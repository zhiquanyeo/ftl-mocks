window.addEventListener('load', function () {
    
var ledYellow = document.getElementById('led-yellow');
var ledRed = document.getElementById('led-red');
var ledGreen = document.getElementById('led-green');

var buttonA = document.getElementById('button-a');
var buttonB = document.getElementById('button-b');
var buttonC = document.getElementById('button-c');

var motor1Speed = document.getElementById('motor-1-speed');
var motor2Speed = document.getElementById('motor-2-speed');
var motor1Positive = document.getElementById('motor-1-positive');
var motor1Negative = document.getElementById('motor-1-negative');
var motor2Positive = document.getElementById('motor-2-positive');
var motor2Negative = document.getElementById('motor-2-negative');

var motorElements = [
    {
        speed: motor1Speed,
        positive: motor1Positive,
        negative: motor1Negative
    },
    {
        speed: motor2Speed,
        positive: motor2Positive,
        negative: motor2Negative
    },
]

buttonA.addEventListener('click', onButtonClicked.bind(null, 'buttonA'));
buttonB.addEventListener('click', onButtonClicked.bind(null, 'buttonB'));
buttonC.addEventListener('click', onButtonClicked.bind(null, 'buttonC'));

var buttonStates = {
    buttonA: false,
    buttonB: false,
    buttonC: false,
};

var aInputs = [
    0.0,
    0.0,
    0.0,
    0.0,
    0.0,
    0,0
];

var leds = {
    red: false,
    green: false,
    yellow: false,
};

var m1Value = 0.0;
var m2Value = 0.0;

var socket = io();

// === Initialization Code
updateState();

socket.on('stateUpdate', function (state) {
    leds.red = state.leds.red;
    leds.green = state.leds.green;
    leds.yellow = state.leds.yellow;

    m1Value = state.motors[0];
    m2Value = state.motors[1];

    buttonStates.buttonA = state.buttons.buttonA;
    buttonStates.buttonB = state.buttons.buttonB;
    buttonStates.buttonC = state.buttons.buttonC;
    
    updateState();
});
// === End Initialization Code


// === Helper functions ===
function updateState() {
    if (leds.red) {
        ledRed.classList.add('on');
    }
    else {
        ledRed.classList.remove('on');
    }

    if (leds.yellow) {
        ledYellow.classList.add('on');
    }
    else {
        ledYellow.classList.remove('on');
    }

    if (leds.green) {
        ledGreen.classList.add('on');
    }
    else {
        ledGreen.classList.remove('on');
    }

    updateMotor(0, m1Value);
    updateMotor(1, m2Value);

    if (buttonStates.buttonA) {
        buttonA.classList.add('pressed');
    }
    else {
        buttonA.classList.remove('pressed');
    }

    if (buttonStates.buttonB) {
        buttonB.classList.add('pressed');
    }
    else {
        buttonB.classList.remove('pressed');
    }

    if (buttonStates.buttonC) {
        buttonC.classList.add('pressed');
    }
    else {
        buttonC.classList.remove('pressed');
    }
}

function onButtonClicked(button) {
    buttonStates[button] = !buttonStates[button];

    // buttonA, buttonB, buttonC
    socket.emit('buttonChanged', {
        button: button,
        value: buttonStates[button]
    });

    updateState();
}

function onEntryChanged(idx, event) {
    var newVal = entries[idx].value;
    if (!newVal) {
        newVal = 0;
        entries[idx].value = 0;
    }

    dataBuf[idx] = newVal;
    socket.emit('byteChanged', {
        idx: idx,
        newVal: newVal
    });

    console.log('byte ' + idx + ' changed to: ' + newVal)
}

function updateMotor(motorNum, speed) {
    if (motorNum < 0 || motorNum > 1) return;
    // Make sure the speed is -400 to 400
    if (speed < -400) {
        speed = -400;
    }
    if (speed > 400) {
        speed = 400;
    }

    var elements = motorElements[motorNum];
    elements.speed.innerHTML = speed;

    elements.positive.style.width = '0px';
    elements.negative.style.width = '0px';

    var width;
    if (speed > 0) {
        width = (speed / 400) * 250;
        elements.positive.style.width = width + 'px';
    }
    else if (speed < 0) {
        width = (-speed / 400) * 250;
        elements.negative.style.width = width + 'px';
    }
}

});