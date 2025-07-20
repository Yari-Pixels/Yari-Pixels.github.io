//hrôzostrašne vyzerajúca definícia slovníku z obrázkami
//nebudem klamať, na tvorbu tohto slovníka som si spravil python script
let images = undefined;
let currentImageId = undefined;

//premenné pre prácu s posunom po dotykových obrazovkách
let touchStart = undefined;
let touchLast = undefined;

//premenné a konštanty používané pri približovaní obrázku
let offsetX = 0;
let offsetY = 0;
let currentZoom = 1;
const minZoom = 1;
const maxZoom = 3;
const stepSize = 0.001;

//konštanty s 
const modalContainer = document.getElementById('modal-display');
const aspectRatioContainer = document.getElementById('aspect-ratio-container');
const modalImage = document.getElementById('modal-image');


//funkcia ktorá pomocou cyklu naplní galériu obrázkami zo slovníku
function loadImages() {
    try {
        const response = fetch('js/img.json');
        if (!response.ok) {
            throw new Error('Network response was not ok ' + response.statusText);
        }
        images = response.json();
    } catch (error) {
        console.error('There has been a problem with your fetch operation:', error);
    }
    for (const [id, image] of Object.entries(images)) {
        createImageElement(id, image)
    }
};

//funkcia ktorá pridá do galérie obrázok podľa zadaných údajov
//údaje sú zapísané v slovníkoch
//náhľad obrázku v ňom má definovanú cestu k obrázku, pozadie, mód zobrazenia, a pozícia vrámci rámčeku ak bol v object-fit požitý mód cover alebo none
//pre náhľad aj detail obrázku je definovaný len jeden alt text aj id ktoré sú používané obi dvomi
function createImageElement(id, image) {
    const img = document.createElement('img');

    img.id = id;
    img.src = image.thumb.src;
    img.alt = image.alt;

    img.style.objectFit = image.thumb.mode;
    img.style.objectPosition = image.thumb.position;
    img.style.backgroundColor = image.thumb.background;

    img.classList.add('grid-item', 'gallery-image');
    img.addEventListener('click', openModal);

    const gallery = document.getElementById('main-gallery');
    gallery.prepend(img);
};

//funkcia na otvorenie detailu obrázka
//spustí funkciu, ktorá bráni posunu po stránke
//zistí id obrázku na ktorý bolo kliknuté a použije ho aby nastavil obrázok podľa údajov zo slovníka
//pre detail obrázku je definovaná cesto k obrázka, a text, ktorý sa zobrazí pri prejdení myšou
//nakoniec nastaví zobrazenie pre kontajner obrázku na flex a nastaví aspect ratio obrázku a jeho kontajneru  
function openModal() {
    disableScroll();
    currentImageId = this.id;

    modalImage.src = images[currentImageId].src;
    modalImage.alt = images[currentImageId].alt;
    modalImage.title = images[currentImageId].hover;

    let aspectRatio = calculateAspectRatio(modalImage.src);
    modalImage.style.aspectRatio = aspectRatio;
    aspectRatioContainer.style.aspectRatio = aspectRatio;
    modalContainer.style.display = "flex";
}
//funkcia na zatvorenie detailu obrázku
//nastaví zobrazenie detailu obrázku na none a znovu povolí pohyb po stránke 
//vynuluje premenné týkajúce sa zobrazeného obrázku
function closeModal() {
    modalContainer.style.display = "none";
    enableScroll();
    resetModalImage();
}

//Zapíše údaje o začiatku dotyka a posledným miestom dotyka na dotykovej obrazovke
function touchScrollStart(e) {
    touchStart = {
        x: e.touches[0].clientX,
        y: e.touches[0].clientY
    };
    touchLast = {
        x: 0,
        y: 0
    };
};

//Pri posune po obrazovke zistí kam sa dotyk posunul a nastaví do premennej rozdiel od počiatočného miesta dotyka
//Podľa toho, či je posun väčší horizontálne alebo vertikálne upraví polohu a priehľadnosť obrázku
//To dáva užívateľovi odozvu o jeho akcií
function touchScroll(e) {
    touchLast.x = touchStart.x - e.touches[0].clientX,
        touchLast.y = touchStart.y - e.touches[0].clientY

    if (Math.abs(touchLast.x) > Math.abs(touchLast.y)) {
        modalImage.style.transform = "translate(" + -touchLast.x * 2 + "px, 0px)";
        modalImage.style.opacity = (110 - Math.abs(touchLast.x)) / 110;
    }
    else {
        modalImage.style.transform = "translate(0px, " + -touchLast.y + "px)";
        modalImage.style.opacity = (250 - Math.abs(touchLast.y)) / 250;
        modalContainer.style.opacity = (250 - Math.abs(touchLast.y)) / 250;
    }
}

//Pri ukončení dotyka zistí či nastal väčší posun vertikálne alebo horizontálne
//Ak v danom smere prekročil stanovenú hodnotu príde k posunu na iný obrázok alebo jeho zatvorenie
//Ak neboli prekročené žiadne hodnoty nastaví štýl obrázku späť na pôvodné hodnoty
function touchScrollEnd(e) {
    if (Math.abs(touchLast.x) > Math.abs(touchLast.y)) {
        if (touchLast.x > 100) {
            nextImageSwipe(1);
            return
        }
        if (touchLast.x < 100) {
            nextImageSwipe(-1);
            return
        }
    }
    if (Math.abs(touchLast.y) > 150) {
        closeModal();
        return;
    }
    modalImage.style.transform = "translate(0px, 0px) scale(1)";
    modalImage.style.opacity = "unset";
    modalContainer.style.opacity = "unset";
}

