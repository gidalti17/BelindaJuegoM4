const game = {
    stage: 1,
    puntos: 0,
    maxPuntos: 31, // 10 de memoria, 9 de ahorcado, 12 de frases
    time: 120,
    timerInt: null,
    historial: [],

    /* ================= DATOS BASADOS EN PROGRESIÓN 14 ================= */
    memoriaData: [
        {id:1, t:'Nitrógeno (N2)'}, {id:1, t:'Gas más abundante del aire (78%)'},
        {id:2, t:'Oxígeno (O2)'}, {id:2, t:'Gas para respiración celular (21%)'},
        {id:3, t:'Argón (Ar)'}, {id:3, t:'Gas inerte en el aire (0.93%)'},
        {id:4, t:'Contaminante Primario'}, {id:4, t:'CO: Emitido directo por autos'},
        {id:5, t:'Contaminante Secundario'}, {id:5, t:'Ozono: Formado por reacciones en el aire'},
        {id:6, t:'Fuentes Móviles'}, {id:6, t:'Causan el 81% de contaminación (Transporte)'},
        {id:7, t:'Fuentes Fijas'}, {id:7, t:'Industrias y quemas de basura (19%)'},
        {id:8, t:'Inversión Térmica'}, {id:8, t:'Atrapa gases tóxicos cerca del suelo'},
        {id:9, t:'PM 2.5'}, {id:9, t:'Partículas diminutas que dañan pulmones'},
        {id:10, t:'Lluvia Ácida'}, {id:10, t:'Efecto secundario por óxidos de azufre'}
    ],

    ahorcadoWords: [
    { palabra:"ATMOSFERA", pista:"Capa de gases que rodea la Tierra" },
    { palabra:"NITROGENO", pista:"Gas más abundante del aire" },
    { palabra:"OXIGENO", pista:"Gas necesario para respirar" },
    { palabra:"MONOXIDO", pista:"Gas tóxico producido por combustión" },
    { palabra:"PARTICULAS", pista:"PM2.5 son muy peligrosas" },
    { palabra:"OZONO", pista:"Contaminante secundario" },
    { palabra:"FOTOQUIMICO", pista:"Tipo de smog causado por luz solar" },
    { palabra:"CATALIZADOR", pista:"Reduce gases tóxicos en autos" },
    { palabra:"EFECTO", pista:"Consecuencia o resultado ambiental" }
    ],
    ahorcadoIndex: 0,

    frases: [
        {
            f: "El aire es una mezcla ___ de varios gases.",
            r: "HOMOGÉNEA",
            o: ["HOMOGÉNEA", "HETEROGÉNEA", "PURA", "SÓLIDA", "ÚNICA", "TÓXICA"],
            info: "Es una mezcla homogénea porque sus componentes (N2, O2, etc.) no están unidos químicamente."
        },
        {
            f: "Gas que ocupa el 78% de la atmósfera terrestre:",
            r: "NITRÓGENO",
            o: ["NITRÓGENO", "OXÍGENO", "CO2", "ARGÓN", "METANO", "HELIO"],
            info: "El Nitrógeno es el más abundante, seguido por el Oxígeno con un 21%."
        },
        {
            f: "Los contaminantes ___ son los que se emiten directamente a la atmósfera.",
            r: "PRIMARIOS",
            o: ["PRIMARIOS", "SECUNDARIOS", "TERCIARIOS", "LIMPIOS", "NATURALES", "FÓSILES"],
            info: "Ejemplos: Monóxido de carbono (CO) y óxidos de nitrógeno (NOx) de los escapes."
        },
        {
            f: "El Ozono (O3) troposférico es un contaminante de tipo ___.",
            r: "SECUNDARIO",
            o: ["SECUNDARIO", "PRIMARIO", "INOCUO", "BENIGNO", "SÓLIDO", "LÍQUIDO"],
            info: "Se considera secundario porque se forma mediante reacciones químicas entre contaminantes primarios y luz solar."
        },
        {
            f: "Las fuentes ___ (autos, camiones) generan el 81% de la contaminación.",
            r: "MÓVILES",
            o: ["MÓVILES", "FIJAS", "NATURALES", "SOLARES", "EÓLICAS", "HIDRICAS"],
            info: "El transporte es el mayor emisor de contaminantes en las zonas urbanas."
        },
        {
            f: "La ___ térmica ocurre cuando una capa de aire caliente atrapa al aire frío y contaminado abajo.",
            r: "INVERSIÓN",
            o: ["INVERSIÓN", "CONVEXIÓN", "RADIACIÓN", "DENSIDAD", "PRESIÓN", "FUSIÓN"],
            info: "Esto impide que los contaminantes se dispersen, causando episodios graves de mala calidad del aire."
        },
        {
            f: "Las partículas ___ son las más peligrosas por su capacidad de llegar al fondo de los pulmones.",
            r: "PM2.5",
            o: ["PM2.5", "PM100", "POLEN", "ARENA", "SAL", "HUMO"],
            info: "Debido a su tamaño microscópico, atraviesan las barreras naturales del cuerpo."
        },
        {
            f: "El ___ de Carbono es un gas incoloro e inodoro que puede causar la muerte.",
            r: "MONÓXIDO",
            o: ["MONÓXIDO", "DIÓXIDO", "SULFURO", "CLORO", "OXÍGENO", "ARGÓN"],
            info: "Se produce por la combustión incompleta de gasolina, leña o carbón."
        },
        {
            f: "Acción para mejorar el aire: Reducir el uso de compuestos ___ en aerosoles.",
            r: "CFC",
            o: ["CFC", "H2O", "CO2", "LED", "O2", "N2"],
            info: "Los Clorofluorocarbonos (CFC) destruyen la capa de ozono estratosférico."
        },
        {
            f: "La quema de basura y las industrias son consideradas fuentes ___.",
            r: "FIJAS",
            o: ["FIJAS", "MÓVILES", "LIMPIAS", "VERDES", "INSTANTÁNEAS", "TOTALES"],
            info: "Representan el 19% de las emisiones contaminantes según las estadísticas revisadas."
        },
        {
            f: "El fenómeno de la ___ ácida daña edificios, monumentos y ecosistemas.",
            r: "LLUVIA",
            o: ["LLUVIA", "NIEVE", "NEBLINA", "BRISA", "TORMENTA", "MAREA"],
            info: "Se forma cuando los óxidos de azufre y nitrógeno reaccionan con la humedad del aire."
        },
        {
            f: "Elemento que ayuda a filtrar gases tóxicos en los automóviles:",
            r: "CATALIZADOR",
            o: ["CATALIZADOR", "RADIADOR", "FRENO", "VOLANTE", "LLANTA", "ESPEJO"],
            info: "El convertidor catalítico transforma gases nocivos en gases menos dañinos antes de salir por el escape."
        }
    ],

    fraseActual: 0,

    start(){
        document.getElementById('intro-screen').classList.add('hidden');
        document.getElementById('game-ui').classList.remove('hidden');
        this.loadStage1();
    },

    startTimer(s, callback){
        this.time = s;
        clearInterval(this.timerInt);
        document.getElementById('time-text').innerText = this.time + "s";
        document.getElementById('timer-fill').style.width = "100%";
        this.timerInt = setInterval(() => {
            this.time--;
            document.getElementById('time-text').innerText = this.time + "s";
            document.getElementById('timer-fill').style.width = (this.time / s) * 100 + "%";
            if(this.time <= 0){
                clearInterval(this.timerInt);
                callback();
            }
        }, 1000);
    },

    showModal(t, txt, callbackNext){
        document.getElementById('modal-title').innerText = t;
        document.getElementById('modal-text').innerText = txt;
        document.getElementById('overlay').classList.remove('hidden');
        
        // Re-asignamos el evento al botón del modal
        const btn = document.querySelector('#overlay .neon-btn');
        btn.onclick = () => {
            document.getElementById('overlay').classList.add('hidden');
            if(callbackNext) callbackNext();
        };
    },

    nextStage(){
        if(this.stage === 1){
            this.stage = 2;
            this.loadStage2();
        } else if(this.stage === 2){
            this.stage = 3;
            this.loadStage3();
        } else {
            this.showFinalReport();
        }
    },

    /* ================= MEMORAMA ================= */
    loadStage1(){
        const container = document.getElementById('game-container');
        container.innerHTML = '';
        container.className = 'memorama-grid';
        document.getElementById('stage-title').innerText = "ETAPA 1: MEMORIA ATMOSFÉRICA";

        this.startTimer(200, () => {
            this.showModal("TIEMPO AGOTADO", "El protocolo de memoria ha expirado. Avanzando...", () => this.nextStage());
        });

        let deck = [...this.memoriaData].sort(() => Math.random() - 0.5);
        let flipped = [];
        let matchedCount = 0;

        deck.forEach(item => {
            const card = document.createElement('div');
            card.className = 'card';
            card.innerHTML = `
                <div class="card-inner">
                    <div class="card-front">${item.t}</div>
                    <div class="card-back">
                        <img src="luz.jpg" onerror="this.src='https://via.placeholder.com/150/00f2fe/000000?text=CHEM'">
                    </div>
                </div>
            `;
            card.onclick = () => {
                if(flipped.length < 2 && !card.classList.contains('flipped')){
                    card.classList.add('flipped');
                    flipped.push({card, id: item.id, text: item.t});
                    if(flipped.length === 2){
                        if(flipped[0].id === flipped[1].id){
                            this.puntos++;
                            matchedCount++;
                            document.getElementById('score').innerText = this.puntos;
                            flipped = [];
                            if(matchedCount === 10){
                                clearInterval(this.timerInt);
                                setTimeout(() => {
                                    this.showModal("BASE DE DATOS SINCRONIZADA", "Has identificado correctamente los componentes del aire y contaminantes.", () => this.nextStage());
                                }, 500);
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

    /* ================= AHORCADO ================= */
    loadStage2(){
        const container = document.getElementById('game-container');
        container.innerHTML = '';
        container.className = 'stage-central';
        document.getElementById('stage-title').innerText = `ETAPA 2: CÓDIGO QUÍMICO (${this.ahorcadoIndex + 1}/9)`;

        this.startTimer(50, () => {
            this.ahorcadoIndex++;
            if(this.ahorcadoIndex < 9) this.loadStage2();
            else this.showModal("FASE FINALIZADA", "Avanzando al siguiente protocolo.", () => this.nextStage());
        });

        const actual = this.ahorcadoWords[this.ahorcadoIndex];
        const word = actual.palabra;
        container.innerHTML = `
            <svg id="hangman-svg" viewBox="0 0 200 250">
                <path d="M20 230 L180 230 M50 230 L50 20 L130 20 L130 50" stroke="var(--neon-blue)" stroke-width="5" fill="none" />
                <circle id="h-head" class="hang-path hidden" cx="130" cy="80" r="20" stroke="white" stroke-width="5" fill="none" />
                <line id="h-body" class="hang-path hidden" x1="130" y1="100" x2="130" y2="170" stroke="white" stroke-width="5" />
                <line id="h-armL" class="hang-path hidden" x1="130" y1="120" x2="100" y2="150" stroke="white" stroke-width="5" />
                <line id="h-armR" class="hang-path hidden" x1="130" y1="120" x2="160" y2="150" stroke="white" stroke-width="5" />
                <line id="h-legL" class="hang-path hidden" x1="130" y1="170" x2="100" y2="210" stroke="white" stroke-width="5" />
                <line id="h-legR" class="hang-path hidden" x1="130" y1="170" x2="160" y2="210" stroke="white" stroke-width="5" />
            </svg>
            <div id="word-display" class="hangman-word"></div>

            <p style="color:var(--neon-green); text-align:center; margin-top:10px;">
            Pista: ${actual.pista}
            </p>

            <div id="keyboard" class="letter-grid"></div>
        `;

        
        let guessed = [word[0], word[word.length - 1]];
        let fails = 0;
        const parts = ['h-head', 'h-body', 'h-armL', 'h-armR', 'h-legL', 'h-legR'];

        const updateWord = () => {
            const d = word.split('').map(l => guessed.includes(l) ? l : '_').join(' ');
            document.getElementById('word-display').innerText = d;
            if(!d.includes('_')){
                this.puntos++;
                this.historial.push({q:`Palabra: ${word}`, r:"Adivinada", v:true});
                document.getElementById('score').innerText = this.puntos;
                this.ahorcadoIndex++;
                setTimeout(() => {
                    if(this.ahorcadoIndex < 9) this.loadStage2();
                    else { clearInterval(this.timerInt); this.showModal("SISTEMA DEPURADO", "Palabras clave identificadas.", () => this.nextStage()); }
                }, 1000);
            }
        };

        "ABCDEFGHIJKLMNÑOPQRSTUVWXYZ".split('').forEach(l => {
            const b = document.createElement('button');
            b.className = 'key-btn';
            b.innerText = l;
            b.onclick = () => {
                b.disabled = true;
                if(word.includes(l)){ guessed.push(l); updateWord(); }
                else {
                    if(parts[fails]) document.getElementById(parts[fails]).classList.remove('hidden');
                    fails++;
                    if(fails === 6){
                        this.historial.push({q:`Palabra: ${word}`, r:"Fallida", v:false});
                        this.ahorcadoIndex++;
                        if(this.ahorcadoIndex < 9) this.loadStage2();
                        else { clearInterval(this.timerInt); this.showModal("PROTOCOLO AGOTADO", "Cerrando etapa de códigos.", () => this.nextStage()); }
                    }
                }
            };
            document.getElementById('keyboard').appendChild(b);
        });
        updateWord();
    },

    /* ================= FRASES CON RETROALIMENTACIÓN ================= */
    loadStage3(){
        const container = document.getElementById('game-container');
        container.className = 'stage-central';
        if(this.fraseActual === 0){
            this.startTimer(150, () => this.showFinalReport());
        }

        document.getElementById('stage-title').innerText = `ETAPA 3: PROTOCOLO DE ANÁLISIS (${this.fraseActual + 1}/12)`;
        const f = this.frases[this.fraseActual];

        container.innerHTML = `
            <p style="font-size:1.3rem; text-align:center; padding:15px; color:white;">"${f.f}"</p>
            <div id="options-box" class="letter-grid"></div>
        `;

        f.o.sort(() => Math.random() - 0.5).forEach(opt => {
            const btn = document.createElement('button');
            btn.className = 'neon-btn';
            btn.style.width = "220px";
            btn.innerText = opt;
            btn.onclick = () => {
                const esCorrecto = (opt === f.r);
                if(esCorrecto) this.puntos++;
                
                this.historial.push({
                    q: f.f.replace("___", f.r),
                    r: opt,
                    v: esCorrecto
                });

                document.getElementById('score').innerText = this.puntos;
                
                // RETROALIMENTACIÓN PARA CUMPLIR CRITERIO EVALUACIÓN
                const feedbackTitle = esCorrecto ? "¡CORRECTO!" : "INCORRECTO";
                this.showModal(feedbackTitle, f.info, () => {
                    this.fraseActual++;
                    if(this.fraseActual < 12) this.loadStage3();
                    else { clearInterval(this.timerInt); this.showFinalReport(); }
                });
            };
            document.getElementById('options-box').appendChild(btn);
        });
    },

    showFinalReport(){
        const promedio = (this.puntos / this.maxPuntos * 10).toFixed(1);
        const container = document.getElementById('game-container');
        container.innerHTML = `
            <h1 style="color:var(--neon-blue)">PROTOCOLO FINALIZADO</h1>
            <p style="font-size:1.8rem;">Puntos totales: ${this.puntos} / ${this.maxPuntos}</p>
            <p style="font-size:3rem; color:var(--neon-green);">CALIFICACIÓN: ${promedio}</p>
            <button class="neon-btn" onclick="game.verRevision()">REVISAR EXPEDIENTE</button>
            <button class="neon-btn" onclick="location.reload()" style="border-color:var(--neon-red); color:var(--neon-red);">REINICIAR</button>
        `;
    },

    verRevision(){
        const container = document.getElementById('game-container');
        container.innerHTML = `<div id="review-list" style="text-align:left; width:100%; max-height:350px; overflow-y:auto; padding:15px; background:#050a14; border:1px solid var(--neon-blue); border-radius:10px;"></div>`;
        const list = document.getElementById('review-list');
        this.historial.forEach(item => {
            const div = document.createElement('div');
            div.style.marginBottom = "10px";
            div.style.padding = "8px";
            div.style.borderLeft = `4px solid ${item.v ? '#39ff14' : '#ff3131'}`;
            div.innerHTML = `<small>Análisis:</small> ${item.q}<br><small>Respuesta:</small> ${item.r} ${item.v ? '✅' : '❌'}`;
            list.appendChild(div);
        });
        const btn = document.createElement('button');
        btn.className = 'neon-btn';
        btn.innerText = "VOLVER";
        btn.onclick = () => this.showFinalReport();
        container.appendChild(btn);
    }
};