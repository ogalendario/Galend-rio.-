// Banco de dados de eventos históricos
const eventsData = [
    { date: '2026-03-25', title: 'Fundação do Galo', type: 'titulos', desc: '1908: Nasce o Clube Atlético Mineiro, o maior de Minas.', img: 'https://via.placeholder.com/400x200?text=1908+Alvinegro' },
    { date: '2026-02-25', title: 'Aniversário Betto Fernandes', type: 'torcida', desc: 'Nascimento do administrador do FURACÃO ALVINEGRO e criador do Galendário.', img: '' },
    { date: '2026-07-24', title: 'Libertadores 2013', type: 'titulos', desc: 'O dia em que a América se curvou ao Galo.', img: 'https://via.placeholder.com/400x200?text=Libertadores+2013' },
    { date: '2026-01-11', title: 'Reinaldo, o Rei', type: 'idolos', desc: 'Aniversário do maior artilheiro e símbolo da resistência atleticana.', img: '' },
    { date: '2026-05-30', title: 'Dia do Eu Acredito', type: 'torcida', desc: 'O mantra que define a fé da Massa Atleticana.', img: '' }
];

let userMemories = JSON.parse(localStorage.getItem('galendarioMemories')) || [];
let currentDate = new Date();
let currentFilter = 'todos';

function init() {
    renderCalendar();
    setupMemoryForm();
}

function renderCalendar() {
    const grid = document.getElementById('calendar-grid');
    const monthDisplay = document.getElementById('monthDisplay');
    grid.innerHTML = '';

    const year = currentDate.getFullYear();
    const month = currentDate.getMonth();
    
    monthDisplay.innerText = new Intl.DateTimeFormat('pt-BR', { month: 'long', year: 'numeric' }).format(currentDate).toUpperCase();

    const firstDay = new Date(year, month, 1).getDay();
    const daysInMonth = new Date(year, month + 1, 0).getDate();
    const todayStr = new Date().toLocaleDateString('en-CA'); // Formato YYYY-MM-DD

    for (let i = 0; i < firstDay; i++) grid.innerHTML += `<div class="day empty"></div>`;

    for (let d = 1; d <= daysInMonth; d++) {
        const dateStr = `${year}-${String(month + 1).padStart(2, '0')}-${String(d).padStart(2, '0')}`;
        const isToday = todayStr === dateStr ? 'today' : '';
        
        const dayEvents = eventsData.filter(e => e.date === dateStr && (currentFilter === 'todos' || e.type === currentFilter));
        const dayMems = userMemories.filter(m => m.date === dateStr);

        let tags = dayEvents.map(e => `<span class="event-tag">${e.title}</span>`).join('');
        if(dayMems.length > 0) tags += `<span class="event-tag memory">⭐ ${dayMems.length} Memórias</span>`;

        grid.innerHTML += `
            <div class="day ${isToday}" onclick="showDetail('${dateStr}')">
                <span class="day-number">${d}</span>
                <div class="tags-container">${tags}</div>
            </div>`;
    }
}

function showDetail(date) {
    const content = document.getElementById('details-content');
    const form = document.getElementById('memory-form');
    form.dataset.selectedDate = date;

    const event = eventsData.find(e => e.date === date);
    const mems = userMemories.filter(m => m.date === date);

    let html = `<h5>DATA: ${date.split('-').reverse().join('/')}</h5>`;
    if(event) {
        html += `<h4>${event.title}</h4><p>${event.desc}</p>`;
        if(event.img) html += `<img src="${event.img}" alt="Imagem do Evento">`;
    }
    if(mems.length > 0) {
        html += `<hr><h6>MEMÓRIAS DA MASSA:</h6>`;
        mems.forEach(m => html += `<p class="small"><strong>${m.name} (${m.loc}):</strong> ${m.text}</p>`);
    }
    if(!event && mems.length === 0) html += `<p>Nenhum evento registrado. Deixe sua marca neste dia!</p>`;
    
    content.innerHTML = html;
}

function setupMemoryForm() {
    document.getElementById('memory-form').onsubmit = (e) => {
        e.preventDefault();
        const date = e.target.dataset.selectedDate;
        if(!date) return alert("Por favor, selecione um dia no calendário primeiro!");

        const newMem = {
            date: date,
            name: document.getElementById('userName').value,
            loc: document.getElementById('userLocation').value,
            text: document.getElementById('userMemory').value
        };

        userMemories.push(newMem);
        localStorage.setItem('galendarioMemories', JSON.stringify(userMemories));
        
        // EFEITO DE CELEBRAÇÃO ALVINEGRA
        celebrarSucesso();

        e.target.reset();
        renderCalendar();
        showDetail(date);
    };
}

function celebrarSucesso() {
    const end = Date.now() + 3000;

    (function frame() {
        // Confetes Pretos e Brancos
        confetti({
            particleCount: 4,
            angle: 60,
            spread: 55,
            origin: { x: 0 },
            colors: ['#000000', '#ffffff']
        });
        confetti({
            particleCount: 4,
            angle: 120,
            spread: 55,
            origin: { x: 1 },
            colors: ['#000000', '#ffffff']
        });

        // Bandeiras e Emojis
        if (Math.random() > 0.8) {
            confetti({
                particleCount: 1,
                origin: { y: 0.7 },
                shapes: ['text'],
                shapeOptions: { text: { value: ['🏁', '🏴', '🏳️', '🖤'] } }
            });
        }

        if (Date.now() < end) requestAnimationFrame(frame);
    }());
}

function compartilharDia() {
    const text = document.getElementById('details-content').innerText;
    const url = window.location.href;
    const shareMsg = `Veja o que encontrei no Galendário Alvinegro:\n\n${text}\n\n`;

    if (navigator.share) {
        navigator.share({ title: 'Galendário', text: shareMsg, url: url });
    } else {
        navigator.clipboard.writeText(shareMsg + url);
        alert("Resumo e link copiados! Agora é só colar no Zap ou Insta.");
    }
}

function filterEvents(cat) { currentFilter = cat; renderCalendar(); }
document.getElementById('prevMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() - 1); renderCalendar(); };
document.getElementById('nextMonth').onclick = () => { currentDate.setMonth(currentDate.getMonth() + 1); renderCalendar(); };

window.onload = init;
