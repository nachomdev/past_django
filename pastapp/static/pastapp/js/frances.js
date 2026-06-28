// ========================================
// FRENCH VERBS — Data & Logic
// ========================================

const FRENCH_VERBS = {
    "sappeler": {
        name: "S'APPELER",
        description: "Il sert à dire son nom — Se usa para decir el nombre",
        conjugations: [
            { subject: "Je", verb: "m'appelle" },
            { subject: "Tu", verb: "t'appelles" },
            { subject: "Il / Elle", verb: "s'appelle" },
            { subject: "Nous", verb: "nous appelons" },
            { subject: "Vous", verb: "vous appelez" },
            { subject: "Ils / Elles", verb: "s'appellent" }
        ]
    },
    "etre": {
        name: "ÊTRE",
        description: "Ser / Estar",
        conjugations: [
            { subject: "Je", verb: "suis" },
            { subject: "Tu", verb: "es" },
            { subject: "Il / Elle", verb: "est" },
            { subject: "Nous", verb: "sommes" },
            { subject: "Vous", verb: "êtes" },
            { subject: "Ils / Elles", verb: "sont" }
        ]
    },
    "avoir": {
        name: "AVOIR",
        description: "Tener / Haber",
        conjugations: [
            { subject: "J'", verb: "ai" },
            { subject: "Tu", verb: "as" },
            { subject: "Il / Elle", verb: "a" },
            { subject: "Nous", verb: "avons" },
            { subject: "Vous", verb: "avez" },
            { subject: "Ils / Elles", verb: "ont" }
        ]
    },
    "er": {
        name: "Verbes en -ER",
        description: "Verbos regulares terminados en -ER (présent)",
        // Pattern example with PARLER
        pattern: {
            verb: "PARLER",
            endings: ["e", "es", "e", "ons", "ez", "ent"],
            stems: ["parl", "parl", "parl", "parl", "parl", "parl"]
        },
        conjugations: [
            { subject: "Je", verb: "parle" },
            { subject: "Tu", verb: "parles" },
            { subject: "Il / Elle", verb: "parle" },
            { subject: "Nous", verb: "parlons" },
            { subject: "Vous", verb: "parlez" },
            { subject: "Ils / Elles", verb: "parlent" }
        ],
        // Extra -ER verbs for practice variety
        extraVerbs: [
            { infinitive: "CHANTER", stem: "chant", meaning: "Cantar" },
            { infinitive: "DANSER", stem: "dans", meaning: "Bailar" },
            { infinitive: "MANGER", stem: "mang", meaning: "Comer" },
            { infinitive: "TRAVAILLER", stem: "travaill", meaning: "Trabajar" },
            { infinitive: "HABITER", stem: "habit", meaning: "Vivir/Habitar" },
            { infinitive: "AIMER", stem: "aim", meaning: "Amar/Gustar" },
            { infinitive: "JOUER", stem: "jou", meaning: "Jugar" },
            { infinitive: "REGARDER", stem: "regard", meaning: "Mirar" },
            { infinitive: "ÉCOUTER", stem: "écout", meaning: "Escuchar" },
            { infinitive: "ÉTUDIER", stem: "étudi", meaning: "Estudiar" },
            { infinitive: "CHERCHER", stem: "cherch", meaning: "Buscar" },
            { infinitive: "DONNER", stem: "donn", meaning: "Dar" },
        ]
    }
};

// ========================================
// NATIONALITIES DATA
// ========================================
const NATIONALITES = {
    countries: [
        { pays: "Argentine",   masc: "argentin",   fem: "argentine" },
        { pays: "France",      masc: "français",   fem: "française" },
        { pays: "Italie",      masc: "italien",    fem: "italienne" },
        { pays: "Espagne",     masc: "espagnol",   fem: "espagnole" },
        { pays: "Brésil",      masc: "brésilien",  fem: "brésilienne" },
        { pays: "Angleterre",  masc: "anglais",    fem: "anglaise" },
    ],
    pluralRules: [
        { singulier: "français",    pluriel: "français",     gender: "m" },
        { singulier: "française",   pluriel: "françaises",   gender: "f" },
        { singulier: "italien",     pluriel: "italiens",     gender: "m" },
        { singulier: "italienne",   pluriel: "italiennes",   gender: "f" },
        { singulier: "argentin",    pluriel: "argentins",    gender: "m" },
        { singulier: "argentine",   pluriel: "argentines",   gender: "f" },
        { singulier: "espagnol",    pluriel: "espagnols",    gender: "m" },
        { singulier: "espagnole",   pluriel: "espagnoles",   gender: "f" },
        { singulier: "brésilien",   pluriel: "brésiliens",   gender: "m" },
        { singulier: "brésilienne", pluriel: "brésiliennes", gender: "f" },
        { singulier: "anglais",     pluriel: "anglais",      gender: "m" },
        { singulier: "anglaise",    pluriel: "anglaises",    gender: "f" },
    ],
    examples: [
        { fr: "Il est français.",         es: "Él es francés." },
        { fr: "Elles sont italiennes.",   es: "Ellas son italianas." },
    ]
};

function isNationalitesTab() {
    return state.currentTab === 'nationalites';
}

// ========================================
// PREPOSITIONS DATA
// ========================================
const PREPOSITIONS = {
    villes: {
        rule: "à",
        items: [
            { ville: "Buenos Aires", phrase: "J'habite à Buenos Aires." },
            { ville: "Paris",        phrase: "Nous allons à Paris." },
            { ville: "Rome",         phrase: "Elle va à Rome." },
            { ville: "Madrid",       phrase: "Tu habites à Madrid." },
            { ville: "Londres",      phrase: "Ils voyagent à Londres." },
            { ville: "Tokyo",        phrase: "Vous allez à Tokyo." },
            { ville: "New York",     phrase: "Je vais à New York." },
            { ville: "Berlin",       phrase: "Nous habitons à Berlin." },
        ]
    },
    pays: [
        { pays: "Argentine",     type: "féminin",  prep: "en",  example: "en Argentine" },
        { pays: "France",        type: "féminin",  prep: "en",  example: "en France" },
        { pays: "Italie",        type: "féminin",  prep: "en",  example: "en Italie" },
        { pays: "Espagne",       type: "féminin",  prep: "en",  example: "en Espagne" },
        { pays: "Angleterre",    type: "féminin",  prep: "en",  example: "en Angleterre" },
        { pays: "Chine",         type: "féminin",  prep: "en",  example: "en Chine" },
        { pays: "Colombie",      type: "féminin",  prep: "en",  example: "en Colombie" },
        { pays: "Brésil",        type: "masculin", prep: "au",  example: "au Brésil" },
        { pays: "Canada",        type: "masculin", prep: "au",  example: "au Canada" },
        { pays: "Mexique",       type: "masculin", prep: "au",  example: "au Mexique" },
        { pays: "Japon",         type: "masculin", prep: "au",  example: "au Japon" },
        { pays: "Portugal",      type: "masculin", prep: "au",  example: "au Portugal" },
        { pays: "États-Unis",    type: "pluriel",  prep: "aux", example: "aux États-Unis" },
        { pays: "Pays-Bas",      type: "pluriel",  prep: "aux", example: "aux Pays-Bas" },
    ],
    examples: [
        { fr: "Elle habite en France.",            es: "Ella vive en Francia." },
        { fr: "Il va au Canada.",                  es: "Él va a Canadá." },
        { fr: "Nous voyageons aux États-Unis.",    es: "Nosotros viajamos a Estados Unidos." },
        { fr: "J'habite à Buenos Aires.",           es: "Yo vivo en Buenos Aires." },
        { fr: "Tu vas à Paris.",                    es: "Vos vas a París." },
    ]
};

