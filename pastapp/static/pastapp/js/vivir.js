// Vivir: rutina semanal + seguimiento de 4 semanas + registro de pesos.
// La rutina viene del servidor en window.VIVIR.routine (VIVIR_ROUTINE en views.py).
// Como en flexiones, el cliente manda su fecha local (YYYY-MM-DD).
(function () {
    const { routine, urls, weeks: TOTAL_WEEKS } = window.VIVIR;
    let state = null; // última respuesta de /vivir/api/data

    // ---------- utilidades ----------
    const $ = (sel) => document.querySelector(sel);
    const pad = (n) => String(n).padStart(2, '0');
    const isoDate = (d) => `${d.getFullYear()}-${pad(d.getMonth() + 1)}-${pad(d.getDate())}`;
    const todayIso = () => isoDate(new Date());
    const parseIso = (s) => { const [y, m, d] = s.split('-').map(Number); return new Date(y, m - 1, d); };
    const fmtShort = (s) => { const d = parseIso(s); return `${pad(d.getDate())}/${pad(d.getMonth() + 1)}`; };
    const weekdayIndex = (s) => (parseIso(s).getDay() + 6) % 7; // lunes = 0
    const esc = (s) => String(s).replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&#39;' }[c]));
    const fmtKg = (n) => Number(n).toLocaleString('es-AR', { maximumFractionDigits: 2 });

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

    // Semanas 1-2 usan la versión corta (2 series / 2 vueltas).
    const isShortWeek = (week) => week >= 1 && week <= 2;
    const volumeFor = (ex, week) => (ex.short && isShortWeek(week) ? ex.short : ex.volume);

    function exerciseItems(day, week, withLog) {
        return day.exercises.map((ex) => `
            <li>
                <div class="ex-row">
                    <span class="ex-name">${esc(ex.name)}</span>
                    <span class="ex-vol">${esc(volumeFor(ex, week))}</span>
                </div>
                ${ex.notes ? `<span class="ex-notes">${esc(ex.notes)}</span>` : ''}
                ${withLog && ex.weights ? `<button type="button" class="ex-log" data-exercise="${esc(ex.name)}">+ anotar peso</button>` : ''}
            </li>`).join('');
    }

    // ---------- pestañas ----------
    function showTab(name) {
        document.querySelectorAll('.tab').forEach((b) => b.classList.toggle('active', b.dataset.tab === name));
        document.querySelectorAll('.panel').forEach((p) => p.classList.toggle('active', p.id === `panel-${name}`));
        try { localStorage.setItem('vivir_tab', name); } catch (e) { /* sin storage */ }
    }
    document.querySelectorAll('.tab').forEach((b) => b.addEventListener('click', () => showTab(b.dataset.tab)));

    // ---------- Hoy ----------
    function renderToday() {
        const idx = weekdayIndex(state.today);
        const day = routine[idx];
        const week = state.current_week;
        const inCycle = week >= 1 && week <= TOTAL_WEEKS;
        let notice = '';
        if (week > TOTAL_WEEKS) {
            notice = `<div class="notice">Terminaste el ciclo de ${TOTAL_WEEKS} semanas. Empezá uno nuevo desde <b>Seguimiento</b> (desde ahora: 3 series o vueltas).</div>`;
        } else if (week < 1) {
            notice = `<div class="notice">El ciclo empieza el ${fmtShort(state.start_date)}.</div>`;
        }

        let extra = '';
        if (day.repeat !== undefined) {
            const base = routine[day.repeat];
            extra = `<div class="sub-title">Circuito del ${esc(base.day.toLowerCase())}</div>
                     <ul class="ex-list">${exerciseItems(base, week, true)}</ul>`;
        }

        const s = state.today_session;
        $('#today-week').innerHTML = `
                <div class="week-badge">
                    <span class="big">${inCycle ? `Semana ${week} de ${TOTAL_WEEKS}` : 'Fuera de ciclo'}</span>
                    <span class="muted">${isShortWeek(week) ? 'Versión corta (2 series / 2 vueltas)' : 'Versión completa (3 series / vueltas)'}</span>
                </div>
                ${notice}`;
        const card = $('#today-card');
        card.className = `card day-card kind-${day.kind}`;
        card.innerHTML = `
                <div class="day-head">
                    <h3>${esc(day.day)}</h3>
                    <span class="chip">${esc(day.session)}</span>
                </div>
                ${day.note ? `<span class="ex-notes">${esc(day.note)}</span>` : ''}
                <ul class="ex-list">${exerciseItems(day, week, true)}</ul>
                ${extra}
                <div class="done-box">
                    <label class="check"><input type="checkbox" id="today-done" ${s.done ? 'checked' : ''}> Sesión completada</label>
                    <span class="min-wrap muted"><input type="number" id="today-min" class="input input-min" min="0" max="1440" inputmode="numeric" value="${s.minutes || ''}" placeholder="0"> min</span>
                </div>`;

        $('#today-done').addEventListener('change', (e) => saveSession(state.today, { done: e.target.checked }));
        $('#today-min').addEventListener('change', (e) => saveSession(state.today, { minutes: e.target.value || 0 }));
    }

    // ---------- Rutina ----------
    function renderRoutine() {
        const week = state ? state.current_week : 3;
        const todayIdx = state ? weekdayIndex(state.today) : -1;
        $('#routine-list').innerHTML = routine.map((day, i) => `
            <div class="card day-card kind-${day.kind} ${i === todayIdx ? 'is-today' : ''}">
                <div class="day-head">
                    <h3>${esc(day.day)} ${i === todayIdx ? '<span class="today-tag">hoy</span>' : ''}</h3>
                    <span class="chip">${esc(day.session)}</span>
                </div>
                ${day.note ? `<span class="ex-notes">${esc(day.note)}</span>` : ''}
                <ul class="ex-list">${exerciseItems(day, week, false)}</ul>
            </div>`).join('');
    }

    // ---------- Seguimiento ----------
    function renderWeeks() {
        $('#cycle-start').textContent = parseIso(state.start_date).toLocaleDateString('es-AR', { day: 'numeric', month: 'long', year: 'numeric' });
        $('#weeks-list').innerHTML = state.weeks.map((w) => `
            <div class="card week-card ${w.number === state.current_week ? 'is-current' : ''}">
                <div class="week-head">
                    <h3>Semana ${w.number} <span class="muted">${fmtShort(w.start)} – ${fmtShort(w.end)}</span></h3>
                    <span class="week-total"><span class="${w.done_count === 7 ? 'ok' : ''}">${w.done_count}/7</span> · ${w.minutes_total} min</span>
                </div>
                <div class="progress"><div style="width:${(w.done_count / 7) * 100}%"></div></div>
                ${w.days.map((d, i) => `
                    <div class="track-row kind-${routine[i].kind} ${d.date === state.today ? 'is-today' : ''}">
                        <div class="day"><span>${esc(routine[i].day)}</span><span>${esc(routine[i].session)} · ${fmtShort(d.date)}</span></div>
                        <label class="check"><input type="checkbox" data-date="${d.date}" class="track-done" ${d.done ? 'checked' : ''} aria-label="Completada ${esc(routine[i].day)} ${fmtShort(d.date)}"></label>
                        <span class="min-wrap"><input type="number" data-date="${d.date}" class="input input-min track-min" min="0" max="1440" inputmode="numeric" value="${d.minutes || ''}" placeholder="0" aria-label="Minutos"> min</span>
                    </div>`).join('')}
            </div>`).join('');
    }

    $('#weeks-list').addEventListener('change', (e) => {
        const date = e.target.dataset.date;
        if (!date) return;
        if (e.target.classList.contains('track-done')) saveSession(date, { done: e.target.checked });
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
            await load();
        } catch (err) { toast(err.message, true); }
    });

    async function saveSession(date, fields) {
        try {
            await api(urls.session, { date, ...fields });
            toast(fields.done === true ? '¡Sesión completada!' : 'Guardado');
            await load();
        } catch (err) { toast(err.message, true); }
    }

    // ---------- Pesos ----------
    function renderWeights() {
        const all = state.weights;
        const filterSel = $('#w-filter');
        const current = filterSel.value;
        const names = [...new Set(all.map((w) => w.exercise))].sort((a, b) => a.localeCompare(b, 'es'));
        filterSel.innerHTML = '<option value="">Todos los ejercicios</option>' +
            names.map((n) => `<option value="${esc(n)}">${esc(n)}</option>`).join('');
        filterSel.value = names.includes(current) ? current : '';

        const list = filterSel.value ? all.filter((w) => w.exercise === filterSel.value) : all;

        if (filterSel.value && list.length) {
            const first = list[list.length - 1];
            const last = list[0];
            const max = Math.max(...list.map((w) => w.weight_kg));
            const diff = last.weight_kg - first.weight_kg;
            $('#weights-summary').innerHTML = `
                <div class="summary">
                    <div><b>${fmtKg(last.weight_kg)} kg</b><span>Último</span></div>
                    <div><b>${fmtKg(max)} kg</b><span>Máximo</span></div>
                    <div><b>${diff >= 0 ? '+' : ''}${fmtKg(diff)} kg</b><span>Desde el inicio</span></div>
                </div>`;
        } else {
            $('#weights-summary').innerHTML = '';
        }

        $('#weights-list').innerHTML = list.length ? list.map((w) => `
            <div class="w-item">
                <span class="w-main">${esc(w.exercise)}</span>
                <span class="w-kg">${fmtKg(w.weight_kg)} kg</span>
                <span class="w-meta">${fmtShort(w.date)}${w.sets || w.reps ? ` · ${w.sets} × ${w.reps}` : ''}${w.notes ? ` · ${esc(w.notes)}` : ''}</span>
                <button type="button" class="w-del" data-id="${w.id}">Borrar</button>
            </div>`).join('') : '<div class="empty">Todavía no hay registros.</div>';
        updateLastHint();
    }

    function updateLastHint() {
        const name = $('#w-exercise').value.trim();
        const last = state && state.weights.find((w) => w.exercise === name);
        $('#w-last').textContent = last
            ? `Última vez (${fmtShort(last.date)}): ${fmtKg(last.weight_kg)} kg${last.sets || last.reps ? `, ${last.sets} × ${last.reps}` : ''}`
            : '';
    }

    $('#w-filter').addEventListener('change', renderWeights);
    $('#w-exercise').addEventListener('input', updateLastHint);

    $('#weight-form').addEventListener('submit', async (e) => {
        e.preventDefault();
        $('#w-error').textContent = '';
        const payload = {
            date: $('#w-date').value,
            exercise: $('#w-exercise').value.trim(),
            weight_kg: $('#w-weight').value,
            sets: $('#w-sets').value || 0,
            reps: $('#w-reps').value || 0,
            notes: $('#w-notes').value.trim(),
        };
        try {
            await api(urls.weight, payload);
            $('#w-weight').value = '';
            $('#w-notes').value = '';
            toast('Peso registrado');
            await load();
        } catch (err) { $('#w-error').textContent = err.message; }
    });

    $('#weights-list').addEventListener('click', async (e) => {
        const btn = e.target.closest('.w-del');
        if (!btn || !confirm('¿Borrar este registro?')) return;
        try {
            await api(urls.weightDelete + btn.dataset.id, {});
            toast('Registro borrado');
            await load();
        } catch (err) { toast(err.message, true); }
    });

    // "+ anotar peso" desde Hoy: precarga el formulario de pesos
    $('#panel-hoy').addEventListener('click', (e) => {
        const btn = e.target.closest('.ex-log');
        if (!btn) return;
        const name = btn.dataset.exercise;
        const week = state.current_week;
        $('#w-exercise').value = name;
        $('#w-date').value = state.today;
        $('#w-sets').value = isShortWeek(week) ? 2 : 3;
        const last = state.weights.find((w) => w.exercise === name);
        if (last) { $('#w-weight').value = last.weight_kg; $('#w-reps').value = last.reps || ''; }
        updateLastHint();
        showTab('pesos');
        $('#w-weight').focus();
    });

    // ---------- carga ----------
    async function load() {
        state = await api(`${urls.data}?date=${todayIso()}`);
        renderToday();
        renderRoutine();
        renderWeeks();
        renderWeights();
    }

    $('#w-date').value = todayIso();
    renderRoutine();
    try { const t = localStorage.getItem('vivir_tab'); if (t && $(`#panel-${t}`)) showTab(t); } catch (e) { /* sin storage */ }
    load().catch((err) => toast(err.message, true));
})();
