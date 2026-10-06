(function(root){
'use strict';
const LEGACY_HEADER=['ID Peristiwa','ID Transaksi','Versi Sebelumnya','Aksi','Tanggal','Jenis','Nominal Rupiah','Kategori','Catatan','Akun Pencatat','Waktu Kirim'];
const HEADER=[...LEGACY_HEADER,'ID Periode'];
const TABLE_HEADER=['ID Transaksi','Tanggal','Jenis','Nominal Rupiah','Kategori','Catatan','Pencatat','Waktu Perubahan','Periode'];
const RESET_TX='__buku_kas_periode__';
function validDate(s){return /^\d{4}-\d{2}-\d{2}$/.test(s)&&!isNaN(Date.parse(s))&&new Date(s+'T00:00:00Z').toISOString().slice(0,10)===s;}
function validate(r){
 if(!validDate(r.date))throw Error('Tanggal tidak valid.');
 if(!['income','expense'].includes(r.type))throw Error('Jenis transaksi tidak valid.');
 if(!Number.isSafeInteger(r.amount)||r.amount<1||r.amount>1000000000000)throw Error('Nominal harus bilangan bulat Rp1–Rp1.000.000.000.000.');
 if(!r.category.trim()||r.category.length>60)throw Error('Kategori wajib diisi, maksimal 60 karakter.');
 if(r.note.length>300)throw Error('Catatan maksimal 300 karakter.');return r;
}
function encode(e){const r=e.row||{};return [e.id,e.tx,e.parent,e.action,r.date||'',r.type||'',r.amount||'',r.category||'',r.note||'',e.email,e.time,e.period||''];}
function decode(a){return {id:String(a[0]||''),tx:String(a[1]||''),parent:String(a[2]||''),action:String(a[3]||''),row:{date:String(a[4]||''),type:String(a[5]||''),amount:Number(a[6]),category:String(a[7]||''),note:String(a[8]||'')},email:String(a[9]||''),time:String(a[10]||''),period:String(a[11]||'')};}
function reduce(rows){
 const state=new Map(),seen=new Set(),accepted=new Set(),conflicts=[],periods=new Map([['',{id:'',time:'',email:''}]]);let period='';
 for(const a of rows){const e=decode(a);if(!e.id||seen.has(e.id))continue;seen.add(e.id);const current=state.get(e.tx);
  try{
   if(!e.tx||!['put','delete','reset'].includes(e.action))throw Error('Format peristiwa tidak dikenal');
   if((current?.version||'')!==e.parent)throw Error('Versi berbeda');
   if(e.action==='reset'){
    if(e.tx!==RESET_TX)throw Error('Format reset tidak valid');
    state.set(RESET_TX,{version:e.id,row:null});period=e.id;periods.set(period,{id:period,time:e.time,email:e.email});accepted.add(e.id);continue;
   }
   if(e.tx===RESET_TX)throw Error('ID transaksi khusus periode');
   if(e.period!==period||current?.row&&current.row.period!==period)throw Error('Periode berubah; buat transaksi baru setelah meninjau reset');
   if(e.action==='delete'&&!current?.row)throw Error('Transaksi sudah dihapus');
   if(e.action==='put')validate(e.row);
   const rowPeriod=current?.row?.period??e.period;
   state.set(e.tx,{version:e.id,row:e.action==='delete'?null:{...e.row,id:e.tx,version:e.id,author:e.email,time:e.time,period:rowPeriod}});accepted.add(e.id);
  }catch(err){conflicts.push({event:e,reason:err.message});}
 }
 const allRows=[...state.values()].filter(x=>x.row).map(x=>x.row);
 return {state,seen,accepted,conflicts,period,periods,reset:periods.get(period),allRows,rows:allRows.filter(r=>r.period===period)};
}
function totals(rows,month){let opening=0,income=0,expense=0;for(const r of rows){const sign=r.type==='income'?1:-1;if(r.date.slice(0,7)<month)opening+=sign*r.amount;else if(r.date.startsWith(month)){if(sign===1)income+=r.amount;else expense+=r.amount;}}return {opening,income,expense,closing:opening+income-expense};}
function table(view){return [TABLE_HEADER,...[...view.allRows].sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id)).map(r=>[r.id,r.date,r.type==='income'?'Pemasukan':'Pengeluaran',r.amount,r.category,r.note,r.author,r.time||'',r.period||'Awal'])];}
function csv(rows){const cell=x=>'"'+String(x??'').replace(/^[=+\-@\t\r]/,"'$&").replaceAll('"','""')+'"';return '\ufeff'+[['Tanggal','Jenis','Nominal Rupiah','Kategori','Catatan','Pencatat'],...rows.map(r=>[r.date,r.type==='income'?'Pemasukan':'Pengeluaran',r.amount,r.category,r.note,r.author])].map(r=>r.map(cell).join(',')).join('\r\n');}
const api={LEGACY_HEADER,HEADER,TABLE_HEADER,RESET_TX,validate,validDate,encode,decode,reduce,totals,table,csv};if(typeof module!=='undefined')module.exports=api;else root.KasCore=api;
})(globalThis);