function isPrepositionsTab() {
    return state.currentTab === 'prepositions';
}

// ========================================
// NEGATION DATA
// ========================================
const NEGATION = {
    rule: "La négation sert à dire “non”.",
    structure: "Sujet + ne + verbe + pas",
    vowelRule: "Devant une voyelle ou un 'h' muet : NE → N’",
    examples: [
        { fr: "Je ne parle pas anglais.", es: "Yo no hablo inglés." },
        { fr: "Elle n’aime pas le chocolat.", es: "A ella no le gusta el chocolate." },
        { fr: "Nous ne sommes pas français.", es: "Nosotros no somos franceses." },
        { fr: "Je n’habite pas ici.", es: "Yo no vivo aquí." },
    ]
};

function isNegationTab() {
    return state.currentTab === 'negation';
}

// ========================================
// NOMBRES DATA
// ========================================
const NOMBRES = {
    de0a20: [
        { num: 0, fr: "zéro" }, { num: 1, fr: "un" }, { num: 2, fr: "deux" },
        { num: 3, fr: "trois" }, { num: 4, fr: "quatre" }, { num: 5, fr: "cinq" },
        { num: 6, fr: "six" }, { num: 7, fr: "sept" }, { num: 8, fr: "huit" },
        { num: 9, fr: "neuf" }, { num: 10, fr: "dix" }, { num: 11, fr: "onze" },
        { num: 12, fr: "douze" }, { num: 13, fr: "treize" }, { num: 14, fr: "quatorze" },
        { num: 15, fr: "quinze" }, { num: 16, fr: "seize" }, { num: 17, fr: "dix-sept" },
        { num: 18, fr: "dix-huit" }, { num: 19, fr: "dix-neuf" }, { num: 20, fr: "vingt" }
    ],
    dizaines: [
        { num: 30, fr: "trente" }, { num: 40, fr: "quarante" }, { num: 50, fr: "cinquante" },
        { num: 60, fr: "soixante" }, { num: 70, fr: "soixante-dix" }, { num: 80, fr: "quatre-vingts" },
        { num: 90, fr: "quatre-vingt-dix" }, { num: 100, fr: "cent" }
    ],
    exemples: [
        { num: 21, fr: "vingt et un" }, { num: 32, fr: "trente-deux" }, { num: 45, fr: "quarante-cinq" },
        { num: 58, fr: "cinquante-huit" }, { num: 71, fr: "soixante et onze" }, { num: 84, fr: "quatre-vingt-quatre" },
        { num: 99, fr: "quatre-vingt-dix-neuf" }
    ]
};

function isNombresTab() {
    return state.currentTab === 'nombres';
}

// ========================================
// PRÉSENTATION DATA
// ========================================
const PRESENTATION = {
    se_presenter: [
        "Bonjour !",
        "Je m’appelle Clara.",
        "J’ai 11 ans.",
        "Je suis argentine.",
        "J’habite à Buenos Aires.",
        "J’aime la musique et le sport."
    ],
    presenter_autre: [
        "Elle s’appelle Emma.",
        "Elle a 12 ans.",
        "Elle est française.",
        "Elle habite à Lyon.",
        "Elle aime danser."
    ]
};

function isPresentationTab() {
    return state.currentTab === 'presentation';
}

// ========================================
// LE COLLÈGE DATA
// ========================================
const COLLEGE = {
    lieux: [
        { fr: "le collège",          es: "el colegio secundario" },
        { fr: "la salle de classe",  es: "el aula / la sala de clase" },
        { fr: "la cour de récréation", es: "el patio de recreo" },
        { fr: "la cantine",          es: "el comedor" },
        { fr: "la bibliothèque",     es: "la biblioteca" },
        { fr: "le gymnase",          es: "el gimnasio" },
        { fr: "le laboratoire",      es: "el laboratorio" },
        { fr: "le couloir",          es: "el pasillo" },
        { fr: "le bureau du directeur", es: "la dirección" },
        { fr: "la salle des professeurs", es: "la sala de profesores" },
        { fr: "les toilettes",       es: "los baños" },
        { fr: "le terrain de sport", es: "el campo de deportes" },
        { fr: "la salle informatique", es: "la sala de computación" },
        { fr: "l'entrée",           es: "la entrada" },
    ],
    matieres: [
        { fr: "le français",        es: "francés" },
        { fr: "les mathématiques",   es: "matemáticas" },
        { fr: "l'histoire",         es: "historia" },
        { fr: "la géographie",      es: "geografía" },
        { fr: "les sciences",       es: "ciencias" },
        { fr: "l'anglais",          es: "inglés" },
        { fr: "l'espagnol",         es: "español" },
        { fr: "l'éducation physique", es: "educación física" },
        { fr: "la musique",         es: "música" },
        { fr: "les arts plastiques", es: "artes plásticas" },
        { fr: "la technologie",     es: "tecnología" },
        { fr: "l'informatique",     es: "informática" },
    ],
    ilYA: {
        rule: "IL Y A = Hay (existencia) / IL N'Y A PAS = No hay (negación)",
        structure_affirm: "Il y a + article + nom",
        structure_neg: "Il n'y a pas de + nom",
        examples: [
            { fr: "Il y a une bibliothèque dans le collège.",   es: "Hay una biblioteca en el colegio." },
            { fr: "Il y a des élèves dans la cour.",            es: "Hay alumnos en el patio." },
            { fr: "Il y a un gymnase.",                         es: "Hay un gimnasio." },
            { fr: "Il y a un laboratoire de sciences.",         es: "Hay un laboratorio de ciencias." },
            { fr: "Il n'y a pas de piscine.",                   es: "No hay pileta." },
            { fr: "Il n'y a pas de cantine.",                   es: "No hay comedor." },
            { fr: "Il n'y a pas d'ordinateurs.",                es: "No hay computadoras." },
            { fr: "Il n'y a pas de terrain de sport.",          es: "No hay campo de deportes." },
        ]
    },
    heure: {
        rule: "Para preguntar la hora: Quelle heure est-il ? — Il est…",
        heures: [
            { display: "1:00",  fr: "Il est une heure." },
            { display: "2:00",  fr: "Il est deux heures." },
            { display: "3:00",  fr: "Il est trois heures." },
            { display: "4:15",  fr: "Il est quatre heures et quart." },
            { display: "5:30",  fr: "Il est cinq heures et demie." },
            { display: "6:45",  fr: "Il est sept heures moins le quart." },
            { display: "7:10",  fr: "Il est sept heures dix." },
            { display: "8:20",  fr: "Il est huit heures vingt." },
            { display: "9:40",  fr: "Il est dix heures moins vingt." },
            { display: "10:50", fr: "Il est onze heures moins dix." },
            { display: "12:00", fr: "Il est midi." },
            { display: "0:00",  fr: "Il est minuit." },
        ],
        keywords: [
            { fr: "et quart",          es: "y cuarto (+ 15 min)" },
            { fr: "et demie",          es: "y media (+ 30 min)" },
            { fr: "moins le quart",    es: "menos cuarto (- 15 min)" },
            { fr: "moins + minutes",   es: "menos + minutos" },
            { fr: "midi",              es: "mediodía (12:00)" },
            { fr: "minuit",            es: "medianoche (0:00)" },
        ]
    },
    moments: [
        { fr: "le matin",       es: "la mañana",   horaire: "6h – 12h",  emoji: "🌅" },
        { fr: "l'après-midi",   es: "la tarde",    horaire: "12h – 18h", emoji: "☀️" },
        { fr: "le soir",        es: "la noche (temprano)", horaire: "18h – 22h", emoji: "🌆" },
        { fr: "la nuit",        es: "la noche",    horaire: "22h – 6h",  emoji: "🌙" },
    ],
    momentsExamples: [
        { fr: "Le matin, j'ai cours de français.",       es: "A la mañana, tengo clase de francés." },
        { fr: "L'après-midi, on a sport.",                es: "A la tarde, tenemos deporte." },
        { fr: "Le soir, je fais mes devoirs.",            es: "A la noche, hago mis tareas." },
        { fr: "Je me lève le matin à sept heures.",       es: "Me levanto a la mañana a las siete." },
    ]
};

