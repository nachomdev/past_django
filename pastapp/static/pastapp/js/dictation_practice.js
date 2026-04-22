document.addEventListener('DOMContentLoaded', () => {
    const rawData = document.getElementById('hard-words-data');
    if (!rawData) return;
    
    let verbosBase = [];
    try {
        verbosBase = JSON.parse(rawData.textContent);
    } catch(e) {
        console.error(e);
        return;
    }

    if (verbosBase.length === 0) {
        verbosBase = ["EXAMPLE"]; // fallback
    }

    let verbosRestantes = [...verbosBase];
    let palabraObjetivo = "";
    let verbos_totales = verbosBase.length;
    let verbos_jugados = 0;
    const MAX_INTENTOS = 4;
    let rondaTerminada = false;
    let filaActual = 0; 

    const juegoEl = document.getElementById('contenedor-juego');
    const mensajeEl = document.getElementById('mensaje');
    const mensajeIntento = document.getElementById('intentos');
    const keyboardEl = document.getElementById('keyboard');
    const btnPlay = document.getElementById('btn-play');
    
    let keyboardStatus = {};
    
    // TTS Setup
    const synth = window.speechSynthesis;
    let voice = null;
    function loadVoices() {
        const voices = synth.getVoices();
        voice = voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB') || voices[0];
    }
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();

    function playAudio() {
        if (synth.speaking) synth.cancel();
        const utterance = new SpeechSynthesisUtterance(palabraObjetivo.toLowerCase());
        if (voice) utterance.voice = voice;
        utterance.rate = 0.5;
        utterance.pitch = 1.0;
        utterance.lang = 'en-US';
        synth.speak(utterance);
    }

    btnPlay.addEventListener('click', playAudio);

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
            return;
        }

        const feedback = generarFeedback(intentoStr, palabraObjetivo);
        colorearFilaActual(intentoStr, feedback);

        const animDuration = palabraObjetivo.length * 200 + 300;

        if (intentoStr === palabraObjetivo) {
            rondaTerminada = true;
            setTimeout(() => {
                mostrarMensaje(`¡Correct! ✅`, "correcto");
                setTimeout(iniciarRonda, 3000);
            }, animDuration);
        } else {
            filaActual++;

            if (filaActual >= MAX_INTENTOS) {
                rondaTerminada = true;
                setTimeout(() => {
                    mostrarMensaje(`The correct word was <b>${palabraObjetivo}</b> ❌`, "fallido");
                    document.getElementById('finishImgLost').style.display = 'block';
                    setTimeout(iniciarRonda, 4000);
                }, animDuration);
            } else {
                setTimeout(() => {
                    marcarCeldaActual();
                }, animDuration);
            }
        }
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
                void celdas[colEscribir].offsetWidth; 
                celdas[colEscribir].classList.add('tiene-letra');
            }
            marcarCeldaActual();
        }
    }

    function iniciarRonda() {
        mostrarMensaje("", "limpiar");
        
        verbos_jugados = (verbos_totales - verbosRestantes.length);
        if (verbos_jugados != verbos_totales) {
            verbos_jugados++;
        }

        mensajeIntento.textContent = "Word " + verbos_jugados + " / " + verbos_totales;

        document.getElementById('finishImg').style.display = 'none';
        document.getElementById('finishImgLost').style.display = 'none';

        if (verbosRestantes.length === 0) {
            mostrarMensaje("Congrats! 🎉", "finalizado");
            document.getElementById('finishImg').style.display = 'block';
            keyboardEl.style.display = 'none';
            btnPlay.style.display = 'none';
            document.getElementById('contenedor-juego').style.display = 'none';
            return;
        }

        const indice = Math.floor(Math.random() * verbosRestantes.length);
        palabraObjetivo = verbosRestantes.splice(indice, 1)[0].toUpperCase();
        rondaTerminada = false;

        limpiarCuadricula();
        marcarCeldaActual();
        
        // Auto play on new round
        setTimeout(playAudio, 500);
    }

    // Inicializar
    const isMobile = window.matchMedia("(max-width: 768px)").matches || 
                     ('ontouchstart' in window) || 
                     navigator.maxTouchPoints > 0;
    
    if (isMobile) {
        keyboardEl.style.display = 'flex';
    } else {
        keyboardEl.style.display = 'none';
    }

    document.addEventListener('keydown', manejarTeclado);

    document.querySelectorAll('.kbd-key').forEach(key => {
        key.addEventListener('click', function (e) {
            if (this.classList.contains('invisible')) return;
            const char = this.getAttribute('data-key');
            simularTecla(char);
            e.currentTarget.blur();
            e.preventDefault();
        });
    });

    iniciarRonda();
});
