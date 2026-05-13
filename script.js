const game = {
    stage: 1,
    puntos: 0,
    maxPuntos: 23, // 8 (Memorama) + 3 (Ahorcado) + 12 (Frases)
    time: 120, // 2 minutos para el memorama
    timerInt: null,
    historial: [], // Para ver las respuestas al final

    // --- DATOS ---
    memoriaData: [
        {id:1, t:'CO'}, {id:1, t:'TÓXICO SANGRE'},
        {id:2, t:'PM 2.5'}, {id:2, t:'DAÑO ALVÉOLOS'},
        {id:3, t:'SO2'}, {id:3, t:'LLUVIA ÁCIDA'},
        {id:4, t:'NO2'}, {id:4, t:'SMOG MARRÓN'},
        {id:5, t:'INV. TÉRMICA'}, {id:5, t:'GAS ATRAPADO'},
        {id:6, t:'O3'}, {id:6, t:'IRRITACIÓN'},
        {id:7, t:'CFC'}, {id:7, t:'CAPA OZONO'},
        {id:8, t:'CO2'}, {id:8, t:'CALENTAMIENTO'}
    ],

    ahorcadoWords: ["ATMOSFERA", "CONTAMINACION", "OXIGENO"],
    ahorcadoIndex: 0,

    frases: [
        // Fáciles (1 pto c/u)
        {f: "El ___ es vital para la respiración.", r: "OXIGENO", o: ["OXIGENO", "CO2", "NITROGENO", "ARGON", "METANO", "HELIO"], d: "fácil"},
        {f: "El ___ es el principal gas de efecto invernadero.", r: "CO2", o: ["CO2", "O3", "SO2", "CO", "H2O", "NO2"], d: "fácil"},
        {f: "La capa de ___ nos protege de rayos UV.", r: "OZONO", o: ["OZONO", "HIDROGENO", "PLOMO", "SMOG", "NUBES", "GAS"], d: "fácil"},
        {f: "El uso de la ___ solar es energía limpia.", r: "ENERGIA", o: ["ENERGIA", "FUEGO", "QUEMA", "BASURA", "GASOLINA", "DIESEL"], d: "fácil"},
        // Medias (1 pto c/u)
        {f: "La lluvia ___ daña los monumentos.", r: "ACIDA", o: ["ACIDA", "DULCE", "FRIA", "NEGRA", "RADIANTE", "LIMPIA"], d: "media"},
        {f: "El ___ de carbono es un veneno silencioso.", r: "MONOXIDO", o: ["MONOXIDO", "DIOXIDO", "SULFURO", "TRIOXIDO", "CLORO", "OXIDO"], d: "media"},
        {f: "Las partículas ___ entran profundo a los pulmones.", r: "PM2.5", o: ["PM2.5", "PM100", "POLEN", "ARENA", "AGUA", "HUMO"], d: "media"},
        {f: "El efecto ___ calienta el planeta.", r: "INVERNADERO", o: ["INVERNADERO", "REFLEJO", "TUNEL", "ESPEJO", "BOLA", "GELIDIA"], d: "media"},
        // Difíciles (1 pto c/u)
        {f: "La ___ térmica atrapa contaminantes cerca del suelo.", r: "INVERSION", o: ["INVERSION", "CONVEXION", "PRESION", "DENSIDAD", "FUSION", "REACCION"], d: "difícil"},
        {f: "Los ___ destruyen la capa de ozono.", r: "CFC", o: ["CFC", "H2O", "CO2", "GNC", "LED", "PFC"], d: "difícil"},
        {f: "El smog ___ es típico en ciudades con mucho tráfico.", r: "FOTOQUIMICO", o: ["FOTOQUIMICO", "ORGANICO", "SULFUROSO", "NATURAL", "RADIACTIVO", "HIDRICO"], d: "difícil"},
        {f: "El ___ catalítico reduce emisiones en autos.", r: "CONVERTIDOR", o: ["CONVERTIDOR", "MOTOR", "TANQUE", "FILTRO", "RADIADOR", "TUBO"], d: "difícil"}
    ],
    fraseActual: 0,

    // --- LÓGICA GENERAL ---
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

    // --- ETAPA 1: MEMORAMA ---
    loadStage1() {
        document.getElementById('stage-title').innerText = "ETAPA 1: MEMORIA DE DATOS (8 PAREJAS)";
        this.startTimer(120, () => {
            this.showModal("TIEMPO AGOTADO", `Lograste ${this.puntos} aciertos. Pasando a la siguiente fase.`);
        });
        
        const container = document.getElementById('game-container');
        container.innerHTML = '';
        let deck = [...this.memoriaData].sort(() => Math.random() - 0.5);
        let flipped = [], matchedCount = 0;

        deck.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `<div class="card-inner"><div class="card-front">${item.t}</div><div class="card-back">🧪</div></div>`;
            card.onclick = () => {
                if(flipped.length < 2 && !card.classList.contains('flipped')) {
                    card.classList.add('flipped');
                    flipped.push({card, id: item.id, text: item.t});
                    if(flipped.length === 2) {
                        if(flipped[0].id === flipped[1].id) {
                            this.puntos++;
                            matchedCount++;
                            this.historial.push({q: `Pareja: ${flipped[0].text} - ${flipped[1].text}`, r: "Correcto", v: true});
                            flipped = [];
                            document.getElementById('score').innerText = this.puntos;
                            if(matchedCount === 8) {
                                clearInterval(this.timerInt);
                                this.showModal("MEMORIA COMPLETADA", "Has recuperado todos los datos.");
                            }
                        } else {
                            setTimeout(() => {
                                flipped.forEach(f => f.card.classList.remove('flipped'));
                                flipped = [];
                            }, 800);
                        }
                    }
                }
            };
            container.appendChild(card);
        });
    },

    // --- ETAPA 2: AHORCADO MULTIPLE ---
    loadStage2() {
        document.getElementById('stage-title').innerText = `ETAPA 2: AHORCADO (PALABRA ${this.ahorcadoIndex + 1}/3)`;
        this.startTimer(60, () => { this.showModal("TIEMPO AGOTADO", "No pudiste salvar al agente."); });
        
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div style="text-align:center; width:100%">
                <svg id="hangman-svg" viewBox="0 0 200 250">
                    <rect id="gas-cloud" x="0" y="0" width="200" height="250" />
                    <path class="hang-path" d="M20 230 L180 230 M50 230 L50 20 L130 20 L130 50" />
                    <circle id="h-head" class="hang-path hidden" cx="130" cy="80" r="20" />
                    <line id="h-body" class="hang-path hidden" x1="130" y1="100" x2="130" y2="170" />
                    <line id="h-armL" class="hang-path hidden" x1="130" y1="120" x2="100" y2="150" />
                    <line id="h-armR" class="hang-path hidden" x1="130" y1="120" x2="160" y2="150" />
                    <line id="h-legL" class="hang-path hidden" x1="130" y1="170" x2="100" y2="210" />
                    <line id="h-legR" class="hang-path hidden" x1="130" y1="170" x2="160" y2="210" />
                    <path class="dead-eyes" d="M120 75 L125 80 M125 75 L120 80 M135 75 L140 80 M140 75 L135 80" />
                </svg>
                <div id="word-display" class="hangman-word"></div>
                <div id="keyboard" class="letter-grid"></div>
            </div>`;
        
        const word = this.ahorcadoWords[this.ahorcadoIndex];
        let guessed = [word[0], word[word.length-1]]; // Pistas
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
                if(this.ahorcadoIndex < 3) this.loadStage2();
                else { clearInterval(this.timerInt); this.showModal("AHORCADO COMPLETADO", "Has identificado los gases."); }
            }
        };

        "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('').forEach(l => {
            const b = document.createElement('button');
            b.className = 'key-btn'; b.innerText = l;
            b.onclick = () => {
                b.disabled = true;
                if(word.includes(l)) { guessed.push(l); updateWord(); }
                else {
                    document.getElementById(parts[fails]).classList.remove('hidden');
                    fails++;
                    if(fails === 6) {
                        this.historial.push({q: `Palabra: ${word}`, r: "Fallida", v: false});
                        this.ahorcadoIndex++;
                        if(this.ahorcadoIndex < 3) { alert("¡Perdiste esta palabra! Siguiente..."); this.loadStage2(); }
                        else { clearInterval(this.timerInt); this.showModal("FIN DEL AHORCADO", "Pasando a la última etapa."); }
                    }
                }
            };
            document.getElementById('keyboard').appendChild(b);
        });
        updateWord();
    },

    // --- ETAPA 3: COMPLETAR FRASES ---
    loadStage3() {
        if(this.fraseActual === 0) this.startTimer(100, () => { this.showFinalReport(); });
        document.getElementById('stage-title').innerText = `ETAPA 3: PROTOCOLOS (${this.fraseActual + 1}/12)`;
        const container = document.getElementById('game-container');
        const f = this.frases[this.fraseActual];
        
        container.innerHTML = `
            <div style="text-align:center; width:100%">
                <p style="font-size:1.5rem; margin-bottom:30px;">"${f.f}"</p>
                <div class="letter-grid" id="options-box"></div>
            </div>`;

        f.o.sort(() => Math.random() - 0.5).forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'neon-btn';
            btn.style.margin = "10px";
            btn.innerText = opt;
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

    // --- REPORTE FINAL ---
    showFinalReport() {
        const porcentaje = Math.round((this.puntos / this.maxPuntos) * 100);
        const calificacion = (this.puntos / this.maxPuntos * 10).toFixed(1);
        
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <div style="text-align:center; width:100%">
                <h1 style="font-size:3rem; color:var(--neon-blue)">RESULTADO FINAL</h1>
                <div style="font-size:2rem; margin: 20px 0;">
                    ACIERTOS: ${this.puntos} / ${this.maxPuntos}<br>
                    PORCENTAJE: ${porcentaje}%<br>
                    CALIFICACIÓN: <span style="color:var(--neon-green)">${calificacion}</span>
                </div>
                <button class="neon-btn" onclick="game.verRevision()">VER REVISIÓN DE RESPUESTAS</button>
                <button class="neon-btn" onclick="location.reload()" style="border-color:var(--neon-red); color:var(--neon-red)">REINTENTAR</button>
            </div>`;
        document.getElementById('stage-title').innerText = "REPORTE DE EVALUACIÓN";
    },

    verRevision() {
        const container = document.getElementById('game-container');
        container.innerHTML = `<div id="review-list" style="text-align:left; width:100%; max-height:400px; overflow-y:auto; padding:20px; background:#050a14; border:1px solid var(--neon-blue);"></div>`;
        const list = document.getElementById('review-list');
        
        this.historial.forEach(item => {
            const div = document.createElement('div');
            div.style.marginBottom = "15px";
            div.style.padding = "10px";
            div.style.borderLeft = `5px solid ${item.v ? 'var(--neon-green)' : 'var(--neon-red)'}`;
            div.innerHTML = `<strong>Pregunta:</strong> ${item.q}<br><strong>Tu respuesta:</strong> ${item.r} ${item.v ? '✅' : '❌'}`;
            list.appendChild(div);
        });
        
        const btn = document.createElement('button');
        btn.className = 'neon-btn';
        btn.innerText = "VOLVER AL PUNTAJE";
        btn.onclick = () => this.showFinalReport();
        container.appendChild(btn);
    }
};