function isCollegeTab() {
    return state.currentTab === 'college';
}

// ========================================
// ARTICLES DATA
// ========================================
const ARTICLES = {
    definis: {
        desc: "Ils parlent de quelque chose de précis.",
        masculin: "le",
        feminin: "la",
        voyelle: "l’",
        pluriel: "les",
        exemples: [
            { mot: "le livre", type: "Masculin" },
            { mot: "la maison", type: "Féminin" },
            { mot: "l’école", type: "Devant voyelle" },
            { mot: "les amis", type: "Pluriel" }
        ]
    },
    indefinis: {
        desc: "Ils parlent de quelque chose en général.",
        masculin: "un",
        feminin: "une",
        pluriel: "des",
        exemples: [
            { mot: "un chien", type: "Masculin" },
            { mot: "une table", type: "Féminin" },
            { mot: "des crayons", type: "Pluriel" }
        ]
    },
    practiceWords: [
        { mot: "livre", type: "masculin", startVowel: false },
        { mot: "maison", type: "feminin", startVowel: false },
        { mot: "école", type: "feminin", startVowel: true },
        { mot: "amis", type: "pluriel", startVowel: true },
        { mot: "chien", type: "masculin", startVowel: false },
        { mot: "table", type: "feminin", startVowel: false },
        { mot: "crayons", type: "pluriel", startVowel: false },
        { mot: "garçon", type: "masculin", startVowel: false },
        { mot: "fille", type: "feminin", startVowel: false },
        { mot: "étudiant", type: "masculin", startVowel: true },
        { mot: "oiseau", type: "masculin", startVowel: true },
        { mot: "pommes", type: "pluriel", startVowel: false },
        { mot: "arbres", type: "pluriel", startVowel: true }
    ]
};

function isArticlesTab() {
    return state.currentTab === 'articles';
}

const SUBJECTS = ["Je", "Tu", "Il / Elle", "Nous", "Vous", "Ils / Elles"];
const ER_ENDINGS = ["e", "es", "e", "ons", "ez", "ent"];

// ========================================
// APP STATE
// ========================================
let state = {
    currentTab: 'sappeler',
    mode: 'study',  // 'study' or 'practice'
    // Practice state
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
    initTabs();
    initModeToggle();
    render();
});

function initTabs() {
    document.querySelectorAll('.fr-tab').forEach(tab => {
        tab.addEventListener('click', () => {
            state.currentTab = tab.dataset.verb;
            document.querySelectorAll('.fr-tab').forEach(t => t.classList.remove('active'));
            tab.classList.add('active');
            // Reset practice when changing tab
            resetPractice();
            render();
        });
    });
}

function initModeToggle() {
    document.querySelectorAll('.fr-mode-btn').forEach(btn => {
        btn.addEventListener('click', () => {
            state.mode = btn.dataset.mode;
            document.querySelectorAll('.fr-mode-btn').forEach(b => b.classList.remove('active'));
            btn.classList.add('active');
            if (state.mode === 'practice') {
                startPractice();
            }
            render();
        });
    });
}

// ========================================
// RENDER
// ========================================
function render() {
    const studyPanel = document.getElementById('study-panel');
    const practicePanel = document.getElementById('practice-panel');

    if (state.mode === 'study') {
        studyPanel.style.display = 'block';
        practicePanel.style.display = 'none';
        renderStudy();
    } else {
        studyPanel.style.display = 'none';
        practicePanel.style.display = 'flex';
        renderPractice();
    }
}

// ========================================
// STUDY MODE
// ========================================
function renderStudy() {
    const panel = document.getElementById('study-panel');

    if (isNationalitesTab()) {
        renderStudyNationalites(panel);
        return;
    }

    if (isPrepositionsTab()) {
        renderStudyPrepositions(panel);
        return;
    }

    if (isNegationTab()) {
        renderStudyNegation(panel);
        return;
    }

    if (isArticlesTab()) {
        renderStudyArticles(panel);
        return;
    }

    if (isNombresTab()) {
        renderStudyNombres(panel);
        return;
    }

    if (isPresentationTab()) {
        renderStudyPresentation(panel);
        return;
    }

    if (isCollegeTab()) {
        renderStudyCollege(panel);
        return;
    }

    const verbData = FRENCH_VERBS[state.currentTab];

    let html = '';

    // Main conjugation card
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>📖</span>
                <span class="verb-name">${verbData.name}</span>
            </div>
            <div class="verb-desc">${verbData.description}</div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th>Sujet</th>
                        <th>Verbe</th>
                    </tr>
                </thead>
                <tbody>
    `;

    verbData.conjugations.forEach(c => {
        // Highlight endings for -ER verbs
        let verbDisplay = c.verb;
        if (state.currentTab === 'er') {
            const idx = verbData.conjugations.indexOf(c);
            const ending = ER_ENDINGS[idx];
            const stem = c.verb.slice(0, c.verb.length - ending.length);
            verbDisplay = `${stem}<span class="highlight">${ending}</span>`;
        }

        html += `
            <tr>
                <td class="subject">${c.subject}</td>
                <td class="conjugation">${verbDisplay}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    // For -ER verbs, show the pattern explanation and extra verbs
    if (state.currentTab === 'er') {
        html += `
            <div class="fr-verb-card">
                <div class="verb-title">
                    <span>🔑</span>
                    <span class="verb-name">Terminaisons -ER</span>
                </div>
                <div class="verb-desc">Pour conjuguer, on retire -ER et on ajoute : -e, -es, -e, -ons, -ez, -ent</div>
                <table class="fr-conj-table">
                    <thead>
                        <tr>
                            <th>Sujet</th>
                            <th>Radical + Terminaison</th>
                        </tr>
                    </thead>
                    <tbody>
        `;
        SUBJECTS.forEach((subj, i) => {
            html += `
                <tr>
                    <td class="subject">${subj}</td>
                    <td class="conjugation">___  + <span class="highlight">-${ER_ENDINGS[i]}</span></td>
                </tr>
            `;
        });
        html += `
                    </tbody>
                </table>
            </div>
        `;

        html += `
            <div class="fr-verb-card">
                <div class="verb-title">
                    <span>📚</span>
                    <span class="verb-name">Autres verbes en -ER</span>
                </div>
                <div class="verb-desc">Estos verbos se conjugan con el mismo patrón</div>
                <div class="fr-er-verbs-grid">
        `;
        verbData.extraVerbs.forEach(v => {
            html += `
                <div class="fr-er-verb-chip">
                    ${v.infinitive}
                    <span class="meaning">${v.meaning}</span>
                </div>
            `;
        });
        html += `
                </div>
            </div>
        `;
    }

    // S'APPELER special note
    if (state.currentTab === 'sappeler') {
        html += `
            <div class="fr-verb-card">
                <div class="verb-title">
                    <span>💡</span>
                    <span class="verb-name">Exemples</span>
                </div>
                <div class="verb-desc">Ejemplos de uso</div>
                <table class="fr-conj-table">
                    <tbody>
                        <tr>
                            <td class="subject">🇫🇷</td>
                            <td class="conjugation">Je m'appelle Marie.</td>
                        </tr>
                        <tr>
                            <td class="subject">🇪🇸</td>
                            <td class="conjugation" style="color: var(--fr-text-muted);">Yo me llamo Marie.</td>
                        </tr>
                        <tr>
                            <td class="subject">🇫🇷</td>
                            <td class="conjugation">Comment tu t'appelles ?</td>
                        </tr>
                        <tr>
                            <td class="subject">🇪🇸</td>
                            <td class="conjugation" style="color: var(--fr-text-muted);">¿Cómo te llamás?</td>
                        </tr>
                    </tbody>
                </table>
            </div>
        `;
    }

    panel.innerHTML = html;
}

