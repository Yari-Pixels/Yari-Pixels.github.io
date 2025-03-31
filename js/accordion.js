//získanie všetkých boxov z QNA
const qnaBoxes = document.getElementsByClassName('accordion-box');

function showBox(){
    const isShown = this.classList.contains("shown-answer");
    for(const box of qnaBoxes)
        box.classList.remove("shown-answer")
    if (!isShown)
        this.classList.add("shown-answer")
}

for(const box of qnaBoxes) {
    box.addEventListener("click", showBox)
}