//Resetuje hodnoty obrázku ako zoom, odsadenie a zmenu štýlu
function resetModalImage() {
    currentZoom = 1;
    offsetX = 0;
    offsetY = 0;
    modalImage.style.transform = "translate(0px, 0px) scale(1)";
    modalImage.style.aspectRatio = "unset";
    modalImage.style.opacity = "unset"
    modalContainer.style.opacity = "unset";
}

//zmení uložené id podľa smeru prechodu, ak sa pri tom došlo k hodnote mimo rozmedzia prejde medzi začiatkom a koncom galérií
//volá funkciu na reset štýlov obrázka na predvolenú hodnotu
//použije nové id aby nastavil obrázok podľa údajov zo slovníka
function nextImage(direction) {
    currentImageId -= direction;
    let length = Object.keys(images).length
    currentImageId = currentImageId < 1 ? length : currentImageId;
    currentImageId = currentImageId > length ? 1 : currentImageId;

    resetModalImage();

    modalImage.src = images[currentImageId].src;
    modalImage.alt = images[currentImageId].alt;
    modalImage.title = images[currentImageId].hover;

    let aspectRatio = calculateAspectRatio(modalImage.src);
    modalImage.style.aspectRatio = aspectRatio;
    aspectRatioContainer.style.aspectRatio = aspectRatio;
}

//prechod na ďalší obrázok pri posune pomocou dotyka
//pridá na obrázok triedu no-transition, ktorá vypne prechody a posunie ho na druhú stranu, potom triedu odstráni
//to animuje prechod medzi obrázkami pri posune
//následne zavolá funkciu na bežný prechod po obrázku ktorá ho zmení na ďalší
function nextImageSwipe(direction) {
    modalImage.classList.add("no-transition");
    modalImage.style.transform = "translate(" + direction * 250 + "px, 0px)";
    modalImage.style.opacity = 0;
    modalImage.offsetHeight; //flushing the CSS changes by reading them
    modalImage.classList.remove("no-transition");
    nextImage(direction);
}

//vytvorí premennú img a nastaví ju na zvolený obrázok
//zistí jeho rozmery a vráti ich vo formáte používanom v css vlastnosti aspect ratio
//to je použité na to aby mal element obrázku skutočne rozmery obrázku ktorý zobrazuje, bez toho aby došlo k jeho orezaniu
//takto to bolo potrebné robiť preto, že som chcel aby bolo za obrázkami s priehladnostou zobrazené pozadie o veľkosti daného obrázku
function calculateAspectRatio(src) {
    let img = new Image();
    img.src = src;
    return img.naturalWidth + "/" + img.naturalHeight;
}

//približovanie obrázku - je pripojené na event posunu kolieska myši
//vypočíta nový zoom podľa posunu kolieska a aktuálneho priblíženia
//nastaví nový zoom vrámci zvoleného rozmedzia <minZoom; maxZoom>
//vypočíta taký posun obrázku aby zostal pod kurzorom myši ten istý bod obrázku
//nakoniec pomocou css vlastnosti translate nastaví toto priblíženie a posun
function zoomImage(e) {
    let deltaZoom = -e.deltaY * currentZoom * stepSize;
    let newZoom = currentZoom + deltaZoom;

    if (newZoom < minZoom) {
        newZoom = minZoom;
        deltaZoom = newZoom - currentZoom
    }
    else if (newZoom > maxZoom) {
        newZoom = maxZoom;
        deltaZoom = newZoom - currentZoom
    }

    if (deltaZoom === 0) {
        return;
    }

    let zoomPointX = e.clientX - (modalImage.offsetLeft + offsetX);
    let zoomPointY = e.clientY - (modalImage.offsetTop + offsetY);

    offsetX -= zoomPointX * deltaZoom / currentZoom;
    offsetY -= zoomPointY * deltaZoom / currentZoom;

    if (newZoom == 1) {
        offsetX = 0;
        offsetY = 0;
    }

    currentZoom = newZoom;

    modalImage.style.transform = "translate(" + offsetX + "px, " + offsetY + "px) scale(" + currentZoom + ")";
}

//Ak je kliknuté na jeden z kontajnerov na pozadí obrázku, obrázok sa zatvorí
window.addEventListener('click', function (event) {
    if (event.target === modalContainer || event.target === aspectRatioContainer)
        closeModal()
});

//Pri točení kolečka myši sa mení priblíženie obrázku 
modalImage.addEventListener("wheel", zoomImage);

//Nastavenie šípok po boku obrázku na prepínanie medzi obrázkami
document.getElementById('modal-prev-arrow').addEventListener('click', function () { nextImage(-1) });
document.getElementById('modal-next-arrow').addEventListener('click', function () { nextImage(1) });

//nastavenie eventov na prechádzanie medzi obrázkami a ich zatvorenie na dotykových displejoch
//funkcie je možné spustiť len keď nie je obrázok priblížení
document.addEventListener('touchstart', function (event) {
    if (currentZoom != 1 || modalContainer.style.display === "none")
        return;
    touchScrollStart(event);
});

document.addEventListener('touchmove', function (event) {
    if (!touchStart || currentZoom != 1 || modalContainer.style.display === "none")
        return;
    touchScroll(event);
});

document.addEventListener('touchend', function () {
    if (!touchStart || currentZoom != 1 || modalContainer.style.display === "none")
        return;
    touchScrollEnd(event);
});

//nastavenie eventov na prechádzanie medzi obrázkami a ich zatvorenie pomocou kláves 
window.addEventListener('keydown', function (event) {
    if (modalContainer.style.display === "none")
        return;
    if (event.key === 'ArrowRight')
        nextImage(1);
    else if (event.key === 'ArrowLeft')
        nextImage(-1);
    else if (event.key === 'Escape')
        closeModal();
    else
        return;
    event.preventDefault();
});

//spustí funkciu na pridanie obrázkov do galérie
loadImages();