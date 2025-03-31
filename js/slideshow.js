//index slidu nastavime na 1
let index = 0;
const slides = document.getElementsByClassName('slide');

//pre element so zadaným indexom nastavím display na block, ostatným na none
//ak je mimo rozmedzia prejdeme na druhú stranu (s prvého na posledný a naopak)
function showSlide(i) {
    if (i > slides.length - 1) {
        i = 0;
    };

    if (i < 0) {
        i = slides.length - 1;
    };

    for (const slide of slides) {
        slide.style.display = 'none';
    }

    slides[i].style.display = 'block';
    return i
}

//prepne slide podľa zadaného posunu
function changeSlide(direction) {
    index = showSlide(index += direction);
};

//nastaví aby na šípkach na preklik boli na evente click pripojené funkcie na prechod cez slidy
const prevArrow = document.getElementById('prev-arrow');
prevArrow.addEventListener('click', function () {
    changeSlide(-1);
});

const nextArrow = document.getElementById('next-arrow');
nextArrow.addEventListener('click', function () {
    changeSlide(1);
});

//defaultne bude zobrazený prvý slide
showSlide(index);