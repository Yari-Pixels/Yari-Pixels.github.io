// definícia náhodných textov
texts = [
    "Hmmm...",
    "Much love, you're safe here",
    "I wish I could hold your hand",
    "Why does it change all the time?",
    "Thanks for stopping by",
    "I know what you are...",
    "Now with 20% more bugs!",
    "Take a break, I'm sure you need it",
    "Check out the gallery!",
    "Tested in production",
    "Did you know, that in terms of...",
    "QA tested - Guaranteed not to work",
    "Robert'); DROP TABLE Students;--",
    "86? 42!",
    "The pixels we made along the way",
    "Don't forget your towel",
    "Always have your wheat pouch ready",
    "<del> Mechanic </del> Artist on duty",
    "our Fren",
    "Season 2 when?",
    "No corpos allowed",
    "Safe space for all pixel lovers",
    "UwU"
]

let randomText = document.getElementById("random-text");
randomText.innerHTML = texts[Math.floor(Math.random() * texts.length)];