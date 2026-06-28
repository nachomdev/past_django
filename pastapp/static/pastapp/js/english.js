// ========================================
// ENGLISH EXAM PRACTICE — Data & Logic
// ========================================

// ========================================
// SIMPLE PAST DATA
// ========================================
const SIMPLE_PAST = {
    regularRules: [
        { rule: "Most verbs", example: "work → worked", pattern: "+ ed" },
        { rule: "Verbs ending in -e", example: "live → lived", pattern: "+ d" },
        { rule: "Verbs ending in consonant + y", example: "study → studied", pattern: "y → ied" },
        { rule: "Short verbs (CVC)", example: "stop → stopped", pattern: "double last + ed" },
    ],
    regularVerbs: [
        { base: "work", past: "worked", es: "trabajar" },
        { base: "play", past: "played", es: "jugar" },
        { base: "watch", past: "watched", es: "mirar" },
        { base: "listen", past: "listened", es: "escuchar" },
        { base: "walk", past: "walked", es: "caminar" },
        { base: "talk", past: "talked", es: "hablar" },
        { base: "cook", past: "cooked", es: "cocinar" },
        { base: "clean", past: "cleaned", es: "limpiar" },
        { base: "live", past: "lived", es: "vivir" },
        { base: "dance", past: "danced", es: "bailar" },
        { base: "study", past: "studied", es: "estudiar" },
        { base: "carry", past: "carried", es: "llevar" },
        { base: "stop", past: "stopped", es: "parar" },
        { base: "travel", past: "travelled", es: "viajar" },
        { base: "visit", past: "visited", es: "visitar" },
        { base: "start", past: "started", es: "empezar" },
        { base: "finish", past: "finished", es: "terminar" },
        { base: "open", past: "opened", es: "abrir" },
        { base: "close", past: "closed", es: "cerrar" },
        { base: "arrive", past: "arrived", es: "llegar" },
        { base: "jump", past: "jumped", es: "saltar" },
        { base: "try", past: "tried", es: "intentar" },
        { base: "help", past: "helped", es: "ayudar" },
        { base: "enjoy", past: "enjoyed", es: "disfrutar" },
        { base: "permit", past: "permitted", es: "permitir" },
        { base: "race", past: "raced", es: "correr (carrera)" },
        { base: "worry", past: "worried", es: "preocuparse" },
        { base: "brush", past: "brushed", es: "cepillar" },
        { base: "smile", past: "smiled", es: "sonreír" },
        { base: "shop", past: "shopped", es: "comprar" },
        { base: "wash", past: "washed", es: "lavar" },
        { base: "hurry", past: "hurried", es: "apurarse" },
    ],
    irregularVerbs: [
        { base: "be", past: "was/were", es: "ser/estar" },
        { base: "have", past: "had", es: "tener" },
        { base: "do", past: "did", es: "hacer" },
        { base: "go", past: "went", es: "ir" },
        { base: "see", past: "saw", es: "ver" },
        { base: "make", past: "made", es: "hacer/fabricar" },
        { base: "come", past: "came", es: "venir" },
        { base: "take", past: "took", es: "tomar" },
        { base: "get", past: "got", es: "obtener" },
        { base: "give", past: "gave", es: "dar" },
        { base: "eat", past: "ate", es: "comer" },
        { base: "drink", past: "drank", es: "beber" },
        { base: "write", past: "wrote", es: "escribir" },
        { base: "read", past: "read", es: "leer" },
        { base: "run", past: "ran", es: "correr" },
        { base: "swim", past: "swam", es: "nadar" },
        { base: "buy", past: "bought", es: "comprar" },
        { base: "think", past: "thought", es: "pensar" },
        { base: "say", past: "said", es: "decir" },
        { base: "tell", past: "told", es: "contar/decir" },
        { base: "find", past: "found", es: "encontrar" },
        { base: "know", past: "knew", es: "saber" },
        { base: "sit", past: "sat", es: "sentarse" },
        { base: "stand", past: "stood", es: "estar de pie" },
        { base: "sleep", past: "slept", es: "dormir" },
        { base: "wake", past: "woke", es: "despertar" },
        { base: "wear", past: "wore", es: "usar/vestir" },
        { base: "put", past: "put", es: "poner" },
        { base: "begin", past: "began", es: "comenzar" },
        { base: "break", past: "broke", es: "romper" },
    ],
    structures: {
        affirmative: {
            structure: "Subject + verb (past form)",
            examples: [
                { en: "I worked yesterday.", es: "Yo trabajé ayer." },
                { en: "She went to school.", es: "Ella fue a la escuela." },
                { en: "They played football.", es: "Ellos jugaron al fútbol." },
            ]
        },
        negative: {
            structure: "Subject + didn't + base verb",
            examples: [
                { en: "I didn't work yesterday.", es: "Yo no trabajé ayer." },
                { en: "She didn't go to school.", es: "Ella no fue a la escuela." },
                { en: "They didn't play football.", es: "Ellos no jugaron al fútbol." },
            ]
        },
        interrogative: {
            structure: "Did + subject + base verb?",
            examples: [
                { en: "Did you work yesterday?", es: "¿Trabajaste ayer?" },
                { en: "Did she go to school?", es: "¿Ella fue a la escuela?" },
                { en: "Did they play football?", es: "¿Ellos jugaron al fútbol?" },
            ]
        }
    },
    waswere: {
        rule: "The verb BE in Simple Past: WAS (I/He/She/It) — WERE (You/We/They)",
        examples: [
            { subj: "I", verb: "was" },
            { subj: "You", verb: "were" },
            { subj: "He/She/It", verb: "was" },
            { subj: "We", verb: "were" },
            { subj: "They", verb: "were" },
        ]
    }
};

