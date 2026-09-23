(() => {
const criteria=[['water','얕은 먹이터','갯벌·논·습지에 걸어 다니며 먹이를 찾을 얕은 물이 있나요?','있음','없거나 깊은 물뿐'],['food','먹이 생물','작은 물고기·갑각류 등 먹이 생물을 확인했나요?','확인함','부족함을 확인'],['rest','안전한 쉼터','사람이 쉽게 접근하지 않는 휴식 공간이 있나요?','있음','없음'],['quiet','주변 방해','차량·공사·산책객·반려동물 등의 방해가 적나요?','적음','잦음'],['connect','먹이터와 쉼터의 연결','먹이터와 쉼터 사이를 안전하게 이동할 수 있나요?','연결됨','단절·장애 확인']];
const records=window.habitatRegions.map(r=>({id:r.id,name:r.name+' 일대',lat:r.lat,lng:r.lng,date:'',memo:'',values:Object.fromEntries(criteria.map(c=>[c[0],'unknown']))}));
const defaultIds=new Set(records.map(r=>r.id));
const storageKey='spoonbill-urban-observations-v1';
let restoredSelection,storageWarning='';
try {
 const raw=localStorage.getItem(storageKey);
 if(raw){
 const saved=JSON.parse(raw);
 if(saved.version!==1||!Array.isArray(saved.records))throw Error('Invalid saved records');
 const seen=new Set();
 records.length=0;
 for(const r of saved.records){
 if(!r||typeof r.id!=='string'||seen.has(r.id)||(!defaultIds.has(r.id)&&!/^point-[1-9][0-9]*$/.test(r.id)))continue;
 if(!Number.isFinite(r.lat)||!Number.isFinite(r.lng)||Math.abs(r.lat)>90||Math.abs(r.lng)>180)continue;
 const clean={id:r.id,name:typeof r.name==='string'?r.name.slice(0,80):'관찰 지점',lat:r.lat,lng:r.lng,date:typeof r.date==='string'?r.date.slice(0,10):'',memo:typeof r.memo==='string'?r.memo.slice(0,1500):'',values:Object.fromEntries(criteria.map(c=>[c[0],['yes','no','unknown'].includes(r.values?.[c[0]])?r.values[c[0]]:'unknown']))};
 const index=records.findIndex(x=>x.id===r.id);if(index>=0)records[index]=clean;else records.push(clean);seen.add(r.id);
 }
 restoredSelection=saved.selected;
 }
}catch(e){storageWarning='저장된 기록을 불러오지 못했습니다. 브라우저 저장 설정을 확인해주세요.';}
let nextPoint=Math.max(0,...records.filter(r=>!defaultIds.has(r.id)).map(r=>Number(r.id.slice(6))))+1;
let current=records.find(r=>r.id===restoredSelection)||records[1]||records[0]||null,map;const markers=new Map();const $=s=>document.querySelector(s);const el=(tag,text)=>{const e=document.createElement(tag);e.textContent=text;return e;};
function save(){
 try{localStorage.setItem(storageKey,JSON.stringify({version:1,selected:current?.id||null,records}));$('#urban-storage-status').textContent=storageWarning||'이 브라우저에 자동 저장됨 · 새로고침해도 유지됩니다.';}
 catch(e){$('#urban-storage-status').textContent='자동 저장을 할 수 없습니다. 새로고침 전에 기록을 내려받아 주세요.';}
}
function result(r){const v=Object.values(r.values),known=v.filter(x=>x!=='unknown').length;if(known<5)return {label:'미확인 · 추가 관찰 필요',color:'#83938a',text:`5개 항목 중 ${known}개 확인. 미확인 항목이 있어 적합성을 분류하지 않습니다.`};if(r.values.water==='no'||r.values.food==='no')return {label:'핵심 조건 부족',color:'#b45d50',text:'입력상 먹이터 또는 먹이 조건이 부족합니다. 물때와 계절을 달리해 다시 확인하세요.'};if(v.includes('no'))return {label:'개선·주의',color:'#bd7925',text:'입력상 쉼터, 방해 또는 연결성에 불리한 조건이 있습니다. 방해 완화와 현장 추가 조사가 필요합니다.'};return {label:'적합 가능성',color:'#287259',text:'입력한 다섯 조건은 유리합니다. 실제 이용 여부·수질·계절 변화는 추가 확인이 필요합니다.'};}
function icon(r){return L.divIcon({className:'urban-dot'+(r===current?' selected':''),html:'<span style="background:'+result(r).color+'"></span>',iconSize:[25,25],iconAnchor:[12,12]});}
function update(){$('#urban-delete').hidden=!current;const res=result(current);const panel=$('#urban-result');panel.replaceChildren(el('h3',res.label),el('p',res.text));$('#urban-location').textContent=`지역 대표 위치: ${current.lat.toFixed(2)}°N, ${current.lng.toFixed(2)}°E`;markers.forEach((m,id)=>{const r=records.find(x=>x.id===id);m.setIcon(icon(r));m.getElement()?.setAttribute('aria-label',r.name+' · '+result(r).label);m.setTooltipContent(el('span',r.name+' · '+result(r).label));});drawList();save();}
function drawList(){const list=$('.urban-places');list.replaceChildren();records.forEach(r=>{const b=el('button',r.name);b.type='button';b.setAttribute('aria-pressed',String(r===current));b.addEventListener('click',()=>select(r,true));list.append(b);});}
function select(r,pan=false){current=r||null;
 document.querySelectorAll('.urban-panel input,.urban-panel select,.urban-panel textarea').forEach(e=>e.disabled=!current);
 if(!current){$('#urban-name').value='';$('#urban-date').value='';$('#urban-memo').value='';criteria.forEach(c=>$('#urban-'+c[0]).value='unknown');$('#urban-delete').hidden=true;$('#urban-location').textContent='';$('#urban-result').replaceChildren(el('h3','관찰 지점이 없습니다'),el('p','지도를 눌러 새 관찰 지점을 추가하세요.'));drawList();save();return;}
 $('#urban-name').value=r.name;$('#urban-date').value=r.date;$('#urban-memo').value=r.memo;criteria.forEach(c=>$('#urban-'+c[0]).value=r.values[c[0]]);if(pan&&map)map.setView([r.lat,r.lng],11);update();}
criteria.forEach(([id,title,hint,yes,no])=>{const label=el('label',title);label.htmlFor='urban-'+id;const select=el('select','');select.id='urban-'+id;[['unknown','미확인'],['yes',yes],['no',no]].forEach(([v,t])=>{const o=el('option',t);o.value=v;select.append(o);});select.addEventListener('change',()=>{current.values[id]=select.value;update();});$('#urban-fields').append(label,select,el('small',hint));});
$('#urban-name').addEventListener('input',e=>{current.name=e.target.value.trim()||'이름 없는 관찰 지점';update();});$('#urban-date').addEventListener('input',e=>{current.date=e.target.value;save();});$('#urban-memo').addEventListener('input',e=>{current.memo=e.target.value;save();});
function addMarker(r){const m=L.marker([r.lat,r.lng],{icon:icon(r),keyboard:true,title:r.name}).addTo(map).bindTooltip(el('span',r.name));m.on('click',()=>select(r));markers.set(r.id,m);}
if(window.L){map=L.map('urban-map',{scrollWheelZoom:false}).setView([37.38,126.64],11);L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:17,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map).on('tileerror',()=>$('#urban-map-note').textContent='배경 지도 연결을 확인해주세요. 지역 목록과 관찰 입력은 계속 사용할 수 있습니다.');records.forEach(addMarker);map.on('click',e=>{const r={id:'point-'+nextPoint,name:'새 관찰 지점 '+nextPoint++,lat:Math.round(e.latlng.lat*100)/100,lng:Math.round(e.latlng.lng*100)/100,date:'',memo:'',values:Object.fromEntries(criteria.map(c=>[c[0],'unknown']))};records.push(r);addMarker(r);select(r);});}else $('#urban-map').textContent='지도를 불러오지 못했습니다. 아래 지역을 선택해 관찰 내용을 입력할 수 있습니다.';
$('#urban-delete').addEventListener('click',()=>{
 if(!current)return;
 const removed=current;
 markers.get(removed.id)?.remove();markers.delete(removed.id);
 records.splice(records.indexOf(removed),1);
 select(records[0]||null);
 $('#urban-delete-status').textContent=removed.name+' 지점을 삭제했습니다.';
 $('#urban-name').focus({preventScroll:true});
});
$('#urban-download').addEventListener('click',()=>{const blob=new Blob([JSON.stringify({type:'도시생태 관찰 — 사용자 입력, 검증되지 않은 탐색용 분류',criteria:criteria.map(c=>({id:c[0],label:c[1],question:c[2]})),records:records.map(r=>({...r,result:result(r).label}))},null,2)],{type:'application/json'});const url=URL.createObjectURL(blob);const a=el('a','');a.href=url;a.download='spoonbill-urban-observations.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),1000);});select(current);
})();