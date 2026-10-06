'use strict';
(()=>{
const $=id=>document.getElementById(id), C=window.BUKU_KAS_CONFIG||{}, K=window.KasCore;
const scope='https://www.googleapis.com/auth/spreadsheets',emailScope='https://www.googleapis.com/auth/userinfo.email',profileScope='https://www.googleapis.com/auth/userinfo.profile';
const money=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
const today=()=>{const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const part=t=>parts.find(p=>p.type===t).value;return `${part('year')}-${part('month')}-${part('day')}`;};
let token='',expires=0,user=null,queue=[],view=K.reduce([]),snapshot=null,busy=false,ready=false,schemaReady=false,onlineData=false;
const key=()=>`buku-kas-v1:${C.spreadsheetId}:${user.email.toLowerCase()}`; // Preserve pending queues from version 1.
const id=()=>crypto.randomUUID(),isOwner=()=>user?.email.toLowerCase()===C.ownerEmail.toLowerCase();
function say(message,error=false){$('status').textContent=message;$('status').classList.toggle('error',error);}
function saveQueue(){localStorage.setItem(key()+':queue',JSON.stringify(queue));}
function readQueue(){const raw=JSON.parse(localStorage.getItem(key()+':queue')||'[]');if(!Array.isArray(raw))throw Error('Antrean lokal rusak. Jangan hapus data browser; minta bantuan.');return raw;}
function button(text,fn){const b=document.createElement('button');b.textContent=text;b.onclick=fn;return b;}
function controls(){const resetPending=queue.some(e=>e.action==='reset');$('add').disabled=busy||!user||!schemaReady||resetPending;$('resetWeb').disabled=busy||!isOwner()||!schemaReady||queue.length>0;$('upgrade').disabled=busy||!isOwner();$('refresh').disabled=busy;$('logout').disabled=busy;$('login').disabled=busy;for(const el of $('queue').querySelectorAll('button'))el.disabled=busy;for(const el of $('rows').querySelectorAll('button'))el.disabled=busy||resetPending||!schemaReady;}
function lock(value){busy=value;controls();}
function ensureToken(){if(!token||Date.now()>=expires)throw Error('Sesi Google berakhir. Klik Sambungkan kembali; antrean tetap tersimpan.');}
async function request(path,options={}){
 ensureToken();let response;
 try{response=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(C.spreadsheetId)}${path}`,{...options,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(45000)});}catch(e){throw Error('Koneksi ke Google belum berhasil. Antrean tetap lokal; klik Perbarui setelah koneksi pulih.');}
 const data=await response.json();if(!response.ok){if(response.status===401){token='';throw Error('Sesi Google berakhir. Klik Sambungkan kembali.');}if(response.status===403)throw Error('Akses ditolak. Pastikan Sheets API aktif, izin Sheets disetujui, dan akun ini menjadi Editor spreadsheet.');if(response.status===429)throw Error('Batas permintaan Google tercapai. Tunggu sekitar satu menit, lalu Perbarui.');throw Error(data.error?.message||`Google mengembalikan ${response.status}.`);}return data;
}
let store=new window.KasSheets(request);
function apply(data){snapshot=data;view=data.view;schemaReady=true;$('upgrade').hidden=true;try{localStorage.setItem(key()+':cache',JSON.stringify({at:new Date().toISOString(),values:data.values}));}catch(e){/* Data is on Google; drafts have separate checked storage. */}}
async function pull(){const data=await store.read();apply(data);return data;}
function periodMismatch(e){return e.action!=='reset'&&(e.period||'')!==view.period;}
function reconcile(){
 queue=queue.filter(e=>!view.accepted.has(e.id));for(const e of queue){const parent=view.state.get(e.tx)?.version||'';e.problem=view.seen.has(e.id)?'Perubahan bersamaan ditolak; tinjau lalu terapkan ulang.':parent!==e.parent?'Data telah berubah di perangkat lain; tinjau ulang.':periodMismatch(e)?'Periode sudah direset di perangkat lain. Tinjau sebagai transaksi baru atau buang perubahan.':'';}saveQueue();
}
async function synchronize(){if(!user||busy)return false;lock(true);onlineData=false;let success=false;try{
 say('Membaca spreadsheet dan memeriksa antrean…');await pull();reconcile();
 for(const original of [...queue]){const event=queue.find(e=>e.id===original.id);if(!event||event.problem)continue;await store.append(event);await pull();reconcile();}
 apply(await store.publishStable(snapshot));reconcile();onlineData=true;success=true;
 say(queue.length?`${queue.length} perubahan masih di antrean. Tinjau pesan pada masing-masing perubahan.`:`Terhubung sebagai ${user.email}. Web dan tabel Buku Kas diperbarui ${new Date().toLocaleTimeString('id-ID',{timeZone:'Asia/Jakarta'})} WIB.${view.conflicts.length?' Ada '+view.conflicts.length+' peristiwa konflik/tidak valid dalam riwayat; peristiwa itu tidak masuk saldo.':''}`);
 }catch(e){if(e.code==='NEEDS_UPGRADE'){$('upgrade').hidden=!isOwner();schemaReady=false;}say(e.message+(schemaReady?' Jika transaksi sudah tampil di web tetapi tabel belum sama, tekan Perbarui lagi.':''),true);}finally{render();lock(false);}return success;
}
async function initialize(){if(!isOwner()||busy)return;if(!confirm('Perbarui struktur spreadsheet? Data lama dipertahankan. Versi lama dibuatkan cadangan tersembunyi; tab Buku Kas menjadi tabel transaksi. Pastikan semua anggota memuat ulang web versi baru.'))return;lock(true);let success=false;try{
 say('Memperbarui struktur dan mempertahankan data lama…');apply(await store.migrate());success=true;say('Struktur spreadsheet siap.');
}catch(e){say(e.message,true);}finally{render();lock(false);}if(success)await synchronize();}
function filtered(){const month=$('month').value,q=$('search').value.toLowerCase(),type=$('typeFilter').value;return view.rows.filter(r=>r.date.startsWith(month)&&(type==='all'||r.type===type)&&`${r.category} ${r.note} ${r.author}`.toLowerCase().includes(q)).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));}
function render(){
 $('workspace').hidden=!user;$('welcome').hidden=!!user;$('logout').hidden=!user;$('login').textContent=user?'Sambungkan kembali':'Masuk dengan Google';$('account').textContent=user?.email||'Belum terhubung';$('resetWeb').hidden=!isOwner();
 if(!user){$('rows').replaceChildren();$('queue').replaceChildren();controls();return;}
 $('periodLabel').textContent=view.period?'Periode aktif dimulai '+new Date(view.reset.time).toLocaleString('id-ID',{timeZone:'Asia/Jakarta'})+' WIB. Data periode sebelumnya tetap di spreadsheet.':'Periode awal. Reset web akan memulai periode baru; spreadsheet menyimpan periode lama.';
 const t=K.totals(view.rows,$('month').value);$('balance').textContent=money(t.closing);$('opening').textContent='Saldo awal periode/bulan '+money(t.opening);$('income').textContent=money(t.income);$('expense').textContent=money(t.expense);
 const rows=filtered();$('count').textContent=`${rows.length} transaksi periode aktif • saldo dihitung dari seluruh kategori pada bulan ini`;$('rows').replaceChildren();$('empty').hidden=rows.length>0;
 for(const r of rows){const tr=document.createElement('tr');const date=document.createElement('td');date.textContent=r.date.split('-').reverse().join('/');const detail=document.createElement('td');const title=document.createElement('b');title.textContent=r.category;const note=document.createElement('small');note.textContent=r.note||'Tanpa catatan';detail.append(title,note);const author=document.createElement('td');author.textContent=r.author;const amount=document.createElement('td');amount.className='number '+(r.type==='income'?'green':'red');amount.textContent=(r.type==='income'?'+ ':'− ')+money(r.amount);const actions=document.createElement('td');actions.append(button('Edit',()=>openEditor(r)),button('Hapus',()=>remove(r)));tr.append(date,detail,author,amount,actions);$('rows').append(tr);}
 $('queuePanel').hidden=!queue.length;$('queueCount').textContent=`(${queue.length})`;$('queue').replaceChildren();
 for(const e of queue){const line=document.createElement('div');line.className='queue-item';const label=document.createElement('div');label.textContent=e.action==='reset'?'Reset web dan mulai periode baru':e.action==='delete'?'Hapus transaksi dari web dan tabel Buku Kas':`${e.row.date} · ${e.row.category} · ${money(e.row.amount)}`;const detail=document.createElement('small');detail.textContent=e.problem||'Belum dikonfirmasi spreadsheet';label.append(detail);const actions=document.createElement('div');if(e.problem)actions.append(button('Tinjau & terapkan ulang',()=>reapply(e)));actions.append(button('Buang dari antrean',()=>discard(e)));line.append(label,actions);$('queue').append(line);}
 controls();
}
function pending(tx){if(queue.some(e=>e.tx===tx)){say('Transaksi ini masih memiliki perubahan di antrean. Kirim atau selesaikan antrean dahulu.',true);return true;}return false;}
function openEditor(row){if(busy||!user||!schemaReady||queue.some(e=>e.action==='reset')||row&&pending(row.id))return;$('form').reset();$('formError').textContent='';$('editId').value=row?.id||'';$('editVersion').value=row?.version||'';$('editPeriod').value=row?.period||view.period;$('date').value=row?.date||today();$('type').value=row?.type||'expense';$('amount').value=row?.amount||'';$('category').value=row?.category||'';$('note').value=row?.note||'';$('formTitle').textContent=row?'Edit transaksi':'Tambah transaksi';$('editor').showModal();}
async function enqueue(event){const previous=[...queue];queue.push(event);try{saveQueue();}catch(e){queue=previous;throw Error('Browser tidak dapat menyimpan antrean lokal. Transaksi belum disimpan.');}render();await synchronize();}
async function remove(r){if(busy||pending(r.id)||!confirm(`Hapus transaksi ${r.category}, ${money(r.amount)} dari web dan tab Buku Kas? Riwayat teknis/cadangan terpisah tetap tersedia.`))return;try{await enqueue({id:id(),tx:r.id,parent:r.version,action:'delete',email:user.email,time:new Date().toISOString(),period:r.period});}catch(e){say(e.message,true);}}
async function resetWeb(){
 if(busy||!isOwner())return;if(queue.length){say('Selesaikan seluruh antrean sebelum reset web.',true);return;}
 if(!await synchronize()||!onlineData||queue.length){say('Reset memerlukan sambungan yang berhasil dan antrean kosong. Perbaiki sambungan dahulu.',true);return;}
 if(!confirm('Reset web ke kosong dan Rp0 untuk SEMUA anggota?\n\nTransaksi lama tetap ada di tab Buku Kas pada spreadsheet. Web dan saldo hanya menampilkan periode baru. Tidak menghapus arsip.'))return;
 $('editor').close();$('form').reset();$('search').value='';$('typeFilter').value='all';$('month').value=today().slice(0,7);
 try{await enqueue({id:id(),tx:K.RESET_TX,parent:view.state.get(K.RESET_TX)?.version||'',action:'reset',email:user.email,time:new Date().toISOString(),period:view.period});}catch(e){say(e.message,true);}
}
async function reapply(e){if(busy)return;lock(true);let resend=false;try{
 await pull();reconcile();render();if(!queue.some(x=>x.id===e.id)){say('Perubahan ini sudah diterima spreadsheet.');return;}
 const current=view.state.get(e.tx);let replacement={...e,id:id(),parent:current?.version||'',time:new Date().toISOString(),problem:''};
 if(periodMismatch(e)){
  if(e.action==='delete'){say('Periode transaksi sudah berakhir. Buang antrean ini; arsip lama tidak dihapus lewat antrean periode baru.',true);return;}
  if(!confirm('Periode lama sudah direset. Simpan isi antrean ini sebagai TRANSAKSI BARU di periode aktif? Arsip lama tidak diganti.'))return;
  replacement={...replacement,tx:id(),parent:'',period:view.period};
 }else if(e.action==='reset'){
  if(!confirm('Periode sudah berubah. Reset lagi ke periode baru untuk semua anggota? Data spreadsheet tetap disimpan.'))return;
 }else{
  if(e.action==='delete'&&!current?.row){say('Transaksi sudah dihapus. Anda dapat membuang perubahan ini dari antrean.',true);return;}
  const description=current?.row?`${current.row.date} / ${current.row.category} / ${money(current.row.amount)} / ${current.row.note}`:'Transaksi tidak ada atau telah dihapus.';
  if(!confirm(`Versi saat ini: ${description}\n\nTerapkan perubahan antrean Anda pada versi ini? ${e.action==='delete'?'Transaksi akan dihapus.':'Nilai antrean menggantikan versi ini.'}`))return;
 }
 const before=[...queue];queue=queue.map(x=>x.id===e.id?replacement:x);try{saveQueue();}catch(err){queue=before;throw err;}resend=true;
}catch(err){say(err.message,true);}finally{render();lock(false);}if(resend)await synchronize();}
async function discard(e){if(busy)return;lock(true);try{await pull();reconcile();render();if(!queue.some(x=>x.id===e.id)){say('Perubahan sudah diterima spreadsheet; tidak dapat dibuang sebagai antrean lokal.');return;}if(!confirm('Buang perubahan lokal yang belum diterima ini?'))return;const before=[...queue];queue=queue.filter(x=>x.id!==e.id);try{saveQueue();}catch(err){queue=before;throw err;}render();}catch(err){say('Belum bisa memastikan status perubahan. '+err.message,true);}finally{lock(false);}}
async function authorize(response){
 if(response.error||!response.access_token){say('Akses Google belum diberikan. Silakan masuk kembali.',true);return;}
 if(!google.accounts.oauth2.hasGrantedAllScopes(response,scope,emailScope)){say('Izin Google Sheets dan email diperlukan. Silakan masuk lagi dan setujui izin.',true);return;}
 token=response.access_token;expires=Date.now()+Number(response.expires_in||3600)*1000-60000;
 try{const res=await fetch('https://www.googleapis.com/oauth2/v3/userinfo',{headers:{Authorization:`Bearer ${token}`}});if(!res.ok)throw Error('Tidak dapat memeriksa akun Google.');const profile=await res.json();if(!profile.email||!profile.email_verified)throw Error('Email Google belum terverifikasi.');$('editor').close();$('form').reset();user={email:profile.email,name:profile.name||profile.email};queue=readQueue();view=K.reduce([]);snapshot=null;schemaReady=false;onlineData=false;store=new window.KasSheets(request);
 try{const cache=JSON.parse(localStorage.getItem(key()+':cache')||'null');if(cache)view=K.reduce(cache.values);}catch(e){/* Cache can be reloaded from Google. */}
 $('upgrade').hidden=!isOwner();render();await synchronize();
 }catch(e){token='';user=null;queue=[];view=K.reduce([]);render();say(e.message,true);}
}
$('login').onclick=()=>{if(busy)return;if(!ready){say('Isi config.js terlebih dahulu. Lihat panduan lengkap.',true);return;}if(!window.google?.accounts?.oauth2){say('Layanan login Google belum termuat. Periksa internet/pemblokir skrip lalu muat ulang.',true);return;}google.accounts.oauth2.initTokenClient({client_id:C.clientId,scope:`openid ${emailScope} ${profileScope} ${scope}`,include_granted_scopes:true,callback:authorize,error_callback:e=>say('Jendela Google tidak selesai: '+e.type+'. Izinkan pop-up dan coba lagi.',true)}).requestAccessToken({prompt:'select_account'});};
$('logout').onclick=()=>{if(busy)return;if(queue.length&&!confirm('Ada antrean belum terkirim. Antrean tetap tersimpan di browser ini untuk akun yang sama. Tetap keluar?'))return;token='';expires=0;user=null;queue=[];view=K.reduce([]);snapshot=null;schemaReady=false;onlineData=false;$('editor').close();$('form').reset();render();say('Anda keluar dari aplikasi. Salinan lokal tetap berada di browser ini. Gunakan “Hapus salinan lokal” sebelum keluar dari perangkat bersama.');};
$('clearLocal').onclick=()=>{if(busy)return;if(queue.length){say('Kirim atau selesaikan seluruh antrean dahulu sebelum menghapus salinan lokal.',true);return;}if(confirm('Hapus cache lokal akun ini dan keluar? Data dan periode di Google Sheets tetap tersimpan.')){localStorage.removeItem(key()+':cache');localStorage.removeItem(key()+':queue');$('logout').click();}};
$('form').onsubmit=async event=>{event.preventDefault();if(busy||!user||!schemaReady)return;try{const row=K.validate({date:$('date').value,type:$('type').value,amount:Number($('amount').value),category:$('category').value.trim(),note:$('note').value.trim()});const entry={id:id(),tx:$('editId').value||id(),parent:$('editVersion').value,action:'put',row,email:user.email,time:new Date().toISOString(),period:$('editPeriod').value};const previous=[...queue];queue.push(entry);try{saveQueue();}catch(e){queue=previous;throw Error('Antrean lokal tidak dapat disimpan. Transaksi belum tersimpan.');}$('editor').close();render();await synchronize();}catch(e){$('formError').textContent=e.message;}};
$('close').onclick=()=>$('editor').close();$('add').onclick=()=>openEditor();$('refresh').onclick=synchronize;$('upgrade').onclick=initialize;$('resetWeb').onclick=resetWeb;
for(const name of ['month','search','typeFilter'])$(name).oninput=render;
$('export').onclick=()=>{const blob=new Blob([K.csv(filtered())],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`buku-kas-${$('month').value}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('month').value=today().slice(0,7);$('origin').textContent=location.origin;$('owner').textContent=C.ownerEmail||'Belum diisi';$('sheet').href=`https://docs.google.com/spreadsheets/d/${encodeURIComponent(C.spreadsheetId||'')}/edit`;
ready=!!C.clientId?.endsWith('.apps.googleusercontent.com')&&/^[a-zA-Z0-9_-]{15,}$/.test(C.spreadsheetId||'')&&location.protocol==='https:';
$('setup').hidden=ready;say(ready?'Masuk dengan Google untuk membuka buku kas.':'Belum terhubung: isi config.js dan buka melalui alamat HTTPS GitHub Pages.');
window.addEventListener('offline',()=>say('Koneksi terputus. Transaksi baru masuk antrean lokal. Reset web memerlukan koneksi.',true));
window.addEventListener('online',()=>say('Koneksi kembali tersedia. Klik Perbarui & kirim antrean untuk memeriksa spreadsheet.'));
window.addEventListener('storage',e=>{if(user&&e.key===key()+':queue'){try{queue=readQueue();render();say('Antrean berubah di tab lain. Gunakan satu tab aplikasi per akun agar perubahan lokal tidak saling menimpa.',true);}catch(err){say(err.message,true);}}});
})();
