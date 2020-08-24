window.addEventListener("load", sidenVises);


//////////////////////////////////////
// Utilities

function randomNumber(min, max) {
    return Math.floor(Math.random() * (max - min + 1)) + min;
}

function randomElement(arr) {
    return arr[Math.floor(Math.random() * arr.length)];
}

let points = 0;
let lives = 3;


//////////////////////////////////////
// Font scaling

document.body.setScaledFont = function(f) {
    var s = document.querySelector("#screen").offsetWidth;
    console.log(s);
    var fs = s * f;
    this.style.fontSize = fs + '%';
    return this
};

document.body.setScaledFont(0.12);
window.onresize = function() {
    document.body.setScaledFont(0.12);
};


//////////////////////////////////
// Const

const Timer = {
    _timer: null,
    _callback: null,
    seconds: 0,
    start: function (duration, tick, done) {
        console.log('Starting timer: ' + duration);
        Timer.seconds = duration;
        Timer._callback = done || null;
        Timer._timer = setInterval(function () {
            //console.log(Timer.seconds + (Timer.seconds % 2 ? ' Tick' : ' Tock'));
            tick && tick();
            Timer.seconds--;
            if (Timer.seconds < 0) {
                // Store callback as a varaible because we need to call it after stopping the timer
                let callback = Timer._callback;
                Timer.stop();
                callback && callback();
            }
        }, 1000);
    },
    stop: function () {
        clearInterval(Timer._timer);
        Timer._timer = null;
        Timer._callback = null;
    },
    prettyTime: function (sec) {
        // Show seconds as mm:ss
        // @see https://stackoverflow.com/a/26206645
        const minutes = '0' + Math.floor(sec / 60);
        const seconds = '0' + (sec - minutes * 60);
        return minutes.substr(-2) + ':' + seconds.substr(-2);
    }
};

const ScreenPoints = {
    /** @type Element */
    pointsGameScreen: document.querySelector(".points"),
    /** @type Element */
    pointsLevelComplete: document.querySelector(".points_level_complete"),
    /** @type Element */
    pointsGameOver: document.querySelector(".points_game_over"),
    update: function (points) {
        ScreenPoints.pointsGameScreen.textContent = points;
        ScreenPoints.pointsLevelComplete.textContent = points;
        ScreenPoints.pointsGameOver.textContent = points;
    }
};

const Music = {
    enabled: true,
    toggle: function () {
        if (Music.enabled) {
            Music.enabled = false;
            console.log("Music is disabled");
            document.querySelector("#lullaby").pause();
        } else {
            Music.enabled = true;
            console.log("Music is enabled");
            document.querySelector("#lullaby").play();
            document.querySelector("#lullaby").volume=0.3;
        }
    },
    playSidenVises: function () {
        if (Effects.enabled) {
            document.querySelector("#lullaby").play();
            document.querySelector("#lullaby").volume=0.3;
        }
    },
};

const Effects = {
    enabled: true,
    toggle: function () {
        if (Effects.enabled) {
            Effects.enabled = false;
            console.log("Effects is disabled");
        } else {
            Effects.enabled = true;
            console.log("Effects is enabled");
        }
    },
    playGameLoaded: function () {
        if (Effects.enabled) {
            setTimeout(function () {
                document.querySelector("#mouse_sound").play();
            }, 1000);
        }
    },
    playbuttonclick: function () {
        if (Effects.enabled) {
            document.querySelector("#button_sound").currentTime = 0;
            document.querySelector("#button_sound").play();
        }
    },
    playShortTrumpet: function () {
        if (Effects.enabled) {
            document.querySelector("#button_sound").currentTime = 0;
            document.querySelector("#trumpet").play();
        }
    },
    playLongTrumpet: function () {
        if (Effects.enabled) {
            document.querySelector("#trumpet_long").play();
        }
    },
    playPositiveClick: function () {
        if (Effects.enabled) {
            document.querySelector("#positive_sound").currentTime = 0;
            document.querySelector("#positive_sound").play();
        }
    },
    playLevelComplete: function () {
        if (Effects.enabled) {
            document.querySelector("#levelcomplete_sound").play();
            Game.elephant.e_awake_happy();
        }
    }
};

const Screen = {
    /** @type Element */
    element: document.querySelector('#screen'),
    hide: function () {
        Screen.element.classList.add("fade_out");
        Screen.element.addEventListener("animationend", function _listener() {
            Screen.element.classList.add("hidden");
            Screen.element.removeEventListener("animationend", _listener);
        });

    }
};

