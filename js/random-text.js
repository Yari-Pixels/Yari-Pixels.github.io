// definícia náhodných textov
texts = [
    "I wish I could hold your hand",
    "Hmmm...",
    "Much love, you're safe here",
    "Why does it change all the time?",
    "Take a break, I'm sure you need it",
    "Thank you for visiting",
    "Now with 20% more bugs!",
    "Tested in production",
    "I know what you are...",
    "Check out the gallery!"
]

// výber náhodného textu a jeho zobrazenie
let randomText = document.getElementById("random-text");
randomText.text = texts[Math.floor(Math.random() * texts.length)];