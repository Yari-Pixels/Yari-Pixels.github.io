// pridá funkciu, ktorá zabráni základnému chovaniu (v tomto prípade scrollovaniu) na všetky eventy, ktoré to môžu spôsobiť
function disableScroll() {
    window.addEventListener('wheel', preventDefault, {passive: false});
    window.addEventListener('touchmove', preventDefault, {passive: false});
    window.addEventListener('keydown', preventKeyScroll, {passive: false});
}

// odoberie funkciu, ktorá zabráni základnému chovaniu (v tomto prípade scrollovaniu) na všetky eventy, ktoré to môžu spôsobiť
function enableScroll() {
    window.removeEventListener('wheel', preventDefault, {passive: false});
    window.removeEventListener('touchmove', preventDefault, {passive: false});
    window.removeEventListener('keydown', preventKeyScroll, {passive: false});
}

//zabráni základnému chovaniu
//použité pri scrolovaní kolečkom myši a posune prstom po dotykovom displeji
function preventDefault(e) {
    e.preventDefault();
}

//zabráni základnému chovaniu ale len pre klávesy, ktoré spôsobujú pohyb po stránke
//použité pri stlačení klávesy
function preventKeyScroll(e) {
    const keys = [
        'ArrowUp', 'ArrowDown',
        'PageUp', 'PageDown',
        'Home', 'End',
        ' '
    ];

    if (keys.includes(e.key)) {
        e.preventDefault();
    }
}