const MenuBackground = {
    /** @type Element */
    element: document.querySelector('#menu_background'),
    show: function () {
        MenuBackground.element.classList.remove('hidden');
        MenuBackground.element.classList.remove('fade_out');
        MenuBackground.element.classList.add('fade_in');
    },
    hide: function (next) {
        MenuBackground.element.classList.remove('fade_in');
        MenuBackground.element.classList.add('fade_out');
        MenuBackground.element.addEventListener('animationend', function _listener() {
            MenuBackground.element.classList.add('hidden');
            MenuBackground.element.removeEventListener('animationend', _listener);
            next && next();
        });
    }
};

const Start = {
    scene: {
        /** @type Element */
        element: document.querySelector('#start'),
        show: function () {
            Start.scene.element.classList.remove('hidden');
            Start.scene.element.classList.remove('fade_out');
            Start.scene.element.classList.add('fade_in');
        },
        hide: function (next) {
            Start.scene.element.classList.remove('fade_in');
            Start.scene.element.classList.add('fade_out');
            Start.scene.element.addEventListener('animationend', function _listener() {
                Start.scene.element.classList.add('hidden');
                Start.scene.element.removeEventListener('animationend', _listener);
                next && next();
            });
        }
    },
    playButton: {
        /** @type Element */
        element: document.querySelector('.button_play'),
        onClick: function () {
            hideStart(MenuBackground.hide(showGame));
            Effects.playbuttonclick();
        },
        show: function () {
            Start.playButton.element.classList.add('pulse');
            Start.playButton.element.addEventListener('click', Start.playButton.onClick);
        },
        hide: function () {
            Start.playButton.element.classList.remove('pulse');
            Start.playButton.element.removeEventListener('click', Start.playButton.onClick);
        }
    },
    settingsButton: {
        /** @type Element */
        element: document.querySelector('.button_settings'),
        onClick: function () {
            hideStart(showSettings);
            Effects.playbuttonclick();
        },
        show: function () {
            Start.settingsButton.element.classList.add('pulse');
            Start.settingsButton.element.addEventListener('click', Start.settingsButton.onClick);
        },
        hide: function () {
            Start.settingsButton.element.classList.remove('pulse');
            Start.settingsButton.element.removeEventListener('click', Start.settingsButton.onClick);
        }
    },
    quitButton: {
        /** @type Element */
        element: document.querySelector('.button_quit'),
        onClick: function () {
            quitGame();
            Effects.playbuttonclick();
        },
        show: function () {
            Start.quitButton.element.classList.add('pulse');
            Start.quitButton.element.addEventListener('click', Start.quitButton.onClick);
        },
        hide: function () {
            Start.quitButton.element.classList.remove('pulse');
            Start.quitButton.element.removeEventListener('click', Start.quitButton.onClick);
        }
    }
};

