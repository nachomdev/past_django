
// --- LÓGICA WORDLE REFACTORIZADA ---
let verbosRestantes = [];
let verboActual = null;
let palabraObjetivo = "";
let verbos_jugados = 0;
let verbos_totales = 0;
let intento = {}
let totales = 0;
const MAX_INTENTOS = 4;
let rondaTerminada = false;
let filaActual = 0; // Fila donde se está escribiendo

// Elementos del DOM
const pistaEl = document.getElementById('pista');
const pistaEspaEl = document.getElementById('pista_espa');
const juegoEl = document.getElementById('contenedor-juego');
const mensajeEl = document.getElementById('mensaje');
const mensajeIntento = document.getElementById('intentos');
const nameInput = document.getElementById('name-id');
const enviarBtn = document.getElementById('boton-enviar');
const reiniciarBtn = document.getElementById('boton-reiniciar');
const nameP = document.getElementById('nameP');
const keyboardEl = document.getElementById('keyboard');
let logPartial = "";
let keyboardStatus = {};

function mostrarMensaje(texto, tipo = "") {
    mensajeEl.innerHTML = texto;
    mensajeEl.className = 'mensaje-feedback ' + tipo;
    if (texto) {
        mensajeEl.classList.add('show');
        setTimeout(() => { if (!rondaTerminada) mensajeEl.classList.remove('show'); }, 3000);
    } else {
        mensajeEl.classList.remove('show');
    }
}

function mostrarIntentoMensaje(texto, tipo = "") {
    mensajeIntento.innerHTML = texto;
    mensajeIntento.className = 'mensaje-feedback ' + tipo;
}

function limpiarCuadricula() {
    juegoEl.innerHTML = '';
    filaActual = 0;

    for (let i = 0; i < MAX_INTENTOS; i++) {
        const filaEl = document.createElement('div');
        filaEl.className = 'fila-intento';
        filaEl.dataset.fila = i;

        const longitud = palabraObjetivo.length;

        for (let j = 0; j < longitud; j++) {
            const caja = document.createElement('div');
            caja.className = 'letra-caja';
            caja.dataset.col = j;
            caja.textContent = '';
            filaEl.appendChild(caja);
        }
        juegoEl.appendChild(filaEl);
    }

    // Reset keyboard colors
    keyboardStatus = {};
    document.querySelectorAll('.kbd-key').forEach(k => {
        if (!k.classList.contains('invisible')) {
            k.className = `kbd-key ${k.classList.contains('large') ? 'large' : ''}`;
        }
    });
}

function marcarCeldaActual() {
    document.querySelectorAll('.letra-caja.letra-escribiendo').forEach(caja => {
        caja.classList.remove('letra-escribiendo');
    });

    const filaEl = document.querySelector(`.fila-intento[data-fila="${filaActual}"]`);
    if (!filaEl) return;

    const celdas = filaEl.querySelectorAll('.letra-caja');
    let colFoco = -1;

    for (let i = 0; i < palabraObjetivo.length; i++) {
        if (celdas[i].textContent === '') {
            colFoco = i;
            break;
        }
    }

    if (colFoco === -1) {
        colFoco = palabraObjetivo.length - 1;
    }

    const celda = celdas[colFoco];
    if (celda) {
        celda.classList.add('letra-escribiendo');
    }
}

function actualizarTecladoEstado(letra, estado) {
    const preStatus = keyboardStatus[letra];
    if (estado === 'correcto') {
        keyboardStatus[letra] = 'correcto';
    } else if (estado === 'presente' && preStatus !== 'correcto') {
        keyboardStatus[letra] = 'presente';
    } else if (estado === 'ausente' && !preStatus) {
        keyboardStatus[letra] = 'ausente';
    }

    const keyEl = document.querySelector(`.kbd-key[data-key="${letra}"]`);
    if (keyEl) {
        keyEl.className = `kbd-key ${keyboardStatus[letra]} ${keyEl.classList.contains('large') ? 'large' : ''}`;
    }
}

function colorearFilaActual(intento, feedback) {
    const filaEl = document.querySelector(`.fila-intento[data-fila="${filaActual}"]`);
    if (!filaEl) return;

    const celdas = filaEl.querySelectorAll('.letra-caja');

    for (let i = 0; i < intento.length; i++) {
        const caja = celdas[i];

        caja.classList.remove('letra-escribiendo');
        caja.classList.remove('tiene-letra');

        setTimeout(() => {
            caja.classList.add('flip-in');
        }, i * 200);

        setTimeout(() => {
            caja.classList.remove('flip-in');
            caja.classList.add(feedback[i]);
            actualizarTecladoEstado(intento[i], feedback[i]);
        }, i * 200 + 250);
    }
}