// ========================================
// STUDY: NATIONALITÉS
// ========================================
function renderStudyNationalites(panel) {
    let html = '';

    // Countries & Nationalities table
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🌍</span>
                <span class="verb-name">Les pays et les nationalités</span>
            </div>
            <div class="verb-desc">Países y nacionalidades en francés</div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th>Pays</th>
                        <th>Nationalité <span class="fr-gender-tag masc">m.</span></th>
                        <th>Nationalité <span class="fr-gender-tag fem">f.</span></th>
                    </tr>
                </thead>
                <tbody>
    `;

    NATIONALITES.countries.forEach(c => {
        html += `
            <tr>
                <td class="subject">${c.pays}</td>
                <td class="conjugation">${c.masc}</td>
                <td class="conjugation"><span class="highlight">${c.fem}</span></td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    // Singular & Plural table
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🔢</span>
                <span class="verb-name">Singulier et pluriel</span>
            </div>
            <div class="verb-desc">Reglas de singular y plural para las nacionalidades</div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th>Singulier</th>
                        <th>Pluriel</th>
                    </tr>
                </thead>
                <tbody>
    `;

    NATIONALITES.pluralRules.forEach(r => {
        const genderTag = r.gender === 'm'
            ? '<span class="fr-gender-tag masc">m.</span>'
            : '<span class="fr-gender-tag fem">f.</span>';

        // Highlight the difference between singular and plural
        let pluralDisplay;
        if (r.singulier === r.pluriel) {
            pluralDisplay = `${r.pluriel} <span style="color: var(--fr-text-dim); font-size: 0.8em;">(invariable)</span>`;
        } else {
            // Find the added suffix
            const added = r.pluriel.slice(r.singulier.length);
            pluralDisplay = `${r.singulier}<span class="highlight">${added}</span>`;
        }

        html += `
            <tr>
                <td class="conjugation">${r.singulier} ${genderTag}</td>
                <td class="conjugation">${pluralDisplay}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    // Examples
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>💡</span>
                <span class="verb-name">Exemples</span>
            </div>
            <div class="verb-desc">Ejemplos de uso</div>
            <table class="fr-conj-table">
                <tbody>
    `;

    NATIONALITES.examples.forEach(ex => {
        html += `
            <tr>
                <td class="subject">🇫🇷</td>
                <td class="conjugation">${ex.fr}</td>
            </tr>
            <tr>
                <td class="subject">🇪🇸</td>
                <td class="conjugation" style="color: var(--fr-text-muted);">${ex.es}</td>
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
// STUDY: PRÉPOSITIONS
// ========================================
function renderStudyPrepositions(panel) {
    let html = '';

    // Villes card
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🏙️</span>
                <span class="verb-name">Avec les villes</span>
            </div>
            <div class="verb-desc">Con las ciudades se usa siempre <strong>à</strong></div>
            <div class="fr-prep-rule-box">
                <span class="fr-prep-tag ville">à</span>
                <span>+ nom de ville</span>
            </div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th>Exemple</th>
                    </tr>
                </thead>
                <tbody>
    `;

    PREPOSITIONS.villes.items.slice(0, 4).forEach(v => {
        const highlighted = v.phrase.replace(/(à \S+(?:\s\S+)?)/g, '<span class="highlight">$1</span>');
        html += `
            <tr>
                <td class="conjugation">${highlighted}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    // Pays card
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🌍</span>
                <span class="verb-name">Avec les pays</span>
            </div>
            <div class="verb-desc">La préposition dépend du type de pays</div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th>Type de pays</th>
                        <th>Préposition</th>
                        <th>Exemple</th>
                    </tr>
                </thead>
                <tbody>
    `;

    // Group by type and show one example per type first
    const types = [
        { type: "féminin",  prep: "en",  label: "Pays féminin" },
        { type: "masculin", prep: "au",  label: "Pays masculin" },
        { type: "pluriel",  prep: "aux", label: "Pays pluriel" },
    ];

    types.forEach(t => {
        const paysOfType = PREPOSITIONS.pays.filter(p => p.type === t.type);
        const first = paysOfType[0];
        html += `
            <tr>
                <td class="subject">${t.label}</td>
                <td class="conjugation"><span class="fr-prep-tag ${t.type}">${t.prep}</span></td>
                <td class="conjugation">${first.example}</td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    // Full country list
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>📚</span>
                <span class="verb-name">Tous les pays</span>
            </div>
            <div class="verb-desc">Lista completa de países y sus preposiciones</div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th>Pays</th>
                        <th>Type</th>
                        <th>Préposition + Pays</th>
                    </tr>
                </thead>
                <tbody>
    `;

    PREPOSITIONS.pays.forEach(p => {
        html += `
            <tr>
                <td class="subject">${p.pays}</td>
                <td class="conjugation"><span class="fr-prep-tag ${p.type}">${p.prep}</span></td>
                <td class="conjugation"><span class="highlight">${p.example}</span></td>
            </tr>
        `;
    });

    html += `
                </tbody>
            </table>
        </div>
    `;

    // Examples
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>💡</span>
                <span class="verb-name">Exemples</span>
            </div>
            <div class="verb-desc">Ejemplos de uso</div>
            <table class="fr-conj-table">
                <tbody>
    `;

    PREPOSITIONS.examples.forEach(ex => {
        html += `
            <tr>
                <td class="subject">🇫🇷</td>
                <td class="conjugation">${ex.fr}</td>
            </tr>
            <tr>
                <td class="subject">🇪🇸</td>
                <td class="conjugation" style="color: var(--fr-text-muted);">${ex.es}</td>
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
// STUDY: NÉGATION
// ========================================
function renderStudyNegation(panel) {
    let html = '';

    // Structure card
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🛑</span>
                <span class="verb-name">La négation : NE … PAS</span>
            </div>
            <div class="verb-desc">${NEGATION.rule}</div>
            <div class="fr-prep-rule-box" style="justify-content: center; font-size: 1.1rem; color: var(--fr-text);">
                <span>${NEGATION.structure.replace('ne', '<span class="highlight">ne</span>').replace('pas', '<span class="highlight">pas</span>')}</span>
            </div>
            <div class="verb-desc" style="margin-top: 1rem; color: #f87171;">
                <strong>Attention:</strong> ${NEGATION.vowelRule.replace('N’', '<span class="highlight">N’</span>')}
            </div>
        </div>
    `;

    // Examples card
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>💡</span>
                <span class="verb-name">Exemples</span>
            </div>
            <table class="fr-conj-table">
                <tbody>
    `;

    NEGATION.examples.forEach(ex => {
        const highlightedFr = ex.fr.replace(/(ne \S+ pas|n’\S+ pas)/gi, '<span class="highlight">$1</span>');
        html += `
            <tr>
                <td class="subject">🇫🇷</td>
                <td class="conjugation">${highlightedFr}</td>
            </tr>
            <tr>
                <td class="subject">🇪🇸</td>
                <td class="conjugation" style="color: var(--fr-text-muted);">${ex.es}</td>
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
// STUDY: ARTICLES
// ========================================
function renderStudyArticles(panel) {
    let html = '';

    // Définis
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>📌</span>
                <span class="verb-name">Les articles définis</span>
            </div>
            <div class="verb-desc">${ARTICLES.definis.desc}</div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th>Genre / Nombre</th>
                        <th>Article</th>
                        <th>Exemple</th>
                    </tr>
                </thead>
                <tbody>
    `;
    const defTypes = [
        { label: 'Masculin', art: ARTICLES.definis.masculin },
        { label: 'Féminin', art: ARTICLES.definis.feminin },
        { label: 'Devant voyelle', art: ARTICLES.definis.voyelle },
        { label: 'Pluriel', art: ARTICLES.definis.pluriel }
    ];
    defTypes.forEach((t, i) => {
        html += `
            <tr>
                <td class="subject">${t.label}</td>
                <td class="conjugation"><span class="fr-gender-tag ${t.label.includes('Féminin') ? 'fem' : 'masc'}">${t.art}</span></td>
                <td class="conjugation"><span class="highlight">${ARTICLES.definis.exemples[i].mot}</span></td>
            </tr>
        `;
    });
    html += `
                </tbody>
            </table>
        </div>
    `;

    // Indéfinis
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🎲</span>
                <span class="verb-name">Les articles indéfinis</span>
            </div>
            <div class="verb-desc">${ARTICLES.indefinis.desc}</div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th>Genre / Nombre</th>
                        <th>Article</th>
                        <th>Exemple</th>
                    </tr>
                </thead>
                <tbody>
    `;
    const indefTypes = [
        { label: 'Masculin', art: ARTICLES.indefinis.masculin },
        { label: 'Féminin', art: ARTICLES.indefinis.feminin },
        { label: 'Pluriel', art: ARTICLES.indefinis.pluriel }
    ];
    indefTypes.forEach((t, i) => {
        html += `
            <tr>
                <td class="subject">${t.label}</td>
                <td class="conjugation"><span class="fr-gender-tag ${t.label.includes('Féminin') ? 'fem' : 'masc'}">${t.art}</span></td>
                <td class="conjugation"><span class="highlight">${ARTICLES.indefinis.exemples[i].mot}</span></td>
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
// STUDY: NOMBRES
// ========================================
function renderStudyNombres(panel) {
    let html = '';

    // De 0 à 20
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🔢</span>
                <span class="verb-name">De 0 à 20</span>
            </div>
            <div class="fr-er-verbs-grid">
    `;
    NOMBRES.de0a20.forEach(n => {
        html += `
            <div class="fr-er-verb-chip" style="display: flex; justify-content: space-between; padding: 0.5rem 1rem;">
                <span style="color: var(--fr-text-dim); font-weight: bold;">${n.num}</span>
                <span style="color: var(--fr-text); font-weight: 600;">${n.fr}</span>
            </div>
        `;
    });
    html += `
            </div>
        </div>
    `;

    // Dizaines
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🔟</span>
                <span class="verb-name">Les dizaines</span>
            </div>
            <div class="fr-er-verbs-grid">
    `;
    NOMBRES.dizaines.forEach(n => {
        html += `
            <div class="fr-er-verb-chip" style="display: flex; justify-content: space-between; padding: 0.5rem 1rem;">
                <span style="color: var(--fr-text-dim); font-weight: bold;">${n.num}</span>
                <span style="color: var(--fr-text); font-weight: 600;">${n.fr}</span>
            </div>
        `;
    });
    html += `
            </div>
        </div>
    `;

    // Exemples
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>💡</span>
                <span class="verb-name">Exemples importants</span>
            </div>
            <table class="fr-conj-table">
                <tbody>
    `;
    NOMBRES.exemples.forEach(ex => {
        html += `
            <tr>
                <td class="subject" style="width: 50px; text-align: right; font-size: 1.2rem;">${ex.num}</td>
                <td class="conjugation">→ <span class="highlight">${ex.fr}</span></td>
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
// STUDY: PRÉSENTATION
// ========================================
function renderStudyPresentation(panel) {
    let html = '';

    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>👋</span>
                <span class="verb-name">Se présenter</span>
            </div>
            <div class="verb-desc">Presentarse (Ejemplo)</div>
            <table class="fr-conj-table">
                <tbody>
    `;
    PRESENTATION.se_presenter.forEach(phrase => {
        html += `
            <tr>
                <td class="conjugation" style="font-size: 1.1rem;">${phrase}</td>
            </tr>
        `;
    });
    html += `
                </tbody>
            </table>
        </div>
    `;

    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🤝</span>
                <span class="verb-name">Présenter une autre personne</span>
            </div>
            <div class="verb-desc">Presentar a otra persona (Ejemplo)</div>
            <table class="fr-conj-table">
                <tbody>
    `;
    PRESENTATION.presenter_autre.forEach(phrase => {
        html += `
            <tr>
                <td class="conjugation" style="font-size: 1.1rem;">${phrase}</td>
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
// STUDY: LE COLLÈGE
// ========================================
function renderStudyCollege(panel) {
    let html = '';

    // ── Les lieux du collège ──
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🏫</span>
                <span class="verb-name">Les lieux du collège</span>
            </div>
            <div class="verb-desc">Los lugares del colegio</div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th>En français</th>
                        <th>En español</th>
                    </tr>
                </thead>
                <tbody>
    `;
    COLLEGE.lieux.forEach(l => {
        html += `
            <tr>
                <td class="conjugation"><span class="highlight">${l.fr}</span></td>
                <td class="conjugation" style="color: var(--fr-text-muted);">${l.es}</td>
            </tr>
        `;
    });
    html += `
                </tbody>
            </table>
        </div>
    `;

    // ── Les matières ──
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>📚</span>
                <span class="verb-name">Les matières scolaires</span>
            </div>
            <div class="verb-desc">Las materias del colegio</div>
            <div class="fr-er-verbs-grid">
    `;
    COLLEGE.matieres.forEach(m => {
        html += `
            <div class="fr-er-verb-chip">
                ${m.fr}
                <span class="meaning">${m.es}</span>
            </div>
        `;
    });
    html += `
            </div>
        </div>
    `;

    // ── IL Y A / IL N'Y A PAS ──
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>✅</span>
                <span class="verb-name">IL Y A / IL N'Y A PAS</span>
            </div>
            <div class="verb-desc">${COLLEGE.ilYA.rule}</div>
            <div class="fr-prep-rule-box" style="flex-direction: column; gap: 0.5rem; align-items: flex-start;">
                <div>
                    <span class="fr-prep-tag ville" style="background: #22c55e30; color: #4ade80;">✓</span>
                    <span style="color: var(--fr-text);">${COLLEGE.ilYA.structure_affirm}</span>
                </div>
                <div>
                    <span class="fr-prep-tag" style="background: #ef444430; color: #f87171;">✗</span>
                    <span style="color: var(--fr-text);">${COLLEGE.ilYA.structure_neg}</span>
                </div>
            </div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Français</th>
                        <th>Español</th>
                    </tr>
                </thead>
                <tbody>
    `;
    COLLEGE.ilYA.examples.forEach(ex => {
        const isNeg = ex.fr.includes("n'y a pas");
        const icon = isNeg ? '🔴' : '🟢';
        html += `
            <tr>
                <td class="subject">${icon}</td>
                <td class="conjugation"><span class="highlight">${ex.fr}</span></td>
                <td class="conjugation" style="color: var(--fr-text-muted);">${ex.es}</td>
            </tr>
        `;
    });
    html += `
                </tbody>
            </table>
        </div>
    `;

    // ── L'heure ──
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🕐</span>
                <span class="verb-name">L'heure — Quelle heure est-il ?</span>
            </div>
            <div class="verb-desc">${COLLEGE.heure.rule}</div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th>Heure</th>
                        <th>En français</th>
                    </tr>
                </thead>
                <tbody>
    `;
    COLLEGE.heure.heures.forEach(h => {
        html += `
            <tr>
                <td class="subject" style="font-size: 1.2rem; font-weight: bold;">${h.display}</td>
                <td class="conjugation"><span class="highlight">${h.fr}</span></td>
            </tr>
        `;
    });
    html += `
                </tbody>
            </table>
        </div>
    `;

    // Mots-clés de l'heure
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🔑</span>
                <span class="verb-name">Mots-clés de l'heure</span>
            </div>
            <div class="verb-desc">Palabras clave para decir la hora</div>
            <div class="fr-er-verbs-grid">
    `;
    COLLEGE.heure.keywords.forEach(k => {
        html += `
            <div class="fr-er-verb-chip">
                ${k.fr}
                <span class="meaning">${k.es}</span>
            </div>
        `;
    });
    html += `
            </div>
        </div>
    `;

    // ── Les moments de la journée ──
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>🌤️</span>
                <span class="verb-name">Les moments de la journée</span>
            </div>
            <div class="verb-desc">Los momentos del día</div>
            <table class="fr-conj-table">
                <thead>
                    <tr>
                        <th></th>
                        <th>Moment</th>
                        <th>Horaire</th>
                        <th>En español</th>
                    </tr>
                </thead>
                <tbody>
    `;
    COLLEGE.moments.forEach(m => {
        html += `
            <tr>
                <td class="subject" style="font-size: 1.3rem;">${m.emoji}</td>
                <td class="conjugation"><span class="highlight">${m.fr}</span></td>
                <td class="conjugation" style="color: var(--fr-text-dim);">${m.horaire}</td>
                <td class="conjugation" style="color: var(--fr-text-muted);">${m.es}</td>
            </tr>
        `;
    });
    html += `
                </tbody>
            </table>
        </div>
    `;

    // Exemples moments
    html += `
        <div class="fr-verb-card">
            <div class="verb-title">
                <span>💡</span>
                <span class="verb-name">Exemples</span>
            </div>
            <table class="fr-conj-table">
                <tbody>
    `;
    COLLEGE.momentsExamples.forEach(ex => {
        html += `
            <tr>
                <td class="subject">🇫🇷</td>
                <td class="conjugation">${ex.fr}</td>
            </tr>
            <tr>
                <td class="subject">🇪🇸</td>
                <td class="conjugation" style="color: var(--fr-text-muted);">${ex.es}</td>
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
function generateQuestions() {
    const questions = [];

    if (isNationalitesTab()) {
        return generateNationalitesQuestions();
    }

    if (isPrepositionsTab()) {
        return generatePrepositionsQuestions();
    }

    if (isNegationTab()) {
        return generateNegationQuestions();
    }

    if (isArticlesTab()) {
        return generateArticlesQuestions();
    }

    if (isNombresTab()) {
        return generateNombresQuestions();
    }

    if (isPresentationTab()) {
        return generatePresentationQuestions();
    }

    if (isCollegeTab()) {
        return generateCollegeQuestions();
    }

    const verbData = FRENCH_VERBS[state.currentTab];

    if (state.currentTab === 'er') {
        // Mix PARLER with extra -ER verbs
        const allERVerbs = [
            { infinitive: "PARLER", stem: "parl", meaning: "Hablar" },
            ...verbData.extraVerbs
        ];

        for (let i = 0; i < state.totalQuestions; i++) {
            const verb = allERVerbs[Math.floor(Math.random() * allERVerbs.length)];
            const subjIdx = Math.floor(Math.random() * SUBJECTS.length);
            const subject = SUBJECTS[subjIdx];
            const ending = ER_ENDINGS[subjIdx];
            const answer = verb.stem + ending;

            questions.push({
                subject,
                verbName: verb.infinitive,
                meaning: verb.meaning,
                answer,
                displaySubject: subject === "Je" && isVowel(answer[0]) ? "J'" : subject
            });
        }
    } else {
        // Regular verbs: S'APPELER, ÊTRE, AVOIR
        for (let i = 0; i < state.totalQuestions; i++) {
            const conjIdx = Math.floor(Math.random() * verbData.conjugations.length);
            const conj = verbData.conjugations[conjIdx];
            
            let fullAnswer;
            if (state.currentTab === 'sappeler') {
                fullAnswer = conj.verb;
            } else {
                fullAnswer = conj.verb;
            }

            questions.push({
                subject: conj.subject,
                verbName: verbData.name,
                meaning: verbData.description,
                answer: fullAnswer,
                displaySubject: conj.subject
            });
        }
    }

    return questions;
}

function generateNationalitesQuestions() {
    const questions = [];
    const types = ['masc', 'fem', 'pluriel'];

    for (let i = 0; i < state.totalQuestions; i++) {
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'masc') {
            const country = NATIONALITES.countries[Math.floor(Math.random() * NATIONALITES.countries.length)];
            questions.push({
                questionType: 'nationalite',
                prompt: `Nationalité masculine`,
                displaySubject: country.pays + ' →',
                verbName: 'MASCULIN',
                answer: country.masc,
            });
        } else if (type === 'fem') {
            const country = NATIONALITES.countries[Math.floor(Math.random() * NATIONALITES.countries.length)];
            questions.push({
                questionType: 'nationalite',
                prompt: `Nationalité féminine`,
                displaySubject: country.pays + ' →',
                verbName: 'FÉMININ',
                answer: country.fem,
            });
        } else {
            const rule = NATIONALITES.pluralRules[Math.floor(Math.random() * NATIONALITES.pluralRules.length)];
            const genderLabel = rule.gender === 'm' ? 'masc.' : 'fém.';
            questions.push({
                questionType: 'pluriel',
                prompt: `Mettez au pluriel (${genderLabel})`,
                displaySubject: rule.singulier + ' →',
                verbName: 'PLURIEL',
                answer: rule.pluriel,
            });
        }
    }

    return questions;
}

function generatePrepositionsQuestions() {
    const questions = [];
    const allPays = PREPOSITIONS.pays;
    const allVilles = PREPOSITIONS.villes.items;

    for (let i = 0; i < state.totalQuestions; i++) {
        // Mix cities and countries roughly 30/70
        const isVille = Math.random() < 0.3;

        if (isVille) {
            const ville = allVilles[Math.floor(Math.random() * allVilles.length)];
            questions.push({
                questionType: 'preposition',
                prompt: `Quelle préposition ? (ville)`,
                displayTemplate: '___ ' + ville.ville,
                verbName: 'VILLE',
                answer: 'à ' + ville.ville,
            });
        } else {
            const pays = allPays[Math.floor(Math.random() * allPays.length)];
            questions.push({
                questionType: 'preposition',
                prompt: `Quelle préposition ? (pays ${pays.type})`,
                displayTemplate: '___ ' + pays.pays,
                verbName: pays.type.toUpperCase(),
                answer: pays.example,
            });
        }
    }

    return questions;
}

function generateNegationQuestions() {
    const questions = [];
    
    const items = [
        { subj: "Je", v: "parle" },
        { subj: "Tu", v: "parles" },
        { subj: "Nous", v: "parlons" },
        { subj: "Je", v: "suis" },
        { subj: "Il", v: "est" },
        { subj: "Vous", v: "êtes" },
        { subj: "J'", v: "ai" },
        { subj: "Tu", v: "as" },
        { subj: "Elles", v: "ont" },
        { subj: "J'", v: "habite" },
        { subj: "Tu", v: "aimes" },
        { subj: "Elle", v: "écoute" },
        { subj: "Nous", v: "allons" },
        { subj: "Ils", v: "voyagent" }
    ];

    for (let i = 0; i < state.totalQuestions; i++) {
        const item = items[Math.floor(Math.random() * items.length)];
        
        let answerSubj = item.subj;
        if (answerSubj === "J'") answerSubj = "Je";
        
        const firstChar = item.v[0].toLowerCase();
        const isVowelStart = isVowel(firstChar) || firstChar === 'h';
        const neg1 = isVowelStart ? "n'" : "ne ";
        const answer = `${answerSubj} ${neg1}${item.v} pas`;
        
        const displayStr = `${item.subj} ${item.v}`;
        
        questions.push({
            questionType: 'negation',
            prompt: `Mettez à la forme négative`,
            displaySubject: displayStr + ' →',
            verbName: 'NÉGATION',
            answer: answer,
        });
    }

    return questions;
}

function generateArticlesQuestions() {
    const questions = [];
    const words = ARTICLES.practiceWords;

    for (let i = 0; i < state.totalQuestions; i++) {
        const isDefini = Math.random() < 0.5;
        const wordObj = words[Math.floor(Math.random() * words.length)];
        
        let correctArticle = '';
        if (isDefini) {
            if (wordObj.type === 'pluriel') correctArticle = ARTICLES.definis.pluriel;
            else if (wordObj.startVowel) correctArticle = ARTICLES.definis.voyelle;
            else if (wordObj.type === 'feminin') correctArticle = ARTICLES.definis.feminin;
            else correctArticle = ARTICLES.definis.masculin;
        } else {
            if (wordObj.type === 'pluriel') correctArticle = ARTICLES.indefinis.pluriel;
            else if (wordObj.type === 'feminin') correctArticle = ARTICLES.indefinis.feminin;
            else correctArticle = ARTICLES.indefinis.masculin;
        }

        // Handle l' merging with word
        let answer = '';
        if (correctArticle === "l’" || correctArticle === "l'") {
            answer = "l'" + wordObj.mot;
        } else {
            answer = correctArticle + " " + wordObj.mot;
        }

        questions.push({
            questionType: 'article',
            prompt: `Quel est l'article ${isDefini ? 'défini (le/la/l’/les)' : 'indéfini (un/une/des)'} ?`,
            displayTemplate: '___ ' + wordObj.mot + ' (' + (wordObj.type === 'pluriel' ? 'pl.' : wordObj.type.substring(0,4) + '.') + ')',
            verbName: isDefini ? 'DÉFINI' : 'INDÉFINI',
            answer: answer,
        });
    }

    return questions;
}

function getNumberInFrench(num) {
    if (num <= 20) {
        const de0a20 = ["zéro", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf", "vingt"];
        return de0a20[num];
    }
    if (num === 100) return "cent";
    
    const dizainesStr = {
        20: "vingt", 30: "trente", 40: "quarante", 50: "cinquante", 60: "soixante", 70: "soixante-dix", 80: "quatre-vingts", 90: "quatre-vingt-dix"
    };
    if (num % 10 === 0) return dizainesStr[num];
    
    if (num === 71) return "soixante et onze";
    if (num === 81) return "quatre-vingt-un";
    if (num === 91) return "quatre-vingt-onze";
    
    let d = Math.floor(num / 10) * 10;
    let u = num % 10;
    
    if (d === 70) {
        d = 60;
        u += 10;
    } else if (d === 90) {
        d = 80;
        u += 10;
    }
    
    let prefix = dizainesStr[d];
    if (d === 80) prefix = "quatre-vingt";
    
    if (u === 1 && d !== 80) {
        return prefix + " et un";
    }
    
    const unitsStr = ["", "un", "deux", "trois", "quatre", "cinq", "six", "sept", "huit", "neuf", "dix", "onze", "douze", "treize", "quatorze", "quinze", "seize", "dix-sept", "dix-huit", "dix-neuf"];
    return prefix + "-" + unitsStr[u];
}

function generateNombresQuestions() {
    const questions = [];

    for (let i = 0; i < state.totalQuestions; i++) {
        const randNum = Math.floor(Math.random() * 101); // 0 to 100
        questions.push({
            questionType: 'nombres',
            prompt: `Écrivez le nombre en lettres`,
            displaySubject: randNum + ' =',
            verbName: 'NÚMEROS',
            answer: getNumberInFrench(randNum),
        });
    }

    return questions;
}

function generatePresentationQuestions() {
    const questions = [];
    const items = [
        { prompt: "Yo me llamo Clara.", template: "Je ___ Clara.", answer: "m'appelle" },
        { prompt: "Yo tengo 11 años.", template: "J'___ 11 ans.", answer: "ai" },
        { prompt: "Yo soy argentina.", template: "Je ___ argentine.", answer: "suis" },
        { prompt: "Yo vivo en Buenos Aires.", template: "J'___ à Buenos Aires.", answer: "habite" },
        { prompt: "Me gusta la música.", template: "J'___ la musique.", answer: "aime" },
        { prompt: "Ella se llama Emma.", template: "Elle ___ Emma.", answer: "s'appelle" },
        { prompt: "Ella tiene 12 años.", template: "Elle ___ 12 ans.", answer: "a" },
        { prompt: "Ella es francesa.", template: "Elle ___ française.", answer: "est" },
        { prompt: "Ella vive en Lyon.", template: "Elle ___ à Lyon.", answer: "habite" },
        { prompt: "A ella le gusta bailar.", template: "Elle ___ danser.", answer: "aime" },
    ];

    for (let i = 0; i < state.totalQuestions; i++) {
        const item = items[Math.floor(Math.random() * items.length)];
        questions.push({
            questionType: 'presentation',
            prompt: item.prompt,
            displayTemplate: item.template,
            verbName: 'PRÉSENTATION',
            answer: item.answer,
        });
    }

    return questions;
}

function generateCollegeQuestions() {
    const questions = [];
    // 5 question types: lieux vocab, matières vocab, il y a / il n'y a pas, heure, moments
    const types = ['lieux', 'matieres', 'ilya', 'heure', 'moments'];

    for (let i = 0; i < state.totalQuestions; i++) {
        const type = types[Math.floor(Math.random() * types.length)];

        if (type === 'lieux') {
            const lieu = COLLEGE.lieux[Math.floor(Math.random() * COLLEGE.lieux.length)];
            // Ask: given spanish, write french
            questions.push({
                questionType: 'college_vocab',
                prompt: `¿Cómo se dice en francés?`,
                displaySubject: lieu.es + ' →',
                verbName: 'LES LIEUX',
                answer: lieu.fr,
            });
        } else if (type === 'matieres') {
            const mat = COLLEGE.matieres[Math.floor(Math.random() * COLLEGE.matieres.length)];
            questions.push({
                questionType: 'college_vocab',
                prompt: `¿Cómo se dice en francés?`,
                displaySubject: mat.es + ' →',
                verbName: 'LES MATIÈRES',
                answer: mat.fr,
            });
        } else if (type === 'ilya') {
            // Build a sentence the student must complete
            const lieuxForIlya = [
                { noun: "bibliothèque", article: "une", gender: "f" },
                { noun: "gymnase", article: "un", gender: "m" },
                { noun: "cantine", article: "une", gender: "f" },
                { noun: "laboratoire", article: "un", gender: "m" },
                { noun: "piscine", article: "une", gender: "f" },
                { noun: "terrain de sport", article: "un", gender: "m" },
                { noun: "salle informatique", article: "une", gender: "f" },
                { noun: "ordinateurs", article: "des", gender: "pl" },
            ];
            const item = lieuxForIlya[Math.floor(Math.random() * lieuxForIlya.length)];
            const isNeg = Math.random() < 0.5;

            if (isNeg) {
                // Use de/d' for negation
                const startsVowel = 'aeéèêiouâîôûùëïüÿ'.includes(item.noun[0].toLowerCase());
                const de = startsVowel ? "d'" : "de ";
                questions.push({
                    questionType: 'college_ilya',
                    prompt: `Complétez avec IL N'Y A PAS`,
                    displayTemplate: `___ ${item.noun}`,
                    verbName: "IL N'Y A PAS",
                    answer: `Il n'y a pas ${de}${item.noun}`,
                });
            } else {
                questions.push({
                    questionType: 'college_ilya',
                    prompt: `Complétez avec IL Y A`,
                    displayTemplate: `___ ${item.article} ${item.noun}`,
                    verbName: 'IL Y A',
                    answer: `Il y a ${item.article} ${item.noun}`,
                });
            }
        } else if (type === 'heure') {
            const h = COLLEGE.heure.heures[Math.floor(Math.random() * COLLEGE.heure.heures.length)];
            questions.push({
                questionType: 'college_heure',
                prompt: `Quelle heure est-il ? Écrivez en français`,
                displaySubject: '🕐 ' + h.display + ' →',
                verbName: "L'HEURE",
                answer: h.fr,
            });
        } else {
            // moments
            const m = COLLEGE.moments[Math.floor(Math.random() * COLLEGE.moments.length)];
            questions.push({
                questionType: 'college_moments',
                prompt: `¿Cómo se dice en francés?`,
                displaySubject: m.emoji + ' ' + m.es + ' →',
                verbName: 'MOMENTS',
                answer: m.fr,
            });
        }
    }

    return questions;
}

function isVowel(char) {
    return 'aeéèêiouâîôûùëïüÿ'.includes(char.toLowerCase());
}

function startPractice() {
    state.questions = generateQuestions();
    state.currentQuestion = 0;
    state.score = 0;
    state.wrong = 0;
    state.streak = 0;
    state.bestStreak = 0;
    state.answered = false;
}

function resetPractice() {
    state.mode = 'study';
    document.querySelectorAll('.fr-mode-btn').forEach(b => {
        b.classList.toggle('active', b.dataset.mode === 'study');
    });
}

function renderPractice() {
    const panel = document.getElementById('practice-panel');
    
    // Check if finished
    if (state.currentQuestion >= state.questions.length) {
        renderResults(panel);
        return;
    }

    const q = state.questions[state.currentQuestion];
    const progress = ((state.currentQuestion) / state.questions.length) * 100;

    panel.innerHTML = `
        <div class="fr-score-bar">
            <div class="fr-score-item correct-score">
                <span class="score-icon">✓</span>
                <span class="score-val" id="score-correct">${state.score}</span>
            </div>
            <div class="fr-score-item wrong-score">
                <span class="score-icon">✗</span>
                <span class="score-val" id="score-wrong">${state.wrong}</span>
            </div>
            <div class="fr-score-item streak-score">
                <span class="score-icon">🔥</span>
                <span class="score-val" id="score-streak">${state.streak}</span>
            </div>
        </div>

        <div class="fr-question-card">
            <div class="fr-progress-bar-container">
                <div class="fr-progress-bar" style="width: ${progress}%"></div>
            </div>
            <div class="fr-question-count">Question ${state.currentQuestion + 1} / ${state.questions.length}</div>
            <div class="fr-prompt">${q.prompt || 'Conjuguez le verbe'}</div>
            <div class="fr-verb-display">${q.verbName}</div>
            <div class="fr-subject-display">${q.displayTemplate || (q.displaySubject + ' ___')}</div>

            <div class="fr-input-wrapper">
                <input 
                    type="text" 
                    class="fr-input" 
                    id="fr-answer-input" 
                    placeholder="Votre réponse..." 
                    autocomplete="off" 
                    autocorrect="off" 
                    spellcheck="false"
                    ${state.answered ? 'disabled' : ''}
                >
            </div>

            <div class="fr-correction" id="fr-correction"></div>

            <button class="fr-submit-btn" id="fr-submit-btn" onclick="handleSubmit()">
                ${state.answered ? 'Suivant →' : 'Vérifier'}
            </button>
        </div>
    `;

    const input = document.getElementById('fr-answer-input');
    if (input && !state.answered) {
        setTimeout(() => input.focus(), 100);
        input.addEventListener('keydown', (e) => {
            if (e.key === 'Enter') handleSubmit();
        });
    }
}

function normalizeAnswer(str) {
    return str.trim().toLowerCase()
        // Normalize common apostrophe variants
        .replace(/[\u2018\u2019\u2032\u0060]/g, "'");
}

function handleSubmit() {
    if (state.answered) {
        // Move to next question
        state.currentQuestion++;
        state.answered = false;
        renderPractice();
        return;
    }

    const input = document.getElementById('fr-answer-input');
    const correction = document.getElementById('fr-correction');
    const submitBtn = document.getElementById('fr-submit-btn');
    const userAnswer = normalizeAnswer(input.value);
    const q = state.questions[state.currentQuestion];
    const correctAnswer = normalizeAnswer(q.answer);

    if (!userAnswer) {
        input.classList.add('wrong');
        setTimeout(() => input.classList.remove('wrong'), 500);
        return;
    }

    state.answered = true;
    input.disabled = true;
    submitBtn.textContent = 'Suivant →';

    if (userAnswer === correctAnswer) {
        state.score++;
        state.streak++;
        if (state.streak > state.bestStreak) state.bestStreak = state.streak;
        input.classList.add('correct');
        correction.className = 'fr-correction show correct-msg';
        correction.textContent = '✓ Correct ! Très bien !';
    } else {
        state.wrong++;
        state.streak = 0;
        input.classList.add('wrong');
        correction.className = 'fr-correction show wrong-msg';
        correction.innerHTML = `✗ La bonne réponse : <strong>${q.answer}</strong>`;
    }

    // Update score display
    document.getElementById('score-correct').textContent = state.score;
    document.getElementById('score-wrong').textContent = state.wrong;
    document.getElementById('score-streak').textContent = state.streak;
}

function renderResults(panel) {
    const total = state.questions.length;
    const pct = Math.round((state.score / total) * 100);
    let emoji, message;

    if (pct === 100) {
        emoji = '🏆';
        message = 'Parfait ! Magnifique !';
    } else if (pct >= 80) {
        emoji = '🌟';
        message = 'Excellent travail !';
    } else if (pct >= 60) {
        emoji = '👍';
        message = 'Bon travail, continuez !';
    } else if (pct >= 40) {
        emoji = '📖';
        message = 'Révisez et réessayez !';
    } else {
        emoji = '💪';
        message = 'Courage, vous pouvez le faire !';
    }

    panel.innerHTML = `
        <div class="fr-results">
            <div style="font-size: 3rem; margin-bottom: 0.5rem;">${emoji}</div>
            <h2>${message}</h2>
            <div class="score-big">${pct}%</div>
            <div class="score-label">${state.score} correctes sur ${total} — Meilleure série : ${state.bestStreak} 🔥</div>
            <button class="restart-btn" onclick="restartPractice()">Réessayer</button>
        </div>
    `;
}

function restartPractice() {
    startPractice();
    renderPractice();
}
