import {readFile,writeFile,mkdir} from 'node:fs/promises';
import path from 'node:path';
import {parseCSV,buildModel,summarize,requiredFiles} from '../src/analytics.mjs';
const directory=process.argv[2]||'dummy_data';
const tables={};
for(const name of [...requiredFiles,'olist_order_payments_dataset.csv','product_category_name_translation.csv']){
  try{tables[name]=parseCSV(await readFile(path.join(directory,name),'utf8'));}
  catch(error){if(error.code==='ENOENT'&&!requiredFiles.includes(name))continue;throw error;}
}
const model=buildModel(tables);
const summary=summarize(model.records,model.paymentsAvailable);
await mkdir('generated',{recursive:true});
await writeFile('generated/olist-summary.json',JSON.stringify({...summary,sources:model.sources},null,2));
console.log(`Validated ${model.records.length} orders. Summary written to generated/olist-summary.json. This does not replace the bundled summary automatically.`);