function generarFeedback(intento, objetivo) {
    const resultado = Array(objetivo.length).fill('ausente');
    const objetivoChars = objetivo.split('');
    const intentoChars = intento.split('');

    for (let i = 0; i < objetivo.length; i++) {
        if (intentoChars[i] === objetivoChars[i]) {
            resultado[i] = 'correcto';
            objetivoChars[i] = null;
            intentoChars[i] = null;
        }
    }

    for (let i = 0; i < objetivo.length; i++) {
        if (intentoChars[i] && resultado[i] !== 'correcto') {
            const indexEnObjetivo = objetivoChars.indexOf(intentoChars[i]);
            if (indexEnObjetivo > -1) {
                resultado[i] = 'presente';
                objetivoChars[indexEnObjetivo] = null;
            }
        }
    }
    return resultado;
}

function verificarIntento() {
    if (rondaTerminada) return;

    const filaActualEl = document.querySelector(`.fila-intento[data-fila="${filaActual}"]`);
    if (!filaActualEl) return;

    const celdas = filaActualEl.querySelectorAll('.letra-caja');
    let intentoStr = '';
    celdas.forEach(caja => { intentoStr += caja.textContent; });

    if (intentoStr.length !== palabraObjetivo.length) {
        mostrarMensaje(`Faltan letras`, "error");
        // Shake animation if we wanted
        return;
    }

    const feedback = generarFeedback(intentoStr, palabraObjetivo);
    colorearFilaActual(intentoStr, feedback);

    const animDuration = palabraObjetivo.length * 200 + 300;
    const nombreJugador = document.getElementById('name-id').value;

    // Save Attempt to DB
    fetch('/save_attempt', {
        method: 'POST',
        body: JSON.stringify({
            player_name: nombreJugador,
            target_verb: palabraObjetivo,
            attempt_word: intentoStr,
            is_correct: intentoStr === palabraObjetivo
        }),
        headers: {
            'Content-Type': 'application/json'
        }
    }).catch(err => console.error(err));

    if (intentoStr === palabraObjetivo) {
        rondaTerminada = true;
        setTimeout(() => {
            mostrarMensaje(`¡Correct! ✅`, "correcto");
            agregarLogUI(intentoStr, palabraObjetivo, true);
            setTimeout(iniciarRonda, 3000);
        }, animDuration);
    } else {
        filaActual++;

        if (filaActual >= MAX_INTENTOS) {
            rondaTerminada = true;
            setTimeout(() => {
                mostrarMensaje(`La correcta es <b>${palabraObjetivo}</b> ❌`, "fallido");
                agregarLogUI(intentoStr, palabraObjetivo, false);
                document.getElementById('finishImgLost').style.display = 'block';
                setTimeout(iniciarRonda, 4000);
            }, animDuration);
        } else {
            setTimeout(() => {
                agregarLogUI(intentoStr, palabraObjetivo, false);
                marcarCeldaActual();
            }, animDuration);
        }
    }
}

function agregarLogUI(intento, objetivo, esCorrecto) {
    const logContainer = document.getElementById('historial-intentos');
    if (!logContainer) return;

    const div = document.createElement('div');
    div.style.padding = '8px';
    div.style.margin = '4px 0';
    div.style.borderRadius = '4px';
    div.style.display = 'flex';
    div.style.justifyContent = 'space-between';
    div.style.fontSize = '0.9rem';

    if (esCorrecto) {
        div.style.backgroundColor = 'var(--color-correct)';
        div.style.color = 'white';
        div.innerHTML = `<span>Attempt: <b>${intento}</b></span> <span>✅ Correct!</span>`;
    } else {
        div.style.backgroundColor = 'var(--color-tone-4)';
        div.style.color = 'var(--color-tone-1)';
        div.innerHTML = `<span>Attempt: <b>${intento}</b></span> <span>❌ Target: ${objetivo}</span>`;
    }

    logContainer.prepend(div);
}

function simularTecla(tecla) {
    const eventoDinamico = new KeyboardEvent('keydown', {
        key: tecla,
        bubbles: true
    });
    document.dispatchEvent(eventoDinamico);
}

function manejarTeclado(evento) {
    if (rondaTerminada) return;

    const tecla = evento.key.toUpperCase();
    const longitudObjetivo = palabraObjetivo.length;
    const filaActualEl = document.querySelector(`.fila-intento[data-fila="${filaActual}"]`);
    if (!filaActualEl) return;
    const celdas = filaActualEl.querySelectorAll('.letra-caja');

    if (tecla === 'ENTER') {
        evento.preventDefault();
        verificarIntento();
        return;
    }

    if (tecla === 'BACKSPACE') {
        evento.preventDefault();
        let colBorrar = -1;
        for (let i = longitudObjetivo - 1; i >= 0; i--) {
            if (celdas[i].textContent !== '') { colBorrar = i; break; }
        }
        if (colBorrar >= 0) {
            celdas[colBorrar].textContent = '';
            celdas[colBorrar].classList.remove('tiene-letra');
        }
        marcarCeldaActual();
        return;
    }

    if (tecla.match(/^[A-Z]$/) && tecla.length === 1) {
        let colEscribir = -1;
        for (let i = 0; i < longitudObjetivo; i++) {
            if (celdas[i].textContent === '') { colEscribir = i; break; }
        }
        if (colEscribir !== -1) {
            celdas[colEscribir].textContent = tecla;
            void celdas[colEscribir].offsetWidth; // trigger reflow
            celdas[colEscribir].classList.add('tiene-letra');
        }
        marcarCeldaActual();
    }
}

