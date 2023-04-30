import { createElement } from '../utils.js'

export function loadQuotes() {
    createElement("quotesContainer", "", "#seshParent")
    getQuotes()
}

function getQuotes() {
    const randomQuote = quotes[Math.floor(Math.random()*(quotes.length))];
    let quoteContainer = document.createElement("div");
    quoteContainer.innerHTML = randomQuote;
    quoteContainer.id = "quoteContainer";
    document.querySelector("#quotesContainer").appendChild(quoteContainer);
}

export function cleanup() {
    const quotesContainer = document.getElementById("quotesContainer")
    if(quotesContainer)
        quotesContainer.remove()
}

const quotes = [
    `It is what it is.`,
    `What contains the box?`,
    `What you don't want to think about wastes your time.`,
    `The only thing real is your mind. Everything else doesn't matter.`,
    `You are your habits.`,
    `You won't regret making a choice if you don't make a choice. `,
    `Life is a pattern of patterns.`,
    `Ignorance is bliss, as long as it lasts.`,
    `We're not the champions of evolution; we're the byproducts.`,
    `The more you change, everything stays the same.`,
    `If you've done something and nobody knows, have you really done it?`,
    `There's no randomness. Only the variables are too many.`,
    `Just look at the night sky to see how insignificant all of this is.`,  
    `Logic is the driving force of the universe`,
    `People are immutable.`,
    `Time moves forward, and nothing changes.`,
    `The search for meaning is pointless.`,
    `To think that we will one day find the fundamental laws of the universe is naive.`, 
    `You don't know if you haven't been there.`, 
    `Most people don't even get an opportunity to make a change.`,
    `We are selectively blind`,
    `Nihilism is perfect clarity of the absolute truth`,
    `Every day is exactly the same.`,
    `We're just acting out our genetic code`,
    `What's the point of all this?`,
    `Ordeals and cheap thrills. That's it, right?`,
    `You say it aloud so you can process it better.`,
    `2 + 2 = 5`,
    `Consciousness is the biggest illusion.`,
    `Knowledge and perspective are inseparable.`,
    `The only upshot of life is the transmission of knowledge.`,
    `Beat around the bush all you want, but consistency and discipline top spurts of inspiration any day.`,
] 
