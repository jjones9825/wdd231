const preferencesSummary = document.querySelector("#preferences-summary");

function displayPreferences() {
    if (!preferencesSummary) {
        return;
    }

    const params = new URLSearchParams(window.location.search);

    const genre = params.get("genre");
    const length = params.get("length");
    const frequency = params.get("frequency");
    const goal = params.get("goal");

    if (!genre && !length && !frequency && !goal) {
        preferencesSummary.innerHTML = `
            <p class="empty-message">
                No reading preferences were submitted yet.
            </p>
        `;
        return;
    }

    const preferences = [
        {label: "Favorite Genre ", value: genre},
        {label: "Preferred Book Length ", value: length},
        {label: "Reading Frequency ", value: frequency},
        {label: "Reading Goal ", value: goal ? `${goal}` : null}
    ];

    preferencesSummary.replaceChildren();

    preferences.forEach((preference) => {
        const item = document.createElement("div");
        item.classList.add("preference-item");

        const label = document.createElement("span");
        label.classList.add("preference-label");
        label.textContent = preference.label;

        const value = document.createElement("span");
        value.classList.add("preference-value");
        value.textContent = preference.value || "Not specified";

        item.append(label, value);
        preferencesSummary.appendChild(item);
    });
}

displayPreferences();