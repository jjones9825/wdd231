import { discoverItems } from "../data/discover.mjs";

const discoverGrid = document.querySelector('#discover-grid');
const visitMessage = document.querySelector('#visit-message');


function displayDiscoverItems(items) {
    discoverGrid.innerHTML = "";

    items.forEach((item, index) => {
        const card = document.createElement('article');

        card.classList.add('discover-card');
        card.classList.add(`area-${index + 1}`);

        card.innerHTML = `
            <h2>${item.title}</h2>

            <figure>
                <img src="${item.image}" alt="${item.title}" loading="${index === 0 ? "eager" : "lazy"}" width="300" height="200">
            </figure>

            <address>${item.address}</address>
            <p>${item.description}</p>

            <button type="button" class="learn-more">
                Learn More
            </button>
        `;

        discoverGrid.appendChild(card);
    });
}


function displayVisitMessage() {
    const now = Date.now();
    const lastVisit = localStorage.getItem('discoverLastVisit');

    if (!lastVisit) {
        visitMessage.textContent = "Welcome! Let us know if you have any questions.";
    }

    else {
        const previousVisit = Number(lastVisit);
        const difference = now - previousVisit;

        const millilsecondsInDay = 1000 * 60 * 60 * 24;

        const daysSinceVisit = Math.floor(difference / millilsecondsInDay);

        if (daysSinceVisit < 1) {
            visitMessage.textContent = "Back so soon! Awesome!";
        }
        else if (daysSinceVisit === 1) {
            visitMessage.textContent = "You last visited 1 day ago.";
        }
        else {
            visitMessage.textContent = `You last visited ${daysSinceVisit} days ago.`;
        }
    }

    localStorage.setItem('discoverLastVisit', now);
}

displayDiscoverItems(discoverItems);
displayVisitMessage();