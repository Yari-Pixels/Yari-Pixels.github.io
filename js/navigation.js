//získa potrebné elementy
const navContainerTop = document.getElementById("navigation-top");
const navIconTop = navContainerTop.getElementsByClassName("navigation-icon")[0];
const navTop = navContainerTop.getElementsByClassName("navigation")[0];

//pridá funkciu, ktorá zobrazí/schová hamburger navigáciu pri kliknutí na ikonu pomocou pridania/odobrania triedy navigation-top-clicked
navIconTop.addEventListener("click", function () {
    navTop.classList.toggle("navigation-top-clicked");
});