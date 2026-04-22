document.addEventListener('DOMContentLoaded', () => {
    const rawTextData = document.getElementById('dictation-text-data');
    if (!rawTextData) return;

    let text = "";
    try {
        text = JSON.parse(rawTextData.textContent);
    } catch (e) {
        console.error("Error parsing dictation text", e);
        return;
    }

    // Split text into sentences (ignoring empty ones)
    const rawParagraphs = text.match(/[^.!?]+[.!?]*[\s]*/g) || [text];
    const paragraphs = rawParagraphs.map(p => p.trim()).filter(p => p.length > 0);
    const container = document.getElementById('dictation-container');
    const btnPlay = document.getElementById('btn-play');
    const progressText = document.getElementById('progress-text');
    
    let currentParagraphIndex = 0;
    let paragraphsData = [];

    // Initialize TTS
    const synth = window.speechSynthesis;
    let voice = null;

    // Load voices and try to select an english one (or best available)
    function loadVoices() {
        const voices = synth.getVoices();
        // Try to find a US English voice, which is good for dictation
        voice = voices.find(v => v.lang === 'en-US' || v.lang === 'en-GB') || voices[0];
    }
    
    if (speechSynthesis.onvoiceschanged !== undefined) {
        speechSynthesis.onvoiceschanged = loadVoices;
    }
    loadVoices();

    let completedCard;

    function buildUI() {
        completedCard = document.createElement('div');
        completedCard.className = 'paragraph-container completed';
        completedCard.style.display = 'none';
        completedCard.style.marginBottom = '20px';
        container.appendChild(completedCard);

        paragraphs.forEach((pText, pIndex) => {
            const pDiv = document.createElement('div');
            pDiv.className = 'paragraph-container' + (pIndex === 0 ? ' active' : '');
            pDiv.id = `para-${pIndex}`;

            // We need to parse words and punctuation
            // This regex matches words (including those with apostrophes) and non-word characters separately.
            const tokenRegex = /([a-zA-Z0-9áéíóúÁÉÍÓÚñÑ']+)|([^a-zA-Z0-9áéíóúÁÉÍÓÚñÑ'\s]+)|\s+/g;
            let match;
            
            let inputsCount = 0;

            while ((match = tokenRegex.exec(pText)) !== null) {
                const word = match[1];
                const punct = match[2];
                const space = match[0].match(/^\s+$/);

                if (word) {
                    const inputLength = word.length;
                    
                    const wrapper = document.createElement('span');
                    wrapper.className = 'word-wrapper';
                    
                    const input = document.createElement('input');
                    input.type = 'text';
                    input.className = 'word-input';
                    input.dataset.target = word;
                    // base width + padding
                    input.style.width = `${Math.max(inputLength, 1) + 1.5}ch`;
                    input.maxLength = inputLength + 2; // slight tolerance
                    input.autocomplete = 'off';
                    input.spellcheck = false;
                    
                    // Events for the input
                    input.addEventListener('input', (e) => handleInput(e, input, pIndex));
                    input.addEventListener('focus', () => input.classList.add('typing'));
                    input.addEventListener('blur', () => input.classList.remove('typing'));
                    // Allow navigating back with backspace if empty
                    input.addEventListener('keydown', (e) => handleKeydown(e, input));

                    wrapper.appendChild(input);
                    pDiv.appendChild(wrapper);
                    inputsCount++;
                } else if (punct) {
                    const span = document.createElement('span');
                    span.className = 'punctuation';
                    span.textContent = punct;
                    pDiv.appendChild(span);
                } else if (space) {
                    pDiv.appendChild(document.createTextNode(' '));
                }
            }

            paragraphsData.push({
                text: pText,
                totalWords: inputsCount,
                correctWords: 0
            });

            container.appendChild(pDiv);
        });
        
        updateProgress();
    }

    function handleInput(e, input, pIndex) {
        const val = input.value.trim();
        const target = input.dataset.target;
        const valLower = val.toLowerCase();
        const targetLower = target.toLowerCase();

        if (val === target) {
            input.classList.remove('incorrect', 'partial');
            input.classList.add('correct');
            input.value = target; // ensure formatting is exactly target
            input.disabled = true;
            
            paragraphsData[pIndex].correctWords++;
            
            // Focus next input in this paragraph
            const parent = input.closest('.paragraph-container');
            const inputs = Array.from(parent.querySelectorAll('.word-input'));
            const currentIndex = inputs.indexOf(input);
            
            if (currentIndex < inputs.length - 1) {
                // Find next unlocked input
                let nextInput = inputs.find((inp, idx) => idx > currentIndex && !inp.disabled);
                if (nextInput) nextInput.focus();
            }

            checkParagraphCompletion(pIndex);
        } else if (valLower === targetLower) {
            // Partially correct (wrong case)
            input.classList.remove('incorrect');
            input.classList.add('partial');
        } else {
            input.classList.remove('partial');
            // Remove incorrect animation if it's currently playing, then re-add if wrong length etc
            // We only show 'incorrect' if they typed the same length or more and it's wrong
            if (val.length >= target.length && val !== target) {
                input.classList.add('incorrect');
                setTimeout(() => input.classList.remove('incorrect'), 500);
            } else {
                input.classList.remove('incorrect');
            }
        }
    }

    function handleKeydown(e, input) {
        if (e.key === 'Backspace' && input.value === '') {
            e.preventDefault();
            const parent = input.closest('.paragraph-container');
            const inputs = Array.from(parent.querySelectorAll('.word-input'));
            const currentIndex = inputs.indexOf(input);
            
            if (currentIndex > 0) {
                // Find previous unlocked input
                let prevInputs = inputs.slice(0, currentIndex).reverse();
                let targetInput = prevInputs.find(inp => !inp.disabled);
                if (targetInput) {
                    targetInput.focus();
                }
            }
        }
    }

    function checkParagraphCompletion(pIndex) {
        if (paragraphsData[pIndex].correctWords >= paragraphsData[pIndex].totalWords) {
            // Paragraph complete!
            setTimeout(() => {
                const currentDiv = document.getElementById(`para-${pIndex}`);
                
                // Move contents to the shared completed card
                completedCard.style.display = 'block';
                while (currentDiv.firstChild) {
                    completedCard.appendChild(currentDiv.firstChild);
                }
                completedCard.appendChild(document.createTextNode(' ')); // space between sentences
                currentDiv.remove();
                
                if (pIndex + 1 < paragraphsData.length) {
                    // Next paragraph
                    currentParagraphIndex++;
                    const nextDiv = document.getElementById(`para-${currentParagraphIndex}`);
                    nextDiv.classList.add('active');
                    updateProgress();
                    
                    // Focus first input of next paragraph
                    const firstInput = nextDiv.querySelector('.word-input');
                    if (firstInput) {
                        firstInput.focus();
                        firstInput.scrollIntoView({ behavior: 'smooth', block: 'center' });
                    }
                    
                    // Auto-play audio for the new sentence
                    setTimeout(playAudio, 300);
                } else {
                    // Entire dictation complete
                    document.getElementById('controls').style.display = 'none';
                    document.getElementById('progress-text').style.display = 'none';
                    const winMsg = document.getElementById('success-message');
                    winMsg.style.display = 'block';
                    winMsg.classList.add('animate__bounceIn');
                }
            }, 800);
        }
    }

    function updateProgress() {
        progressText.textContent = `Sentence ${currentParagraphIndex + 1} of ${paragraphsData.length}`;
    }

    function playAudio() {
        if (synth.speaking) {
            synth.cancel(); // Stop current playing
        }
        
        const pText = paragraphsData[currentParagraphIndex].text;
        const utterance = new SpeechSynthesisUtterance(pText);
        
        if (voice) {
            utterance.voice = voice;
        }
        
        // Setup for kids
        utterance.rate = 0.5;  // slightly slower
        utterance.pitch = 1.0; 
        // Force English for english dictations
        utterance.lang = 'en-US'; 

        synth.speak(utterance);
    }

    btnPlay.addEventListener('click', playAudio);

    // Initialize UI
    buildUI();
    
    // Focus first input
    const firstInput = document.querySelector('.word-input');
    if (firstInput) firstInput.focus();
});
