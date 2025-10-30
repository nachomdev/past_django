
    const irregularVerbs = [
        {"group":"Irregular","present":"TO BE (I-HE-SHE-IT)","past":"WAS","option1":"WAS","opction2":"WERE","option3":"WHERE","description":"ERA / ERAN"},
        {"group":"Irregular","present":"TO BE (YOU-WE-THEY)","past":"WERE","option1":"WAS","opction2":"WERE","option3":"WHERE","description":"ERA / ERAN"},
        {"group":"Irregular","present":"TO BREAK","past":"BROKE","option1":"BROKE","opction2":"BROGHT","option3":"BROAK","description":"ROMPER"},
        {"group":"Irregular","present":"TO BRING","past":"BROUGHT","option1":"BROUGHT","opction2":"BROGHT","option3":"BRIGHT","description":"TRAER"},
        {"group":"Irregular","present":"TO BUY","past":"BOUGHT","option1":"BOUGHT","opction2":"BOGHT","option3":"BUGHT","description":"COMPRAR"},
        {"group":"Irregular","present":"TO CATCH","past":"CAUGHT","option1":"CAUGHT","opction2":"CAUCHT","option3":"CAGHT","description":"ATRAPAR"},
        {"group":"Irregular","present":"TO CHOOSE","past":"CHOSE","option1":"CHOSE","opction2":"CHUSE","option3":"CHOUSE","description":"ELEGIR"},
        {"group":"Irregular","present":"TO COME","past":"CAME","option1":"CAME","opction2":"COME","option3":"COM","description":"VENIR"},
        {"group":"Irregular","present":"TO CUT","past":"CUT","option1":"CUT","opction2":"COUGHT","option3":"CAT","description":"CORTAR"},
        {"group":"Irregular","present":"TO DO","past":"DID","description":"HACER"}/*,
        
       {"group":"Irregular","present":"TO BEAT","past":"BEAT","description":"DERROTAR"},
        {"group":"Irregular","present":"TO BECOME","past":"BECAME","description":"CONVERTIR"},
        {"group":"Irregular","present":"TO BEGIN","past":"BEGAN","description":"COMENZAR"},
        {"group":"Irregular","present":"TO BITE","past":"BIT","description":"MORDER"},
        {"group":"Irregular","present":"TO BUILD","past":"BUILT","option1":"BUILT","opction2":"BUILD","option3":"BUILDT","description":"CONSTRUIR"},
        {"group":"Irregular","present":"TO BURN","past":"BURNT","description":"QUEMAR"},
        
        
        
        {"group":"Irregular","present":"TO COST","past":"COST","description":"COSTAR"},
        {"group":"Irregular","present":"TO DRINK","past":"DRANK","description":"BEBER"},
        {"group":"Irregular","present":"TO DRIVE","past":"DROVE","description":"CONDUCIR"},
        {"group":"Irregular","present":"TO EAT","past":"ATE","description":"COMER"},
        {"group":"Irregular","present":"TO FALL","past":"FELL","description":"CAER"},
        {"group":"Irregular","present":"TO FEEL","past":"FELT","description":"SENTIR"},
        {"group":"Irregular","present":"TO FIGHT","past":"FOUGHT","description":"PELEAR"},
        {"group":"Irregular","present":"TO FIND","past":"FOUND","description":"ENCONTRAR"},
        {"group":"Irregular","present":"TO FLY","past":"FLEW","description":"VOLAR"},
        {"group":"Irregular","present":"TO FORBID","past":"FORBADE","description":"PROHIBIR"},
        {"group":"Irregular","present":"TO FORGET","past":"FORGOT","description":"OLVIDAR"},
        {"group":"Irregular","present":"TO FREEZE","past":"FROZE","description":"CONGELAR"},
        {"group":"Irregular","present":"TO GET","past":"GOT","description":"CONSEGUIR"},
        {"group":"Irregular","present":"TO GIVE","past":"GAVE","description":"DAR"},
        {"group":"Irregular","present":"TO GO","past":"WENT","description":"IR"},
        {"group":"Irregular","present":"TO GROW","past":"GREW","description":"CRECER"},
        {"group":"Irregular","present":"TO HAVE","past":"HAD","description":"TENER"},
        {"group":"Irregular","present":"TO HEAR","past":"HEARD","description":"ESCUCHAR"},
        {"group":"Irregular","present":"TO HIDE","past":"HID","description":"ESCONDER"},
        {"group":"Irregular","present":"TO HIT","past":"HIT","description":"GOLPEAR"},
        {"group":"Irregular","present":"TO HURT","past":"HURT","description":"HERIR"},
        {"group":"Irregular","present":"TO KEEP","past":"KEPT","description":"CONSERVAR"},
        {"group":"Irregular","present":"TO KNOW","past":"KNEW","description":"SABER"},
        {"group":"Irregular","present":"TO LEARN","past":"LEARNT","description":"APRENDER"},
        {"group":"Irregular","present":"TO LEAVE","past":"LEFT","description":"DEJAR / SALIR"},
        {"group":"Irregular","present":"TO LEND","past":"LENT","description":"PRESTAR"},
        {"group":"Irregular","present":"TO LET","past":"LET","description":"DEJAR / SALIR"},
        {"group":"Irregular","present":"TO LIGHT","past":"LIT","description":"ENCENDER"},
        {"group":"Irregular","present":"TO LOSE","past":"LOST","description":"PERDER"},
        {"group":"Irregular","present":"TO MAKE","past":"MADE","description":"HACER"},
        {"group":"Irregular","present":"TO MEAN","past":"MEANT","description":"SIGNIFICAR"},
        {"group":"Irregular","present":"TO MEET","past":"MET","description":"CONOCER"},
        {"group":"Irregular","present":"TO PAY","past":"PAID","description":"PAGAR"},
        {"group":"Irregular","present":"TO PUT","past":"PUT","description":"PONER"},
        {"group":"Irregular","present":"TO READ","past":"READ","description":"LEER"},
        {"group":"Irregular","present":"TO RIDE","past":"RODE","description":"MONTAR"},
        {"group":"Irregular","present":"TO RING","past":"RANG","description":"LLAMAR"},
        {"group":"Irregular","present":"TO RUN","past":"RAN","description":"CORRER"},
        {"group":"Irregular","present":"TO SAY","past":"SAID","description":"DECIR"},
        {"group":"Irregular","present":"TO SEE","past":"SAW","description":"VER"},
        {"group":"Irregular","present":"TO SELL","past":"SOLD","description":"VENDER"},
        {"group":"Irregular","present":"TO SEND","past":"SENT","description":"ENVIAR"},
        {"group":"Irregular","present":"TO SHINE","past":"SHONE","description":"BRILLAR"},
        {"group":"Irregular","present":"TO SHOOT","past":"SHOT","description":"DISPARAR"},
        {"group":"Irregular","present":"TO SHOW","past":"SHOWED","description":"MOSTRAR"},
        {"group":"Irregular","present":"TO SHUT","past":"SHUT","description":"CERRAR"},
        {"group":"Irregular","present":"TO SING","past":"SANG","description":"CANTAR"},
        {"group":"Irregular","present":"TO SIT","past":"SAT","description":"SENTAR"},
        {"group":"Irregular","present":"TO SLEEP","past":"SLEPT","description":"DORMIR"},
        {"group":"Irregular","present":"TO SMELL","past":"SMELT","description":"OLER"},
        {"group":"Irregular","present":"TO SPEAK","past":"SPOKE","description":"HABLAR"},
        {"group":"Irregular","present":"TO STAND","past":"STOOD","description":"PERMANECER"},
        {"group":"Irregular","present":"TO STEAL","past":"STOLE","description":"ROBAR"},
        {"group":"Irregular","present":"TO SWIM","past":"SWAM","description":"NADAR"},
        {"group":"Irregular","present":"TO TAKE","past":"TOOK","description":"TOMAR"},
        {"group":"Irregular","present":"TO TEACH","past":"TAUGHT","description":"ENSEÑAR"},
        {"group":"Irregular","present":"TO TEAR","past":"TORE","description":"RASGAR"},
        {"group":"Irregular","present":"TO TELL","past":"TOLD","description":"CONTAR"},
        {"group":"Irregular","present":"TO THINK","past":"THOUGHT","description":"PENSAR"},
        {"group":"Irregular","present":"TO THROW","past":"THREW","description":"TIRAR"},
        {"group":"Irregular","present":"TO WAKE","past":"WOKE","description":"DESPERTAR"},
        {"group":"Irregular","present":"TO WEAR","past":"WORE","description":"WEAR"},
        {"group":"Irregular","present":"TO WIN","past":"WON","description":"GANAR"},
        {"group":"Irregular","present":"TO WRITE","past":"WROTE","description":"ESCRIBIR"},*/
    ];

    const regularVerbs = [
        {"group":"Regular","present":"TO ACCEPT","past":"ACCEPTED"},
        {"group":"Regular","present":"TO ACHIEVE","past":"ACHIEVED"},
        {"group":"Regular","present":"TO ADD","past":"ADDED"},
        {"group":"Regular","present":"TO ADMIRE","past":"ADMIRED"},
        {"group":"Regular","present":"TO ADMIT","past":"ADMITTED"},
        {"group":"Regular","present":"TO ADOPT","past":"ADOPTED"},
        {"group":"Regular","present":"TO ADVISE","past":"ADVISED"},
        {"group":"Regular","present":"TO AGREE","past":"AGREED"},
        {"group":"Regular","present":"TO ALLOW","past":"ALLOWED"},
        {"group":"Regular","present":"TO ANNOUNCE","past":"ANNOUNCED"},
        {"group":"Regular","present":"TO APPRECIATE","past":"APPRECIATED"},
        {"group":"Regular","present":"TO APPROVE","past":"APPROVED"},
        {"group":"Regular","present":"TO ARGUE","past":"ARGUED"},
        {"group":"Regular","present":"TO ARRIVE","past":"ARRIVED"},
        {"group":"Regular","present":"TO ASK","past":"ASKED"},
        {"group":"Regular","present":"TO ASSIST","past":"ASSISTED"},
        {"group":"Regular","present":"TO ATTACK","past":"ATTACKED"},
        {"group":"Regular","present":"TO BAKE","past":"BAKED"},
        {"group":"Regular","present":"TO BEG","past":"BEGGED"},
        {"group":"Regular","present":"TO BEHAVE","past":"BEHAVED"},
        {"group":"Regular","present":"TO BOIL","past":"BOILED"},
        {"group":"Regular","present":"TO BORROW","past":"BORROWED"},
        {"group":"Regular","present":"TO BRUSH","past":"BRUSHED"},
        {"group":"Regular","present":"TO BURY","past":"BURIED"},
        {"group":"Regular","present":"TO CALL","past":"CALLED"},
        {"group":"Regular","present":"TO CHALLENGE","past":"CHALLENGED"},
        {"group":"Regular","present":"TO CHANGE","past":"CHANGED"},
        {"group":"Regular","present":"TO CHASE","past":"CHASED"},
        {"group":"Regular","present":"TO CHEAT","past":"CHEATED"},
        {"group":"Regular","present":"TO CHEER","past":"CHEERED"},
        {"group":"Regular","present":"TO CHEW","past":"CHEWED"},
        {"group":"Regular","present":"TO CLAP","past":"CLAPPED"},
        {"group":"Regular","present":"TO CLEAN","past":"CLEANED"},
        {"group":"Regular","present":"TO COLLECT","past":"COLLECTED"},
        {"group":"Regular","present":"TO COMPARE","past":"COMPARED"},
        {"group":"Regular","present":"TO COMPLAIN","past":"COMPLAINED"},
        {"group":"Regular","present":"TO CONFESS","past":"CONFESSED"},
        {"group":"Regular","present":"TO CONSTRUCT","past":"CONSTRUCTED"},
        {"group":"Regular","present":"TO CONTROL","past":"CONTROLLED"},
        {"group":"Regular","present":"TO COPY","past":"COPIED"},
        {"group":"Regular","present":"TO COUNT","past":"COUNTED"},
        {"group":"Regular","present":"TO CREATE","past":"CREATED"},
        {"group":"Regular","present":"TO CRY","past":"CRIED"},
        {"group":"Regular","present":"TO CYCLE","past":"CYCLED"},
        {"group":"Regular","present":"TO DAMAGE","past":"DAMAGED"},
        {"group":"Regular","present":"TO DANCE","past":"DANCED"},
        {"group":"Regular","present":"TO DELIVER","past":"DELIVERED"},
        {"group":"Regular","present":"TO DESTROY","past":"DESTROYED"},
        {"group":"Regular","present":"TO DIVIDE","past":"DIVIDED"},
        {"group":"Regular","present":"TO DRAG","past":"DRAGGED"},
        {"group":"Regular","present":"TO EARN","past":"EARNED"},
        {"group":"Regular","present":"TO EMPLOY","past":"EMPLOYED"},
        {"group":"Regular","present":"TO ENCOURAGE","past":"ENCOURAGED"},
        {"group":"Regular","present":"TO ENJOY","past":"ENJOYED"},
        {"group":"Regular","present":"TO ESTABLISH","past":"ESTABLISHED"},
        {"group":"Regular","present":"TO ESTIMATE","past":"ESTIMATED"},
        {"group":"Regular","present":"TO EXERCISE","past":"EXERCISED"},
        {"group":"Regular","present":"TO EXPAND","past":"EXPANDED"},
        {"group":"Regular","present":"TO EXPLAIN","past":"EXPLAINED"},
        {"group":"Regular","present":"TO FRY","past":"FRIED"},
        {"group":"Regular","present":"TO GATHER","past":"GATHERED"},
        {"group":"Regular","present":"TO GREET","past":"GREETED"},
        {"group":"Regular","present":"TO GUESS","past":"GUESSED"},
        {"group":"Regular","present":"TO HARASS","past":"HARASSED"},
        {"group":"Regular","present":"TO HATE","past":"HATED"},
        {"group":"Regular","present":"TO HELP","past":"HELPED"},
        {"group":"Regular","present":"TO HOPE","past":"HOPED"},
        {"group":"Regular","present":"TO IDENTIFY","past":"IDENTIFIED"},
        {"group":"Regular","present":"TO INTERRUPT","past":"INTERRUPTED"},
        {"group":"Regular","present":"TO INTRODUCE","past":"INTRODUCED"},
        {"group":"Regular","present":"TO IRRITATE","past":"IRRITATED"},
        {"group":"Regular","present":"TO JOKE","past":"JOKED"},
        {"group":"Regular","present":"TO JUMP","past":"JUMPED"},
        {"group":"Regular","present":"TO KICK","past":"KICKED"},
        {"group":"Regular","present":"TO KILL","past":"KILLED"},
        {"group":"Regular","present":"TO KISS","past":"KISSED"},
        {"group":"Regular","present":"TO LAUGH","past":"LAUGHED"},
        {"group":"Regular","present":"TO LIE","past":"LIED"},
        {"group":"Regular","present":"TO LIKE","past":"LIKED"},
        {"group":"Regular","present":"TO LISTEN","past":"LISTENED"},
        {"group":"Regular","present":"TO LOVE","past":"LOVED"},
        {"group":"Regular","present":"TO MARRY","past":"MARRIED"},
        {"group":"Regular","present":"TO MEASURE","past":"MEASURED"},
        {"group":"Regular","present":"TO MOVE","past":"MOVED"},
        {"group":"Regular","present":"TO MURDER","past":"MURDERED"},
        {"group":"Regular","present":"TO NEED","past":"NEEDED"},
        {"group":"Regular","present":"TO OBEY","past":"OBEYED"},
        {"group":"Regular","present":"TO OFFEND","past":"OFFENDED"},
        {"group":"Regular","present":"TO OFFER","past":"OFFERED"},
        {"group":"Regular","present":"TO OPEN","past":"OPENED"},
        {"group":"Regular","present":"TO PAINT","past":"PAINTED"},
        {"group":"Regular","present":"TO PARK","past":"PARKED"},
        {"group":"Regular","present":"TO PHONE","past":"PHONED"},
        {"group":"Regular","present":"TO PICK","past":"PICKED"},
        {"group":"Regular","present":"TO PLAY","past":"PLAYED"},
        {"group":"Regular","present":"TO PRAY","past":"PRAYED"},
        {"group":"Regular","present":"TO PRINT","past":"PRINTED"},
        {"group":"Regular","present":"TO PULL","past":"PULLED"},
        {"group":"Regular","present":"TO PUNCH","past":"PUNCHED"},
        {"group":"Regular","present":"TO PUNISH","past":"PUNISHED"},
        {"group":"Regular","present":"TO PURCHASE","past":"PURCHASED"},
        {"group":"Regular","present":"TO PUSH","past":"PUSHED"},
        {"group":"Regular","present":"TO QUESTION","past":"QUESTIONED"},
        {"group":"Regular","present":"TO RACE","past":"RACED"},
        {"group":"Regular","present":"TO RELAX","past":"RELAXED"},
        {"group":"Regular","present":"TO REMEMBER","past":"REMEMBERED"},
        {"group":"Regular","present":"TO REPLY","past":"REPLIED"},
        {"group":"Regular","present":"TO RETIRE","past":"RETIRED"},
        {"group":"Regular","present":"TO RETURN","past":"RETURNED"},
        {"group":"Regular","present":"TO RUB","past":"RUBBED"},
        {"group":"Regular","present":"TO SCOLD","past":"SCOLDED"},
        {"group":"Regular","present":"TO SELECT","past":"SELECTED"},
        {"group":"Regular","present":"TO SMOKE","past":"SMOKED"},
        {"group":"Regular","present":"TO SNORE","past":"SNORED"},
        {"group":"Regular","present":"TO STARE","past":"STARED"},
        {"group":"Regular","present":"TO START","past":"STARTED"},
        {"group":"Regular","present":"TO STUDY","past":"STUDIED"},
        {"group":"Regular","present":"TO TALK","past":"TALKED"},
        {"group":"Regular","present":"TO THANK","past":"THANKED"},
        {"group":"Regular","present":"TO TRAVEL","past":"TRAVELLED"},
        {"group":"Regular","present":"TO TROUBLE","past":"TROUBLED"},
        {"group":"Regular","present":"TO TYPE","past":"TYPED"},
        {"group":"Regular","present":"TO USE","past":"USED"},
        {"group":"Regular","present":"TO VISIT","past":"VISITED"},
        {"group":"Regular","present":"TO WAIT","past":"WAITED"},
        {"group":"Regular","present":"TO WALK","past":"WALKED"},
        {"group":"Regular","present":"TO WANT","past":"WANTED"},
        {"group":"Regular","present":"TO WARN","past":"WARNED"},
        {"group":"Regular","present":"TO WINK","past":"WINKED"},
        {"group":"Regular","present":"TO WORRY","past":"WORRIED"},
        {"group":"Regular","present":"TO YELL","past":"YELLED"}
    ];

    let usedVerbs = [];
    let selectedGroups = [];
    let presentList = [];
    let pastAnswersList = [];
    let correctAnswersList = [];
    //let attempts = 0;
    let correctAnswers = 0;
    let partialVerbs = 1;
    let totalVerbs = 10;
    let nota = "";
    //let score = 0;

    const popupOK = document.getElementById('popupOK');
    const popupNOK = document.getElementById('popupNOK');
    const popupFinish = document.getElementById('popupFinish');

    function showPopupOK() {
        popupOK.style.display = 'block';
        setTimeout(hidePopupOK, 3000); // Oculta el popup después de 3 segundos (3000 milisegundos)
    }

    function hidePopupOK() {
        popupOK.style.display = 'none';
    }

    function showPopupNOK() {
        popupNOK.style.display = 'block';
        setTimeout(hidePopupNOK, 3000); // Oculta el popup después de 3 segundos (3000 milisegundos)
    }

    function hidePopupNOK() {
        popupNOK.style.display = 'none';
    }

    function showPopupFinish() {
        popupFinish.style.display = 'block';
        //setTimeout(hidePopupFinish, 3000); // Oculta el popup después de 3 segundos (3000 milisegundos)
    }

    function hidePopupFinish() {
        popupFinish.style.display = 'none';
    }
