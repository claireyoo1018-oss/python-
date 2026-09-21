(() => {
 const regions = window.habitatRegions;
 const list = document.querySelector('.region-list');
 const panel = document.querySelector('#observation');
 const markers = new Map();
 let map;
 const icon = (index, selected) => L.divIcon({className:'marker'+(selected?' selected-pin':''),html:`<span class="pin">${index+1}</span>`,iconSize:[36,36],iconAnchor:[18,18]});
 function select(id, pan = true) {
   const region = regions.find(item => item.id === id) || regions[0];
   list.querySelectorAll('button').forEach(button => button.setAttribute('aria-pressed', String(button.dataset.id === region.id)));
   panel.innerHTML = `<div class="detail-top"><span>지역별 관측 기록</span><span class="demo-tag">예시 기록</span></div><h2>${region.name}</h2><p class="subtitle">${region.area}</p><div class="count-row"><strong>${region.count}<small> 마리</small></strong><div><p>예시 관측 개체 수</p><p>실제 조사 결과가 아닙니다</p></div></div><dl><div><dt>관측일 (예시)</dt><dd>${region.date}</dd></div><div><dt>서식 환경</dt><dd>${region.habitat}</dd></div></dl><h3>관측 메모</h3><p class="detail-copy">${region.behavior}</p><h3>이 지역의 환경</h3><p class="detail-copy">${region.ecology}</p>`;
   if(map){regions.forEach((r,i) => {const marker=markers.get(r.id);marker.setIcon(icon(i,r.id===region.id));marker.setZIndexOffset(r.id===region.id?1000:0);marker.getElement().setAttribute('aria-label',r.name+' 관측 기록 보기');}); }
   history.replaceState(null,'',`#${region.id}`);
 }
 regions.forEach(region => {const button=document.createElement('button');button.type='button';button.textContent=region.name;button.dataset.id=region.id;button.setAttribute('aria-pressed','false');button.addEventListener('click',()=>select(region.id));list.append(button);});
 if(window.L){
   document.querySelector('#map').innerHTML='';
   map=L.map('map',{scrollWheelZoom:false}).setView([35.65,126.7],6);
   const tiles=L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png',{maxZoom:12,minZoom:5,attribution:'&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'}).addTo(map);
   tiles.on('tileerror',()=>{document.querySelector('.map-note').textContent='배경 지도를 불러오지 못했습니다. 인터넷 연결을 확인해 주세요. 지역 버튼으로 관측 정보는 계속 볼 수 있습니다.';});
   regions.forEach((region,i)=>{const marker=L.marker([region.lat,region.lng],{icon:icon(i,false),title:region.name+' 관측 기록 보기',alt:region.name+' 관측 기록 보기',keyboard:true}).addTo(map).bindTooltip(region.name,{direction:'right',offset:[16,0]});marker.on('click',()=>select(region.id,false));markers.set(region.id,marker);});
 }else{document.querySelector('#map').innerHTML='<p class="map-loading">지도를 불러오지 못했습니다. 아래 지역 버튼으로 관측 정보를 살펴보세요.</p>';}
 select(location.hash.slice(1) || 'seocheon',false);
 window.addEventListener('hashchange',()=>select(location.hash.slice(1)));
})();