const Settings = {
    scene: {
        /** @type Element */
        element: document.querySelector('#settings'),
        show: function () {
            Settings.scene.element.classList.remove('hidden');
            Settings.scene.element.classList.remove('fade_out');
            Settings.scene.element.classList.add('fade_in');
        },
        hide: function (next) {
            Settings.scene.element.classList.remove('fade_in');
            Settings.scene.element.classList.add('fade_out');
            Settings.scene.element.addEventListener('animationend', function _listener() {
                Settings.scene.element.classList.add('hidden');
                Settings.scene.element.removeEventListener('animationend', _listener);
                next && next();
            });
        }
    },
    musicButton: {
        /** @type Element */
        element: document.querySelector('.button_music'),
        onClick: function () {
            console.log('Toggle musicButton');
            Music.toggle();
            Settings.musicButton.update();
            Effects.playbuttonclick();
        },
        update: function () {
            if (Music.enabled) {
                Settings.musicButton.element.classList.add("unmuted");
                Settings.musicButton.element.classList.remove("muted");
            } else {
                Settings.musicButton.element.classList.remove("unmuted");
                Settings.musicButton.element.classList.add("muted");
            }
        },
        show: function () {
            Settings.musicButton.update();
            Settings.musicButton.element.classList.add('pulse');
            Settings.musicButton.element.addEventListener('click', Settings.musicButton.onClick);
        },
        hide: function () {
            Settings.musicButton.element.classList.remove('pulse');
            Settings.musicButton.element.removeEventListener('click', Settings.musicButton.onClick);
        }
    },
    effectsButton: {
        /** @type Element */
        element: document.querySelector('.button_effects'),
        onClick: function () {
            console.log('Toggle effectsButton');
            Effects.toggle();
            Settings.effectsButton.update();
            Effects.playbuttonclick();
        },
        update: function () {
            if (Effects.enabled) {
                Settings.effectsButton.element.classList.add("unmuted");
                Settings.effectsButton.element.classList.remove("muted");
            } else {
                Settings.effectsButton.element.classList.remove("unmuted");
                Settings.effectsButton.element.classList.add("muted");
            }
        },
        show: function () {
            Settings.effectsButton.update();
            Settings.effectsButton.element.classList.add('pulse');
            Settings.effectsButton.element.addEventListener('click', Settings.effectsButton.onClick);
        },
        hide: function () {
            Settings.effectsButton.element.classList.remove('pulse');
            Settings.effectsButton.element.removeEventListener('click', Settings.effectsButton.onClick);
        }
    },
    backButton: {
        /** @type Element */
        element: document.querySelector('.button_back'),
        onClick: function () {
            hideSettings(showStart);
            Effects.playbuttonclick();
        },
        show: function () {
            Settings.backButton.element.classList.add('pulse');
            Settings.backButton.element.addEventListener('click', Settings.backButton.onClick);
        },
        hide: function () {
            Settings.backButton.element.classList.remove('pulse');
            Settings.backButton.element.removeEventListener('click', Settings.backButton.onClick);
        }
    }
};

