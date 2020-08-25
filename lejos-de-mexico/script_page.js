document.addEventListener("DOMContentLoaded", start);

let dishes = [];
let dish;

let urlParams = new URLSearchParams(window.location.search);
let dishID = urlParams.get("dishID");

function start() {

    async function getJson() {
        console.log("getJson");
        let jsonData = await fetch("dishes.json");
        dishes = await jsonData.json();
        dishes.forEach(obj => {
            if (obj.image == dishID) {
                dish = obj;
            }
        });

        open();
    }

    function open() {
        document.querySelector("h1").textContent = `${dish.title}`;
        document.querySelector("#singleview").innerHTML =
            `<div class="large_item reverse tablet_wrap">
<div class="large_card tablet_wrap">
                    <div class="dish_info__short">
                    <h3>${dish.longtitle}</h3>
                    <p>${dish.longtext}</p>
                    <div class="price">Price: ${dish.price},-</div>
                    </div>
                    </div>
                    
<div class="large_image">
                    <img src="elements/dishes/${dish.image}.jpg" class="shadow" alt="${dish.title}">
                    </div>
                    </div>
                    <div class="source">
                    Image source: <u>${dish.imgsource}</u>
                    </div>`;
        document.querySelector("title").textContent = `${dish.title} - Lejos de Mexico`;
    }

    getJson();
}
