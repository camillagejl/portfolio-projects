window.addEventListener("load", showPage);

function showPage() {
    console.log('Showing the page');
    document.querySelector('.header_menu').addEventListener('click', showMenu);
}

function showMenu() {
    console.log('Remove hidden');
    document.querySelector('#burger_menu').classList.remove('hidden');
    document.querySelector('.content').classList.add('hidden');
    document.querySelector('.header_menu').removeEventListener('click', showMenu);
    document.querySelector('.header_menu').addEventListener('click', hideMenu);
}

function hideMenu() {
    console.log('Remove hidden');
    document.querySelector('#burger_menu').classList.add('hidden');
    document.querySelector('.content').classList.remove('hidden');
    document.querySelector('.header_menu').removeEventListener('click', hideMenu);
    document.querySelector('.header_menu').addEventListener('click', showMenu);
}