function iniciarRonda() {
    mostrarMensaje("", "limpiar");
    mensajeIntento.style.display = 'block';

    verbos_jugados = (verbos_totales - verbosRestantes.length);
    if (verbos_jugados != verbos_totales) {
        verbos_jugados++;
    }

    mensajeIntento.textContent = verbos_jugados + " / " + verbos_totales

    document.getElementById('finishImg').style.display = 'none';
    document.getElementById('finishImgLost').style.display = 'none';

    if (verbosRestantes.length === 0) {
        mostrarMensaje("Congrats! 🎉", "finalizado");
        document.getElementById('finishImg').style.display = 'block';
        keyboardEl.style.display = 'none';
        document.getElementById('pista').style.display = 'none';
        document.getElementById('pista_espa').style.display = 'none';
        document.getElementById('contenedor-juego').style.display = 'none';
        const hist = document.getElementById('historial-intentos');
        if (hist) hist.style.display = 'block';
        return;
    }

    const indice = Math.floor(Math.random() * verbosRestantes.length);
    verboActual = verbosRestantes.splice(indice, 1)[0];
    palabraObjetivo = verboActual.pasado.toUpperCase();
    rondaTerminada = false;

    pistaEl.textContent = `Infinitive: TO ${verboActual.infinitivo}`;
    pistaEspaEl.textContent = `( ${verboActual.espa} )`;

    limpiarCuadricula();
    marcarCeldaActual();
}

function inicializarJuego(verbosBaseFiltrado, name) {
    const headerBtn = document.getElementById('boton-reiniciar');
    if (headerBtn) headerBtn.style.display = 'block';

    document.getElementById('container_juego').style.display = 'flex';
    document.getElementById('container_verbos').style.display = 'none';
    keyboardEl.style.display = 'flex';

    // Crear contenedor de historial si no existe
    if (!document.getElementById('historial-intentos')) {
        const hist = document.createElement('div');
        hist.id = 'historial-intentos';
        hist.style.width = '100%';
        hist.style.maxWidth = '500px';
        hist.style.marginTop = '20px';
        hist.style.display = 'none';
        hist.style.borderTop = '1px solid var(--color-tone-4)';
        hist.style.paddingTop = '10px';

        document.getElementById('container_juego').insertBefore(hist, keyboardEl);
    }

    nameP.textContent = name;
    mensajeEl.innerHTML = "";
    verbosRestantes = [...verbosBaseFiltrado];
    totales = verbosRestantes.length;
    verbos_totales = verbosRestantes.length;
    iniciarRonda();
}

// Extracted global initialization
document.addEventListener('DOMContentLoaded', () => {
    document.addEventListener('keydown', manejarTeclado);

    const btnFiltrar = document.getElementById('boton-filtrar');
    const listaCheckboxes = document.getElementById('lista-checkboxes');

    if (btnFiltrar) {
        btnFiltrar.addEventListener('click', () => {
            const gruposSeleccionados = [];
            const name = document.getElementById('name-id').value;
            const errorBox = document.getElementById('name-error');
            if (name.trim() === '') {
                if (errorBox) errorBox.style.display = 'block';
                return;
            }
            if (errorBox) errorBox.style.display = 'none';

            if (listaCheckboxes) {
                const checkboxes = listaCheckboxes.querySelectorAll('input[type="checkbox"]');
                checkboxes.forEach(cb => {
                    if (cb.checked) gruposSeleccionados.push(cb.value);
                });

                const resultadoFiltrado = verbosBase.filter(verbo =>
                    gruposSeleccionados.includes(verbo.group)
                );

                if (resultadoFiltrado.length === 0) {
                    mostrarMensaje(`Selecionar al menos un grupo.`, "singrupo");
                } else {
                    inicializarJuego(resultadoFiltrado, name)
                }
            } else {
                // pastoazar logic
                const resultadoFiltrado = [...verbosBase].sort(() => 0.5 - Math.random()).slice(0, 10);
                if (resultadoFiltrado.length === 0) {
                    mostrarMensaje(`Selecionar al menos un grupo.`, "singrupo");
                } else {
                    inicializarJuego(resultadoFiltrado, name)
                }
            }
        });
    }

    const reiniciarBtn = document.getElementById('boton-reiniciar');
    if (reiniciarBtn) {
        reiniciarBtn.addEventListener('click', () => window.location.reload());
    }

    // Teclado en pantalla
    document.querySelectorAll('.kbd-key').forEach(key => {
        key.addEventListener('click', function (e) {
            if (this.classList.contains('invisible')) return;
            const char = this.getAttribute('data-key');
            simularTecla(char);
            e.currentTarget.blur();
            e.preventDefault();
        });
    });

    if (typeof generarCheckboxes === 'function') generarCheckboxes();
});
