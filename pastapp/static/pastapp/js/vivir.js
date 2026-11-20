// Vivir: Inicio (resumen semanal), Entrenamiento (sesión del día editable), Comidas y
// Pesos (peso corporal). La config (catálogo de ejercicios y comidas, rutinas, plan
// semanal) viene del servidor en window.VIVIR (ver VIVIR_* en views.py). Como en
// flexiones, el cliente manda su fecha local (YYYY-MM-DD).
(function () {
    const cfg = window.VIVIR;
    const { urls } = cfg;
    const TOTAL_WEEKS = cfg.weeks;
    const DEFAULT_BODY_WEIGHT = 70;
    const WATER_GOAL = 8;
    // Gasto base aproximado (sin entrenar) para el balance: kcal por kg por día.
    const BASE_KCAL_PER_KG = 26;
    const DEFAULT_MIN_PER_REP = 0.25;
    const MIN_MEALS_FOR_BALANCE = 3;
    const EFFORTS = [
        { label: 'Suave', met: 2.5 },
        { label: 'Moderado', met: 3.5 },
        { label: 'Intenso', met: 5 },
        { label: 'Muy intenso', met: 8 },
    ];
    const MODES = [
        { key: 'reps', label: 'Series y repeticiones' },
        { key: 'cardio', label: 'Cardio (minutos, km, rpm)' },
        { key: 'free', label: 'Solo minutos' },
    ];

    let cycle = null;     // /vivir/api/data: ciclo, peso corporal, ejercicios y comidas propias, últimas cargas
    let day = null;       // /vivir/api/day: sesión y comidas del día elegido
    let week = null;      // /vivir/api/week: resumen de la semana elegida en Inicio
    let selected = null;  // día elegido en Entrenamiento / Comidas (YYYY-MM-DD)
    let weekStart = null; // lunes de la semana elegida en Inicio
    let dayReq = 0;
    let weekReq = 0;

    // ---------- utilidades ----------
    const $ = (sel) => document.querySelector(sel);
    const pad = (n) => String(n).padStart(2, '0');
    const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const todayIso = () => isoDate(new Date());
    const parseIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
    const addDays = (s, n) => { const d = parseIso(s); d.setDate(d.getDate() + n); return isoDate(d); };
    const mondayOf = (s) => addDays(s, -((parseIso(s).getDay() + 6) % 7));
    const fmtShort = (s) => { const d = parseIso(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
    const fmtLong = (s) => parseIso(s).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    const cap = (s) => s.charAt(0).toUpperCase() + s.slice(1);
    const weekdayIndex = (s) => (parseIso(s).getDay() + 6) % 7; // lunes = 0
    const WEEKDAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const fmtNum = (n, dec = 1) => Number(n).toLocaleString('es-AR', { maximumFractionDigits: dec });
    const fmtKg = (n) => fmtNum(n, 1);
    const fmtDiff = (n) => `${n > 0 ? '+' : n < 0 ? '−' : '±'}${fmtKg(Math.abs(n))}`;
    const numOrNull = (v) => (v === '' || v === null || v === undefined || Number.isNaN(Number(v)) ? null : Number(v));

    function toast(msg, isError) {
        const t = $('#toast');
        t.textContent = msg;
        t.classList.toggle('error', !!isError);
        t.classList.add('show');
        clearTimeout(toast._t);
        toast._t = setTimeout(() => t.classList.remove('show'), 2200);
    }

    async function api(url, body) {
        const opts = body === undefined ? {} : {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(body),
        };
        const res = await fetch(url, opts);
        if (res.status === 401) { window.location.reload(); throw new Error('No autorizado'); }
        const data = await res.json().catch(() => ({}));
        if (!res.ok) throw new Error(data.error || 'Error');
        return data;
    }

    // ---------- catálogo, rutinas y calorías ----------
    const catalog = () => (cycle ? cycle.custom_exercises : []).concat(cfg.exercises);
    const findEx = (name) => catalog().find((e) => e.name === name);
    const routineBy = (key) => cfg.routines.find((r) => r.key === key);
    const suggestedKey = (date) => cfg.weekPlan[weekdayIndex(date)];
    const routineKeyFor = (session, date) => (session && session.routine) || suggestedKey(date);
    const weekOf = (date) => (cycle ? Math.floor((parseIso(date) - parseIso(cycle.start_date)) / 864e5 / 7) + 1 : 1);
    // Semanas 1-2 usan la versión corta (2 series / 2 vueltas).
    const isShortWeek = (w) => w >= 1 && w <= 2;

    // "3 × 8-12" -> { sets: 3, reps: 8 }
    function parseVolume(vol) {
        const m = /(\d+)\s*[×x]\s*(\d+)/.exec(vol || '');
        return m ? { sets: Number(m[1]), reps: Number(m[2]) } : null;
    }

    // Arma un ítem del día a partir de un ejercicio del catálogo.
    function makeItem(ex, volume, minutes, notes) {
        const mode = ex.mode || 'free';
        const item = { name: ex.name, volume: volume || '', notes: notes || '', met: ex.met, minutes, mode };
        if (mode === 'reps') {
            const pv = parseVolume(volume) || { sets: 3, reps: 10 };
            item.per_rep = Math.round((minutes / (pv.sets * pv.reps)) * 1000) / 1000 || DEFAULT_MIN_PER_REP;
        }
        return item;
    }

    function resolveRoutine(key, wk) {
        return routineBy(key).items.map((it) => {
            const ex = findEx(it.ex) || { name: it.ex, met: 3, minutes: 10, volume: '' };
            const short = it.short && isShortWeek(wk);
            return makeItem(ex, short ? it.short : (it.volume || ex.volume),
                short ? Math.round(ex.minutes * 2 / 3) : ex.minutes, it.notes);
        });
    }

    const itemsFor = (session, date) => (session && session.items) || resolveRoutine(routineKeyFor(session, date), weekOf(date));

    // Peso vigente en una fecha: el último registrado hasta ese día (o el primero si
    // la fecha es anterior a todos). body_weights viene del más nuevo al más viejo.
    function weightEntryFor(date) {
        const list = (cycle && cycle.body_weights) || [];
        return list.find((w) => w.date <= date) || list[list.length - 1] || null;
    }
    const bodyWeight = (date = selected) => { const w = weightEntryFor(date); return w ? w.weight_kg : DEFAULT_BODY_WEIGHT; };
    // kcal = MET × 3.5 × kg / 200 × minutos
    const kcalOf = (met, minutes, date = selected) => (met * 3.5 * bodyWeight(date) / 200) * minutes;
    const totals = (items, date = selected) => items.reduce((acc, it) => ({
        minutes: acc.minutes + (it.minutes || 0),
        kcal: acc.kcal + kcalOf(it.met || 0, it.minutes || 0, date),
    }), { minutes: 0, kcal: 0 });

    // Esfuerzo (MET) según la velocidad, para bici y caminata/carrera con km anotados.
    function metForSpeed(name, kmh) {
        if (/bici/i.test(name)) return kmh < 16 ? 4 : kmh < 19 ? 6.8 : kmh < 22 ? 8 : kmh < 26 ? 10 : 12;
        if (/camin|corr|trot/i.test(name)) return kmh < 4 ? 2.8 : kmh < 5.5 ? 3.5 : kmh < 6.5 ? 5 : kmh < 8 ? 7 : kmh < 10 ? 9.8 : 11.5;
        return null;
    }

    function effortOf(met) {
        const level = met < 3 ? 0 : met < 4.5 ? 1 : met < 6.5 ? 2 : 3;
        return { label: EFFORTS[level].label, dots: '●'.repeat(level + 1) + '○'.repeat(3 - level) };
    }

    function effortChip(it) {
        const e = effortOf(it.met || 0);
        return `<span class="effort" title="${esc(it.met)} MET · ${esc(it.minutes)} min"><i>${e.dots}</i> ${e.label} · ≈${Math.round(kcalOf(it.met || 0, it.minutes || 0))} kcal</span>`;
    }

    // Lo registrado de un ítem ("3 × 10 · 20 kg", "35 min · 12,4 km · 80 rpm") o '' si no hay nada.
    function loggedText(it) {
        if (it.mode === 'reps' && it.sets && it.reps) return `${it.sets} × ${it.reps}${it.kg ? ` · ${fmtNum(it.kg)} kg` : ''}`;
        if (it.mode === 'cardio' && (it.km || it.rpm)) {
            return [`${it.minutes} min`, it.km ? `${fmtNum(it.km, 2)} km` : '', it.rpm ? `${it.rpm} rpm` : ''].filter(Boolean).join(' · ');
        }
        return '';
    }

    // ---------- pestañas ----------
    const TABS = ['inicio', 'entrenamiento', 'comidas', 'pesos'];
    function showTab(name) {
        document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
        document.querySelectorAll('.panel').forEach((p) => p.classList.toggle('active', p.id === `panel-${name}`));
        $('#day-nav').classList.toggle('hidden', name !== 'entrenamiento' && name !== 'comidas');
        try { localStorage.setItem('vivir_tab', name); } catch (e) { /* sin storage */ }
    }
    document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));

    // ---------- hoja inferior ----------
    function openSheet(title, html, onMount) {
        $('#sheet-title').textContent = title;
        // Cuerpo nuevo en cada apertura: así no se acumulan los listeners de hojas anteriores.
        const old = $('#sheet-body');
        const fresh = old.cloneNode(false);
        old.replaceWith(fresh);
        fresh.innerHTML = html;
        $('#sheet').classList.remove('hidden');
        document.body.classList.add('sheet-open');
        if (onMount) onMount($('#sheet-body'));
    }
    function closeSheet() {
        $('#sheet').classList.add('hidden');
        document.body.classList.remove('sheet-open');
        $('#sheet-body').innerHTML = '';
    }
    $('#sheet-close').addEventListener('click', closeSheet);
    $('#sheet').addEventListener('click', (e) => { if (e.target.id === 'sheet') closeSheet(); });
    document.addEventListener('keydown', (e) => { if (e.key === 'Escape') closeSheet(); });

    // ---------- Inicio: resumen semanal ----------
    function cycleText(date) {
        const wk = weekOf(date);
        return wk >= 1 && wk <= TOTAL_WEEKS
            ? `Semana ${wk} de ${TOTAL_WEEKS} del ciclo · ${isShortWeek(wk) ? 'versión corta' : 'versión completa'}`
            : 'Fuera del ciclo de 4 semanas';
    }

    function renderWeekNav() {
        const end = addDays(weekStart, 6);
        const s = parseIso(weekStart), e = parseIso(end);
        const month = (d) => d.toLocaleDateString('es-AR', { month: 'short' }).replace('.', '');
        $('#week-title').textContent = s.getMonth() === e.getMonth()
            ? `${s.getDate()} al ${e.getDate()} de ${month(e)}`
            : `${s.getDate()} ${month(s)} al ${e.getDate()} ${month(e)}`;
        $('#week-sub').textContent = cycleText(weekStart);
        $('#week-today').classList.toggle('hidden', weekStart === mondayOf(todayIso()));
    }

    function renderWeek() {
        if (!week || !cycle) return;
        const today = todayIso();
        let done = 0, minutes = 0, burned = 0, eaten = 0, water = 0, mealsN = 0, protein = 0;
        const balances = [];
        const rows = week.days.map((d, i) => {
            const r = routineBy(routineKeyFor(d, d.date));
            const t = totals(itemsFor(d, d.date), d.date);
            const dayBurned = d.done ? t.kcal : 0;
            if (d.done) { done += 1; burned += dayBurned; }
            minutes += d.minutes || 0;
            eaten += d.meals.kcal;
            water += d.water;
            mealsN += d.meals.count;
            protein += d.meals.protein;
            // Solo días con al menos 3 comidas con kcal: con menos, el balance engaña.
            if (d.meals.kcal_known >= MIN_MEALS_FOR_BALANCE) balances.push(d.meals.kcal - (bodyWeight(d.date) * BASE_KCAL_PER_KG + dayBurned));
            const future = d.date > today;
            return `
            <div class="wd-row kind-${r.kind} ${d.date === today ? 'is-today' : ''} ${future ? 'is-future' : ''}">
                <button type="button" class="wd-main" data-open="${d.date}" title="Ver el día">
                    <span class="wd-day">${cap(WEEKDAYS[i])} <small>${fmtShort(d.date)}</small></span>
                    <span class="wd-routine">${esc(r.name)}${d.done ? ` · ${d.minutes || Math.round(t.minutes)} min` : ''}</span>
                    <span class="wd-icons">
                        <span title="Comidas registradas" class="${d.meals.count ? '' : 'off'}">🍽 ${d.meals.count}${d.meals.kcal_known ? ` · ${d.meals.kcal}` : ''}</span>
                        <span title="Vasos de agua" class="${d.water ? '' : 'off'}">💧 ${d.water}</span>
                    </span>
                </button>
                <label class="check wd-check"><input type="checkbox" data-date="${d.date}" class="track-done" ${d.done ? 'checked' : ''} aria-label="Completada ${esc(WEEKDAYS[i])} ${fmtShort(d.date)}"></label>
            </div>`;
        }).join('');

        const avgBalance = balances.length ? balances.reduce((a, b) => a + b, 0) / balances.length : null;
        $('#week-summary').innerHTML = `
            <div class="progress"><div style="width:${(done / 7) * 100}%"></div></div>
            <div class="stats-grid">
                <div><b class="${done === 7 ? 'ok' : ''}">${done}/7</b><span>entrenamientos</span></div>
                <div><b>${minutes}</b><span>minutos</span></div>
                <div><b>≈ ${Math.round(burned)}</b><span>kcal entrenando</span></div>
                <div><b>${eaten || '—'}</b><span>kcal comidas</span></div>
                <div><b>${mealsN ? `${protein}/${mealsN}` : '—'}</b><span>comidas con proteína</span></div>
                <div><b>${water}</b><span>vasos de agua</span></div>
            </div>
            <div class="balance ${avgBalance === null ? '' : avgBalance < 0 ? 'neg' : 'pos'}">
                <span>Balance estimado</span>
                <b>${avgBalance === null ? '—' : `${avgBalance > 0 ? '+' : '−'}${fmtNum(Math.abs(Math.round(avgBalance)), 0)} kcal/día`}</b>
                <small>${avgBalance === null
                    ? `Aparece en los días con al menos ${MIN_MEALS_FOR_BALANCE} comidas con kcal anotadas.`
                    : `Comido − (gasto base ≈ ${BASE_KCAL_PER_KG} kcal × kg + entrenamiento), promedio de ${balances.length} ${balances.length === 1 ? 'día' : 'días'} con las comidas anotadas.`}</small>
            </div>`;
        $('#week-days').innerHTML = rows;
    }

    async function selectWeek(date) {
        weekStart = mondayOf(date);
        renderWeekNav();
        await loadWeek();
    }

    $('#week-prev').addEventListener('click', () => selectWeek(addDays(weekStart, -7)));
    $('#week-next').addEventListener('click', () => selectWeek(addDays(weekStart, 7)));
    $('#week-today').addEventListener('click', () => selectWeek(todayIso()));

    $('#week-days').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-open]');
        if (!btn) return;
        showTab('entrenamiento');
        selectDate(btn.dataset.open);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });
    $('#week-days').addEventListener('change', (e) => {
        if (!e.target.classList.contains('track-done')) return;
        const date = e.target.dataset.date;
        const fields = { done: e.target.checked };
        const d = week.days.find((x) => x.date === date);
        if (e.target.checked && d && !d.minutes) fields.minutes = Math.round(totals(itemsFor(d, date), date).minutes);
        saveSession(date, fields, e.target.checked ? '¡Sesión completada!' : 'Guardado');
    });

    $('#cycle-save').addEventListener('click', async () => {
        const date = $('#cycle-date').value;
        if (!date || !confirm('¿Empezar un ciclo nuevo de 4 semanas? Lo registrado no se borra.')) return;
        try {
            await api(urls.start, { date });
            $('.cycle-more').open = false;
            toast('Nuevo ciclo iniciado');
            await refresh();
        } catch (err) { toast(err.message, true); }
    });

    // ---------- navegación de días ----------
    function renderDayNav() {
        const long = fmtLong(selected);
        $('#day-title').textContent = selected === todayIso() ? `Hoy, ${long}` : cap(long);
        $('#day-picker').value = selected;
        $('#day-sub').textContent = cycleText(selected).replace(' del ciclo', '');
        $('#day-today').classList.toggle('hidden', selected === todayIso());
    }

    async function selectDate(date) {
        selected = date;
        renderDayNav();
        await loadDay();
    }

    $('#day-prev').addEventListener('click', () => selectDate(addDays(selected, -1)));
    $('#day-next').addEventListener('click', () => selectDate(addDays(selected, 1)));
    $('#day-today').addEventListener('click', () => selectDate(todayIso()));
    $('#day-picker').addEventListener('change', (e) => { if (e.target.value) selectDate(e.target.value); });

    // ---------- Entrenamiento: sesión del día ----------
    function renderSession() {
        const s = day.session;
        const key = routineKeyFor(s, selected);
        const routine = routineBy(key);
        const sugKey = suggestedKey(selected);
        const items = itemsFor(s, selected);
        const t = totals(items);
        const dayNote = key === sugKey ? cfg.dayNotes[weekdayIndex(selected)] : '';
        const card = $('#session-card');
        card.className = `card day-card kind-${routine.kind}`;
        card.innerHTML = `
            <div class="day-head">
                <h3>${esc(routine.name)}</h3>
                <button type="button" class="btn-ghost" id="change-routine">Cambiar</button>
            </div>
            ${key !== sugKey ? `<span class="suggested">Sugerida para el ${WEEKDAYS[weekdayIndex(selected)]}: ${esc(routineBy(sugKey).name)}</span>` : ''}
            ${dayNote ? `<span class="ex-notes">${esc(dayNote)}</span>` : ''}
            ${routine.note ? `<span class="ex-notes">${esc(routine.note)}</span>` : ''}
            <ul class="ex-list">
                ${items.map((it, i) => {
                    const logged = loggedText(it);
                    return `
                <li class="${logged ? 'is-logged' : ''}">
                    <button type="button" class="ex-row ex-open" data-index="${i}" title="Anotar series, reps, kg o km">
                        <span class="ex-name">${esc(it.name)}</span>
                        <span class="ex-vol">${logged ? `✓ ${esc(logged)}` : esc(it.volume)}</span>
                    </button>
                    ${logged && it.volume ? `<span class="ex-notes">Objetivo: ${esc(it.volume)}</span>` : ''}
                    ${it.notes ? `<span class="ex-notes">${esc(it.notes)}</span>` : ''}
                    <div class="ex-actions">
                        ${effortChip(it)}
                        <button type="button" class="ex-log ex-open" data-index="${i}">✎ ${logged ? 'Editar' : 'Anotar'}</button>
                        <button type="button" class="ex-remove" data-index="${i}" aria-label="Quitar ${esc(it.name)}" title="Quitar">✕</button>
                    </div>
                </li>`;
                }).join('') || '<li class="empty">Sin ítems. Agregá alguno.</li>'}
            </ul>
            <button type="button" class="add-item" id="add-item">+ Agregar ítem</button>
            ${s.items ? `<div class="custom-row"><span>Hay cambios o registros guardados en este día</span><button type="button" class="link-btn" id="reset-items">Restablecer</button></div>` : ''}
            <div class="session-totals">
                <span>≈ <b>${Math.round(t.minutes)}</b> min · ≈ <b>${Math.round(t.kcal)}</b> kcal</span>
                <button type="button" class="link-btn" id="edit-weight">${weightEntryFor(selected) ? `con ${fmtKg(bodyWeight())} kg ✎` : `Registrá tu peso (uso ${DEFAULT_BODY_WEIGHT} kg)`}</button>
            </div>
            <div class="done-box">
                <label class="check"><input type="checkbox" id="day-done" ${s.done ? 'checked' : ''}> Sesión completada</label>
                <span class="min-wrap muted"><input type="number" id="day-min" class="input input-min" min="0" max="1440" inputmode="numeric" value="${s.minutes || ''}" placeholder="${Math.round(t.minutes)}"> min</span>
            </div>`;
    }

    $('#session-card').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        if (target.id === 'change-routine') return openRoutinePicker();
        if (target.id === 'add-item') return openAddItem();
        if (target.id === 'reset-items') {
            if (!confirm('Se vuelve a la rutina original y se pierden los registros de este día (series, kg, km). ¿Seguir?')) return;
            return saveSession(selected, { items: null }, 'Rutina restablecida');
        }
        if (target.id === 'edit-weight') return openBodyWeight();
        if (target.classList.contains('ex-remove')) {
            const items = itemsFor(day.session, selected).slice();
            const [removed] = items.splice(Number(target.dataset.index), 1);
            return saveSession(selected, { items }, `Quitado: ${removed.name}`);
        }
        if (target.classList.contains('ex-open')) return openItemEditor(Number(target.dataset.index));
    });

    $('#session-card').addEventListener('change', (e) => {
        if (e.target.id === 'day-done') {
            const fields = { done: e.target.checked };
            // Si no anotó minutos, al completar usa la duración estimada.
            if (e.target.checked && !day.session.minutes) fields.minutes = Math.round(totals(itemsFor(day.session, selected)).minutes);
            saveSession(selected, fields, e.target.checked ? '¡Sesión completada!' : 'Guardado');
        }
        if (e.target.id === 'day-min') saveSession(selected, { minutes: e.target.value || 0 });
    });

    // Anotar lo hecho en un ítem: series/reps/kg (fuerza), minutos/km/rpm (cardio) o minutos.
    function openItemEditor(index) {
        const items = itemsFor(day.session, selected);
        const it = items[index];
        const ex = findEx(it.name);
        const mode = it.mode || (ex && ex.mode) || 'free';
        const last = cycle.last[it.name];
        const target = parseVolume(it.volume);
        const lastText = last && last.date !== selected
            ? `Última vez (${fmtShort(last.date)}): ${loggedText({ mode, ...last }) || `${last.minutes} min`}` : '';
        const val = (v) => (v === null || v === undefined ? '' : v);

        let fields;
        if (mode === 'reps') {
            fields = `
                <div class="grid-3">
                    <div class="field"><label for="ie-sets">Series</label><input type="number" id="ie-sets" class="input" min="0" max="50" inputmode="numeric" value="${val(it.sets ?? (target && target.sets))}"></div>
                    <div class="field"><label for="ie-reps">Reps</label><input type="number" id="ie-reps" class="input" min="0" max="500" inputmode="numeric" value="${val(it.reps ?? (last && last.reps) ?? (target && target.reps))}"></div>
                    <div class="field"><label for="ie-kg">Kg</label><input type="number" id="ie-kg" class="input" min="0" max="1000" step="0.5" inputmode="decimal" value="${val(it.kg ?? (last && last.kg))}" placeholder="—"></div>
                </div>`;
        } else if (mode === 'cardio') {
            fields = `
                <div class="grid-3">
                    <div class="field"><label for="ie-min">Minutos</label><input type="number" id="ie-min" class="input" min="0" max="600" inputmode="numeric" value="${val(it.minutes)}"></div>
                    <div class="field"><label for="ie-km">Km</label><input type="number" id="ie-km" class="input" min="0" max="500" step="0.1" inputmode="decimal" value="${val(it.km)}" placeholder="opcional"></div>
                    <div class="field"><label for="ie-rpm">RPM</label><input type="number" id="ie-rpm" class="input" min="0" max="300" inputmode="numeric" value="${val(it.rpm)}" placeholder="opcional"></div>
                </div>`;
        } else {
            fields = `<div class="field"><label for="ie-min">Minutos</label><input type="number" id="ie-min" class="input" min="0" max="600" inputmode="numeric" value="${val(it.minutes)}"></div>`;
        }

        openSheet(it.name, `
            <form class="picked" id="ie-form" autocomplete="off">
                ${it.volume ? `<span class="muted">Objetivo: <b>${esc(it.volume)}</b></span>` : ''}
                ${lastText ? `<span class="muted">${esc(lastText)}</span>` : ''}
                ${fields}
                <div class="ie-preview" id="ie-preview"></div>
                <button type="submit" class="btn">Guardar</button>
                <div class="form-error" id="ie-error"></div>
            </form>`, (body) => {
            const q = (sel) => body.querySelector(sel);

            // Ítem resultante con los valores del formulario (y minutos/esfuerzo recalculados).
            function build() {
                const next = { ...it, mode };
                if (mode === 'reps') {
                    next.sets = numOrNull(q('#ie-sets').value);
                    next.reps = numOrNull(q('#ie-reps').value);
                    next.kg = numOrNull(q('#ie-kg').value);
                    const perRep = it.per_rep || (target ? it.minutes / (target.sets * target.reps) : DEFAULT_MIN_PER_REP);
                    next.per_rep = Math.round(perRep * 1000) / 1000;
                    if (next.sets && next.reps) next.minutes = Math.max(1, Math.round(next.sets * next.reps * perRep));
                } else {
                    next.minutes = numOrNull(q('#ie-min').value) || 0;
                    if (mode === 'cardio') {
                        next.km = numOrNull(q('#ie-km').value);
                        next.rpm = numOrNull(q('#ie-rpm').value);
                        const baseMet = ex ? ex.met : it.met;
                        const fromSpeed = next.km && next.minutes ? metForSpeed(it.name, next.km / (next.minutes / 60)) : null;
                        next.met = fromSpeed || baseMet;
                    }
                }
                Object.keys(next).forEach((k) => { if (next[k] === null) delete next[k]; });
                return next;
            }

            function preview() {
                const next = build();
                const speed = next.mode === 'cardio' && next.km && next.minutes ? ` · ${fmtNum(next.km / (next.minutes / 60))} km/h` : '';
                q('#ie-preview').innerHTML = `≈ <b>${Math.round(next.minutes)}</b> min · ≈ <b>${Math.round(kcalOf(next.met, next.minutes))}</b> kcal · ${effortOf(next.met).label}${speed}`;
            }

            body.addEventListener('input', preview);
            preview();
            const first = q('input');
            if (first) first.focus();
            q('#ie-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                const list = itemsFor(day.session, selected).slice();
                list[index] = build();
                closeSheet();
                await saveSession(selected, { items: list }, `Anotado: ${it.name}`);
            });
        });
    }

    // Elegir rutina: muestra todas, con sus ítems y la sugerencia de días.
    function openRoutinePicker() {
        const wk = weekOf(selected);
        const current = routineKeyFor(day.session, selected);
        const sugKey = suggestedKey(selected);
        const html = cfg.routines.map((r) => {
            const items = resolveRoutine(r.key, wk);
            const t = totals(items);
            const days = cfg.weekPlan.map((k, i) => (k === r.key ? WEEKDAYS[i] : null)).filter(Boolean);
            return `
            <button type="button" class="card day-card routine-option kind-${r.kind} ${r.key === current ? 'is-selected' : ''}" data-key="${r.key}">
                <div class="day-head">
                    <h3>${esc(r.name)}</h3>
                    ${r.key === current ? '<span class="chip">Elegida</span>' : r.key === sugKey ? '<span class="chip">Sugerida hoy</span>' : ''}
                </div>
                <span class="routine-meta">${days.length ? `Toca: ${days.join(', ')}` : 'Alternativa'} · ≈ ${Math.round(t.minutes)} min · ≈ ${Math.round(t.kcal)} kcal</span>
                <ul class="ex-list">${items.map((it) => `
                    <li><div class="ex-row"><span class="ex-name">${esc(it.name)}</span><span class="ex-vol">${esc(it.volume)}</span></div></li>`).join('')}
                </ul>
            </button>`;
        }).join('');
        openSheet('Elegir rutina', html, (body) => {
            body.addEventListener('click', async (e) => {
                const opt = e.target.closest('.routine-option');
                if (!opt) return;
                const key = opt.dataset.key;
                if (day.session.items && key !== current && !confirm('Este día tiene cambios o registros. Al cambiar de rutina se pierden. ¿Seguir?')) return;
                closeSheet();
                await saveSession(selected, { routine: key === sugKey ? '' : key }, `Rutina: ${routineBy(key).name}`);
            });
        });
    }

    // Agregar ítem: sugiere del catálogo (fijo + propios) o crea uno nuevo.
    function openAddItem() {
        openSheet('Agregar ítem', `
            <input type="search" class="input" id="ai-search" placeholder="Buscar ejercicio…" autocomplete="off">
            <div class="suggest-list" id="ai-list"></div>
            <div id="ai-picked"></div>
            <button type="button" class="btn-ghost" id="ai-new">+ Crear ejercicio nuevo</button>
            <form class="picked hidden" id="ai-create" autocomplete="off">
                <span class="picked-name">Nuevo ejercicio</span>
                <div class="field"><label for="ai-name">Nombre</label><input type="text" id="ai-name" class="input" maxlength="100" required></div>
                <div class="field"><label for="ai-mode">Se registra con</label>
                    <select id="ai-mode" class="input">${MODES.map((m) => `<option value="${m.key}">${m.label}</option>`).join('')}</select>
                </div>
                <div class="grid-2">
                    <div class="field"><label for="ai-effort">Esfuerzo</label>
                        <select id="ai-effort" class="input">${EFFORTS.map((e, i) => `<option value="${e.met}" ${i === 1 ? 'selected' : ''}>${e.label}</option>`).join('')}</select>
                    </div>
                    <div class="field"><label for="ai-min">Minutos</label><input type="number" id="ai-min" class="input" min="1" max="600" value="10" required></div>
                </div>
                <div class="field"><label for="ai-vol">Volumen</label><input type="text" id="ai-vol" class="input" maxlength="50" placeholder="Ej: 3 × 10-12 o 20 min"></div>
                <button type="submit" class="btn">Crear y agregar</button>
                <div class="form-error" id="ai-error"></div>
            </form>`, (body) => {
            const search = body.querySelector('#ai-search');

            function renderList() {
                const q = search.value.trim().toLowerCase();
                const list = catalog().filter((e) => !q || e.name.toLowerCase().includes(q));
                const exact = catalog().some((e) => e.name.toLowerCase() === q);
                const row = (e) => `
                    <div class="suggest-item" role="button" tabindex="0" data-name="${esc(e.name)}">
                        <span class="s-name">${esc(e.name)}</span>
                        <span class="s-meta">${effortOf(e.met).label} · ${e.minutes} min${e.custom ? ` <span class="s-del" data-del="${e.id}" title="Borrar ejercicio">✕</span>` : ''}</span>
                    </div>`;
                const custom = list.filter((e) => e.custom);
                const fixed = list.filter((e) => !e.custom);
                body.querySelector('#ai-list').innerHTML =
                    (custom.length ? `<span class="section-label">Tus ejercicios</span>${custom.map(row).join('')}` : '') +
                    (fixed.length ? `<span class="section-label">De la rutina</span>${fixed.map(row).join('')}` : '') +
                    (q && !exact ? `<div class="suggest-item" role="button" tabindex="0" data-create="${esc(search.value.trim())}"><span class="s-name">Crear «${esc(search.value.trim())}»</span><span class="s-meta">nuevo</span></div>` : '') ||
                    '<div class="empty">Sin resultados.</div>';
            }

            function showCreate(name) {
                body.querySelector('#ai-picked').innerHTML = '';
                body.querySelector('#ai-create').classList.remove('hidden');
                body.querySelector('#ai-new').classList.add('hidden');
                body.querySelector('#ai-name').value = name || '';
                body.querySelector(name ? '#ai-min' : '#ai-name').focus();
            }

            function pick(name) {
                const ex = findEx(name);
                body.querySelector('#ai-create').classList.add('hidden');
                body.querySelector('#ai-new').classList.remove('hidden');
                body.querySelector('#ai-picked').innerHTML = `
                    <form class="picked" id="ai-pick-form">
                        <span class="picked-name">${esc(ex.name)}</span>
                        <div class="grid-2">
                            <div class="field"><label for="ap-vol">Volumen</label><input type="text" id="ap-vol" class="input" maxlength="50" value="${esc(ex.volume)}"></div>
                            <div class="field"><label for="ap-min">Minutos</label><input type="number" id="ap-min" class="input" min="0" max="600" value="${ex.minutes}"></div>
                        </div>
                        <button type="submit" class="btn">Agregar al día</button>
                    </form>`;
                body.querySelector('#ai-pick-form').addEventListener('submit', (e) => {
                    e.preventDefault();
                    addItem(makeItem(ex, body.querySelector('#ap-vol').value.trim(), Number(body.querySelector('#ap-min').value) || 0));
                });
                body.querySelector('#ap-vol').focus();
            }

            search.addEventListener('input', renderList);
            body.querySelector('#ai-new').addEventListener('click', () => showCreate(search.value.trim()));
            body.querySelector('#ai-list').addEventListener('click', async (e) => {
                const del = e.target.closest('[data-del]');
                if (del) {
                    if (!confirm('¿Borrar este ejercicio de tu lista? Los días ya guardados no cambian.')) return;
                    try {
                        await api(urls.exerciseDelete + del.dataset.del, {});
                        cycle.custom_exercises = cycle.custom_exercises.filter((x) => String(x.id) !== del.dataset.del);
                        renderList();
                    } catch (err) { toast(err.message, true); }
                    return;
                }
                const item = e.target.closest('.suggest-item');
                if (!item) return;
                if (item.dataset.create !== undefined) showCreate(item.dataset.create);
                else pick(item.dataset.name);
            });
            body.querySelector('#ai-list').addEventListener('keydown', (e) => {
                if (e.key === 'Enter' && e.target.classList.contains('suggest-item')) e.target.click();
            });
            body.querySelector('#ai-create').addEventListener('submit', async (e) => {
                e.preventDefault();
                const payload = {
                    name: body.querySelector('#ai-name').value.trim(),
                    mode: body.querySelector('#ai-mode').value,
                    met: Number(body.querySelector('#ai-effort').value),
                    minutes: Number(body.querySelector('#ai-min').value),
                    volume: body.querySelector('#ai-vol').value.trim(),
                };
                try {
                    const res = await api(urls.exercise, payload);
                    cycle.custom_exercises.push(res.exercise);
                    const ex = res.exercise;
                    addItem(makeItem(ex, ex.volume, ex.minutes));
                } catch (err) { body.querySelector('#ai-error').textContent = err.message; }
            });
            renderList();
            search.focus();
        });
    }

    async function addItem(item) {
        const items = itemsFor(day.session, selected).concat([item]);
        closeSheet();
        await saveSession(selected, { items }, `Agregado: ${item.name}`);
    }

    // Registra el peso del día elegido (el mismo registro que la pestaña Pesos).
    function openBodyWeight() {
        const own = cycle.body_weights.find((w) => w.date === selected);
        openSheet('Tu peso corporal', `
            <p class="muted">Se usa para estimar las calorías: kcal ≈ esfuerzo (MET) × 3,5 × kg ÷ 200 × minutos. Queda en tu historial de Pesos.</p>
            <form class="picked" id="bw-form">
                <div class="field"><label for="bw-kg">Peso del ${esc(fmtShort(selected))} (kg)</label>
                    <input type="number" id="bw-kg" class="input" min="25" max="400" step="0.1" inputmode="decimal" value="${weightEntryFor(selected) ? bodyWeight() : ''}" required></div>
                <button type="submit" class="btn">Guardar</button>
                <div class="form-error" id="bw-error"></div>
            </form>`, (body) => {
            body.querySelector('#bw-kg').focus();
            body.querySelector('#bw-form').addEventListener('submit', async (e) => {
                e.preventDefault();
                try {
                    await api(urls.weight, { date: selected, weight_kg: body.querySelector('#bw-kg').value, notes: own ? own.notes : '' });
                    closeSheet();
                    toast('Peso guardado');
                    await refresh();
                } catch (err) { body.querySelector('#bw-error').textContent = err.message; }
            });
        });
    }

    async function saveSession(date, fields, msg) {
        try {
            const res = await api(urls.session, { date, ...fields });
            if (date === selected && day) { day.session = res.session; renderSession(); renderFood(); }
            toast(msg || 'Guardado');
            await refresh();
        } catch (err) { toast(err.message, true); }
    }

    // ---------- Comidas ----------
    const foods = () => (cycle ? cycle.custom_foods : []).concat(cfg.foods);

    function renderFood() {
        const meals = day.meals;
        const s = day.session;
        const known = meals.filter((m) => m.kcal !== null);
        const eaten = known.reduce((a, m) => a + m.kcal, 0);
        const burned = Math.round(totals(itemsFor(s, selected)).kcal);
        const withProtein = meals.filter((m) => m.protein).length;
        $('#food-summary').innerHTML = `
            <div class="food-stats">
                <div><b>${known.length ? eaten : '—'}</b><span>kcal comidas</span></div>
                <div><b>${meals.length ? `${withProtein}/${meals.length}` : '—'}</b><span>con proteína</span></div>
                <div><b>≈ ${burned}</b><span>kcal ${s.done ? 'entrenando' : 'previstas'}</span></div>
            </div>
            <div class="water">
                <div><b>Agua</b><div class="glasses">${'●'.repeat(Math.min(s.water, WATER_GOAL))}${'○'.repeat(Math.max(0, WATER_GOAL - s.water))}${s.water > WATER_GOAL ? ` +${s.water - WATER_GOAL}` : ''}</div></div>
                <div class="water-ctrl">
                    <button type="button" class="round-btn" id="water-minus" aria-label="Un vaso menos">−</button>
                    <b>${s.water} ${s.water === 1 ? 'vaso' : 'vasos'}</b>
                    <button type="button" class="round-btn" id="water-plus" aria-label="Un vaso más">+</button>
                </div>
            </div>
            <span class="muted">Proteína en cada comida y suficiente agua (≈ ${WATER_GOAL} vasos).</span>`;

        const labels = Object.fromEntries(cfg.mealTypes);
        const groups = cfg.mealTypes.map(([key]) => [key, meals.filter((m) => m.meal_type === key)]).filter(([, list]) => list.length);
        $('#meals-list').innerHTML = groups.length ? groups.map(([key, list]) => `
            <div class="meal-group">
                <h3>${esc(labels[key])}</h3>
                ${list.map((m) => `
                <div class="meal-item">
                    <span class="meal-desc">${esc(m.description)}${m.portions !== 1 ? ` <small>× ${fmtNum(m.portions, 2)}</small>` : ''}</span>
                    <span class="meal-kcal">${m.kcal !== null ? `${m.kcal} kcal` : ''}</span>
                    <span class="meal-meta">${m.protein ? '<span class="protein-tag">Con proteína</span>' : 'Sin proteína'}</span>
                    <button type="button" class="w-del" data-meal="${m.id}">Borrar</button>
                </div>`).join('')}
            </div>`).join('') : '<div class="empty">Todavía no registraste comidas este día.</div>';
    }

    $('#food-summary').addEventListener('click', (e) => {
        const water = day.session.water;
        if (e.target.id === 'water-plus') saveSession(selected, { water: water + 1 }, 'Agua +1');
        if (e.target.id === 'water-minus' && water > 0) saveSession(selected, { water: water - 1 }, 'Agua −1');
    });

    // Buscador de comidas: sugiere las propias y las comunes; una nueva se guarda al registrarla.
    function renderFoodSuggest() {
        const input = $('#m-desc');
        const box = $('#food-suggest');
        const q = input.value.trim().toLowerCase();
        const exact = foods().find((f) => f.name.toLowerCase() === q);
        const list = foods().filter((f) => !q || f.name.toLowerCase().includes(q)).slice(0, 8);
        const row = (f) => `
            <div class="suggest-item" role="option" tabindex="0" data-food="${esc(f.name)}">
                <span class="s-name">${esc(f.name)}</span>
                <span class="s-meta">${f.kcal !== null ? `${f.kcal} kcal` : 's/kcal'}${f.protein ? ' · P' : ''}${f.custom ? ` <span class="s-del" data-del-food="${f.id}" title="Borrar de tu lista">✕</span>` : ''}</span>
            </div>`;
        const html = list.map(row).join('') +
            (q && !exact && !list.some((f) => f.name.toLowerCase().startsWith(q)) ? `<div class="suggest-new">«${esc(input.value.trim())}» es nueva: completá las kcal y queda guardada.</div>` : '');
        box.innerHTML = html;
        const show = document.activeElement === input && !!html && !(exact && list.length === 1);
        box.classList.toggle('hidden', !show);
        input.setAttribute('aria-expanded', String(show));
    }

    function pickFood(name) {
        const f = foods().find((x) => x.name === name);
        if (!f) return;
        $('#m-desc').value = f.name;
        $('#m-kcal').value = f.kcal ?? '';
        $('#m-protein').checked = !!f.protein;
        $('#food-suggest').classList.add('hidden');
        updateMealTotal();
        $('#m-portions').focus();
    }

    function updateMealTotal() {
        const kcal = numOrNull($('#m-kcal').value);
        const portions = numOrNull($('#m-portions').value) || 1;
        $('#m-total').textContent = kcal !== null && portions !== 1 ? `Total ≈ ${Math.round(kcal * portions)} kcal` : '';
    }

    $('#m-desc').addEventListener('input', () => {
        const f = foods().find((x) => x.name.toLowerCase() === $('#m-desc').value.trim().toLowerCase());
        if (f) { $('#m-kcal').value = f.kcal ?? ''; $('#m-protein').checked = !!f.protein; updateMealTotal(); }
        renderFoodSuggest();
    });
    $('#m-desc').addEventListener('focus', renderFoodSuggest);
    $('#m-desc').addEventListener('blur', () => setTimeout(() => $('#food-suggest').classList.add('hidden'), 150));
    $('#m-kcal').addEventListener('input', updateMealTotal);
    $('#m-portions').addEventListener('input', updateMealTotal);
    $('#food-suggest').addEventListener('mousedown', (e) => e.preventDefault()); // no perder el foco al tocar
    $('#food-suggest').addEventListener('click', async (e) => {
        const del = e.target.closest('[data-del-food]');
        if (del) {
            if (!confirm('¿Borrar esta comida de tu lista? Lo ya registrado no cambia.')) return;
            try {
                await api(urls.foodDelete + del.dataset.delFood, {});
                cycle.custom_foods = cycle.custom_foods.filter((f) => String(f.id) !== del.dataset.delFood);
                renderFoodSuggest();
            } catch (err) { toast(err.message, true); }
            return;
        }
        const item = e.target.closest('[data-food]');
        if (item) pickFood(item.dataset.food);
    });
    $('#food-suggest').addEventListener('keydown', (e) => {
        if (e.key === 'Enter' && e.target.dataset.food) { e.preventDefault(); pickFood(e.target.dataset.food); }
    });

    $('#meal-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        $('#m-error').textContent = '';
        try {
            const res = await api(urls.meal, {
                date: selected,
                meal_type: $('#m-type').value,
                description: $('#m-desc').value.trim(),
                kcal: $('#m-kcal').value,
                portions: $('#m-portions').value || 1,
                protein: $('#m-protein').checked,
            });
            if (res.food) {
                cycle.custom_foods = cycle.custom_foods.filter((f) => f.id !== res.food.id).concat([res.food])
                    .sort((a, b) => a.name.localeCompare(b.name, 'es'));
            }
            $('#m-desc').value = '';
            $('#m-kcal').value = '';
            $('#m-portions').value = 1;
            $('#m-protein').checked = false;
            updateMealTotal();
            toast(res.food ? 'Comida registrada y guardada en tu lista' : 'Comida registrada');
            await Promise.all([loadDay(), loadWeek()]);
        } catch (err) { $('#m-error').textContent = err.message; }
    });

    $('#meals-list').addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-meal]');
        if (!btn || !confirm('¿Borrar esta comida?')) return;
        try {
            await api(urls.mealDelete + btn.dataset.meal, {});
            toast('Comida borrada');
            await Promise.all([loadDay(), loadWeek()]);
        } catch (err) { toast(err.message, true); }
    });

    // Sugerir el tipo de comida según la hora.
    function guessMealType() {
        const h = new Date().getHours();
        return h < 11 ? 'desayuno' : h < 15 ? 'almuerzo' : h < 19 ? 'merienda' : 'cena';
    }

    // ---------- Pesos (peso corporal) ----------
    // Línea de evolución en SVG (registros en orden cronológico).
    function weightChart(asc) {
        if (asc.length < 2) return '';
        const W = 320, H = 110, P = 8;
        const kg = asc.map((w) => w.weight_kg);
        const min = Math.min(...kg), max = Math.max(...kg);
        const span = max - min || 1;
        const t0 = parseIso(asc[0].date);
        const tspan = (parseIso(asc[asc.length - 1].date) - t0) || 1;
        const pts = asc.map((w) => [
            P + ((parseIso(w.date) - t0) / tspan) * (W - 2 * P),
            P + (1 - (w.weight_kg - min) / span) * (H - 2 * P),
        ]);
        const line = pts.map(([x, y]) => `${x.toFixed(1)},${y.toFixed(1)}`).join(' ');
        return `
            <div class="w-chart">
                <svg viewBox="0 0 ${W} ${H}" role="img" aria-label="Evolución del peso">
                    <polyline points="${line}" fill="none" stroke="currentColor" stroke-width="2" stroke-linejoin="round" stroke-linecap="round"/>
                    ${pts.map(([x, y]) => `<circle cx="${x.toFixed(1)}" cy="${y.toFixed(1)}" r="3"/>`).join('')}
                </svg>
                <div class="w-chart-axis"><span>${fmtShort(asc[0].date)}</span><span>${fmtKg(min)} – ${fmtKg(max)} kg</span><span>${fmtShort(asc[asc.length - 1].date)}</span></div>
            </div>`;
    }

    function trendClass(now, before) {
        return now < before ? 'down' : now > before ? 'up' : '';
    }

    function renderWeights() {
        const list = cycle.body_weights; // del más nuevo al más viejo
        if (list.length) {
            const last = list[0];
            const prev = list[1];
            const first = list[list.length - 1];
            $('#weight-now').innerHTML = `
                <div class="summary">
                    <div><b>${fmtKg(last.weight_kg)} kg</b><span>Actual · ${fmtShort(last.date)}</span></div>
                    <div><b class="${prev ? trendClass(last.weight_kg, prev.weight_kg) : ''}">${prev ? `${fmtDiff(last.weight_kg - prev.weight_kg)} kg` : '—'}</b><span>${prev ? `Desde el último · ${fmtShort(prev.date)}` : 'Desde el último'}</span></div>
                    <div><b class="${prev ? trendClass(last.weight_kg, first.weight_kg) : ''}">${prev ? `${fmtDiff(last.weight_kg - first.weight_kg)} kg` : '—'}</b><span>${prev ? `Desde el inicio · ${fmtShort(first.date)}` : 'Desde el inicio'}</span></div>
                </div>`;
        } else {
            $('#weight-now').innerHTML = '<div class="empty">Registrá tu peso para ver cómo evoluciona.</div>';
        }
        $('#weights-chart').innerHTML = weightChart(list.slice(0, 60).reverse());

        $('#weights-list').innerHTML = list.length ? list.map((w, i) => {
            const prev = list[i + 1];
            return `
            <div class="w-item">
                <span class="w-main">${esc(cap(fmtLong(w.date)))}</span>
                <span class="w-kg">${fmtKg(w.weight_kg)} kg</span>
                <span class="w-meta">${prev ? `${fmtDiff(w.weight_kg - prev.weight_kg)} kg vs. ${fmtShort(prev.date)}` : 'Primer registro'}${w.notes ? ` · ${esc(w.notes)}` : ''}</span>
                <button type="button" class="w-del" data-id="${w.id}">Borrar</button>
            </div>`;
        }).join('') : '<div class="empty">Todavía no registraste tu peso.</div>';
        updateWeightHint();
    }

    // Avisa si la fecha elegida ya tiene un registro (se va a reemplazar).
    function updateWeightHint() {
        const existing = cycle && cycle.body_weights.find((w) => w.date === $('#w-date').value);
        $('#w-hint').textContent = existing
            ? `Ese día ya registraste ${fmtKg(existing.weight_kg)} kg: al guardar se reemplaza.`
            : 'Un registro por día. El último peso se usa para estimar las calorías.';
    }
    $('#w-date').addEventListener('change', updateWeightHint);

    $('#weight-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        $('#w-error').textContent = '';
        try {
            const res = await api(urls.weight, {
                date: $('#w-date').value,
                weight_kg: $('#w-weight').value,
                notes: $('#w-notes').value.trim(),
            });
            $('#w-weight').value = '';
            $('#w-notes').value = '';
            toast(res.created ? 'Peso registrado' : 'Peso actualizado');
            await refresh();
        } catch (err) { $('#w-error').textContent = err.message; }
    });

    $('#weights-list').addEventListener('click', async (e) => {
        const btn = e.target.closest('.w-del');
        if (!btn || !confirm('¿Borrar este registro?')) return;
        try {
            await api(urls.weightDelete + btn.dataset.id, {});
            toast('Registro borrado');
            await refresh();
        } catch (err) { toast(err.message, true); }
    });

    // ---------- carga ----------
    async function loadCycle() {
        cycle = await api(`${urls.data}?date=${todayIso()}`);
        $('#cycle-start').textContent = parseIso(cycle.start_date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
        $('#cycle-date').value = mondayOf(todayIso());
        renderWeights();
        renderWeekNav();
        renderWeek();
        if (day) { renderDayNav(); renderSession(); renderFood(); }
    }

    async function loadDay() {
        const req = ++dayReq;
        const data = await api(`${urls.day}?date=${selected}`);
        if (req !== dayReq) return; // llegó una respuesta vieja
        day = data;
        renderSession();
        renderFood();
    }

    async function loadWeek() {
        const req = ++weekReq;
        const data = await api(`${urls.week}?date=${weekStart}`);
        if (req !== weekReq) return;
        week = data;
        renderWeek();
    }

    const refresh = () => Promise.all([loadCycle(), loadWeek()]);

    selected = todayIso();
    weekStart = mondayOf(selected);
    $('#w-date').value = selected;
    $('#m-type').value = guessMealType();
    try { const t = localStorage.getItem('vivir_tab'); showTab(TABS.includes(t) ? t : 'inicio'); } catch (e) { showTab('inicio'); }
    loadCycle()
        .then(() => { renderDayNav(); return Promise.all([loadDay(), loadWeek()]); })
        .catch((err) => toast(err.message, true));
})();
