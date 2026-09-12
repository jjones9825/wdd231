const membersContainer = document.querySelector('#members');
const gridButton = document.querySelector('#grid-btn');
const listButton = document.querySelector('#list-btn');

gridButton.addEventListener("click", () => {
    membersContainer.classList.remove('members-list');
    membersContainer.classList.add('members-grid');

    gridButton.classList.add('active');
    listButton.classList.remove('active');
});

listButton.addEventListener("click", () => {
    membersContainer.classList.remove('members-grid');
    membersContainer.classList.add('members-list');

    listButton.classList.add('active');
    gridButton.classList.remove('active');
});

async function getMembers() {
    try {
        const response = await fetch("data/members.json");
        const data = await response.json();

        displayMembers(data);
    }
    catch (error) {
        console.error("Unable to load member data:", error);
    }
}

function displayMembers(members) {
    membersContainer.innerHTML = "";

    members.forEach(member => {
        const card = document.createElement('article');

        card.classList.add('member-card');

        card.innerHTML = `
            <img src="${member.image}" alt="${member.name} logo" loading="lazy">

            <div class="member-info">
                <h2>${member.name}</h2>
                <p class="category">${member.category}</p>
                <p class="address">${member.address}</p>
                <p class="phone">${member.phone}</p>
                <a class="website" href="${member.website}" target="_blank">
                    ${member.website}
                </a>
            </div>
        `;

        membersContainer.appendChild(card);
    });
}

getMembers();