const Game = {
    scene: {
        /** @type Element */
        element: document.querySelector('#game'),
        time: 30,
        show: function () {
            lives = 3;
            points = 0;
            ScreenPoints.update(points);
            document.querySelector('#timer').textContent = Timer.prettyTime(Game.scene.time);
            document.querySelector("#thoughts").classList.remove("hidden");
            Game.scene.element.classList.remove('hidden');
            Game.scene.element.classList.remove('fade_out');
            Game.scene.element.classList.add('fade_in');
            Effects.playGameLoaded();
            Dreams.shuffle();
            document.querySelector(".dreams").addEventListener('animationend', function _listener() {
                Dreams.enable();
                Timer.start(
                    Game.scene.time,
                    function () {
                        // console.log('Tick: ' + Timer.prettyTime(Timer.seconds));
                        document.querySelector('#timer').textContent = Timer.prettyTime(Timer.seconds);
                    },
                    function () {
                        levelComplete();
                    }
                );
                document.querySelector(".dreams").removeEventListener('animationend', _listener);
            });
        },
        hide: function (next) {
            Game.scene.element.classList.remove('fade_in');
            Game.scene.element.classList.add('fade_out_slow');
            next && next();
        }
    },
    elephant: {
        /** @type Element */
        element: document.querySelector('#elephant'),
        show: function () {
            Game.elephant.element.classList.remove("e_awake_happy");
            Game.elephant.element.classList.remove("e_awake_unhappy");
            Game.elephant.element.classList.remove("e_asleep_unhappy");
            Game.elephant.element.classList.remove("e_asleep_happy");
            Game.elephant.element.classList.add("e_asleep_neutral");
        },
        hide: function () {
            Game.elephant.element.removeEventListener("click", Game.elephant.onClick);
            Game.elephant.element.classList.remove("pointer");
        },
        e_asleep_neutral: function () {
            Game.elephant.element.classList.remove("e_asleep_unhappy");
            Game.elephant.element.classList.remove("e_asleep_happy");
            Game.elephant.element.classList.remove("e_awake_happy");
            Game.elephant.element.classList.remove("e_awake_unhappy");
            Game.elephant.element.classList.add("e_asleep_neutral");
        },
        e_asleep_happy: function () {
            Game.elephant.element.classList.remove("e_asleep_unhappy");
            Game.elephant.element.classList.remove("e_awake_happy");
            Game.elephant.element.classList.remove("e_awake_unhappy");
            Game.elephant.element.classList.remove("e_asleep_neutral");
            Game.elephant.element.classList.add("e_asleep_happy");
        },
        e_asleep_unhappy: function () {
            Game.elephant.element.classList.remove("e_awake_happy");
            Game.elephant.element.classList.remove("e_awake_unhappy");
            Game.elephant.element.classList.remove("e_asleep_neutral");
            Game.elephant.element.classList.remove("e_asleep_happy");
            Game.elephant.element.classList.add("e_asleep_unhappy");
        },
        e_awake_happy: function () {
            Game.elephant.element.classList.remove("e_awake_unhappy");
            Game.elephant.element.classList.remove("e_asleep_neutral");
            Game.elephant.element.classList.remove("e_asleep_happy");
            Game.elephant.element.classList.remove("e_asleep_unhappy");
            Game.elephant.element.classList.add("e_awake_happy");
        },
        e_awake_unhappy: function () {
            Game.elephant.element.classList.remove("e_asleep_neutral");
            Game.elephant.element.classList.remove("e_asleep_happy");
            Game.elephant.element.classList.remove("e_asleep_unhappy");
            Game.elephant.element.classList.remove("e_awake_happy");
            Game.elephant.element.classList.add("e_awake_unhappy");
        }
    },
    energy: {
        show: function () {
            Game.energy_0.show();
            Game.energy_1.show();
            Game.energy_2.show();
        },
        hide: function () {
            Game.energy_0.hide();
            Game.energy_1.hide();
            Game.energy_2.hide();
        }
    },
    energy_0: {
        /** @type Element */
        element: document.querySelector('#energy_0'),
        show: function () {
            Game.energy_0.element.classList.remove("hidden");
            Game.energy_0.element.classList.remove("fade_out");
            Game.energy_0.element.classList.add("fade_in");
            Game.energy_0.element.addEventListener("animationend", function _listener () {
                Game.energy_0.element.classList.remove("fade_in");
                Game.energy_0.element.removeEventListener("animationend", _listener);
            });
        },
        hide: function () {
            Game.energy_0.element.classList.remove("fade_in");
            Game.energy_0.element.classList.add("hidden");
        }
    },
    energy_1: {
        /** @type Element */
        element: document.querySelector('#energy_1'),
        show: function () {
            Game.energy_1.element.classList.remove("hidden");
            Game.energy_1.element.classList.remove("fade_out");
            Game.energy_1.element.classList.add("fade_in");
            Game.energy_1.element.addEventListener("animationend", function _listener () {
                Game.energy_1.element.classList.remove("fade_in");
                Game.energy_1.element.removeEventListener("animationend", _listener);
            });
        },
        hide: function () {
            Game.energy_1.element.classList.remove("fade_in");
            Game.energy_1.element.classList.add("hidden");
        }
    },
    energy_2: {
        /** @type Element */
        element: document.querySelector('#energy_2'),
        show: function () {
            Game.energy_2.element.classList.remove("hidden");
            Game.energy_2.element.classList.remove("fade_out");
            Game.energy_2.element.classList.add("fade_in");
            Game.energy_2.element.addEventListener("animationend", function _listener () {
                Game.energy_2.element.classList.remove("fade_in");
                Game.energy_2.element.removeEventListener("animationend", _listener);
            });
        },
        hide: function () {
            Game.energy_2.element.classList.remove("fade_in");
            Game.energy_2.element.classList.add("hidden");
        }
    }
};

