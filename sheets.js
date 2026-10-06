(function(root){
'use strict';
const K=typeof module!=='undefined'?require('./core.js'):root.KasCore;
const LOG='_Riwayat Buku Kas',TABLE='Buku Kas';
const same=(a,b)=>JSON.stringify(a||[])===JSON.stringify(b);
const cell=v=>({userEnteredValue:typeof v==='number'?{numberValue:v}:{stringValue:String(v??'')}});
const gridRows=values=>values.map(a=>({values:a.map(cell)}));
class KasSheets {
 constructor(request){this.request=request;this.ids=null;}
 async metadata(){return this.request('?fields=sheets.properties');}
 async values(title,range){const r=await this.request('/values/'+encodeURIComponent(`'${title}'!${range}`));return r.values||[];}
 async batch(requests){return this.request(':batchUpdate',{method:'POST',body:JSON.stringify({requests})});}
 async inspect(){
  const meta=await this.metadata(),sheets=meta.sheets||[];const find=t=>sheets.find(s=>s.properties.title===t)?.properties;
  const log=find(LOG),table=find(TABLE);
  if(log){
   const values=await this.values(LOG,'A:L');if(!same(values[0],K.HEADER))throw Error('Struktur riwayat versi 2 tidak cocok. Data tidak ditimpa. Periksa tab _Riwayat Buku Kas.');
   if(!table){this.ids=null;return {ready:false,missingTable:true,log,values,meta};}
   const header=await this.values(TABLE,'A1:I1');if(!same(header[0],K.TABLE_HEADER))throw Error('Judul kolom Buku Kas berubah atau berisi data lain. Data tidak ditimpa. Pulihkan header versi 2 sebelum melanjutkan.');
   this.ids={log:log.sheetId,table:table.sheetId};return {ready:true,values,meta};
  }
  const values=table?await this.values(TABLE,'A:L'):[];
  if(values.length&&!same(values[0],K.LEGACY_HEADER))throw Error('Tab Buku Kas bukan format versi lama yang dikenali. Data tidak ditimpa; jangan gunakan migrasi pada file lain.');
  this.ids=null;return {ready:false,legacy:table,values,meta};
 }
 async read(){
  if(!this.ids){const info=await this.inspect();if(!info.ready){const err=Error('Pemilik perlu menekan “Perbarui struktur spreadsheet” sekali. Data lama akan dipertahankan.');err.code='NEEDS_UPGRADE';throw err;}return this.snapshot(info.values);}
  return this.snapshot(await this.values(LOG,'A:L'));
 }
 snapshot(values){if(!same(values[0],K.HEADER))throw Error('Header riwayat berubah; pengiriman dihentikan untuk melindungi data.');return {values:values.slice(1),view:K.reduce(values.slice(1)),revision:JSON.stringify(values)};}
 async migrate(){
  const info=await this.inspect();if(info.ready)return this.snapshot(info.values);
  const used=new Set((info.meta.sheets||[]).map(s=>s.properties.sheetId));const fresh=()=>{let n;do{n=Math.floor(Math.random()*1000000000)+1;}while(used.has(n));used.add(n);return n;};
  const logId=info.log?.sheetId??info.legacy?.sheetId??fresh(),tableId=fresh(),req=[];
  if(info.legacy){
   const backupId=fresh(),backupName='Cadangan v1 '+new Date().toISOString().replace(/[^0-9]/g,'').slice(0,14)+' '+backupId;
   req.push({duplicateSheet:{sourceSheetId:logId,newSheetId:backupId,newSheetName:backupName}},{updateSheetProperties:{properties:{sheetId:backupId,hidden:true},fields:'hidden'}});
   req.push({updateSheetProperties:{properties:{sheetId:logId,title:LOG},fields:'title'}});
  }else if(!info.log){req.push({addSheet:{properties:{sheetId:logId,title:LOG,gridProperties:{rowCount:1000,columnCount:12,frozenRowCount:1}}}});}
  const logGrid=info.log?.gridProperties||info.legacy?.gridProperties;
  if(logGrid&&logGrid.columnCount<12)req.push({updateSheetProperties:{properties:{sheetId:logId,gridProperties:{columnCount:12}},fields:'gridProperties.columnCount'}});
  req.push({updateCells:{range:{sheetId:logId,startRowIndex:0,endRowIndex:1,startColumnIndex:0,endColumnIndex:12},rows:gridRows([K.HEADER]),fields:'userEnteredValue'}});
  const snapshot=this.snapshot([K.HEADER,...info.values.slice(1)]),data=K.table(snapshot.view);
  req.push({addSheet:{properties:{sheetId:tableId,title:TABLE,gridProperties:{rowCount:Math.max(1000,data.length),columnCount:9,frozenRowCount:1}}}});
  req.push({updateCells:{range:{sheetId:tableId,startRowIndex:0,startColumnIndex:0,endColumnIndex:9},rows:gridRows(data),fields:'userEnteredValue'}});
  req.push({updateSheetProperties:{properties:{sheetId:logId,hidden:true},fields:'hidden'}});
  req.push({repeatCell:{range:{sheetId:tableId,startRowIndex:0,endRowIndex:1},cell:{userEnteredFormat:{backgroundColor:{red:.07,green:.38,blue:.29},textFormat:{bold:true,foregroundColor:{red:1,green:1,blue:1}}}},fields:'userEnteredFormat'}});
  await this.batch(req);this.ids={log:logId,table:tableId};return this.read();
 }
 async append(event){if(!this.ids)throw Error('Struktur spreadsheet belum siap.');return this.request('/values/'+encodeURIComponent(`'${LOG}'!A:L`)+':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS',{method:'POST',body:JSON.stringify({majorDimension:'ROWS',values:[K.encode(event)]})});}
 async publish(snapshot){
  // Rebuild the display from the authoritative log. A single atomic update clears
  // all obsolete cells too; never delete rows using a stale row number.
  const meta=await this.metadata(),table=meta.sheets.find(s=>s.properties.sheetId===this.ids.table)?.properties;
  if(!table||table.title!==TABLE)throw Error('Tab Buku Kas berubah. Transaksi ada di riwayat; tabel belum diperbarui.');
  const header=await this.values(TABLE,'A1:I1');if(!same(header[0],K.TABLE_HEADER))throw Error('Header Buku Kas berubah. Data tidak ditimpa; pulihkan header lalu Perbarui.');
  const data=K.table(snapshot.view),req=[];
  if(data.length>table.gridProperties.rowCount)req.push({updateSheetProperties:{properties:{sheetId:this.ids.table,gridProperties:{rowCount:data.length+100}},fields:'gridProperties.rowCount'}});
  req.push({updateCells:{range:{sheetId:this.ids.table,startRowIndex:0,startColumnIndex:0,endColumnIndex:9},rows:gridRows(data),fields:'userEnteredValue'}});await this.batch(req);
 }
 async publishStable(snapshot){
  for(let attempt=0;attempt<3;attempt++){
   await this.publish(snapshot);const latest=await this.read();if(latest.revision===snapshot.revision)return latest;snapshot=latest;
  }
  throw Error('Ada perubahan bersamaan saat tabel diperbarui. Data tetap tersimpan di riwayat; tekan Perbarui lagi agar tabel spreadsheet mengikuti versi terbaru.');
 }
}
if(typeof module!=='undefined')module.exports={KasSheets,LOG,TABLE,gridRows};else root.KasSheets=KasSheets;
})(globalThis);
