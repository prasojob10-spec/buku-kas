'use strict';
(()=>{
const $=id=>document.getElementById(id), C=window.BUKU_KAS_CONFIG||{}, K=window.KasCore;
const scope='https://www.googleapis.com/auth/spreadsheets';
const emailScope='https://www.googleapis.com/auth/userinfo.email';
const profileScope='https://www.googleapis.com/auth/userinfo.profile';
const money=n=>new Intl.NumberFormat('id-ID',{style:'currency',currency:'IDR',maximumFractionDigits:0}).format(n);
const today=()=>{const parts=new Intl.DateTimeFormat('en-CA',{timeZone:'Asia/Jakarta',year:'numeric',month:'2-digit',day:'2-digit'}).formatToParts(new Date());const part=t=>parts.find(p=>p.type===t).value;return `${part('year')}-${part('month')}-${part('day')}`;};
let token='',expires=0,user=null,queue=[],view=K.reduce([]),busy=false,ready=false,onlineData=false;
const key=()=>`buku-kas-v1:${C.spreadsheetId}:${user.email.toLowerCase()}`;
const id=()=>crypto.randomUUID();
function say(message,error=false){$('status').textContent=message;$('status').classList.toggle('error',error);}
function saveQueue(){localStorage.setItem(key()+':queue',JSON.stringify(queue));}
function readQueue(){const raw=JSON.parse(localStorage.getItem(key()+':queue')||'[]');if(!Array.isArray(raw))throw Error('Antrean lokal rusak. Jangan hapus data browser; unduh cadangan browser atau minta bantuan.');return raw;}
function button(text,fn){const b=document.createElement('button');b.textContent=text;b.onclick=fn;return b;}
function lock(value){busy=value;for(const el of [$('refresh'),$('add'),$('logout'),$('login'),...$('queue').querySelectorAll('button'),...$('rows').querySelectorAll('button')])el.disabled=value;}
function ensureToken(){if(!token||Date.now()>=expires)throw Error('Sesi Google berakhir. Klik Sambungkan kembali; antrean tetap tersimpan.');}
async function request(path,options={}){
 ensureToken();let response;
 try{response=await fetch(`https://sheets.googleapis.com/v4/spreadsheets/${encodeURIComponent(C.spreadsheetId)}${path}`,{...options,headers:{Authorization:`Bearer ${token}`,'Content-Type':'application/json'},signal:AbortSignal.timeout(45000)});}catch(e){throw Error('Koneksi ke Google belum berhasil. Antrean tetap lokal; klik Perbarui setelah koneksi pulih.');}
 const data=await response.json();if(!response.ok){if(response.status===401){token='';throw Error('Sesi Google berakhir. Klik Sambungkan kembali.');}if(response.status===403)throw Error('Akses ditolak. Pastikan Sheets API aktif, izin Sheets disetujui, dan akun ini menjadi Editor spreadsheet.');if(response.status===429)throw Error('Batas permintaan Google tercapai. Tunggu sebentar, lalu Perbarui.');throw Error(data.error?.message||`Google mengembalikan ${response.status}.`);}return data;
}
async function pull(){
 const data=await request('/values/'+encodeURIComponent("'Buku Kas'!A:K"));const values=data.values||[];
 if(JSON.stringify(values[0]||[])!==JSON.stringify(K.HEADER))throw Error('Tab Buku Kas belum disiapkan atau judul kolom berubah. Pemilik perlu menyiapkan buku kas dari tombol di halaman ini; jangan menimpa data lama.');
 view=K.reduce(values.slice(1));onlineData=true;$('initialize')?.setAttribute('hidden','');
 try{localStorage.setItem(key()+':cache',JSON.stringify({at:new Date().toISOString(),values:values.slice(1)}));}catch(e){say('Data terbaca, tetapi browser tidak dapat menyimpan cache lokal.',true);}
}
function reconcile(){queue=queue.filter(e=>!view.accepted.has(e.id));for(const e of queue){const parent=view.state.get(e.tx)?.version||'';e.problem=view.seen.has(e.id)?'Perubahan bersamaan ditolak; tinjau lalu terapkan ulang.':parent!==e.parent?'Transaksi telah berubah di perangkat lain; tinjau ulang.':'';}saveQueue();}
async function synchronize(){if(!user||busy)return;lock(true);try{
 say('Membaca spreadsheet dan memeriksa antrean…');await pull();reconcile();
 for(const event of [...queue]){if(event.problem)continue;
  await request('/values/'+encodeURIComponent("'Buku Kas'!A:K")+':append?valueInputOption=RAW&insertDataOption=INSERT_ROWS',{method:'POST',body:JSON.stringify({majorDimension:'ROWS',values:[K.encode(event)]})});
  await pull();reconcile();
 }
 say(queue.length?`${queue.length} perubahan masih di antrean. Tinjau pesan pada masing-masing perubahan.`:`Terhubung sebagai ${user.email}. Data diperbarui ${new Date().toLocaleTimeString('id-ID',{timeZone:'Asia/Jakarta'})} WIB.${view.conflicts.length?' Ada '+view.conflicts.length+' peristiwa konflik/tidak valid dalam riwayat; peristiwa itu tidak masuk saldo.':''}`);
}catch(e){say(e.message,true);}finally{render();lock(false);}}
async function initialize(){if(!user||busy)return;if(!confirm('Siapkan tab Buku Kas pada spreadsheet ini? Gunakan spreadsheet kosong. Data pada tab lain tidak diubah.'))return;lock(true);try{
 const meta=await request('?fields=sheets.properties');let sheet=meta.sheets.find(s=>s.properties.title==='Buku Kas');
 if(!sheet){const made=await request(':batchUpdate',{method:'POST',body:JSON.stringify({requests:[{addSheet:{properties:{title:'Buku Kas',gridProperties:{frozenRowCount:1}}}}]})});sheet=made.replies[0].addSheet;}
 const old=await request('/values/'+encodeURIComponent("'Buku Kas'!A:K"));if((old.values||[]).length)throw Error('Tab Buku Kas sudah berisi data. Tidak ditimpa. Jika header benar, cukup tekan Perbarui.');
 await request('/values/'+encodeURIComponent("'Buku Kas'!A1:K1")+'?valueInputOption=RAW',{method:'PUT',body:JSON.stringify({values:[K.HEADER]})});
 say('Tab Buku Kas siap. Klik Perbarui untuk mulai.');
}catch(e){say(e.message,true);}finally{lock(false);}}
function filtered(){const month=$('month').value,q=$('search').value.toLowerCase(),type=$('typeFilter').value;return view.rows.filter(r=>r.date.startsWith(month)&&(type==='all'||r.type===type)&&`${r.category} ${r.note} ${r.author}`.toLowerCase().includes(q)).sort((a,b)=>b.date.localeCompare(a.date)||a.id.localeCompare(b.id));}
function render(){
 $('workspace').hidden=!user;$('welcome').hidden=!!user;$('logout').hidden=!user;$('login').textContent=user?'Sambungkan kembali':'Masuk dengan Google';$('account').textContent=user?.email||'Belum terhubung';$('add').disabled=!user;
 if(!user)return;
 const t=K.totals(view.rows,$('month').value);$('balance').textContent=money(t.closing);$('opening').textContent='Saldo awal '+money(t.opening);$('income').textContent=money(t.income);$('expense').textContent=money(t.expense);
 const rows=filtered();$('count').textContent=`${rows.length} transaksi • saldo dihitung dari seluruh kategori pada bulan ini`;$('rows').replaceChildren();$('empty').hidden=rows.length>0;
 for(const r of rows){const tr=document.createElement('tr');const date=document.createElement('td');date.textContent=r.date.split('-').reverse().join('/');const detail=document.createElement('td');const title=document.createElement('b');title.textContent=r.category;const note=document.createElement('small');note.textContent=r.note||'Tanpa catatan';detail.append(title,note);const author=document.createElement('td');author.textContent=r.author;const amount=document.createElement('td');amount.className='number '+(r.type==='income'?'green':'red');amount.textContent=(r.type==='income'?'+ ':'− ')+money(r.amount);const actions=document.createElement('td');actions.append(button('Edit',()=>openEditor(r)),button('Hapus',()=>remove(r)));tr.append(date,detail,author,amount,actions);$('rows').append(tr);}
 $('queuePanel').hidden=!queue.length;$('queueCount').textContent=`(${queue.length})`;$('queue').replaceChildren();
 for(const e of queue){const line=document.createElement('div');line.className='queue-item';const label=document.createElement('div');label.textContent=e.action==='delete'?'Hapus transaksi':`${e.row.date} · ${e.row.category} · ${money(e.row.amount)}`;const detail=document.createElement('small');detail.textContent=e.problem||'Belum dikonfirmasi spreadsheet';label.append(detail);const actions=document.createElement('div');if(e.problem)actions.append(button('Tinjau & terapkan ulang',()=>reapply(e)));actions.append(button('Buang dari antrean',()=>discard(e)));line.append(label,actions);$('queue').append(line);}
}
function pending(tx){if(queue.some(e=>e.tx===tx)){say('Transaksi ini masih memiliki perubahan di antrean. Kirim atau selesaikan antrean dahulu.',true);return true;}return false;}
function openEditor(row){if(busy||!user||row&&pending(row.id))return;$('form').reset();$('formError').textContent='';$('editId').value=row?.id||'';$('editVersion').value=row?.version||'';$('date').value=row?.date||today();$('type').value=row?.type||'expense';$('amount').value=row?.amount||'';$('category').value=row?.category||'';$('note').value=row?.note||'';$('formTitle').textContent=row?'Edit transaksi':'Tambah transaksi';$('editor').showModal();}
async function enqueue(event){const previous=[...queue];queue.push(event);try{saveQueue();}catch(e){queue=previous;throw Error('Browser tidak dapat menyimpan antrean lokal. Transaksi belum disimpan. Salin isi formulir, periksa ruang penyimpanan dan pengaturan browser.');}render();await synchronize();}
async function remove(r){if(busy||pending(r.id)||!confirm(`Hapus transaksi ${r.category}, ${money(r.amount)}? Riwayat tetap ada di spreadsheet.`))return;try{await enqueue({id:id(),tx:r.id,parent:r.version,action:'delete',email:user.email,time:new Date().toISOString()});}catch(e){say(e.message,true);}}
async function reapply(e){if(busy)return;try{await pull();reconcile();render();if(!queue.some(x=>x.id===e.id)){say('Perubahan ini ternyata sudah diterima spreadsheet.');return;}
 const current=view.state.get(e.tx);if(e.action==='delete'&&!current?.row){say('Transaksi sudah dihapus. Anda dapat membuang perubahan ini dari antrean.',true);return;}
 const description=current?.row?`${current.row.date} / ${current.row.category} / ${money(current.row.amount)} / ${current.row.note}`:'Transaksi tidak ada atau telah dihapus.';
 if(!confirm(`Versi saat ini: ${description}\n\nTerapkan perubahan antrean Anda pada versi ini? ${e.action==='delete'?'Transaksi akan dihapus.':'Nilai pada antrean akan menggantikan versi saat ini.'}`))return;
 const before=[...queue];queue=queue.map(x=>x.id===e.id?{...x,id:id(),parent:current?.version||'',time:new Date().toISOString(),problem:''}:x);try{saveQueue();}catch(err){queue=before;throw err;}await synchronize();
}catch(err){say(err.message,true);}}
async function discard(e){if(busy)return;try{await pull();reconcile();render();if(!queue.some(x=>x.id===e.id)){say('Perubahan sudah diterima spreadsheet. Untuk membatalkannya, edit/hapus melalui riwayat.');return;}if(!confirm('Buang perubahan lokal ini? Jika belum pernah diterima, perubahan ini tidak akan dikirim.'))return;const before=[...queue];queue=queue.filter(x=>x.id!==e.id);try{saveQueue();}catch(err){queue=before;throw err;}render();}catch(err){say('Belum bisa memastikan status perubahan. '+err.message,true);}}
async function authorize(response){
 if(response.error||!response.access_token){say('Akses Google belum diberikan. Silakan masuk kembali dan setujui izin yang diperlukan.',true);return;}
 if(!google.accounts.oauth2.hasGrantedAllScopes(response,scope,emailScope)){say('Izin Google Sheets dan email diperlukan. Silakan masuk lagi dan setujui izin.',true);return;}
 token=response.access_token;expires=Date.now()+Number(response.expires_in||3600)*1000-60000;
 try{const res=await fetch('https://www.googleapis.com/oauth2/v3/userinfo',{headers:{Authorization:`Bearer ${token}`}});if(!res.ok)throw Error('Tidak dapat memeriksa akun Google.');const profile=await res.json();if(!profile.email||!profile.email_verified)throw Error('Email Google belum terverifikasi.');$('editor').close();$('form').reset();user={email:profile.email,name:profile.name||profile.email};queue=readQueue();view=K.reduce([]);onlineData=false;
 try{const cache=JSON.parse(localStorage.getItem(key()+':cache')||'null');if(cache)view=K.reduce(cache.values);}catch(e){/* Cache may be reloaded from Google. */}
 render();$('initialize')?.remove();if(user.email.toLowerCase()===C.ownerEmail.toLowerCase()){const b=button('Siapkan tab Buku Kas (pemakaian pertama)',initialize);b.id='initialize';$('workspace').prepend(b);}
 await synchronize();
 }catch(e){token='';user=null;queue=[];view=K.reduce([]);render();say(e.message,true);}
}
$('login').onclick=()=>{if(busy)return;if(!ready){say('Isi config.js terlebih dahulu. Lihat panduan lengkap.',true);return;}if(!window.google?.accounts?.oauth2){say('Layanan login Google belum termuat. Periksa internet/pemblokir skrip lalu muat ulang.',true);return;}google.accounts.oauth2.initTokenClient({client_id:C.clientId,scope:`openid ${emailScope} ${profileScope} ${scope}`,include_granted_scopes:true,callback:authorize,error_callback:e=>say('Jendela Google tidak selesai: '+e.type+'. Izinkan pop-up dan coba lagi.',true)}).requestAccessToken({prompt:'select_account'});};
$('logout').onclick=()=>{if(queue.length&&!confirm('Ada antrean yang belum terkirim. Antrean tetap tersimpan di browser ini dan dapat dibuka dengan akun yang sama. Tetap keluar?'))return;token='';expires=0;user=null;queue=[];view=K.reduce([]);$('editor').close();$('form').reset();$('initialize')?.remove();render();say('Anda keluar dari aplikasi. Salinan lokal tetap berada di browser ini. Gunakan “Hapus salinan lokal” sebelum keluar dari perangkat bersama.');};
$('clearLocal').onclick=()=>{if(busy)return;if(queue.length){say('Kirim atau selesaikan seluruh antrean dahulu sebelum menghapus salinan lokal.',true);return;}if(confirm('Hapus cache lokal akun ini dan keluar? Data di Google Sheets tetap tersimpan.')){localStorage.removeItem(key()+':cache');localStorage.removeItem(key()+':queue');$('logout').click();}};
$('form').onsubmit=async event=>{event.preventDefault();try{const row=K.validate({date:$('date').value,type:$('type').value,amount:Number($('amount').value),category:$('category').value.trim(),note:$('note').value.trim()});const entry={id:id(),tx:$('editId').value||id(),parent:$('editVersion').value,action:'put',row,email:user.email,time:new Date().toISOString()};const previous=[...queue];queue.push(entry);try{saveQueue();}catch(e){queue=previous;throw Error('Antrean lokal tidak dapat disimpan. Transaksi belum tersimpan.');}$('editor').close();render();await synchronize();}catch(e){$('formError').textContent=e.message;}};
$('close').onclick=()=>$('editor').close();$('add').onclick=()=>openEditor();$('refresh').onclick=synchronize;
for(const name of ['month','search','typeFilter'])$(name).oninput=render;
$('export').onclick=()=>{const blob=new Blob([K.csv(filtered())],{type:'text/csv;charset=utf-8;'}),url=URL.createObjectURL(blob),a=document.createElement('a');a.href=url;a.download=`buku-kas-${$('month').value}.csv`;a.click();setTimeout(()=>URL.revokeObjectURL(url),1000);};
$('month').value=today().slice(0,7);$('origin').textContent=location.origin;$('owner').textContent=C.ownerEmail||'Belum diisi';$('sheet').href=`https://docs.google.com/spreadsheets/d/${encodeURIComponent(C.spreadsheetId||'')}/edit`;
ready=!!C.clientId?.endsWith('.apps.googleusercontent.com')&&/^[a-zA-Z0-9_-]{15,}$/.test(C.spreadsheetId||'')&&location.protocol==='https:';
$('setup').hidden=ready;say(ready?'Masuk dengan Google untuk membuka buku kas.':'Belum terhubung: isi config.js dan buka melalui alamat HTTPS GitHub Pages.');
window.addEventListener('offline',()=>say('Koneksi terputus. Transaksi baru disimpan dalam antrean browser ini. Jangan tutup halaman sebelum menyimpan formulir.',true));
window.addEventListener('online',()=>say('Koneksi kembali tersedia. Klik Perbarui & kirim antrean untuk memeriksa spreadsheet.'));
window.addEventListener('storage',e=>{if(user&&e.key===key()+':queue'){try{queue=readQueue();render();say('Antrean berubah di tab lain. Gunakan satu tab aplikasi per akun agar perubahan lokal tidak saling menimpa.',true);}catch(err){say(err.message,true);}}});
})();
