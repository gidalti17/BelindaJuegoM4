const game = {
    stage: 1,
    puntos: 0,
    maxPuntos: 31, // 10 (Memorama) + 9 (Ahorcado) + 12 (Frases)
    time: 120, 
    timerInt: null,
    historial: [],

    memoriaData: [
        {id:1, t:'Aire'}, {id:1, t:'Mezcla de gases de la atmósfera'},
        {id:2, t:'Oxígeno'}, {id:2, t:'Gas necesario para respirar'},
        {id:3, t:'Nitrógeno'}, {id:3, t:'Gas más abundante del aire'},
        {id:4, t:'Contaminación'}, {id:4, t:'Presencia de gases dañinos'},
        {id:5, t:'Primarios'}, {id:5, t:'Se emiten directamente al aire'},
        {id:6, t:'Secundarios'}, {id:6, t:'Se forman por reacciones químicas'},
        {id:7, t:'Monóxido de Carbono'}, {id:7, t:'Gas tóxico de combustibles'},
        {id:8, t:'CFC'}, {id:8, t:'Gases que dañan la capa de ozono'},
        {id:9, t:'Metano'}, {id:9, t:'Gas que causa efecto invernadero'},
        {id:10, t:'Ozono'}, {id:10, t:'Gas que protege de rayos solares'}
    ],

    // AHORA SON 9 PALABRAS
    ahorcadoWords: ["ATMOSFERA", "CONTAMINACION", "OXIGENO", "METANO", "NITROGENO", "PARTICULAS", "OZONO", "BIOXIDO", "SMOG"],
    ahorcadoIndex: 0,

    frases: [
        {f: "El ___ es vital para la respiración.", r: "OXIGENO", o: ["OXIGENO", "CO2", "NITROGENO", "ARGON", "METANO", "HELIO"]},
        {f: "El ___ es el principal gas de efecto invernadero.", r: "CO2", o: ["CO2", "O3", "SO2", "CO", "H2O", "NO2"]},
        {f: "La capa de ___ nos protege de rayos UV.", r: "OZONO", o: ["OZONO", "HIDROGENO", "PLOMO", "SMOG", "NUBES", "GAS"]},
        {f: "El uso de la ___ solar es energía limpia.", r: "ENERGIA", o: ["ENERGIA", "FUEGO", "QUEMA", "BASURA", "GASOLINA", "DIESEL"]},
        {f: "La lluvia ___ daña los monumentos.", r: "ACIDA", o: ["ACIDA", "DULCE", "FRIA", "NEGRA", "RADIANTE", "LIMPIA"]},
        {f: "El ___ de carbono es un veneno silencioso.", r: "MONOXIDO", o: ["MONOXIDO", "DIOXIDO", "SULFURO", "TRIOXIDO", "CLORO", "OXIDO"]},
        {f: "Las partículas ___ entran profundo a los pulmones.", r: "PM2.5", o: ["PM2.5", "PM100", "POLEN", "ARENA", "AGUA", "HUMO"]},
        {f: "El efecto ___ calienta el planeta.", r: "INVERNADERO", o: ["INVERNADERO", "REFLEJO", "TUNEL", "ESPEJO", "BOLA", "GELIDIA"]},
        {f: "La ___ térmica atrapa contaminantes cerca del suelo.", r: "INVERSION", o: ["INVERSION", "CONVEXION", "PRESION", "DENSIDAD", "FUSION", "REACCION"]},
        {f: "Los ___ destruyen la capa de ozono.", r: "CFC", o: ["CFC", "H2O", "CO2", "GNC", "LED", "PFC"]},
        {f: "El smog ___ es típico en ciudades con mucho tráfico.", r: "FOTOQUIMICO", o: ["FOTOQUIMICO", "ORGANICO", "SULFUROSO", "NATURAL", "RADIACTIVO", "HIDRICO"]},
        {f: "El ___ catalítico reduce emisiones en autos.", r: "CONVERTIDOR", o: ["CONVERTIDOR", "MOTOR", "TANQUE", "FILTRO", "RADIADOR", "TUBO"]}
    ],
    fraseActual: 0,

    start() {
        document.getElementById('intro-screen').classList.add('hidden');
        document.getElementById('game-ui').classList.remove('hidden');
        this.loadStage1();
    },

    startTimer(s, callback) {
        this.time = s;
        clearInterval(this.timerInt);
        this.timerInt = setInterval(() => {
            this.time--;
            document.getElementById('time-text').innerText = this.time + "s";
            document.getElementById('timer-fill').style.width = (this.time/s)*100 + "%";
            if(this.time <= 0) {
                clearInterval(this.timerInt);
                callback();
            }
        }, 1000);
    },

    showModal(t, txt) {
        document.getElementById('modal-title').innerText = t;
        document.getElementById('modal-text').innerText = txt;
        document.getElementById('overlay').classList.remove('hidden');
    },

    nextStage() {
        document.getElementById('overlay').classList.add('hidden');
        if(this.stage === 1) { this.stage = 2; this.loadStage2(); }
        else if(this.stage === 2) { this.stage = 3; this.loadStage3(); }
        else { this.showFinalReport(); }
    },

    loadStage1() {
        const container = document.getElementById('game-container');
        container.innerHTML = '';
        container.className = 'memorama-grid'; 
        document.getElementById('stage-title').innerText = "ETAPA 1: MEMORIA (10 PAREJAS)";
        this.startTimer(120, () => this.showModal("TIEMPO AGOTADO", "Pasando a la siguiente fase."));
        
        let deck = [...this.memoriaData].sort(() => Math.random() - 0.5);
        let flipped = [], matchedCount = 0;

        deck.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<div class="card-inner"><div class="card-front">${item.t}</div><div class="card-back"><img src="luz.jpg"></div></div>`;
            card.onclick = () => {
                if(flipped.length < 2 && !card.classList.contains('flipped')) {
                    card.classList.add('flipped');
                    flipped.push({card, id: item.id, text: item.t});
                    if(flipped.length === 2) {
                        if(flipped[0].id === flipped[1].id) {
                            this.puntos++; matchedCount++;
                            document.getElementById('score').innerText = this.puntos;
                            flipped = [];
                            if(matchedCount === 10) { clearInterval(this.timerInt); setTimeout(() => this.showModal("MEMORIA COMPLETADA", "¡Buen trabajo!"), 500); }
                        } else {
                            setTimeout(() => { flipped.forEach(f => f.card.classList.remove('flipped')); flipped = []; }, 800);
                        }
                    }
                }
            };
            container.appendChild(card);
        });
    },

    loadStage2() {
        const container = document.getElementById('game-container');
        container.innerHTML = '';
        container.className = 'stage-central';
        document.getElementById('stage-title').innerText = `ETAPA 2: AHORCADO (${this.ahorcadoIndex + 1}/9)`;
        
        // TIEMPO DE 40 SEGUNDOS SEGÚN LO PEDIDO
        this.startTimer(40, () => {
            this.ahorcadoIndex++;
            if(this.ahorcadoIndex < 9) this.loadStage2();
            else this.showModal("ETAPA TERMINADA", "Siguiente nivel.");
        });
        
        container.innerHTML = `
            <svg id="hangman-svg" viewBox="0 0 200 250">
                <path d="M20 230 L180 230 M50 230 L50 20 L130 20 L130 50" stroke="var(--neon-blue)" stroke-width="5" fill="none"/>
                <circle id="h-head" class="hang-path hidden" cx="130" cy="80" r="20" stroke="white" stroke-width="5" fill="none"/>
                <line id="h-body" class="hang-path hidden" x1="130" y1="100" x2="130" y2="170" stroke="white" stroke-width="5"/>
                <line id="h-armL" class="hang-path hidden" x1="130" y1="120" x2="100" y2="150" stroke="white" stroke-width="5"/>
                <line id="h-armR" class="hang-path hidden" x1="130" y1="120" x2="160" y2="150" stroke="white" stroke-width="5"/>
                <line id="h-legL" class="hang-path hidden" x1="130" y1="170" x2="100" y2="210" stroke="white" stroke-width="5"/>
                <line id="h-legR" class="hang-path hidden" x1="130" y1="170" x2="160" y2="210" stroke="white" stroke-width="5"/>
            </svg>
            <div id="word-display" class="hangman-word"></div>
            <div id="keyboard" class="letter-grid"></div>`;
        
        const word = this.ahorcadoWords[this.ahorcadoIndex];
        let guessed = [word[0], word[word.length-1]]; 
        let fails = 0;
        const parts = ['h-head', 'h-body', 'h-armL', 'h-armR', 'h-legL', 'h-legR'];

        const updateWord = () => {
            const d = word.split('').map(l => guessed.includes(l) ? l : '_').join(' ');
            document.getElementById('word-display').innerText = d;
            if(!d.includes('_')) {
                this.puntos++;
                this.historial.push({q: `Palabra: ${word}`, r: "Adivinada", v: true});
                document.getElementById('score').innerText = this.puntos;
                this.ahorcadoIndex++;
                if(this.ahorcadoIndex < 9) setTimeout(() => this.loadStage2(), 1000);
                else { clearInterval(this.timerInt); this.showModal("AHORCADO COMPLETADO", "¡Excelente!"); }
            }
        };

        "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('').forEach(l => {
            const b = document.createElement('button');
            b.className = 'key-btn'; b.innerText = l;
            b.onclick = () => {
                b.disabled = true;
                if(word.includes(l)) { guessed.push(l); updateWord(); }
                else {
                    if(parts[fails]) document.getElementById(parts[fails]).classList.remove('hidden');
                    fails++;
                    if(fails === 6) {
                        this.historial.push({q: `Palabra: ${word}`, r: "Fallida", v: false});
                        this.ahorcadoIndex++;
                        if(this.ahorcadoIndex < 9) this.loadStage2();
                        else { clearInterval(this.timerInt); this.showModal("SIGUIENTE ETAPA", "Fase terminada."); }
                    }
                }
            };
            document.getElementById('keyboard').appendChild(b);
        });
        updateWord();
    },

    loadStage3() {
        const container = document.getElementById('game-container');
        container.className = 'stage-central';
        if(this.fraseActual === 0) this.startTimer(100, () => this.showFinalReport());
        document.getElementById('stage-title').innerText = `ETAPA 3: PROTOCOLOS (${this.fraseActual + 1}/12)`;
        const f = this.frases[this.fraseActual];
        container.innerHTML = `<p style="font-size:1.4rem; text-align:center;">"${f.f}"</p><div id="options-box" class="letter-grid"></div>`;
        f.o.sort(() => Math.random() - 0.5).forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'neon-btn'; btn.innerText = opt;
            btn.onclick = () => {
                const esCorrecto = (opt === f.r);
                if(esCorrecto) this.puntos++;
                this.historial.push({q: f.f.replace("___", f.r), r: opt, v: esCorrecto});
                document.getElementById('score').innerText = this.puntos;
                this.fraseActual++;
                if(this.fraseActual < 12) this.loadStage3();
                else { clearInterval(this.timerInt); this.showFinalReport(); }
            };
            document.getElementById('options-box').appendChild(btn);
        });
    },

    showFinalReport() {
        const promedio = (this.puntos / this.maxPuntos * 10).toFixed(1);
        const container = document.getElementById('game-container');
        container.className = 'stage-central';
        container.innerHTML = `
            <h1 style="color:var(--neon-blue)">EVALUACIÓN COMPLETADA</h1>
            <p style="font-size:1.8rem;">PUNTOS: ${this.puntos} / ${this.maxPuntos}</p>
            <p style="font-size:3.5rem; color:var(--neon-green)">PROMEDIO FINAL: ${promedio}</p>
            <button class="neon-btn" onclick="game.verRevision()">VER MIS RESULTADOS</button>
            <button class="neon-btn" onclick="location.reload()" style="border-color:var(--neon-red); color:var(--neon-red); font-size: 0.9rem;">REINTENTAR</button>
        `;
    },

    verRevision() {
        const container = document.getElementById('game-container');
        container.innerHTML = `<div id="review-list" style="text-align:left; width:100%; max-height:350px; overflow-y:auto; padding:15px; background:#050a14; border:1px solid var(--neon-blue);"></div>`;
        const list = document.getElementById('review-list');
        this.historial.forEach(item => {
            const div = document.createElement('div');
            div.style.marginBottom = "10px"; div.style.padding = "8px";
            div.style.borderLeft = `4px solid ${item.v ? '#39ff14' : '#ff3131'}`;
            div.innerHTML = `<small>Pregunta:</small> ${item.q}<br><small>Respuesta:</small> ${item.r} ${item.v ? '✅' : '❌'}`;
            list.appendChild(div);
        });
        const btn = document.createElement('button');
        btn.className = 'neon-btn'; btn.innerText = "VOLVER";
        btn.onclick = () => this.showFinalReport();
        container.appendChild(btn);
    }
};