const Dreams = {
    dream1: {
        /** @type Element */
        element: document.querySelector('#dream_1'),
        type: 'carrot',
    },
    dream2: {
        /** @type Element */
        element: document.querySelector('#dream_2'),
        type: 'carrot',
    },
    dream3: {
        /** @type Element */
        element: document.querySelector('#dream_3'),
        type: 'carrot',
    },
    types: {
        good: ['carrot', 'lollipop', 'sun'],
        bad: ['mouse'],
    },
    onGoodClick: function () {
        clickPositive();
        Dreams.shuffle();
        Dreams.enable();
    },
    onBadClick: function () {
        Game.scene.element.classList.add("locked");
        clickMouse();
        Dreams.reset();
        setTimeout(function () {
            Dreams.shuffle();
            Dreams.enable();
            }, 2000);

    },
    _getClickEventForType: function (type) {
        if (Dreams.types.good.includes(type)) {
            return Dreams.onGoodClick;
        }
        return Dreams.onBadClick;
    },
    _getType: function (isGood) {
        if (isGood) {
            return randomElement(Dreams.types.good);
        }
        return randomElement(Dreams.types.bad);
    },
    shuffle: function () {
        Game.scene.element.classList.remove("locked");
        Dreams.reset();
        // Get a random number to randomly pick a dream to be the bad one
        let bad = randomNumber(1, 3);
        Dreams.dream1.type = Dreams._getType(1 !== bad);
        Dreams.dream2.type = Dreams._getType(2 !== bad);
        Dreams.dream3.type = Dreams._getType(3 !== bad);

        Dreams.dream1.element.classList.add(Dreams.dream1.type);
        Dreams.dream2.element.classList.add(Dreams.dream2.type);
        Dreams.dream3.element.classList.add(Dreams.dream3.type);
    },
    enable: function () {
        Dreams.dream1.element.addEventListener("click", Dreams._getClickEventForType(Dreams.dream1.type));
        Dreams.dream1.element.classList.add('pointer');

        Dreams.dream2.element.addEventListener("click", Dreams._getClickEventForType(Dreams.dream2.type));
        Dreams.dream2.element.classList.add('pointer');

        Dreams.dream3.element.addEventListener("click", Dreams._getClickEventForType(Dreams.dream3.type));
        Dreams.dream3.element.classList.add('pointer');
    },
    reset: function () {
        Dreams.dream1.element.removeEventListener("click", Dreams._getClickEventForType(Dreams.dream1.type));
        Dreams.dream1.element.classList.remove(Dreams.dream1.type);
        Dreams.dream1.element.classList.remove('pointer');

        Dreams.dream2.element.removeEventListener("click", Dreams._getClickEventForType(Dreams.dream2.type));
        Dreams.dream2.element.classList.remove(Dreams.dream2.type);
        Dreams.dream2.element.classList.remove('pointer');

        Dreams.dream3.element.removeEventListener("click", Dreams._getClickEventForType(Dreams.dream3.type));
        Dreams.dream3.element.classList.remove(Dreams.dream3.type);
        Dreams.dream3.element.classList.remove('pointer');
    }
};

const LevelComplete = {
    scene: {
        /** @type Element */
        element: document.querySelector('#levelcomplete'),
        show: function () {
            LevelComplete.scene.element.classList.remove('hidden');
            LevelComplete.scene.element.classList.remove('fade_out');
            LevelComplete.scene.element.classList.add('fade_in_slow');
            Effects.playLevelComplete();
        },
        hide: function (next) {
            LevelComplete.scene.element.classList.remove('fade_in');
            LevelComplete.scene.element.classList.add('fade_out');
            LevelComplete.scene.element.classList.add("hidden");
            next && next();

        }
    },
    quitButton: {
        /** @type Element */
        element: document.querySelector('.levelcomplete_button_quit'),
        onClick: function () {
            quitGame();
            Effects.playbuttonclick();
        },
        show: function () {
            LevelComplete.quitButton.element.classList.add('pulse');
            LevelComplete.quitButton.element.addEventListener('click', LevelComplete.quitButton.onClick);
        },
        hide: function () {
            LevelComplete.quitButton.element.classList.remove('pulse');
            LevelComplete.quitButton.element.removeEventListener('click', LevelComplete.quitButton.onClick);
        }
    },
    playAgainButton: {
        /** @type Element */
        element: document.querySelector('.levelcomplete_button_play_again'),
        onClick: function () {
            console.log("Play again");
            hideLevelComplete(showStart);
            MenuBackground.show();
            Effects.playbuttonclick();
        },
        show: function () {
            LevelComplete.playAgainButton.element.classList.add('pulse');
            LevelComplete.playAgainButton.element.addEventListener('click', LevelComplete.playAgainButton.onClick);
        },
        hide: function () {
            LevelComplete.playAgainButton.element.classList.remove('pulse');
            LevelComplete.playAgainButton.element.removeEventListener('click', LevelComplete.playAgainButton.onClick);
        }
    }
};

