init();

async function init() {
    const gameFrame = document.getElementById("game");
    const gameLink = document.getElementById("game-link");
    const madeBy = document.getElementById("made-by");
    const madeFor = document.getElementById("made-for");
    const gameData = await loadGameData();
    console.log(window.location.hash);
    const game = gameData[window.location.hash.substring(1)];
    gameFrame.src = game["src"];
    gameFrame.width = game["x"];
    gameFrame.height = game["y"];
    gameLink.href = game["link"]
    madeBy.innerText = `Game by ${game["group"]}`;
    madeFor.innerText = game["subText"];
}


async function loadGameData() {
    let response = await fetch("./js/games.json");
    images = await response.json();
    return images;
};