// Vivir: sesión del día (editable), comidas, seguimiento de 4 semanas y peso corporal.
// La config (catálogo de ejercicios, rutinas, plan semanal) viene del servidor
// en window.VIVIR (ver VIVIR_* en views.py). Como en flexiones, el cliente
// manda su fecha local (YYYY-MM-DD).
(function () {
    const cfg = window.VIVIR;
    const { urls } = cfg;
    const TOTAL_WEEKS = cfg.weeks;
    const DEFAULT_BODY_WEIGHT = 70;
    const WATER_GOAL = 8;
    const EFFORTS = [
        { label: 'Suave', met: 2.5 },
        { label: 'Moderado', met: 3.5 },
        { label: 'Intenso', met: 5 },
        { label: 'Muy intenso', met: 8 },
    ];

    let cycle = null;     // /vivir/api/data: ciclo, registro de peso corporal, ejercicios propios
    let day = null;       // /vivir/api/day: sesión y comidas del día elegido
    let selected = null;  // fecha elegida (YYYY-MM-DD)
    let dayReq = 0;

    // ---------- utilidades ----------
    const $ = (sel) => document.querySelector(sel);
    const pad = (n) => String(n).padStart(2, '0');
    const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const todayIso = () => isoDate(new Date());
    const parseIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
    const addDays = (s, n) => { const d = parseIso(s); d.setDate(d.getDate() + n); return isoDate(d); };
    const fmtShort = (s) => { const d = parseIso(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
    const fmtLong = (s) => parseIso(s).toLocaleDateString('es-AR', { weekday: 'long', day: 'numeric', month: 'long' });
    const weekdayIndex = (s) => (parseIso(s).getDay() + 6) % 7; // lunes = 0
    const WEEKDAYS = ['lunes', 'martes', 'miércoles', 'jueves', 'viernes', 'sábado', 'domingo'];
    const esc = (s) => String(s ?? '').replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const fmtKg = (n) => Number(n).toLocaleString('es-AR', { maximumFractionDigits: 1 });

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
    const catalog = () => cfg.exercises.concat(cycle ? cycle.custom_exercises : []);
    const findEx = (name) => catalog().find((e) => e.name === name);
    const routineBy = (key) => cfg.routines.find((r) => r.key === key);
    const suggestedKey = (date) => cfg.weekPlan[weekdayIndex(date)];
    const routineKeyFor = (session, date) => (session && session.routine) || suggestedKey(date);
    const weekOf = (date) => (cycle ? Math.floor((parseIso(date) - parseIso(cycle.start_date)) / 864e5 / 7) + 1 : 1);
    // Semanas 1-2 usan la versión corta (2 series / 2 vueltas).
    const isShortWeek = (week) => week >= 1 && week <= 2;

    function resolveRoutine(key, week) {
        const r = routineBy(key);
        return r.items.map((it) => {
            const ex = findEx(it.ex) || { met: 3, minutes: 10, volume: '' };
            const short = it.short && isShortWeek(week);
            return {
                name: it.ex,
                volume: short ? it.short : (it.volume || ex.volume),
                notes: it.notes || '',
                met: ex.met,
                minutes: short ? Math.round(ex.minutes * 2 / 3) : ex.minutes,
            };
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

    function effortOf(met) {
        const level = met < 3 ? 0 : met < 4.5 ? 1 : met < 6.5 ? 2 : 3;
        return { label: EFFORTS[level].label, dots: '●'.repeat(level + 1) + '○'.repeat(3 - level) };
    }

    function effortChip(it) {
        const e = effortOf(it.met || 0);
        return `<span class="effort" title="${esc(it.met)} MET · ${esc(it.minutes)} min"><i>${e.dots}</i> ${e.label} · ≈${Math.round(kcalOf(it.met || 0, it.minutes || 0))} kcal</span>`;
    }

    // ---------- pestañas ----------
    function showTab(name) {
        document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
        document.querySelectorAll('.panel').forEach((p) => p.classList.toggle('active', p.id === `panel-${name}`));
        $('#day-nav').classList.toggle('hidden', name !== 'hoy' && name !== 'comidas');
        try { localStorage.setItem('vivir_tab', name); } catch (e) { /* sin storage */ }
    }
    document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));

    // ---------- hoja inferior ----------
    function openSheet(title, html, onMount) {
        $('#sheet-title').textContent = title;
        $('#sheet-body').innerHTML = html;
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

    // ---------- navegación de días ----------
    function renderDayNav() {
        const week = weekOf(selected);
        const long = fmtLong(selected);
        $('#day-title').textContent = selected === todayIso() ? `Hoy, ${long}` : long.charAt(0).toUpperCase() + long.slice(1);
        $('#day-picker').value = selected;
        $('#day-sub').textContent = week >= 1 && week <= TOTAL_WEEKS
            ? `Semana ${week} de ${TOTAL_WEEKS} · ${isShortWeek(week) ? 'versión corta' : 'versión completa'}`
            : 'Fuera del ciclo de 4 semanas';
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

    // ---------- Hoy: sesión del día ----------
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
                ${items.map((it, i) => `
                <li>
                    <div class="ex-row">
                        <span class="ex-name">${esc(it.name)}</span>
                        <span class="ex-vol">${esc(it.volume)}</span>
                    </div>
                    ${it.notes ? `<span class="ex-notes">${esc(it.notes)}</span>` : ''}
                    <div class="ex-actions">
                        ${effortChip(it)}
                        <button type="button" class="ex-remove" data-index="${i}" aria-label="Quitar ${esc(it.name)}" title="Quitar">✕</button>
                    </div>
                </li>`).join('') || '<li class="empty">Sin ítems. Agregá alguno.</li>'}
            </ul>
            <button type="button" class="add-item" id="add-item">+ Agregar ítem</button>
            ${s.items ? `<div class="custom-row"><span>Rutina modificada para este día</span><button type="button" class="link-btn" id="reset-items">Restablecer</button></div>` : ''}
            <div class="session-totals">
                <span>≈ <b>${t.minutes}</b> min · ≈ <b>${Math.round(t.kcal)}</b> kcal</span>
                <button type="button" class="link-btn" id="edit-weight">${weightEntryFor(selected) ? `con ${fmtKg(bodyWeight())} kg ✎` : `Registrá tu peso (uso ${DEFAULT_BODY_WEIGHT} kg)`}</button>
            </div>
            <div class="done-box">
                <label class="check"><input type="checkbox" id="day-done" ${s.done ? 'checked' : ''}> Sesión completada</label>
                <span class="min-wrap muted"><input type="number" id="day-min" class="input input-min" min="0" max="1440" inputmode="numeric" value="${s.minutes || ''}" placeholder="${t.minutes}"> min</span>
            </div>`;
    }

    $('#session-card').addEventListener('click', (e) => {
        const target = e.target.closest('button');
        if (!target) return;
        if (target.id === 'change-routine') return openRoutinePicker();
        if (target.id === 'add-item') return openAddItem();
        if (target.id === 'reset-items') return saveSession(selected, { items: null }, 'Rutina restablecida');
        if (target.id === 'edit-weight') return openBodyWeight();
        if (target.classList.contains('ex-remove')) {
            const items = itemsFor(day.session, selected).slice();
            const [removed] = items.splice(Number(target.dataset.index), 1);
            return saveSession(selected, { items }, `Quitado: ${removed.name}`);
        }
    });

    $('#session-card').addEventListener('change', (e) => {
        if (e.target.id === 'day-done') {
            const fields = { done: e.target.checked };
            // Si no anotó minutos, al completar usa la duración estimada.
            if (e.target.checked && !day.session.minutes) fields.minutes = totals(itemsFor(day.session, selected)).minutes;
            saveSession(selected, fields, e.target.checked ? '¡Sesión completada!' : 'Guardado');
        }
        if (e.target.id === 'day-min') saveSession(selected, { minutes: e.target.value || 0 });
    });

    // Elegir rutina: muestra todas, con sus ítems y la sugerencia de días.
    function openRoutinePicker() {
        const week = weekOf(selected);
        const current = routineKeyFor(day.session, selected);
        const sugKey = suggestedKey(selected);
        const html = cfg.routines.map((r) => {
            const items = resolveRoutine(r.key, week);
            const t = totals(items);
            const days = cfg.weekPlan.map((k, i) => (k === r.key ? WEEKDAYS[i] : null)).filter(Boolean);
            return `
            <button type="button" class="card day-card routine-option kind-${r.kind} ${r.key === current ? 'is-selected' : ''}" data-key="${r.key}">
                <div class="day-head">
                    <h3>${esc(r.name)}</h3>
                    ${r.key === current ? '<span class="chip">Elegida</span>' : r.key === sugKey ? '<span class="chip">Sugerida hoy</span>' : ''}
                </div>
                <span class="routine-meta">${days.length ? `Toca: ${days.join(', ')}` : 'Alternativa'} · ≈ ${t.minutes} min · ≈ ${Math.round(t.kcal)} kcal</span>
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
                if (day.session.items && key !== current && !confirm('Este día tiene cambios en los ítems. Al cambiar de rutina se pierden. ¿Seguir?')) return;
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
                    addItem({
                        name: ex.name, volume: body.querySelector('#ap-vol').value.trim(), notes: '',
                        met: ex.met, minutes: Number(body.querySelector('#ap-min').value) || 0,
                    });
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
                    met: Number(body.querySelector('#ai-effort').value),
                    minutes: Number(body.querySelector('#ai-min').value),
                    volume: body.querySelector('#ai-vol').value.trim(),
                };
                try {
                    const res = await api(urls.exercise, payload);
                    cycle.custom_exercises.push(res.exercise);
                    const ex = res.exercise;
                    addItem({ name: ex.name, volume: ex.volume, notes: '', met: ex.met, minutes: ex.minutes });
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
                    await loadCycle();
                } catch (err) { body.querySelector('#bw-error').textContent = err.message; }
            });
        });
    }

    async function saveSession(date, fields, msg) {
        try {
            const res = await api(urls.session, { date, ...fields });
            if (date === selected && day) { day.session = res.session; renderSession(); renderFood(); }
            toast(msg || 'Guardado');
            await loadCycle();
        } catch (err) { toast(err.message, true); }
    }

    // ---------- Comidas ----------
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
                    <span class="meal-desc">${esc(m.description)}</span>
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

    $('#meal-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        $('#m-error').textContent = '';
        try {
            await api(urls.meal, {
                date: selected,
                meal_type: $('#m-type').value,
                description: $('#m-desc').value.trim(),
                kcal: $('#m-kcal').value,
                protein: $('#m-protein').checked,
            });
            $('#m-desc').value = '';
            $('#m-kcal').value = '';
            $('#m-protein').checked = false;
            toast('Comida registrada');
            await loadDay();
        } catch (err) { $('#m-error').textContent = err.message; }
    });

    $('#meals-list').addEventListener('click', async (e) => {
        const btn = e.target.closest('[data-meal]');
        if (!btn || !confirm('¿Borrar esta comida?')) return;
        try {
            await api(urls.mealDelete + btn.dataset.meal, {});
            toast('Comida borrada');
            await loadDay();
        } catch (err) { toast(err.message, true); }
    });

    // Sugerir el tipo de comida según la hora.
    function guessMealType() {
        const h = new Date().getHours();
        return h < 11 ? 'desayuno' : h < 15 ? 'almuerzo' : h < 19 ? 'merienda' : 'cena';
    }

    // ---------- Seguimiento ----------
    function renderWeeks() {
        $('#cycle-start').textContent = parseIso(cycle.start_date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
        const today = todayIso();
        const currentWeek = weekOf(today);
        $('#weeks-list').innerHTML = cycle.weeks.map((w) => {
            const kcal = w.days.filter((d) => d.done).reduce((a, d) => a + totals(itemsFor(d, d.date), d.date).kcal, 0);
            return `
            <div class="card week-card ${w.number === currentWeek ? 'is-current' : ''}">
                <div class="week-head">
                    <h3>Semana ${w.number} <span class="muted">${fmtShort(w.start)} – ${fmtShort(w.end)}</span></h3>
                    <span class="week-total"><span class="${w.done_count === 7 ? 'ok' : ''}">${w.done_count}/7</span> · ${w.minutes_total} min${kcal ? ` · ≈${Math.round(kcal)} kcal` : ''}</span>
                </div>
                <div class="progress"><div style="width:${(w.done_count / 7) * 100}%"></div></div>
                ${w.days.map((d, i) => {
                    const r = routineBy(routineKeyFor(d, d.date));
                    return `
                    <div class="track-row kind-${r.kind} ${d.date === today ? 'is-today' : ''}">
                        <button type="button" class="day" data-open="${d.date}" title="Ver el detalle del día"><span>${esc(WEEKDAYS[i][0].toUpperCase() + WEEKDAYS[i].slice(1))}</span><span>${esc(r.name)}${d.items ? ' (modificada)' : ''} · ${fmtShort(d.date)}</span></button>
                        <label class="check"><input type="checkbox" data-date="${d.date}" class="track-done" ${d.done ? 'checked' : ''} aria-label="Completada ${esc(WEEKDAYS[i])} ${fmtShort(d.date)}"></label>
                        <span class="min-wrap"><input type="number" data-date="${d.date}" class="input input-min track-min" min="0" max="1440" inputmode="numeric" value="${d.minutes || ''}" placeholder="0" aria-label="Minutos"> min</span>
                    </div>`;
                }).join('')}
            </div>`;
        }).join('');
    }

    $('#weeks-list').addEventListener('click', (e) => {
        const btn = e.target.closest('[data-open]');
        if (!btn) return;
        showTab('hoy');
        selectDate(btn.dataset.open);
        window.scrollTo({ top: 0, behavior: 'smooth' });
    });

    $('#weeks-list').addEventListener('change', (e) => {
        const date = e.target.dataset.date;
        if (!date) return;
        if (e.target.classList.contains('track-done')) saveSession(date, { done: e.target.checked }, e.target.checked ? '¡Sesión completada!' : 'Guardado');
        if (e.target.classList.contains('track-min')) saveSession(date, { minutes: e.target.value || 0 });
    });

    $('#new-cycle-btn').addEventListener('click', () => {
        $('#cycle-date').value = todayIso();
        $('#cycle-form').classList.toggle('hidden');
    });
    $('#cycle-save').addEventListener('click', async () => {
        const date = $('#cycle-date').value;
        if (!date) return;
        try {
            await api(urls.start, { date });
            $('#cycle-form').classList.add('hidden');
            toast('Nuevo ciclo iniciado');
            await loadCycle();
        } catch (err) { toast(err.message, true); }
    });

    // ---------- Pesos (peso corporal) ----------
    const fmtDiff = (n) => `${n > 0 ? '+' : n < 0 ? '−' : '±'}${fmtKg(Math.abs(n))}`;

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

    function renderWeights() {
        const list = cycle.body_weights; // del más nuevo al más viejo
        if (list.length) {
            const last = list[0];
            const first = list[list.length - 1];
            const ref = list.find((w) => w.date <= addDays(last.date, -30));
            $('#weights-summary').innerHTML = `
                <div class="summary">
                    <div><b>${fmtKg(last.weight_kg)} kg</b><span>Actual</span></div>
                    <div><b>${ref ? `${fmtDiff(last.weight_kg - ref.weight_kg)} kg` : '—'}</b><span>Últimos 30 días</span></div>
                    <div><b>${list.length > 1 ? `${fmtDiff(last.weight_kg - first.weight_kg)} kg` : '—'}</b><span>Desde el ${fmtShort(first.date)}</span></div>
                </div>
                ${weightChart(list.slice(0, 60).reverse())}`;
        } else {
            $('#weights-summary').innerHTML = '';
        }

        $('#weights-list').innerHTML = list.length ? list.map((w, i) => {
            const prev = list[i + 1];
            const long = fmtLong(w.date);
            return `
            <div class="w-item">
                <span class="w-main">${esc(long.charAt(0).toUpperCase() + long.slice(1))}</span>
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
            await loadCycle();
        } catch (err) { $('#w-error').textContent = err.message; }
    });

    $('#weights-list').addEventListener('click', async (e) => {
        const btn = e.target.closest('.w-del');
        if (!btn || !confirm('¿Borrar este registro?')) return;
        try {
            await api(urls.weightDelete + btn.dataset.id, {});
            toast('Registro borrado');
            await loadCycle();
        } catch (err) { toast(err.message, true); }
    });

    // ---------- carga ----------
    async function loadCycle() {
        cycle = await api(`${urls.data}?date=${todayIso()}`);
        renderWeeks();
        renderWeights();
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

    function renderAll() {
        renderDayNav();
        renderSession();
        renderFood();
        renderWeeks();
        renderWeights();
    }

    selected = todayIso();
    $('#w-date').value = selected;
    $('#m-type').value = guessMealType();
    try { const t = localStorage.getItem('vivir_tab'); showTab(t && $(`#panel-${t}`) ? t : 'hoy'); } catch (e) { showTab('hoy'); }
    loadCycle()
        .then(() => { renderDayNav(); return loadDay(); })
        .catch((err) => toast(err.message, true));
})();