const GameOver = {
    scene: {
        /** @type Element */
        element: document.querySelector('#gameover'),
        show: function () {
            GameOver.scene.element.classList.remove('hidden');
            GameOver.scene.element.classList.remove('fade_out');
            GameOver.scene.element.classList.add('fade_in_slow');
        },
        hide: function (next) {
            GameOver.scene.element.classList.remove('fade_in');
            GameOver.scene.element.classList.add("fade_out");
            GameOver.scene.element.classList.add("hidden");
            next && next();
            // GameOver.scene.element.addEventListener('animationend', function _listener() {
            //     GameOver.scene.element.classList.add('hidden');
            //     GameOver.scene.element.removeEventListener('animationend', _listener);
            //     next && next();
            // });
        }
    },
    quitButton: {
        /** @type Element */
        element: document.querySelector('.gameover_button_quit'),
        onClick: function () {
            console.log('Quit the game');
            quitGame();
            Effects.playbuttonclick();
        },
        show: function () {
            GameOver.quitButton.element.classList.add('pulse');
            GameOver.quitButton.element.addEventListener('click', GameOver.quitButton.onClick);
        },
        hide: function () {
            GameOver.quitButton.element.classList.remove('pulse');
            GameOver.quitButton.element.removeEventListener('click', GameOver.quitButton.onClick);
        }
    },
    playAgainButton: {
        /** @type Element */
        element: document.querySelector('.gameover_button_play_again'),
        onClick: function () {
            console.log("Play again");
            hideGameOver(showStart);
            MenuBackground.show();
            Effects.playbuttonclick();
        },
        show: function () {
            GameOver.playAgainButton.element.classList.add('pulse');
            GameOver.playAgainButton.element.addEventListener('click', GameOver.playAgainButton.onClick);
        },
        hide: function () {
            GameOver.playAgainButton.element.classList.remove('pulse');
            GameOver.playAgainButton.element.removeEventListener('click', GameOver.playAgainButton.onClick);
        }
    }
};

//////////////////////////////////
// Start scene

function sidenVises() {
    showStart();
    document.querySelector("#lullaby").volume = 0.6;
}

function showStart() {
    Game.scene.element.classList.add('hidden');
    Start.scene.show();
    Start.playButton.show();
    Start.settingsButton.show();
    Start.quitButton.show();
}

function hideStart(next) {
    Start.playButton.hide();
    Start.settingsButton.hide();
    Start.quitButton.hide();
    Start.scene.hide(next);
}

//////////////////////////////////
// Settings scene

function showSettings() {
    Settings.scene.show();
    Settings.musicButton.show();
    Settings.effectsButton.show();
    Settings.backButton.show();
}

function hideSettings(next) {
    Settings.musicButton.hide();
    Settings.effectsButton.hide();
    Settings.backButton.hide();
    Settings.scene.hide(next);
}

//////////////////////////////////
// Game scene

function showGame() {
    Game.scene.show();
    Game.elephant.show();
    Game.energy.show();
}

//////////////////////////////////
// End screens

function gameOver() {
    Game.scene.hide();
    Game.energy.hide();
    Dreams.reset();
    GameOver.scene.show();
    GameOver.quitButton.show();
    GameOver.playAgainButton.show();
    Timer.stop();
}

function hideGameOver(next) {
    GameOver.playAgainButton.hide();
    GameOver.quitButton.hide();
    GameOver.scene.hide(next);
}

function levelComplete() {
    Game.scene.hide();
    Game.energy.hide();
    Dreams.reset();
    document.querySelector("#thoughts").classList.add("hidden");
    LevelComplete.scene.show();
    LevelComplete.quitButton.show();
    LevelComplete.playAgainButton.show();
    Timer.stop();
}

function hideLevelComplete(next) {
    LevelComplete.playAgainButton.hide();
    LevelComplete.quitButton.hide();
    LevelComplete.scene.hide(next);
}

//////////////////////////////////
// Quit game

function quitGame() {
    console.log("Quitting the game");
    Screen.hide();
    document.querySelector("#lullaby").pause();

}

//////////////////////////////////
// Click functions

function clickPositive() {
    points++;
    ScreenPoints.update(points);
    Game.elephant.e_asleep_happy();
    clearElephantTimer();
    setElephantTimer();
    Effects.playPositiveClick();
}

function clickMouse() {
    clearElephantTimer();
    lives--;
    console.log("Lives:" + lives);
    let currentEnergy = "#energy_" + lives;
    document.querySelector(currentEnergy).classList.add("fade_out");
    if (lives === 0) {
        gameOver();
        Effects.playLongTrumpet();
        Game.elephant.e_awake_unhappy();
    }
    else if (lives !== 0) {
        Effects.playShortTrumpet();
        Game.elephant.e_asleep_unhappy();
        setTimeout(Game.elephant.e_asleep_neutral, 2000);
    }
}

//////////////////////////////////
// Elephant timer

var elephantTimer;

function setElephantTimer() {
    elephantTimer = setTimeout (Game.elephant.e_asleep_neutral, 2000);
}

function clearElephantTimer() {
    clearTimeout(elephantTimer);
}
