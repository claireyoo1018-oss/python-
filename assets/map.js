const regionSelect = document.getElementById('region');
function selectRegion(id) {
 const d = window.habitatData[id]; if (!d) return;
 regionSelect.value = id;
 document.querySelectorAll('[data-region]').forEach(b => b.setAttribute('aria-pressed', String(b.dataset.region === id)));
 const panel = document.getElementById('detail');
 panel.replaceChildren();
 function el(tag, text, cls) { const e = document.createElement(tag); e.textContent = text; if (cls) e.className = cls; return e; }
 panel.append(el('span','관측 기록 · 예시 데이터','pill'),el('h2',d.name),el('p',d.area));
 const count = el('div',String(d.count),'count'); count.append(el('small','마리 / 가상 관측')); panel.append(count);
 for (const [label,value] of [['관측일 (예시)',d.date],['서식 환경',d.type],['소개 계절',d.season],['자료 구분','시연용 · 실제 조사 아님']]) {const row=el('div','','data-row');row.append(el('span',label),el('strong',value));panel.append(row);}
 panel.append(el('h3','이곳의 서식 환경'),el('p',d.description),el('p',d.observation,'note'));
}
document.querySelectorAll('[data-region]').forEach(b => b.addEventListener('click',() => selectRegion(b.dataset.region)));
regionSelect.addEventListener('change', e => selectRegion(e.target.value));
selectRegion('ganghwa');
// SVG markers support keyboard activation as well as pointer input.
document.querySelectorAll('.region-marker').forEach(marker => marker.addEventListener('keydown', event => { if (event.key === 'Enter' || event.key === ' ') { event.preventDefault(); selectRegion(marker.dataset.region); } }));
