export const requiredFiles = ['olist_customers_dataset.csv','olist_orders_dataset.csv','olist_order_items_dataset.csv','olist_order_reviews_dataset.csv','olist_products_dataset.csv'];
export function parseCSV(text) {
  const rows=[]; let row=[], cell='', quoted=false;
  text=text.replace(/^\uFEFF/,'');
  for(let i=0;i<text.length;i++) {
    const c=text[i];
    if(c==='"') { if(quoted && text[i+1]==='"'){cell+='"';i++;} else quoted=!quoted; }
    else if(c===',' && !quoted){row.push(cell);cell='';}
    else if((c==='\n'||c==='\r') && !quoted){row.push(cell);if(row.some(Boolean))rows.push(row);row=[];cell='';if(c==='\r'&&text[i+1]==='\n')i++;}
    else cell+=c;
  }
  if(quoted)throw new Error('CSV has an unclosed quoted field.');
  row.push(cell);if(row.some(Boolean))rows.push(row);
  const header=rows.shift()||[];
  if(new Set(header).size!==header.length)throw new Error('Duplicate CSV columns.');
  return rows.map((values,index)=>{if(values.length!==header.length)throw new Error(`CSV row ${index+2} has an unexpected column count.`);return Object.fromEntries(header.map((name,i)=>[name,values[i]]));});
}
function index(rows,key) {
  const result=new Map();
  for(const row of rows){if(!row[key]||result.has(row[key]))throw new Error(`Missing or duplicate ${key}.`);result.set(row[key],row);}
  return result;
}
const amount=(s)=>{const n=Number(s);if(s===''||s==null||!Number.isFinite(n)||n<0)throw new Error('Invalid monetary value.');return n;};
const time=(s)=>s ? Date.parse(s.replace(' ','T')+'Z') : NaN;
export function buildModel(tables) {
  for(const name of requiredFiles)if(!tables[name]?.length)throw new Error(`Required non-empty file: ${name}`);
  const schema={
    'olist_customers_dataset.csv':['customer_id','customer_state'],
    'olist_orders_dataset.csv':['order_id','customer_id','order_status','order_purchase_timestamp','order_delivered_customer_date','order_estimated_delivery_date'],
    'olist_order_items_dataset.csv':['order_id','product_id','price'],
    'olist_order_reviews_dataset.csv':['order_id','review_id','review_score','review_creation_date','review_answer_timestamp'],
    'olist_products_dataset.csv':['product_id','product_category_name']
  };
  for(const [name,columns] of Object.entries(schema))for(const c of columns)if(!(c in tables[name][0]))throw new Error(`${name} missing column ${c}`);
  const customers=index(tables[requiredFiles[0]],'customer_id');
  const products=index(tables[requiredFiles[4]],'product_id');
  index(tables[requiredFiles[1]],'order_id');
  const translations=new Map((tables['product_category_name_translation.csv']||[]).map(r=>[r.product_category_name,r.product_category_name_english]));
  const records=tables[requiredFiles[1]].map(o=>{
    const date=o.order_purchase_timestamp.slice(0,10);
    if(!/^\d{4}-\d{2}-\d{2}$/.test(date)||!Number.isFinite(Date.parse(date)))throw new Error('Invalid purchase date.');
    const customer=customers.get(o.customer_id);if(!customer)throw new Error('Order without a matching customer.');
    const start=time(o.order_purchase_timestamp), end=time(o.order_delivered_customer_date), estimated=time(o.order_estimated_delivery_date);
    const valid=Number.isFinite(start)&&Number.isFinite(end)&&end>=start;
    return {date,state:customer.customer_state||'Unknown',status:o.order_status,sales:0,items:0,score:null,days:valid?(end-start)/86400000:null,onTime:valid&&Number.isFinite(estimated)?o.order_delivered_customer_date.slice(0,10)<=o.order_estimated_delivery_date.slice(0,10):null,categories:{},payments:{}};
  });
  const lookup=new Map(tables[requiredFiles[1]].map((o,i)=>[o.order_id,records[i]]));
  for(const item of tables[requiredFiles[2]]){
    const order=lookup.get(item.order_id);if(!order)throw new Error('Item without a matching order.');
    const product=products.get(item.product_id);if(!product)throw new Error('Item without a matching product.');
    const category=translations.get(product.product_category_name)||product.product_category_name||'unknown';
    const value=amount(item.price);order.sales+=value;order.items++;order.categories[category]=(order.categories[category]||0)+value;
  }
  const latest=new Map();
  for(const review of tables[requiredFiles[3]]){
    if(!lookup.has(review.order_id))continue;
    const rank=[review.review_creation_date,review.review_answer_timestamp,review.review_id].join('|');
    if(!latest.has(review.order_id)||rank>latest.get(review.order_id).rank)latest.set(review.order_id,{rank,score:Number(review.review_score)});
  }
  for(const [id,r] of latest){if(!Number.isInteger(r.score)||r.score<1||r.score>5)throw new Error('Invalid review score.');lookup.get(id).score=r.score;}
  for(const payment of tables['olist_order_payments_dataset.csv']||[]){
    const order=lookup.get(payment.order_id);if(!order)throw new Error('Payment without a matching order.');
    const method=payment.payment_type||'unknown';order.payments[method]=(order.payments[method]||0)+amount(payment.payment_value);
  }
  return {version:1,records,paymentsAvailable:!!tables['olist_order_payments_dataset.csv'],sources:Object.fromEntries(Object.entries(tables).map(([k,v])=>[k,v.length]))};
}
export function filterRecords(records,{start='',end='',state='All'}={}) {
  return records.filter(r=>(!start||r.date>=start)&&(!end||r.date<=end)&&(state==='All'||r.state===state));
}
export function summarize(records,paymentsAvailable=true) {
  const delivered=records.filter(r=>r.status==='delivered');
  const maps={monthly:new Map(),states:new Map(),categories:new Map(),status:new Map(),ratings:new Map(),payments:new Map()};
  const add=(map,k,v)=>map.set(k,(map.get(k)||0)+v);
  for(const r of records)add(maps.status,r.status,1);
  const durations=[];let sales=0,items=0,scoreSum=0,reviewed=0,eligible=0,onTime=0;
  for(const r of delivered){
    sales+=r.sales;items+=r.items;add(maps.monthly,r.date.slice(0,7),r.sales);add(maps.states,r.state,r.sales);
    for(const [k,v] of Object.entries(r.categories))add(maps.categories,k,v);
    for(const [k,v] of Object.entries(r.payments))add(maps.payments,k,v);
    if(r.score!=null){scoreSum+=r.score;reviewed++;add(maps.ratings,String(r.score),1);}
    if(r.days!=null)durations.push(r.days);
    if(r.onTime!=null){eligible++;if(r.onTime)onTime++;}
  }
  durations.sort((a,b)=>a-b);const n=durations.length;
  const median=n?(durations[Math.floor((n-1)/2)]+durations[Math.floor(n/2)])/2:null;
  const result={kpis:{sales,items,deliveredOrders:delivered.length,allOrders:records.length,rating:reviewed?scoreSum/reviewed:null,reviewedOrders:reviewed,aov:delivered.length?sales/delivered.length:null,medianDays:median,deliveryEligible:eligible,durationEligible:n,onTimeRate:eligible?onTime/eligible:null,reviewCoverage:delivered.length?reviewed/delivered.length:null},paymentsAvailable};
  for(const [name,map] of Object.entries(maps))result[name]=[...map].sort(name==='monthly'||name==='ratings'?(a,b)=>a[0].localeCompare(b[0]):(a,b)=>b[1]-a[1]);
  return result;
}
export function summaryCSV(summary) {
  const escape=(value)=>'"'+String(value).replace(/^[=+@-]/,"'$&").replaceAll('"','""')+'"';
  const rows=[['section','label','value'],...Object.entries(summary.kpis).map(([k,v])=>['kpi',k,v??''])];
  for(const section of ['monthly','states','categories','status','ratings','payments'])for(const [label,value] of summary[section]||[])rows.push([section,label,value]);
  return rows.map(row=>row.map(escape).join(',')).join('\r\n');
}
