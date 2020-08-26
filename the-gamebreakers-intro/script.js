"use strict";

document.addEventListener("DOMContentLoaded", fetchFiles);
const video_container = document.querySelector(".video_container");
const text_content = document.querySelector(".text_content");

let index = 0;

let camillaVideo;
let julieVideo;
let logo;
let camilla;
let julie;

let musicVolume = 1;


// Font scaling function from:
// https://stackoverflow.com/questions/16056591/font-scaling-based-on-width-of-container/20968345#20968345
document.body.setScaledFont = function (f) {
    var s = this.offsetWidth, fs = s * f;
    this.style.fontSize = fs + '%';
    return this
};

document.body.setScaledFont(0.12);
window.onresize = function () {
    document.body.setScaledFont(0.12);
};

function fetchFiles() {

    const camillaVideoSVG = fetch("elements/video1.svg").then(r => r.text());
    const julieVideoSVG = fetch("elements/video2.svg").then(r => r.text());
    const logoSVG = fetch("elements/Pc.svg").then(r => r.text());
    const camillaSVG = fetch("elements/Camilla.svg").then(r => r.text());
    const julieSVG = fetch("elements/Julie.svg").then(r => r.text());

    Promise
        .all([camillaVideoSVG, julieVideoSVG, logoSVG, camillaSVG, julieSVG])
        .then(
            function (responses) {
                const [camillaVideoSVG, julieVideoSVG, logoSVG, camillaSVG, julieSVG] = responses;
                camillaVideo = camillaVideoSVG;
                julieVideo = julieVideoSVG;
                logo = logoSVG;
                camilla = camillaSVG;
                julie = julieSVG;
                addStartButtonClick();
            }
        );
}

function addStartButtonClick() {
    document.querySelector(".start_button").addEventListener("click", function _listener() {

        document.querySelector(".start_button").removeEventListener("click", _listener);
        document.querySelector(".start_button").style.display = "none";
        setTimeout(run1stScreen, 200);
    });
}

// Assignment title
function run1stScreen() {
    document.querySelector('#music').play();
    console.log("Running 1st screen");
    let textContent = "Assignment: 14C.01.05 GTA intro";
    document.querySelector(".text_content").classList.add("intro_text");

    typewriterEffect(textContent, run2ndScreen, ".text_content_1", 2000);
}

// Project by:
function run2ndScreen() {
    text_content.classList.remove("intro_text");
    text_content.classList.add("logo_text");

    let textContent = "Project by:";
    typewriterEffect(textContent, run2ndScreenPt2, ".text_content_1", 500);
}

// The GameBreakers logo
function run2ndScreenPt2() {
    document.querySelector(".video_content").innerHTML += `<div class="logo">${logo}</div>`;
    document.querySelector(".video_content").addEventListener("animationend", function _function() {
        setTimeout(run3rdScreen, 2000);
        document.querySelector(".video_content").removeEventListener("animationend", _function);
    });
}

// Camilla video
function run3rdScreen() {
    document.querySelector(".text_content_1").innerHTML = "";
    text_content.classList.remove("logo_text");
    document.querySelector(".video_content").innerHTML = camillaVideo;

    setTimeout(run4thScreen, 5000);
}

// Camilla character
function run4thScreen() {
    document.querySelector(".video_content").innerHTML = "";
    document.querySelector(".character_container").innerHTML = `<div class="character camilla">${camilla}</div>`;
    document.querySelector(".character").addEventListener("animationend", function () {
        document.querySelector(".text_content").classList.add("character_text");
        let textContent = "Camilla";
        typewriterEffect(textContent, run4thScreenPt2, ".text_content_1", 500);
    })
}

function run4thScreenPt2() {
    let textContent = "The programmer";
    typewriterEffect(textContent, run4thScreenPt3, ".text_content_2", 500);
}

function run4thScreenPt3() {
    let textContent = "... and CTR freak";
    typewriterEffect(textContent, run5thScreen, ".text_content_3", 2000);
}

// Julie video
function run5thScreen() {
    document.querySelector(".character_container").innerHTML = "";
    document.querySelector(".text_content").classList.remove("character_text");
    text_content.classList.remove("logo_text");
    document.querySelector(".video_content").innerHTML = julieVideo;

    setTimeout(run6thScreen, 5000);
}

// Julie character
function run6thScreen() {
    document.querySelector(".video_content").innerHTML = "";
    document.querySelector(".text_content_1").innerHTML = "";
    document.querySelector(".text_content_2").innerHTML = "";
    document.querySelector(".text_content_3").innerHTML = "";
    document.querySelector(".character_container").innerHTML = `<div class="character julie">${julie}</div>`;
    document.querySelector(".character").addEventListener("animationend", function () {
        document.querySelector(".text_content").classList.add("character_text");
        let textContent = "Julie";
        typewriterEffect(textContent, run6thScreenPt2, ".text_content_1", 500);
    })
}

function run6thScreenPt2() {
    let textContent = "The illustrator";
    typewriterEffect(textContent, run6thScreenPt3, ".text_content_2", 500);
}

function run6thScreenPt3() {
    let textContent = "... and RPG geek";
    typewriterEffect(textContent, run7thScreen, ".text_content_3", 2000);
}

// Group picture
function run7thScreen() {
    document.querySelector(".video_content").innerHTML = "";
    document.querySelector(".text_content").classList.remove("character_text");
    document.querySelector(".text_content_1").innerHTML = "";
    document.querySelector(".text_content_2").innerHTML = "";
    document.querySelector(".text_content_3").innerHTML = "";
    document.querySelector(".character_container").innerHTML = `<div class="character julie">${julie}</div> <div class="character camilla">${camilla}</div>`;
    document.querySelector(".character").addEventListener("animationend", function () {
        document.querySelector(".text_content").classList.add("character_text");
        document.querySelector(".text_content").classList.add("narrow");
        let textContent = "We're gonna leave early";
        typewriterEffect(textContent, run7thScreenPt2, ".text_content_1", 500);
    })
}

function run7thScreenPt2() {
    let textContent = "... to play video games";
    document.querySelector(".text_content_2").innerHTML = "<br>";
    typewriterEffect(textContent, fadeMusic, ".text_content_3", 500);
}

// ----- HELPER FUNCTIONS -----

function typewriterEffect(text, nextFunction, destination, delay) {
    console.log(delay);
    if (index <= text.length) {
        document.querySelector(destination).innerHTML = text.substring(0, index);
        index++;
        setTimeout(function () {
                typewriterEffect(text, nextFunction, destination, delay);
            }
            , 80);
    } else {
        index = 0;
        setTimeout(nextFunction && nextFunction
            , delay);
    }
}

function fadeMusic() {
    if (musicVolume > 0) {
        musicVolume = musicVolume - 0.01;
        console.log(musicVolume);
        document.querySelector("#music").volume = musicVolume;
        setTimeout(fadeMusic, 50);
    }
}