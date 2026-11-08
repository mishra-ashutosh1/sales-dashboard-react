import test from 'node:test';
import assert from 'node:assert/strict';
import {parseCSV,buildModel,filterRecords,summarize,summaryCSV,requiredFiles} from '../src/analytics.mjs';
const fixture=()=>({
 [requiredFiles[0]]:[{customer_id:'c1',customer_state:'SP'},{customer_id:'c2',customer_state:'RJ'}],
 [requiredFiles[1]]:[{order_id:'a',customer_id:'c1',order_status:'delivered',order_purchase_timestamp:'2018-01-01 12:00:00',order_delivered_customer_date:'2018-01-03 15:00:00',order_estimated_delivery_date:'2018-01-03 00:00:00'},{order_id:'b',customer_id:'c2',order_status:'canceled',order_purchase_timestamp:'2018-02-01 12:00:00',order_delivered_customer_date:'',order_estimated_delivery_date:''}],
 [requiredFiles[2]]:[{order_id:'a',product_id:'p',price:'100'},{order_id:'a',product_id:'p',price:'50'}],
 [requiredFiles[3]]:[{order_id:'a',review_id:'r1',review_score:'1',review_creation_date:'2018-01-04',review_answer_timestamp:'2018-01-04'},{order_id:'a',review_id:'r2',review_score:'5',review_creation_date:'2018-01-05',review_answer_timestamp:'2018-01-05'}],
 [requiredFiles[4]]:[{product_id:'p',product_category_name:'test'}],
 'olist_order_payments_dataset.csv':[{order_id:'a',payment_type:'credit_card',payment_value:'160'}]
});
test('CSV handles BOM, escaped quotes, commas and embedded newlines',()=>{assert.deepEqual(parseCSV('\uFEFFa,b\r\n1,"hello, ""world""\nnext"\r\n'),[{a:'1',b:'hello, "world"\nnext'}]);assert.throws(()=>parseCSV('a,b\n1'),/column count/);assert.throws(()=>parseCSV('a\n"unfinished'),/unclosed/);});
test('items, payments and reviews do not multiply one another',()=>{const m=buildModel(fixture()),s=summarize(m.records);assert.equal(s.kpis.sales,150);assert.equal(s.kpis.items,2);assert.equal(s.kpis.rating,5);assert.equal(s.kpis.allOrders,2);assert.equal(s.kpis.deliveredOrders,1);assert.equal(s.payments[0][1],160);assert.equal(s.kpis.aov,150);});
test('global date and state filters affect the same order cohort',()=>{const m=buildModel(fixture());assert.equal(filterRecords(m.records,{state:'RJ'}).length,1);assert.equal(summarize(filterRecords(m.records,{state:'RJ'})).kpis.sales,0);assert.equal(filterRecords(m.records,{start:'2018-01-01',end:'2018-01-31'}).length,1);});
test('delivery is on time on the estimated calendar day',()=>{const s=summarize(buildModel(fixture()).records);assert.equal(s.kpis.onTimeRate,1);assert.equal(s.kpis.medianDays,2.125);});
test('missing delivery dates are excluded and empty sets remain valid',()=>{const f=fixture();f[requiredFiles[1]][0].order_delivered_customer_date='';const s=summarize(buildModel(f).records);assert.equal(s.kpis.onTimeRate,null);assert.equal(s.kpis.medianDays,null);assert.equal(summarize([]).kpis.rating,null);});
test('duplicate joins and missing files are rejected',()=>{const f=fixture();f[requiredFiles[0]].push(f[requiredFiles[0]][0]);assert.throws(()=>buildModel(f),/duplicate/);assert.throws(()=>buildModel({}),/Required/);});
test('CSV export escapes quotes and spreadsheet formulas',()=>{assert.match(summaryCSV({kpis:{sales:1},categories:[['=SUM(A1)',1]]}),/"'=SUM\(A1\)"/);});