/*
    function getRandomVerb(selectedGroups, usedVerbs) {
      let verbsInGroups = verbs.filter(v => selectedGroups.includes(v.group));
      let randomVerb = verbsInGroups[Math.floor(Math.random() * verbsInGroups.length)];
      return randomVerb;
    }

    function getRandomVerb2(selectedGroups, usedVerbs) {
        let verbsGroups = verbs.filter(v => selectedGroups.includes(v.group));
        totalVerbs = verbsGroups.length;
        const filteredVerbs = verbsGroups.filter(v => !usedVerbs.includes(v));
        const index = Math.floor(Math.random() * filteredVerbs.length);
        if(filteredVerbs.length==0){
            return "-1"
        }
        usedVerbs.push(filteredVerbs[index]);
        return filteredVerbs[index];
    }*/

    function getRandomVerbs(selectedGroups, usedVerbs) {
        let verbsGroups = selectedGroups;
        totalVerbs = verbsGroups.length;
        const filteredVerbs = verbsGroups.filter(v => !usedVerbs.includes(v));
        const index = Math.floor(Math.random() * filteredVerbs.length);
        if(filteredVerbs.length==0){
            return "-1"
        }
        usedVerbs.push(filteredVerbs[index]);
        return filteredVerbs[index];
    }

    function getRandomGroup(groups) {
        const index = Math.floor(Math.random() * groups.length);
        return groups[index];
    }

    function getSelectedGroups() {
        const groupNames = [];
        const groups = document.querySelectorAll('input[name="group"]:checked');
        groups.forEach(group => {
            groupNames.push(group.value);
        });
        return groupNames;
    }

    function startGame() {
        document.getElementById("sinCheck").style.display = "none";
        //document.getElementById("score").style.display = "block";
        /*selectedGroups = getSelectedGroups();*/
        /*if (selectedGroups.length === 0) {
            usedVerbs = [];
            document.getElementById("sinCheck").style.display = "block";
            return;
        }*/
        document.getElementById("game").style.display = "block";
        document.getElementById("start").style.display = "none";
        document.getElementById("restart").style.display = "block";

        // N�mero de elementos a extraer de cada lista
        const numRegularVerbs = 0;
        const numIrregularVerbs = 20;
        
        // Extraer elementos al azar de las listas
        const randomRegularVerbs = extractRandomElements(regularVerbs, numRegularVerbs);
        console.log(randomRegularVerbs);
        const randomIrregularVerbs = extractRandomElements(irregularVerbs, numIrregularVerbs);
        console.log(randomIrregularVerbs);

        selectedGroups = randomRegularVerbs.concat(randomIrregularVerbs);

        // Funci�n para mezclar una lista usando el algoritmo de Fisher-Yates
        function shuffleArray(array) {
            for (let i = array.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [array[i], array[j]] = [array[j], array[i]];
            }
        }
        
        // Mezclar la lista combinada
        shuffleArray(selectedGroups);

        const presentField = document.getElementById("present");
        const descriptionField = document.getElementById("description");
        const pastField = document.getElementById("past");

        const verb = getRandomVerbs(selectedGroups,usedVerbs);
        localStorage.setItem("verb", JSON.stringify(verb));
        presentField.textContent = verb.present;
        descriptionField.textContent = verb.description;
        pastField.value = "";
        document.getElementById('correct-answers').textContent = `${partialVerbs} / ${totalVerbs}`;
        document.getElementById('correct-answers').style.display="block";
        document.getElementById("result").textContent = "";
        document.getElementById("popupResult").style.display="none";
        document.getElementById("popupResultCorrect").style.display="none";
        document.getElementById("game").classList.remove("d-none");
    }

    document.getElementById("past").addEventListener("keydown", function(event) {
        if (event.keyCode === 13) {
          event.preventDefault();
          document.getElementById("past").blur();
          nextBtn.click();
        }
      });

    function checkAnswer() {
        document.getElementById("alertInput").style.display="none";
        if (document.getElementById("past").value.trim() === "") {
            event.preventDefault();
            document.getElementById("alertInput").textContent="Please enter a text.";
            document.getElementById("alertInput").style.display="block";
            return;
          }
        const verifyBtn = document.getElementById("nextBtn");
        document.getElementById("past").focus();
        document.getElementById("viewCorrect").textContent = "";
        document.getElementById("viewCorrect").style.display = "none";
        if(partialVerbs-1>=totalVerbs){
            console.log("Siempre siempre siempre");
            showPopupFinish();
            presentList.push(verb.present.toLowerCase());
            pastAnswersList.push(pastValue);
            correctAnswersList.push(verb.past.toLowerCase());
            //attempts++;
            correctAnswers++;
            document.getElementById("finishText").style.display = "block"
            document.getElementById('status').textContent = "Correct: "+correctAnswers+" / "+totalVerbs;
            document.getElementById("status").style.display = "block";
            /*if (score === 100*totalVerbs) {
                nota = "Excellent";
            } else if (score >= 90*totalVerbs && score <= 99*totalVerbs) {
                nota = "Very Good Indeed";
            } else if (score >= 70*totalVerbs && score <= 89*totalVerbs) {
                nota = "Very Good";
            } else if (score >= 50*totalVerbs && score <= 69*totalVerbs) {
                nota = "Good";
            } else {
                nota = "Let's practice";
            }*/
            document.getElementById("finishText").textContent = nota;
            document.getElementById("game").style.display = "none";
               
            const incorrectLabel = document.getElementById("incorrect");

            for (let i = 0; i < pastAnswersList.length; i++) {
                        
                const span0 = document.createElement("span");
                span0.textContent = presentList[i].toUpperCase();
                
                const span2 = document.createElement("span");
                span2.classList.add("text-success");
                span2.textContent = correctAnswersList[i].toUpperCase();

                const span1 = document.createElement("span");
                if(pastAnswersList[i] === correctAnswersList[i]){
                    span1.classList.add("text-success");
                    incorrectLabel.appendChild(span0);
                    incorrectLabel.appendChild(document.createTextNode(" : "));
                    incorrectLabel.appendChild(span1);
                    incorrectLabel.appendChild(document.createElement("br"));
                }else{
                    span1.classList.add("text-danger");
                    incorrectLabel.appendChild(span0);
                    incorrectLabel.appendChild(document.createTextNode(" : "));
                    incorrectLabel.appendChild(span1);
                    incorrectLabel.appendChild(document.createTextNode(" - "));
                    incorrectLabel.appendChild(span2);
                    incorrectLabel.appendChild(document.createElement("br"));
                }
                span1.textContent = pastAnswersList[i].toUpperCase();
                
            }
            document.getElementById('incorrect').style.display = "block";
            
            return;
        }
        if(verifyBtn.innerText === "Check"){
            //attempts++;
            const pastField = document.getElementById("past");
            const pastValue = pastField.value.trim().toLowerCase();
            const verb = JSON.parse(localStorage.getItem("verb"));
            presentList.push(verb.present.toLowerCase());
            pastAnswersList.push(pastValue);
            correctAnswersList.push(verb.past.toLowerCase());
            if (pastValue === verb.past.toLowerCase()) {
                //attempts++;
                correctAnswers++;
                //score = score + 100;
                //document.getElementById('score').textContent = "Score: "+score;
                if(partialVerbs>=totalVerbs){
                    showPopupFinish();
                    document.getElementById('status').textContent = "Correct: "+correctAnswers+" / "+totalVerbs;
                    document.getElementById("finishText").style.display = "block";
                    document.getElementById("status").style.display = "block";
                    document.getElementById("game").display = "none";
                    pastField.classList.add("text-success");
                    pastField.value = "YOU FINISH LOCA! ;)";
                    pastField.disabled=true;
                    verifyBtn.disabled=true;
                    /*if (score === 100*totalVerbs) {
                        nota = "Excellent";
                    } else if (score >= 90*totalVerbs && score <= 99*totalVerbs) {
                        nota = "Very Good Indeed";
                    } else if (score >= 70*totalVerbs && score <= 89*totalVerbs) {
                        nota = "Very Good";
                    } else if (score >= 50*totalVerbs && score <= 69*totalVerbs) {
                        nota = "Good";
                    } else {
                        nota = "Let's practice";
                    }*/
                    document.getElementById("finishText").textContent = nota;
                    verifyBtn.display="none";
                    document.getElementById("nextBtn").display = "none";
                    document.getElementById("viewAnswer").display = "none";
                    document.getElementById("game").style.display = "none";
        
                    const incorrectLabel = document.getElementById("incorrect");
    
                    for (let i = 0; i < pastAnswersList.length; i++) {
                        
                        const span0 = document.createElement("span");
                        span0.textContent = presentList[i].toUpperCase();

                        const span2 = document.createElement("span");
                        span2.classList.add("text-success");
                        span2.textContent = correctAnswersList[i].toUpperCase();

                        const span1 = document.createElement("span");
                        if(pastAnswersList[i] === correctAnswersList[i]){
                            span1.classList.add("text-success");
                            incorrectLabel.appendChild(span0);
                            incorrectLabel.appendChild(document.createTextNode(" : "));
                            incorrectLabel.appendChild(span1);
                            incorrectLabel.appendChild(document.createElement("br"));
                        }else{
                            span1.classList.add("text-danger");
                            incorrectLabel.appendChild(span0);
                            incorrectLabel.appendChild(document.createTextNode(" : "));
                            incorrectLabel.appendChild(span1);
                            incorrectLabel.appendChild(document.createTextNode(" - "));
                            incorrectLabel.appendChild(span2);
                            incorrectLabel.appendChild(document.createElement("br"));
                        }
                        span1.textContent = pastAnswersList[i].toUpperCase();
                        
                    }
                    document.getElementById('incorrect').style.display = "block";
        
                    return;
                }
                document.getElementById("viewAnswer").style.display = "none";
                pastField.classList.add("text-success");
                pastField.classList.remove("text-danger");
                pastField.disabled = true;
                document.getElementById("result").style.display = "block"
                document.getElementById("result").textContent = "CORRECT";
                document.getElementById("result").classList.remove("alert-danger");
                document.getElementById("result").classList.add("alert-success");
                document.getElementById("popupResultCorrect").style.display="block";
                verifyBtn.disabled = false;
                verifyBtn.innerText = "Next";
                verifyBtn.classList.remove("btn-primary");
                verifyBtn.classList.add("btn-success");
                verifyBtn.focus();
            } else {
                /*if(score>=25){
                    score = score - 25;
                } else {
                    score = 0;
                }*/
                
                if(partialVerbs>=totalVerbs){
                    showPopupFinish();
                    document.getElementById('status').textContent = "Correct: "+correctAnswers+" / "+totalVerbs;
                    document.getElementById("finishText").style.display = "block";
                    document.getElementById("status").style.display = "block";
                    document.getElementById("game").display = "none";
                    pastField.classList.add("text-success");
                    pastField.value = "YOU FINISH LOCA! ;)";
                    pastField.disabled=true;
                    verifyBtn.disabled=true;
                    /*if (score === 100*totalVerbs) {
                        nota = "Excellent";
                    } else if (score >= 90*totalVerbs && score <= 99*totalVerbs) {
                        nota = "Very Good Indeed";
                    } else if (score >= 70*totalVerbs && score <= 89*totalVerbs) {
                        nota = "Very Good";
                    } else if (score >= 50*totalVerbs && score <= 69*totalVerbs) {
                        nota = "Good";
                    } else {
                        nota = "Let's practice";
                    }*/
                    document.getElementById("finishText").textContent = nota;
                    verifyBtn.display="none";
                    document.getElementById("nextBtn").display = "none";
                    document.getElementById("viewAnswer").display = "none";
                    document.getElementById("game").style.display = "none";
        
                    const incorrectLabel = document.getElementById("incorrect");
    
                    for (let i = 0; i < pastAnswersList.length; i++) {
                        
                        const span0 = document.createElement("span");
                        span0.textContent = presentList[i].toUpperCase();

                        const span2 = document.createElement("span");
                        span2.classList.add("text-success");
                        span2.textContent = correctAnswersList[i].toUpperCase();

                        const span1 = document.createElement("span");
                        if(pastAnswersList[i] === correctAnswersList[i]){
                            span1.classList.add("text-success");
                            incorrectLabel.appendChild(span0);
                            incorrectLabel.appendChild(document.createTextNode(" : "));
                            incorrectLabel.appendChild(span1);
                            incorrectLabel.appendChild(document.createElement("br"));
                        }else{
                            span1.classList.add("text-danger");
                            span1.classList.add("text-success");
                            incorrectLabel.appendChild(span0);
                            incorrectLabel.appendChild(document.createTextNode(" : "));
                            incorrectLabel.appendChild(span1);
                            incorrectLabel.appendChild(document.createTextNode(" - "));
                            incorrectLabel.appendChild(span2);
                            incorrectLabel.appendChild(document.createElement("br"));
                        }
                        span1.textContent = pastAnswersList[i].toUpperCase();
                        
                    }
                    document.getElementById('incorrect').style.display = "block";
        
                    return;
                }

                document.getElementById("viewAnswer").style.display = "none";
                pastField.classList.remove("text-success");
                pastField.classList.add("text-danger");                
                document.getElementById("viewCorrect").textContent = verb.past.toUpperCase();
                document.getElementById("viewCorrect").style.display = "block";
                pastField.disabled = true;
                document.getElementById("result").style.display = "block"
                document.getElementById("result").textContent = "UPS... INCORRECT";
                document.getElementById("result").classList.remove("alert-success");
                document.getElementById("result").classList.add("alert-danger");
                document.getElementById("popupResult").style.display="block";
                document.getElementById("popupResultCorrect").style.display="none";
                verifyBtn.disabled = false;
                verifyBtn.innerText = "Next";
                verifyBtn.classList.remove("btn-primary");
                verifyBtn.classList.add("btn-success");
                verifyBtn.focus();
            }
        } else {
            const pastField = document.getElementById("past");
            const presentField = document.getElementById("present");
            const descriptionField = document.getElementById("description");
            partialVerbs++;
            document.getElementById("result").classList.remove("alert-danger");
            document.getElementById("result").classList.remove("alert-success");
            document.getElementById("result").style.display = "none"
            document.getElementById("viewAnswer").style.display = "none";
            document.getElementById("popupResult").style.display="none";
            document.getElementById("popupResultCorrect").style.display="none";
            pastField.classList.remove("text-danger");
            pastField.classList.remove("text-success");
            verifyBtn.innerText = "Check";
            verifyBtn.classList.remove("btn-success");
            verifyBtn.classList.add("btn-primary");
            pastField.value="";
            
            const verb = getRandomVerbs(selectedGroups,usedVerbs);
           
            pastField.disabled = false;
            pastField.focus();
            localStorage.setItem("verb", JSON.stringify(verb));
            presentField.textContent = verb.present;
            descriptionField.textContent = verb.description;
            pastField.value = "";
            document.getElementById("result").textContent = "";
            document.getElementById("popupResult").style.display="none";
            document.getElementById("popupResultCorrect").style.display="none";
        }
        document.getElementById('correct-answers').textContent = `${partialVerbs} / ${totalVerbs}`;
    }

    function viewAnswer(){
        document.getElementById("viewAnswer").style.display = "none";
        document.getElementById("result").style.display = "none"
        document.getElementById("popupResult").style.display="none";
        document.getElementById("popupResultCorrect").style.display="none";
        const verifyBtn = document.getElementById("nextBtn");
        const verb = JSON.parse(localStorage.getItem("verb"));
        const pastField = document.getElementById("past");
        pastField.classList.add("text-success");
        pastField.classList.remove("text-danger");
        pastField.value = verb.past
        verifyBtn.disabled = false;
        verifyBtn.innerText = "Next";
        verifyBtn.classList.remove("btn-success");
        verifyBtn.classList.add("btn-primary");
    }

    function extractRandomElements(arr, numElements) {
        const result = [];
        while (result.length < numElements && arr.length > 0) {
          const randomIndex = Math.floor(Math.random() * arr.length);
          result.push(arr.splice(randomIndex, 1)[0]);
        }
        return result;
    }