// ========================================
// PRESENT CONTINUOUS DATA
// ========================================
const PRESENT_CONTINUOUS = {
    rule: "Subject + am/is/are + verb-ING",
    beConjugation: [
        { subj: "I", be: "am" },
        { subj: "You", be: "are" },
        { subj: "He/She/It", be: "is" },
        { subj: "We", be: "are" },
        { subj: "They", be: "are" },
    ],
    ingRules: [
        { rule: "Most verbs", example: "play → playing", pattern: "+ ing" },
        { rule: "Verbs ending in -e", example: "make → making", pattern: "remove -e, + ing" },
        { rule: "Short verbs (CVC)", example: "run → running", pattern: "double last + ing" },
        { rule: "Verbs ending in -ie", example: "die → dying", pattern: "ie → ying" },
    ],
    verbs: [
        { base: "play", ing: "playing", es: "jugar" },
        { base: "eat", ing: "eating", es: "comer" },
        { base: "read", ing: "reading", es: "leer" },
        { base: "watch", ing: "watching", es: "mirar" },
        { base: "listen", ing: "listening", es: "escuchar" },
        { base: "study", ing: "studying", es: "estudiar" },
        { base: "work", ing: "working", es: "trabajar" },
        { base: "sleep", ing: "sleeping", es: "dormir" },
        { base: "cook", ing: "cooking", es: "cocinar" },
        { base: "dance", ing: "dancing", es: "bailar" },
        { base: "make", ing: "making", es: "hacer" },
        { base: "write", ing: "writing", es: "escribir" },
        { base: "run", ing: "running", es: "correr" },
        { base: "swim", ing: "swimming", es: "nadar" },
        { base: "sit", ing: "sitting", es: "sentarse" },
        { base: "stop", ing: "stopping", es: "parar" },
        { base: "die", ing: "dying", es: "morir" },
        { base: "lie", ing: "lying", es: "mentir/acostarse" },
        { base: "drink", ing: "drinking", es: "beber" },
        { base: "wear", ing: "wearing", es: "usar/vestir" },
        { base: "talk", ing: "talking", es: "hablar" },
        { base: "walk", ing: "walking", es: "caminar" },
    ],
    structures: {
        affirmative: {
            structure: "Subject + am/is/are + verb-ING",
            examples: [
                { en: "I am playing football.", es: "Estoy jugando al fútbol." },
                { en: "She is reading a book.", es: "Ella está leyendo un libro." },
                { en: "They are watching TV.", es: "Ellos están mirando la tele." },
            ]
        },
        negative: {
            structure: "Subject + am/is/are + not + verb-ING",
            examples: [
                { en: "I am not playing football.", es: "No estoy jugando al fútbol." },
                { en: "She isn't reading a book.", es: "Ella no está leyendo un libro." },
                { en: "They aren't watching TV.", es: "Ellos no están mirando la tele." },
            ]
        }
    }
};

// ========================================
// QUESTION WORDS DATA
// ========================================
const QUESTION_WORDS = {
    words: [
        { word: "What", meaning: "Qué", usage: "Preguntar por cosas o información", example: "What is your name?" },
        { word: "Where", meaning: "Dónde", usage: "Preguntar por lugares", example: "Where do you live?" },
        { word: "When", meaning: "Cuándo", usage: "Preguntar por tiempo", example: "When is your birthday?" },
        { word: "Who", meaning: "Quién", usage: "Preguntar por personas", example: "Who is your teacher?" },
        { word: "Why", meaning: "Por qué", usage: "Preguntar por razones", example: "Why are you sad?" },
        { word: "How", meaning: "Cómo", usage: "Preguntar por manera o estado", example: "How are you?" },
        { word: "Which", meaning: "Cuál", usage: "Elegir entre opciones", example: "Which colour do you prefer?" },
        { word: "Whose", meaning: "De quién", usage: "Preguntar por posesión", example: "Whose bag is this?" },
        { word: "How many", meaning: "Cuántos/as", usage: "Cantidad (contable)", example: "How many brothers do you have?" },
        { word: "How much", meaning: "Cuánto/a", usage: "Cantidad (incontable) / Precio", example: "How much is this T-shirt?" },
        { word: "How old", meaning: "Cuántos años", usage: "Preguntar por edad", example: "How old are you?" },
        { word: "What time", meaning: "A qué hora", usage: "Preguntar por hora", example: "What time is it?" },
    ],
    practiceQuestions: [
        { question: "___ is your name?", answer: "What" },
        { question: "___ do you live?", answer: "Where" },
        { question: "___ is your birthday?", answer: "When" },
        { question: "___ is your best friend?", answer: "Who" },
        { question: "___ are you late?", answer: "Why" },
        { question: "___ do you go to school?", answer: "How" },
        { question: "___ book do you want?", answer: "Which" },
        { question: "___ pencil is this?", answer: "Whose" },
        { question: "___ students are there?", answer: "How many" },
        { question: "___ does this cost?", answer: "How much" },
        { question: "___ is she?", answer: "How old" },
        { question: "___ do you wake up?", answer: "What time" },
        { question: "___ colour is your bag?", answer: "What" },
        { question: "___ is the library?", answer: "Where" },
        { question: "___ does the class start?", answer: "When" },
        { question: "___ is sitting next to you?", answer: "Who" },
        { question: "___ are you crying?", answer: "Why" },
        { question: "___ do you spell that?", answer: "How" },
    ]
};

