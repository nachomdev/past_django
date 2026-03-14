import os
import re

def refactor():
    base_dir = r"c:\Users\piner\Documents\Proyectos\past_django\past_django\pastapp"
    templates = [
        os.path.join(base_dir, "templates", "pastapp", "pasto.html"),
        os.path.join(base_dir, "templates", "pastapp", "pastoazar.html"),
        os.path.join(base_dir, "templates", "pastapp", "pastojuan.html")
    ]
    
    # We will put the new CSS in static/pastapp/css/wordle.css
    # We will put the new JS in static/pastapp/js/wordle.js
    css_path = os.path.join(base_dir, "static", "pastapp", "css", "wordle.css")
    js_path = os.path.join(base_dir, "static", "pastapp", "js", "wordle.js")
    
    # 1. Write the new CSS
    css_content = """
/* WORDLE PREMIUM THEME */
:root {
    --color-bg: #121213;
    --color-surface: #1e1e1e;
    --color-tone-1: #d7dadc;
    --color-tone-2: #818384;
    --color-tone-3: #565758;
    --color-tone-4: #3a3a3c;
    --color-tone-5: #272729;
    --color-correct: #538d4e;
    --color-present: #b59f3b;
    --color-absent: #3a3a3c;
}

body {
    margin: 0;
    padding: 0;
    font-family: 'Clear Sans', 'Helvetica Neue', Arial, sans-serif;
    background-color: var(--color-bg);
    color: var(--color-tone-1);
    display: flex;
    flex-direction: column;
    align-items: center;
    min-height: 100vh;
}

#wordle-verbo-juego {
    background-color: transparent;
    padding: 10px;
    text-align: center;
    max-width: 500px;
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    box-shadow: none;
}

header {
    width: 100%;
    border-bottom: 1px solid var(--color-tone-4);
    padding: 10px 0;
    margin-bottom: 20px;
}

header h1 {
    font-size: 2.2rem;
    font-weight: 700;
    letter-spacing: 0.1rem;
    margin: 0;
    color: var(--color-tone-1);
}

.pista-verbo {
    font-size: 1.2em;
    font-weight: 600;
    margin-top: 5px;
    margin-bottom: 0px;
    color: var(--color-tone-1);
}

.pista-espa-verbo {
    font-size: 1em;
    color: var(--color-tone-2);
    margin-bottom: 15px;
}

.cuadricula-wordle {
    display: flex;
    flex-direction: column;
    gap: 6px;
    margin-bottom: 20px;
    align-items: center;
}

.fila-intento {
    display: flex;
    gap: 6px;
}

.letra-caja {
    width: 62px; 
    height: 62px;
    display: flex;
    justify-content: center;
    align-items: center;
    font-size: 2rem; 
    font-weight: bold;
    text-transform: uppercase;
    border: 2px solid var(--color-tone-4);
    color: var(--color-tone-1);
    background-color: transparent;
    box-sizing: border-box;
    transition: border-color 0.1s;
    user-select: none;
}

@keyframes pop {
    0% { transform: scale(0.8); }
    40% { transform: scale(1.1); }
    100% { transform: scale(1); }
}

.letra-caja.tiene-letra {
    border-color: var(--color-tone-3);
    animation: pop 0.1s ease-in-out;
}

.letra-caja.letra-escribiendo {
    border-color: var(--color-tone-2);
    border-bottom: 4px solid var(--color-tone-1);
}

@keyframes flipIn {
    0% { transform: rotateX(0); }
    100% { transform: rotateX(-90deg); }
}
@keyframes flipOut {
    0% { transform: rotateX(-90deg); }
    100% { transform: rotateX(0); }
}

.letra-caja.flip-in {
    animation: flipIn 0.25s ease-in forwards;
}

.letra-caja.correcto {
    background-color: var(--color-correct); 
    border-color: var(--color-correct);
    color: white;
    animation: flipOut 0.25s ease-in forwards;
}
.letra-caja.presente {
    background-color: var(--color-present); 
    border-color: var(--color-present);
    color: white;
    animation: flipOut 0.25s ease-in forwards;
}
.letra-caja.ausente {
    background-color: var(--color-absent); 
    border-color: var(--color-absent);
    color: white;
    animation: flipOut 0.25s ease-in forwards;
}

#mensaje {
    font-weight: bold;
    margin-top: 10px;
    padding: 10px;
    border-radius: 5px;
    background-color: var(--color-tone-5);
    display: inline-block;
    opacity: 0;
    transition: opacity 0.3s;
    color: var(--color-tone-1);
}
#mensaje.show {
    opacity: 1;
}

.mensaje-feedback.correcto { color: var(--color-tone-1); }
.mensaje-feedback.fallido { color: var(--color-tone-1); }
.mensaje-feedback.singrupo { color: #f87171; background: transparent !important; }
.mensaje-feedback.error { color: var(--color-tone-1); }
.mensaje-feedback.finalizado { color: var(--color-correct); font-size: 1.5em; background: transparent !important; }
.mensaje-feedback.intento { color: var(--color-tone-2); font-size: 1em; }

#teclado-invisible {
    position: absolute;
    top: 0;
    left: 0;
    width: 10px;
    height: 10px;
    opacity: 0.01;
    z-index: -10;
}

.card {
    background-color: var(--color-surface);
    border: 1px solid var(--color-tone-4);
    border-radius: 8px;
    color: var(--color-tone-1);
}

.form-check-label {
    white-space: nowrap;
    color: var(--color-tone-1) !important;
}
.form-check-input {
    background-color: var(--color-tone-4);
    border-color: var(--color-tone-3);
}
.form-check-input:checked {
    background-color: var(--color-correct);
    border-color: var(--color-correct);
}
.cursor-pointer { cursor: pointer; }
.text-secondary { color: var(--color-tone-2) !important; }

input.form-control {
    background-color: var(--color-bg);
    border: 1px solid var(--color-tone-4);
    color: var(--color-tone-1);
}
input.form-control:focus {
    background-color: var(--color-bg);
    color: var(--color-tone-1);
    border-color: var(--color-tone-2);
    box-shadow: none;
}
button.btn-dark {
    background-color: var(--color-tone-3);
    border-color: var(--color-tone-3);
    color: var(--color-tone-1);
    font-size: 1.1rem;
    padding: 10px 0;
    border-radius: 4px;
}
button.btn-dark:hover {
    background-color: var(--color-tone-2);
    border-color: var(--color-tone-2);
}

#keyboard {
    position: relative;
    user-select: none;
    display: flex;
    flex-direction: column;
    gap: 8px;
    width: 100%;
    max-width: 500px;
    margin: 0 auto;
    margin-top: auto;
    padding-bottom: 20px;
}
.keyboard-row {
    display: flex;
    justify-content: center;
    gap: 6px;
}
.kbd-key {
    background-color: var(--color-tone-2);
    color: var(--color-tone-1);
    border-radius: 4px;
    font-weight: bold;
    display: flex;
    justify-content: center;
    align-items: center;
    height: 58px;
    cursor: pointer;
    text-transform: uppercase;
    flex: 1;
    font-size: 1.2rem;
    transition: background-color 0.1s;
}
.kbd-key.large {
    flex: 1.5;
    font-size: 1rem;
}
.kbd-key.invisible {
    background-color: transparent;
    cursor: default;
}
.kbd-key:active:not(.invisible) {
    transform: scale(0.95);
}
.kbd-key.correcto { background-color: var(--color-correct); }
.kbd-key.presente { background-color: var(--color-present); }
.kbd-key.ausente { background-color: var(--color-tone-4); }

@media (max-width: 400px) {
    .letra-caja { width: 50px; height: 50px; font-size: 1.6rem; }
    .kbd-key { height: 48px; font-size: 1rem; }
}
"""
    with open(css_path, "w", encoding="utf-8") as f:
        f.write(css_content)

    # 2. Write the new JS
    js_content = """
    // --- LÓGICA WORDLE REFACTORIZADA ---
    let verbosRestantes = []; 
    let verboActual = null;
    let palabraObjetivo = "";
    let verbos_jugados = 0;
    let verbos_totales = 0;
    let intento = {}
    let totales = 0;
    const MAX_INTENTOS = 6; // Changed to 6 for standard Wordle feel
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
        if(texto) {
            mensajeEl.classList.add('show');
            setTimeout(() => { if(!rondaTerminada) mensajeEl.classList.remove('show'); }, 3000);
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
            if(!k.classList.contains('invisible')) {
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
            
            const input = document.getElementById('teclado-invisible');
            if(input) {
                const rect = celda.getBoundingClientRect();
                input.style.position = 'fixed';
                input.style.left = `${rect.left + 5}px`;
                input.style.top = `${rect.top + 5}px`;
                input.focus({preventScroll: true});
            }
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
                    mostrarMensaje(`La correcta es <b>${palabraObjetivo}</b> ❌`, "fallido");
                    document.getElementById('finishImgLost').style.display = 'block';
                    setTimeout(iniciarRonda, 4000);
                }, animDuration);
            } else {
                setTimeout(marcarCeldaActual, animDuration);
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

        const input = document.getElementById('teclado-invisible');
        if (document.activeElement === input) {
            // let input handle it, we'll catch 'input' event
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
        const inputInvisible = document.getElementById('teclado-invisible');
        if(inputInvisible) { inputInvisible.focus(); }
        
        mostrarMensaje("","limpiar");
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
        document.getElementById('boton-reiniciar').style.display = 'block';
        document.getElementById('container_juego').style.display = 'flex';
        document.getElementById('container_verbos').style.display = 'none';
        keyboardEl.style.display = 'flex';
        
        nameP.textContent = name;
        mensajeEl.innerHTML = "";
        verbosRestantes = [...verbosBaseFiltrado]; 
        totales=verbosRestantes.length;
        verbos_totales = verbosRestantes.length;
        iniciarRonda();
    }

    // Extracted global initialization
    document.addEventListener('DOMContentLoaded', () => {
        document.addEventListener('keydown', manejarTeclado);

        const btnFiltrar = document.getElementById('boton-filtrar');
        const listaCheckboxes = document.getElementById('lista-checkboxes');
        
        if(btnFiltrar) {
            btnFiltrar.addEventListener('click', () => {
                const gruposSeleccionados = [];
                const name = document.getElementById('name-id').value;
                if(name.trim() === '') {
                    alert('Please enter a name');
                    return;
                }
                
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
        if(reiniciarBtn) {
            reiniciarBtn.addEventListener('click', () => window.location.reload());
        }
        
        // Teclado en pantalla
        document.querySelectorAll('.kbd-key').forEach(key => {
            key.addEventListener('click', function(e) {
                if(this.classList.contains('invisible')) return;
                const char = this.getAttribute('data-key');
                simularTecla(char);
                e.currentTarget.blur();
                e.preventDefault();
            });
        });
        
        const inputInvisible = document.getElementById('teclado-invisible');
        if(inputInvisible) {
            inputInvisible.addEventListener('input', function(e) {
                const letra = e.target.value.toUpperCase();
                e.target.value = '';
                if(letra.match(/^[A-Z]$/)) {
                    simularTecla(letra);
                }
            });
        }
        
        if(typeof generarCheckboxes === 'function') generarCheckboxes();
    });
"""
    with open(js_path, "w", encoding="utf-8") as f:
        f.write(js_content)

    # 3. Refactor HTML templates
    
    html_template = """{% load static %}
<!DOCTYPE html>
<html lang="es">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no">
    <title>Wordle de Past Tense</title>
    <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/css/bootstrap.min.css" rel="stylesheet">
    <link href="{% static 'pastapp/css/wordle.css' %}" rel="stylesheet">
</head>
<body>
    <div id="wordle-verbo-juego">
        <header>
            <h1>Wordle Past</h1>
        </header>

        <div class="container" id="container_verbos" style="display: block;">
            <div id="selector-verbos" class="card shadow-sm mb-4">
                <div class="card-body p-3">
                    <h5 class="fs-5 fw-bold p-2 mb-3">Ingresar nombre</h5>
                    <input class="form-control mb-3" type="text" id="name-id" name="name-id" placeholder="Tu nombre..." minlength="1" required>
                    __REPLACE_CHECKBOXES__
                </div>
            </div>
            <button id="boton-filtrar" class="btn btn-dark w-100 fw-bold shadow-sm">Iniciar Juego</button>
        </div>

        <div class="container p-0 m-0" id="container_juego" style="display: none; flex-direction: column; align-items: center; width:100%; height:100%">
            <h4 class="fw-bold text-center mb-3">Hi <span id="nameP" style="color: var(--color-correct);"></span>!</h4>
            
            <input id="teclado-invisible" type="text" autocomplete="off" autocorrect="off" spellcheck="false" />
            
            <p id="pista" class="pista-verbo">Infinitive: ___</p>
            <p id="pista_espa" class="pista-espa-verbo"></p>
            
            <div id="contenedor-juego" class="cuadricula-wordle"></div>
            
            <p id="mensaje" class="mensaje-feedback"></p>
            <p id="intentos" class="mensaje-feedback"></p>

            <div id="finishImgLost" style="display:none; text-align:center;">
                <img src="{% static 'pastapp/img/lost.png' %}" alt="lost" style="width: 200px; height: 200px">
            </div>
            <div id="finishImg" style="display:none; text-align:center;">
                <img src="{% static 'pastapp/img/win.png' %}" alt="win" style="width: 200px; height: 200px">
            </div>

            <button id="boton-reiniciar" class="btn btn-dark w-100 fw-bold shadow-sm mt-3" style="display:none;">Reiniciar</button>

            <div id="keyboard" style="display: none;">
                <div class="keyboard-row">
                    <div class="kbd-key" data-key="Q">q</div>
                    <div class="kbd-key" data-key="W">w</div>
                    <div class="kbd-key" data-key="E">e</div>
                    <div class="kbd-key" data-key="R">r</div>
                    <div class="kbd-key" data-key="T">t</div>
                    <div class="kbd-key" data-key="Y">y</div>
                    <div class="kbd-key" data-key="U">u</div>
                    <div class="kbd-key" data-key="I">i</div>
                    <div class="kbd-key" data-key="O">o</div>
                    <div class="kbd-key" data-key="P">p</div>
                </div>
                <div class="keyboard-row">
                    <div class="kbd-key invisible" style="flex:0.5"></div>
                    <div class="kbd-key" data-key="A">a</div>
                    <div class="kbd-key" data-key="S">s</div>
                    <div class="kbd-key" data-key="D">d</div>
                    <div class="kbd-key" data-key="F">f</div>
                    <div class="kbd-key" data-key="G">g</div>
                    <div class="kbd-key" data-key="H">h</div>
                    <div class="kbd-key" data-key="J">j</div>
                    <div class="kbd-key" data-key="K">k</div>
                    <div class="kbd-key" data-key="L">l</div>
                    <div class="kbd-key invisible" style="flex:0.5"></div>
                </div>
                <div class="keyboard-row">
                    <div class="kbd-key large" data-key="ENTER">ENTER</div>
                    <div class="kbd-key" data-key="Z">z</div>
                    <div class="kbd-key" data-key="X">x</div>
                    <div class="kbd-key" data-key="C">c</div>
                    <div class="kbd-key" data-key="V">v</div>
                    <div class="kbd-key" data-key="B">b</div>
                    <div class="kbd-key" data-key="N">n</div>
                    <div class="kbd-key" data-key="M">m</div>
                    <div class="kbd-key large" data-key="BACKSPACE">⌫</div>
                </div>
            </div>
        </div>
    </div>
    
    <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.3/dist/js/bootstrap.bundle.min.js"></script>
    <script>
    __REPLACE_VERBOS__
    __REPLACE_EXTRA_JS__
    </script>
    <script src="{% static 'pastapp/js/wordle.js' %}"></script>
</body>
</html>
"""

    def process_file(path):
        with open(path, "r", encoding="utf-8") as f:
            content = f.read()
            
        # Extract verbosBase
        match_verbos = re.search(r'(const verbosBase = \[.*?\];)', content, re.DOTALL)
        verbos_code = match_verbos.group(1) if match_verbos else ""
        
        # specific logic
        has_checkboxes = '<div id="lista-checkboxes"' in content
        
        checkbox_html = ""
        extra_js = ""
        if has_checkboxes:
            checkbox_html = '''<div class="border-top pt-3">
                        <div id="lista-checkboxes" class="verb-list row justify-content-center"></div>
                    </div>'''
            extra_js = """
    function generarCheckboxes() {
        const listaCheckboxes = document.getElementById('lista-checkboxes');
        if(!listaCheckboxes) return;
        listaCheckboxes.innerHTML = '';
        const uniqueGroups = [...new Set(verbosBase.map(v => v.group))].sort();
        uniqueGroups.forEach((group) => {
            const wrapper = document.createElement('div');
            wrapper.className = 'col-sm-6 col-12 mb-2 text-start'; 
            
            const formCheck = document.createElement('div');
            formCheck.className = 'form-check d-flex align-items-center gap-2';

            const input = document.createElement('input');
            input.type = 'checkbox';
            input.value = group;
            input.id = `group-${group}`;
            input.className = 'form-check-input mt-0';
            input.checked = true;

            const infinitivos = verbosBase
                .filter(v => v.group === group)
                .map(v => v.infinitivo.startsWith('BE') ? 'BE' : v.infinitivo);
            
            const verbosDelGrupo = [...new Set(infinitivos)].join(' - ');

            const label = document.createElement('label');
            label.htmlFor = input.id;
            label.className = 'form-check-label cursor-pointer';
            label.innerHTML = `<strong>Group ${group}</strong> <span class="text-secondary d-block" style="font-size:0.8em">${verbosDelGrupo}</span>`;

            formCheck.appendChild(input);
            formCheck.appendChild(label);
            wrapper.appendChild(formCheck);
            listaCheckboxes.appendChild(wrapper);
        });
    }"""
            
        result = html_template.replace("__REPLACE_CHECKBOXES__", checkbox_html)
        result = result.replace("__REPLACE_VERBOS__", verbos_code)
        result = result.replace("__REPLACE_EXTRA_JS__", extra_js)
        
        with open(path, "w", encoding="utf-8") as f:
            f.write(result)

    for template in templates:
         if os.path.exists(template):
             process_file(template)

refactor()
