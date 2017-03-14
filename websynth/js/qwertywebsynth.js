 //Variable for responsive size of keyboard
        var keyOctave;
        var keyWidth;
        var keyHeight

        var mediaScreen = window.matchMedia("(min-width: 600px)");
        if (mediaScreen.matches) {
            keyOctave = 2;
            keyWidth = 960;
            keyHeight = 192;
        } else {
            keyOctave = 1;
            keyWidth = 360;
            keyHeight = 100;
        }

        //Code for making QwertyKeyboard
        var keyboard = new QwertyHancock({
            id: 'keyboardQwerty',
            width: keyWidth,
            height: keyHeight,
            octaves: keyOctave,
            startNote: 'C3',
            whiteNotesColour: 'white',
            blackNotesColour: 'black',
            activeColour: '#357',
        });

        //Start context for Webaudio and create gain
        var audioCtx = new(window.AudioContext || window.webkitAudioContext)();
        var gainNode = audioCtx.createGain();
        var oscillators = {};
        //set value for gainNode which is like a volume level
        gainNode.gain.value = 0.5;

        keyboard.keyDown = function (note, frequency) {

            var oscillator1 = audioCtx.createOscillator();
            oscillator1.frequency.value = frequency;
            oscillator1.type = oscType1;
            oscillator1.detune.value = dial1.val.value;


            var oscillator2 = audioCtx.createOscillator();
            oscillator2.frequency.value = frequency;
            oscillator2.type = oscType2;
            oscillator2.detune.value = dial2.val.value;

            oscillator1.connect(gainNode);
            oscillator2.connect(gainNode);

            gainNode.connect(audioCtx.destination);

            oscillators[frequency] = [oscillator1, oscillator2];

            oscillator1.start(audioCtx.currentTime);
            oscillator2.start(audioCtx.currentTime);
        };

        keyboard.keyUp = function (note, frequency) {
            oscillators[frequency].forEach(function (oscillator) {
                oscillator.stop(audioCtx.currentTime);
            });
        };

        //Variables for Oscillator types
        var oscType1 = document.getElementById("oscillator1Type").value;
        var oscType2 = document.getElementById("oscillator2Type").value;

        //Functions for selectors for changing Oscillator types. 
        function selectOsc1(osc1) {
            oscType1 = osc1;
        }

        function selectOsc2(osc2) {
            oscType2 = osc2;
        }

        var orgDataValue
            //Start Nexus UI
        nx.onload = function () {

            //Setting up specifications the first dial 
            dial1.min = -20;
            dial1.max = 20;
            dial1.responsivity = 0.025;

            //Setting up specifications the second dial 
            dial2.min = -20;
            dial2.max = 20;
            dial2.responsivity = 0.025;

            //Specifying the colors which will be used for Nexus UI
            nx.colorize("accent", "#347");
            nx.colorize("border", "#333");
            nx.colorize("fill", "#fff");
        }