// ========================================
// VOCABULARY DATA
// ========================================
const VOCABULARY = {
    physicalDescription: [
        { en: "tall", es: "alto/a" },
        { en: "short", es: "bajo/a" },
        { en: "thin", es: "delgado/a" },
        { en: "fat / overweight", es: "gordo/a / con sobrepeso" },
        { en: "slim", es: "delgado/a (elegante)" },
        { en: "young", es: "joven" },
        { en: "old", es: "viejo/a" },
        { en: "beautiful", es: "hermoso/a" },
        { en: "handsome", es: "apuesto" },
        { en: "pretty", es: "bonita" },
        { en: "ugly", es: "feo/a" },
    ],
    hair: [
        { en: "long hair", es: "pelo largo" },
        { en: "short hair", es: "pelo corto" },
        { en: "straight hair", es: "pelo lacio" },
        { en: "curly hair", es: "pelo rizado" },
        { en: "wavy hair", es: "pelo ondulado" },
        { en: "blond hair", es: "pelo rubio" },
        { en: "brown hair", es: "pelo castaño" },
        { en: "black hair", es: "pelo negro" },
        { en: "red hair", es: "pelo pelirrojo" },
        { en: "bald", es: "calvo" },
    ],
    eyes: [
        { en: "blue eyes", es: "ojos azules" },
        { en: "brown eyes", es: "ojos marrones" },
        { en: "green eyes", es: "ojos verdes" },
        { en: "big eyes", es: "ojos grandes" },
        { en: "small eyes", es: "ojos pequeños" },
    ],
    otherFeatures: [
        { en: "beard", es: "barba" },
        { en: "moustache", es: "bigote" },
        { en: "freckles", es: "pecas" },
        { en: "glasses", es: "anteojos / lentes" },
        { en: "braces", es: "brackets" },
    ],
    clothes: [
        { en: "T-shirt", es: "remera" },
        { en: "shirt", es: "camisa" },
        { en: "blouse", es: "blusa" },
        { en: "jumper / sweater", es: "suéter / buzo" },
        { en: "hoodie", es: "buzo con capucha" },
        { en: "jacket", es: "campera" },
        { en: "coat", es: "abrigo" },
        { en: "dress", es: "vestido" },
        { en: "skirt", es: "falda / pollera" },
        { en: "jeans", es: "jeans" },
        { en: "trousers / pants", es: "pantalones" },
        { en: "shorts", es: "pantalones cortos" },
        { en: "uniform", es: "uniforme" },
        { en: "pyjamas", es: "pijama" },
    ],
    shoes: [
        { en: "shoes", es: "zapatos" },
        { en: "trainers / sneakers", es: "zapatillas" },
        { en: "boots", es: "botas" },
        { en: "sandals", es: "sandalias" },
        { en: "slippers", es: "pantuflas" },
        { en: "high heels", es: "zapatos de taco" },
    ],
    accessories: [
        { en: "hat", es: "sombrero / gorro" },
        { en: "cap", es: "gorra" },
        { en: "scarf", es: "bufanda" },
        { en: "gloves", es: "guantes" },
        { en: "belt", es: "cinturón" },
        { en: "bag / backpack", es: "bolso / mochila" },
        { en: "watch", es: "reloj" },
        { en: "necklace", es: "collar" },
        { en: "bracelet", es: "pulsera" },
        { en: "earrings", es: "aros" },
        { en: "ring", es: "anillo" },
        { en: "sunglasses", es: "anteojos de sol" },
        { en: "tie", es: "corbata" },
    ]
};

