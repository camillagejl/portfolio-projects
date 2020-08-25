document.addEventListener("DOMContentLoaded", start);

let dishes = [];
let filtered = "";
const filterButtons = document.querySelectorAll(".filter_button");
const menu = document.querySelector("#menu");

function start() {
    filterButtons.forEach(button => {
        button.addEventListener("click", function () {
                let category = this.getAttribute("data-type");
                dishesByCategory(category);
                document.querySelectorAll("button").forEach(button => {
                    button.classList.remove("button_chosen");
                    this.classList.add("button_chosen");
                })
            }
        )
    });

    async function getJson() {
        console.log("getJson");
        let jsonData = await fetch("dishes.json");
        dishes = await jsonData.json();
        dishesByCategory("all");
    }

    getJson();
}

function dishesByCategory(category) {
    menu.innerHTML = "";

    if (category == "all") {
        filtered = dishes;
    }
    else {
        filtered = dishes.filter(dish => dish.category === category);
    }

    filtered.forEach(dish => {
        let template =
            `<div class="dish_container">
                    <img src="elements/dishes/${dish.image}-thumb.jpg" class="shadow" alt="${dish.title} thumbnail">
                    <div class="dish_info__short">
                    <h3>${dish.title}</h3>
                    <p>${dish.shorttext}</p>
                    <div class="price">Price: ${dish.price},-</div>
                    </div>
                </div>`;
        menu.insertAdjacentHTML("beforeend", template);
        menu.lastElementChild.addEventListener("click", () => {
            location.href = "menu_singleview.html?dishID=" + dish.image;
        });

    });
}