// ========================================
// SEQUENCE WORDS DATA
// ========================================
const SEQUENCE_WORDS = {
    words: [
        { en: "First", es: "Primero", usage: "Para empezar una secuencia" },
        { en: "First of all", es: "Antes que nada", usage: "Para empezar con énfasis" },
        { en: "Then", es: "Luego / Entonces", usage: "Después de la primera acción" },
        { en: "Next", es: "A continuación", usage: "Siguiente paso" },
        { en: "After that", es: "Después de eso", usage: "Continuación" },
        { en: "Later", es: "Más tarde", usage: "Tiempo después" },
        { en: "Meanwhile", es: "Mientras tanto", usage: "Al mismo tiempo" },
        { en: "Before", es: "Antes", usage: "Antes de algo" },
        { en: "After", es: "Después", usage: "Después de algo" },
        { en: "Finally", es: "Finalmente", usage: "Para terminar la secuencia" },
        { en: "In the end", es: "Al final", usage: "Resultado final" },
        { en: "At last", es: "Por fin", usage: "Después de mucha espera" },
    ],
    exampleStory: [
        { connector: "First", text: "I woke up at 7 o'clock." },
        { connector: "Then", text: "I had breakfast with my family." },
        { connector: "After that", text: "I walked to school." },
        { connector: "Next", text: "I had English class." },
        { connector: "Later", text: "I played with my friends at break time." },
        { connector: "Finally", text: "I went home and did my homework." },
    ],
    practiceItems: [
        { context: "Empezar el relato", answer: "First" },
        { context: "Después de la primera acción", answer: "Then" },
        { context: "El paso siguiente", answer: "Next" },
        { context: "Continuación tras otro evento", answer: "After that" },
        { context: "Algo que pasó más tarde", answer: "Later" },
        { context: "Terminar la historia", answer: "Finally" },
        { context: "Al mismo tiempo que otra cosa", answer: "Meanwhile" },
        { context: "El resultado final", answer: "In the end" },
        { context: "Después de mucha espera", answer: "At last" },
    ]
};


// ========================================
// APP STATE
// ========================================
let enState = {
    currentTab: 'simple_past',
    mode: 'study',
    questions: [],
    currentQuestion: 0,
    score: 0,
    wrong: 0,
    streak: 0,
    bestStreak: 0,
    answered: false,
    totalQuestions: 10,
};

// ========================================
// INIT
// ========================================
document.addEventListener('DOMContentLoaded', () => {
    enInitTabs();
    enInitModeToggle();
    enRender();
});

function enInitTabs() {
    document.querySelectorAll('.en-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            enState.currentTab = tab.dataset.tab;
            document.querySelectorAll('.en-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            enResetPractice();
            enRender();
        });
    });
}

function enInitModeToggle() {
    document.querySelectorAll('.en-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            enState.mode = btn.dataset.mode;
            document.querySelectorAll('.en-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (enState.mode === 'practice') {
                enStartPractice();
            }
            enRender();
        });
    });
}

// ========================================
// RENDER
// ========================================
function enRender() {
    const studyPanel = document.getElementById('en-study-panel');
    const practicePanel = document.getElementById('en-practice-panel');

    if (enState.mode === 'study') {
        studyPanel.style.display = 'block';
        practicePanel.style.display = 'none';
        enRenderStudy();
    } else {
        studyPanel.style.display = 'none';
        practicePanel.style.display = 'flex';
        enRenderPractice();
    }
}

// ========================================
// STUDY MODE
// ========================================
function enRenderStudy() {
    const panel = document.getElementById('en-study-panel');

    switch (enState.currentTab) {
        case 'simple_past':
            enRenderStudySimplePast(panel);
            break;
        case 'present_continuous':
            enRenderStudyPresentContinuous(panel);
            break;
        case 'question_words':
            enRenderStudyQuestionWords(panel);
            break;
        case 'vocabulary':
            enRenderStudyVocabulary(panel);
            break;
        case 'sequence_words':
            enRenderStudySequenceWords(panel);
            break;
    }
}

// ========================================
// STUDY: SIMPLE PAST
// ========================================
function enRenderStudySimplePast(panel) {
    let html = '';

    // Structures: Affirmative, Negative, Interrogative
    const forms = [
        { key: 'affirmative', icon: '✅', label: 'Affirmative', tagClass: 'affirm' },
        { key: 'negative', icon: '❌', label: 'Negative', tagClass: 'neg' },
        { key: 'interrogative', icon: '❓', label: 'Interrogative', tagClass: 'interr' },
    ];

    forms.forEach(f => {
        const data = SIMPLE_PAST.structures[f.key];
        html += `
        <div class="en-card">
            <div class="card-title">
                <span>${f.icon}</span>
                <span class="title-text">${f.label}</span>
            </div>
            <div class="en-rule-box">
                <span class="en-tag ${f.tagClass}">${f.label}</span>
                <span>${data.structure}</span>
            </div>
            <table class="en-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>English</th>
                        <th>Español</th>
                    </tr>
                </thead>
                <tbody>
        `;
        data.examples.forEach(ex => {
            html += `
                <tr>
                    <td class="label">🇬🇧</td>
                    <td class="value"><span class="highlight">${ex.en}</span></td>
                    <td class="muted">${ex.es}</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        </div>
        `;
    });

    // WAS / WERE
    html += `
    <div class="en-card">
        <div class="card-title">
            <span>🔤</span>
            <span class="title-text">WAS / WERE (BE in Simple Past)</span>
        </div>
        <div class="card-desc">${SIMPLE_PAST.waswere.rule}</div>
        <table class="en-table">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>Verb BE</th>
                </tr>
            </thead>
            <tbody>
    `;
    SIMPLE_PAST.waswere.examples.forEach(e => {
        html += `
            <tr>
                <td class="label">${e.subj}</td>
                <td class="value"><span class="highlight">${e.verb}</span></td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
    </div>
    `;

    // Regular verbs rules
    html += `
    <div class="en-card">
        <div class="card-title">
            <span>📏</span>
            <span class="title-text">Regular Verbs — Rules for -ED</span>
        </div>
        <div class="card-desc">Reglas para formar el pasado de verbos regulares</div>
        <table class="en-table">
            <thead>
                <tr>
                    <th>Rule</th>
                    <th>Pattern</th>
                    <th>Example</th>
                </tr>
            </thead>
            <tbody>
    `;
    SIMPLE_PAST.regularRules.forEach(r => {
        html += `
            <tr>
                <td class="label">${r.rule}</td>
                <td class="value"><span class="en-tag tense">${r.pattern}</span></td>
                <td class="value"><span class="highlight">${r.example}</span></td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
    </div>
    `;

    // Regular verbs list
    html += `
    <div class="en-card">
        <div class="card-title">
            <span>📝</span>
            <span class="title-text">Regular Verbs</span>
        </div>
        <div class="en-grid">
    `;
    SIMPLE_PAST.regularVerbs.forEach(v => {
        html += `
            <div class="en-chip">
                ${v.base} → ${v.past}
                <span class="meaning">${v.es}</span>
            </div>
        `;
    });
    html += `
        </div>
    </div>
    `;

    // Irregular verbs list
    html += `
    <div class="en-card">
        <div class="card-title">
            <span>⚡</span>
            <span class="title-text">Irregular Verbs</span>
        </div>
        <div class="card-desc">Estos verbos no siguen reglas — hay que memorizarlos</div>
        <table class="en-table">
            <thead>
                <tr>
                    <th>Base Form</th>
                    <th>Past</th>
                    <th>Español</th>
                </tr>
            </thead>
            <tbody>
    `;
    SIMPLE_PAST.irregularVerbs.forEach(v => {
        html += `
            <tr>
                <td class="label">${v.base}</td>
                <td class="value"><span class="highlight">${v.past}</span></td>
                <td class="muted">${v.es}</td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
    </div>
    `;

    panel.innerHTML = html;
}

// ========================================
// STUDY: PRESENT CONTINUOUS
// ========================================
function enRenderStudyPresentContinuous(panel) {
    let html = '';

    // BE conjugation
    html += `
    <div class="en-card">
        <div class="card-title">
            <span>🔧</span>
            <span class="title-text">Verb BE (am / is / are)</span>
        </div>
        <div class="card-desc">${PRESENT_CONTINUOUS.rule}</div>
        <table class="en-table">
            <thead>
                <tr>
                    <th>Subject</th>
                    <th>BE</th>
                </tr>
            </thead>
            <tbody>
    `;
    PRESENT_CONTINUOUS.beConjugation.forEach(c => {
        html += `
            <tr>
                <td class="label">${c.subj}</td>
                <td class="value"><span class="highlight">${c.be}</span></td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
    </div>
    `;

    // -ING rules
    html += `
    <div class="en-card">
        <div class="card-title">
            <span>📏</span>
            <span class="title-text">Rules for -ING</span>
        </div>
        <div class="card-desc">Reglas para agregar -ING a los verbos</div>
        <table class="en-table">
            <thead>
                <tr>
                    <th>Rule</th>
                    <th>Pattern</th>
                    <th>Example</th>
                </tr>
            </thead>
            <tbody>
    `;
    PRESENT_CONTINUOUS.ingRules.forEach(r => {
        html += `
            <tr>
                <td class="label">${r.rule}</td>
                <td class="value"><span class="en-tag tense">${r.pattern}</span></td>
                <td class="value"><span class="highlight">${r.example}</span></td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
    </div>
    `;

    // Structures
    const forms = [
        { key: 'affirmative', icon: '✅', label: 'Affirmative', tagClass: 'affirm' },
        { key: 'negative', icon: '❌', label: 'Negative', tagClass: 'neg' },
    ];

    forms.forEach(f => {
        const data = PRESENT_CONTINUOUS.structures[f.key];
        html += `
        <div class="en-card">
            <div class="card-title">
                <span>${f.icon}</span>
                <span class="title-text">${f.label}</span>
            </div>
            <div class="en-rule-box">
                <span class="en-tag ${f.tagClass}">${f.label}</span>
                <span>${data.structure}</span>
            </div>
            <table class="en-table">
                <thead>
                    <tr>
                        <th>English</th>
                        <th>Español</th>
                    </tr>
                </thead>
                <tbody>
        `;
        data.examples.forEach(ex => {
            html += `
                <tr>
                    <td class="value"><span class="highlight">${ex.en}</span></td>
                    <td class="muted">${ex.es}</td>
                </tr>
            `;
        });
        html += `
                </tbody>
            </table>
        </div>
        `;
    });

    // Verbs -ING list
    html += `
    <div class="en-card">
        <div class="card-title">
            <span>📚</span>
            <span class="title-text">Verbs + ING</span>
        </div>
        <div class="en-grid">
    `;
    PRESENT_CONTINUOUS.verbs.forEach(v => {
        html += `
            <div class="en-chip">
                ${v.base} → ${v.ing}
                <span class="meaning">${v.es}</span>
            </div>
        `;
    });
    html += `
        </div>
    </div>
    `;

    panel.innerHTML = html;
}

// ========================================
// STUDY: QUESTION WORDS
// ========================================
function enRenderStudyQuestionWords(panel) {
    let html = '';

    html += `
    <div class="en-card">
        <div class="card-title">
            <span>❓</span>
            <span class="title-text">Question Words</span>
        </div>
        <div class="card-desc">Palabras interrogativas en inglés</div>
        <table class="en-table">
            <thead>
                <tr>
                    <th>Word</th>
                    <th>Meaning</th>
                    <th>Usage</th>
                    <th>Example</th>
                </tr>
            </thead>
            <tbody>
    `;
    QUESTION_WORDS.words.forEach(w => {
        html += `
            <tr>
                <td class="label"><span class="highlight">${w.word}</span></td>
                <td class="value">${w.meaning}</td>
                <td class="muted">${w.usage}</td>
                <td class="value" style="font-style: italic;">${w.example}</td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
    </div>
    `;

    panel.innerHTML = html;
}

// ========================================
// STUDY: VOCABULARY
// ========================================
function enRenderStudyVocabulary(panel) {
    let html = '';

    const sections = [
        { key: 'physicalDescription', title: 'Physical Description', icon: '👤', desc: 'Descripción física' },
        { key: 'hair', title: 'Hair', icon: '💇', desc: 'El cabello' },
        { key: 'eyes', title: 'Eyes', icon: '👁️', desc: 'Los ojos' },
        { key: 'otherFeatures', title: 'Other Features', icon: '🔍', desc: 'Otros rasgos' },
        { key: 'clothes', title: 'Clothes', icon: '👕', desc: 'La ropa' },
        { key: 'shoes', title: 'Shoes', icon: '👟', desc: 'Calzado' },
        { key: 'accessories', title: 'Accessories', icon: '👜', desc: 'Accesorios' },
    ];

    sections.forEach(s => {
        const items = VOCABULARY[s.key];
        html += `
        <div class="en-card">
            <div class="card-title">
                <span>${s.icon}</span>
                <span class="title-text">${s.title}</span>
            </div>
            <div class="card-desc">${s.desc}</div>
            <div class="en-grid">
        `;
        items.forEach(item => {
            html += `
                <div class="en-chip">
                    ${item.en}
                    <span class="meaning">${item.es}</span>
                </div>
            `;
        });
        html += `
            </div>
        </div>
        `;
    });

    panel.innerHTML = html;
}

// ========================================
// STUDY: SEQUENCE WORDS
// ========================================
function enRenderStudySequenceWords(panel) {
    let html = '';

    // Words table
    html += `
    <div class="en-card">
        <div class="card-title">
            <span>🔗</span>
            <span class="title-text">Sequence Words</span>
        </div>
        <div class="card-desc">Conectores de secuencia para ordenar eventos</div>
        <table class="en-table">
            <thead>
                <tr>
                    <th>English</th>
                    <th>Español</th>
                    <th>Usage</th>
                </tr>
            </thead>
            <tbody>
    `;
    SEQUENCE_WORDS.words.forEach(w => {
        html += `
            <tr>
                <td class="label"><span class="highlight">${w.en}</span></td>
                <td class="value">${w.es}</td>
                <td class="muted">${w.usage}</td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
    </div>
    `;

    // Example story
    html += `
    <div class="en-card">
        <div class="card-title">
            <span>📖</span>
            <span class="title-text">Example: My Day</span>
        </div>
        <div class="card-desc">Ejemplo de una historia usando conectores de secuencia</div>
        <table class="en-table">
            <tbody>
    `;
    SEQUENCE_WORDS.exampleStory.forEach(s => {
        html += `
            <tr>
                <td class="label" style="width: 120px;"><span class="highlight">${s.connector},</span></td>
                <td class="value">${s.text}</td>
            </tr>
        `;
    });
    html += `
            </tbody>
        </table>
    </div>
    `;

    panel.innerHTML = html;
}


// ========================================
// PRACTICE MODE
// ========================================
function enGenerateQuestions() {
    switch (enState.currentTab) {
        case 'simple_past': return enGenerateSimplePastQuestions();
        case 'present_continuous': return enGeneratePresentContinuousQuestions();
        case 'question_words': return enGenerateQuestionWordsQuestions();
        case 'vocabulary': return enGenerateVocabularyQuestions();
        case 'sequence_words': return enGenerateSequenceWordsQuestions();
        default: return [];
    }
}

function enGenerateSimplePastQuestions() {
    const questions = [];
    const types = ['regular_past', 'irregular_past', 'negative', 'interrogative', 'waswere'];

    for (let i = 0; i < enState.totalQuestions; i++) {
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'regular_past') {
            const v = SIMPLE_PAST.regularVerbs[Math.floor(Math.random() * SIMPLE_PAST.regularVerbs.length)];
            questions.push({
                prompt: `Write the past form of this verb`,
                display: v.base + ' →',
                tag: 'REGULAR PAST',
                answer: v.past,
            });
        } else if (type === 'irregular_past') {
            const v = SIMPLE_PAST.irregularVerbs[Math.floor(Math.random() * SIMPLE_PAST.irregularVerbs.length)];
            // Skip "be" for simple past form questions (use waswere instead)
            if (v.base === 'be') {
                i--;
                continue;
            }
            questions.push({
                prompt: `Write the past form of this verb`,
                display: v.base + ' →',
                tag: 'IRREGULAR PAST',
                answer: v.past,
            });
        } else if (type === 'negative') {
            const allVerbs = [...SIMPLE_PAST.regularVerbs, ...SIMPLE_PAST.irregularVerbs.filter(v => v.base !== 'be')];
            const v = allVerbs[Math.floor(Math.random() * allVerbs.length)];
            const subjects = ['I', 'You', 'He', 'She', 'We', 'They'];
            const subj = subjects[Math.floor(Math.random() * subjects.length)];
            questions.push({
                prompt: `Write the negative form (Simple Past)`,
                display: `${subj} / ${v.base}`,
                tag: 'NEGATIVE',
                answer: `${subj} didn't ${v.base}`,
            });
        } else if (type === 'interrogative') {
            const allVerbs = [...SIMPLE_PAST.regularVerbs, ...SIMPLE_PAST.irregularVerbs.filter(v => v.base !== 'be')];
            const v = allVerbs[Math.floor(Math.random() * allVerbs.length)];
            const subjects = ['you', 'he', 'she', 'we', 'they'];
            const subj = subjects[Math.floor(Math.random() * subjects.length)];
            questions.push({
                prompt: `Write the interrogative form (Simple Past)`,
                display: `${subj} / ${v.base} ?`,
                tag: 'INTERROGATIVE',
                answer: `Did ${subj} ${v.base}?`,
            });
        } else {
            // was/were
            const items = SIMPLE_PAST.waswere.examples;
            const item = items[Math.floor(Math.random() * items.length)];
            questions.push({
                prompt: `Complete with WAS or WERE`,
                display: `${item.subj} ___`,
                tag: 'WAS / WERE',
                answer: item.verb,
            });
        }
    }

    return questions;
}

function enGeneratePresentContinuousQuestions() {
    const questions = [];
    const types = ['ing_form', 'full_affirm', 'full_neg'];

    for (let i = 0; i < enState.totalQuestions; i++) {
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'ing_form') {
            const v = PRESENT_CONTINUOUS.verbs[Math.floor(Math.random() * PRESENT_CONTINUOUS.verbs.length)];
            questions.push({
                prompt: `Write the -ING form of this verb`,
                display: v.base + ' →',
                tag: '-ING FORM',
                answer: v.ing,
            });
        } else if (type === 'full_affirm') {
            const v = PRESENT_CONTINUOUS.verbs[Math.floor(Math.random() * PRESENT_CONTINUOUS.verbs.length)];
            const beConj = PRESENT_CONTINUOUS.beConjugation[Math.floor(Math.random() * PRESENT_CONTINUOUS.beConjugation.length)];
            questions.push({
                prompt: `Write the full sentence (Present Continuous +)`,
                display: `${beConj.subj} / ${v.base}`,
                tag: 'AFFIRMATIVE',
                answer: `${beConj.subj} ${beConj.be} ${v.ing}`,
            });
        } else {
            const v = PRESENT_CONTINUOUS.verbs[Math.floor(Math.random() * PRESENT_CONTINUOUS.verbs.length)];
            const beConj = PRESENT_CONTINUOUS.beConjugation[Math.floor(Math.random() * PRESENT_CONTINUOUS.beConjugation.length)];
            questions.push({
                prompt: `Write the full negative sentence (Present Continuous -)`,
                display: `${beConj.subj} / not / ${v.base}`,
                tag: 'NEGATIVE',
                answer: `${beConj.subj} ${beConj.be} not ${v.ing}`,
            });
        }
    }

    return questions;
}

function enGenerateQuestionWordsQuestions() {
    const questions = [];
    const pool = QUESTION_WORDS.practiceQuestions;

    for (let i = 0; i < enState.totalQuestions; i++) {
        const item = pool[Math.floor(Math.random() * pool.length)];
        questions.push({
            prompt: `Complete with the correct question word`,
            display: item.question,
            tag: 'QUESTION WORDS',
            answer: item.answer,
        });
    }

    return questions;
}

function enGenerateVocabularyQuestions() {
    const questions = [];
    // Combine all vocabulary sections
    const allVocab = [
        ...VOCABULARY.physicalDescription,
        ...VOCABULARY.hair,
        ...VOCABULARY.eyes,
        ...VOCABULARY.otherFeatures,
        ...VOCABULARY.clothes,
        ...VOCABULARY.shoes,
        ...VOCABULARY.accessories,
    ];

    for (let i = 0; i < enState.totalQuestions; i++) {
        const item = allVocab[Math.floor(Math.random() * allVocab.length)];
        
        questions.push({
            prompt: `How do you say this in English?`,
            display: item.es + ' →',
            tag: 'VOCABULARY',
            answer: item.en,
        });
    }

    return questions;
}

function enGenerateSequenceWordsQuestions() {
    const questions = [];
    const pool = SEQUENCE_WORDS.practiceItems;

    for (let i = 0; i < enState.totalQuestions; i++) {
        const item = pool[Math.floor(Math.random() * pool.length)];
        questions.push({
            prompt: `What sequence word fits this context?`,
            display: item.context + ' →',
            tag: 'SEQUENCE WORDS',
            answer: item.answer,
        });
    }

    return questions;
}


// ========================================
// PRACTICE FLOW
// ========================================
function enStartPractice() {
    enState.questions = enGenerateQuestions();
    enState.currentQuestion = 0;
    enState.score = 0;
    enState.wrong = 0;
    enState.streak = 0;
    enState.bestStreak = 0;
    enState.answered = false;
}

function enResetPractice() {
    enState.mode = 'study';
    document.querySelectorAll('.en-mode-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === 'study');
    });
}

function enRenderPractice() {
    const panel = document.getElementById('en-practice-panel');

    if (enState.currentQuestion >= enState.questions.length) {
        enRenderResults(panel);
        return;
    }

    const q = enState.questions[enState.currentQuestion];
    const progress = ((enState.currentQuestion) / enState.questions.length) * 100;

    panel.innerHTML = `
        <div class="en-score-bar">
            <div class="en-score-item correct-score">
                <span class="score-icon">✓</span>
                <span class="score-val" id="en-score-correct">${enState.score}</span>
            </div>
            <div class="en-score-item wrong-score">
                <span class="score-icon">✗</span>
                <span class="score-val" id="en-score-wrong">${enState.wrong}</span>
            </div>
            <div class="en-score-item streak-score">
                <span class="score-icon">🔥</span>
                <span class="score-val" id="en-score-streak">${enState.streak}</span>
            </div>
        </div>

        <div class="en-question-card">
            <div class="en-progress-bar-container">
                <div class="en-progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="en-question-count">Question ${enState.currentQuestion + 1} / ${enState.questions.length}</div>
            <div class="en-prompt">${q.prompt}</div>
            <div class="en-tag-display">${q.tag}</div>
            <div class="en-subject-display">${q.display}</div>

            <div class="en-input-wrapper">
                <input
                    type="text"
                    class="en-input"
                    id="en-answer-input"
                    placeholder="Your answer..."
                    autocomplete="off"
                    autocorrect="off"
                    spellcheck="false"
                    ${enState.answered ? 'disabled' : ''}
                >
            </div>

            <div class="en-correction" id="en-correction"></div>

            <button class="en-submit-btn" id="en-submit-btn" onclick="enHandleSubmit()">
                ${enState.answered ? 'Next →' : 'Check'}
            </button>
        </div>
    `;

    const input = document.getElementById('en-answer-input');
    if (input && !enState.answered) {
        setTimeout(() => input.focus(), 100);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') enHandleSubmit();
        });
    }
}

function enNormalizeAnswer(str) {
    return str.trim().toLowerCase()
        .replace(/[\u2018\u2019\u2032\u0060]/g, "'")
        .replace(/\s+/g, ' ');
}

function enHandleSubmit() {
    if (enState.answered) {
        enState.currentQuestion++;
        enState.answered = false;
        enRenderPractice();
        return;
    }

    const input = document.getElementById('en-answer-input');
    const correction = document.getElementById('en-correction');
    const submitBtn = document.getElementById('en-submit-btn');
    const userAnswer = enNormalizeAnswer(input.value);
    const q = enState.questions[enState.currentQuestion];
    const correctAnswer = enNormalizeAnswer(q.answer);

    if (!userAnswer) {
        input.classList.add('wrong');
        setTimeout(() => input.classList.remove('wrong'), 500);
        return;
    }

    enState.answered = true;
    input.disabled = true;
    submitBtn.textContent = 'Next →';

    // Check answer — also accept alternatives separated by /
    const alternatives = correctAnswer.split('/').map(a => a.trim());
    const isCorrect = alternatives.some(alt => userAnswer === alt);

    if (isCorrect) {
        enState.score++;
        enState.streak++;
        if (enState.streak > enState.bestStreak) enState.bestStreak = enState.streak;
        input.classList.add('correct');
        correction.className = 'en-correction show correct-msg';
        correction.textContent = '✓ Correct! Well done!';
    } else {
        enState.wrong++;
        enState.streak = 0;
        input.classList.add('wrong');
        correction.className = 'en-correction show wrong-msg';
        correction.innerHTML = `✗ The correct answer: <strong>${q.answer}</strong>`;
    }

    document.getElementById('en-score-correct').textContent = enState.score;
    document.getElementById('en-score-wrong').textContent = enState.wrong;
    document.getElementById('en-score-streak').textContent = enState.streak;
}

function enRenderResults(panel) {
    const total = enState.questions.length;
    const pct = Math.round((enState.score / total) * 100);
    let emoji, message;

    if (pct === 100) {
        emoji = '🏆';
        message = 'Perfect! Outstanding!';
    } else if (pct >= 80) {
        emoji = '🌟';
        message = 'Excellent work!';
    } else if (pct >= 60) {
        emoji = '👍';
        message = 'Good job, keep going!';
    } else if (pct >= 40) {
        emoji = '📖';
        message = 'Review and try again!';
    } else {
        emoji = '💪';
        message = 'Keep practising, you can do it!';
    }

    panel.innerHTML = `
        <div class="en-results">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${emoji}</div>
            <h2>${message}</h2>
            <div class="score-big">${pct}%</div>
            <div class="score-label">${enState.score} correct out of ${total} — Best streak: ${enState.bestStreak} 🔥</div>
            <button class="restart-btn" onclick="enRestartPractice()">Try Again</button>
        </div>
    `;
}

function enRestartPractice() {
    enStartPractice();
    enRenderPractice();
}
