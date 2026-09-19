const currentTemp = document.querySelector('#current-temp');
const weatherDesc = document.querySelector('#weather-desc');
const forecastCont = document.querySelector('#forecast-cont');
const spotlightCont = document.querySelector('#spotlight-cont');


const apiKey = "8be59501ff42e09bd9e86d0e9133d01c";
const latitude = 33.415;
const longitude = -111.835;

const currentWeatherURL = `https://api.openweathermap.org/data/2.5/weather?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;
const forecastURL = `https://api.openweathermap.org/data/2.5/forecast?lat=${latitude}&lon=${longitude}&units=imperial&appid=${apiKey}`;

async function getWeather() {
    try {
        const [currentResponse, forecastResponse] = await Promise.all([fetch(currentWeatherURL), fetch(forecastURL)]);
        if (!currentResponse.ok || !forecastResponse.ok) {
            throw new Error("Unable to retrieve weather data.");
        }
        
        const currentData = await currentResponse.json();
        const forecastData = await forecastResponse.json();

        displayCurrentWeather(currentData);
        displayForecast(forecastData);
    }
    catch (error) {
        console.error("Weather error:", error);
        currentTemp.textContent = "Weather unavailable";
        weatherDesc.textContent = "Unable to load weather data.";
        forecastCont.innerHTML = "<p>Forecast unavailable.</p>";
    }
}




function displayCurrentWeather(data) {
    currentTemp.innerHTML = `${Math.round(data.main.temp)}&deg;F`;
    weatherDesc.textContent = data.weather[0].description;
}

function displayForecast(data) {
    forecastCont.innerHTML = "";

    const dailyForecasts = [];
    const today = new Date();

    data.list.forEach((forecast) => {

        
        const forecastDate = new Date(forecast.dt * 1000);

            if (forecastDate.toDateString() === today.toDateString()) {
                return;
            }

            const alreadyAdded = dailyForecasts.some((item) => {
                return item.date.toDateString() === forecastDate.toDateString();
            });

            if(!alreadyAdded && dailyForecasts.length < 3) {
                dailyForecasts.push({
                    date: forecastDate,
                    temperature: Math.round(forecast.main.temp),
                    description: forecast.weather[0].description
                });
            }
        
    });
    
    dailyForecasts.forEach((forecast) => {
            const dayName = forecast.date.toLocaleDateString("en-US", {
                weekday: "long"
            });
        

            const card = document.createElement("div");
            card.classList.add("forecast-card");

            card.innerHTML = `
                <h4>${dayName}</h4>
                <p class="forecast-temperature">${forecast.temperature}&deg;F</p>
                <p>${forecast.description}</p>
            `;

            forecastCont.appendChild(card);
    });
    
}

async function getSpotlights() {
    try {
        const response = await fetch("data/members.json");

        if(!response.ok) {
            throw new Error("Unable to retrieve member data.");
        }

        const members = await response.json();

        const qualifiedMembers = members.filter(member => member.membership === 2 || member.membership === 3 || member.membership === "Gold" || member.membership === "Silver");

        const shuffledMembers = [...qualifiedMembers].sort(() => Math.random() - 0.5);

        const numberOfSpotlights = Math.min(3, shuffledMembers.length);

        const selectedMembers = shuffledMembers.slice(0, numberOfSpotlights);

        displaySpotlights(selectedMembers);
    }

    catch(error) {
        console.error("Spotlight error:", error);

        spotlightCont.innerHTML = "<p>Member spotlights are currently unavailable.</p>";
    }
}

function displaySpotlights(members) {
    spotlightCont.innerHTML = "";

    members.forEach((member) => {
        const card = document.createElement('article');
        card.classList.add('spotlight-card');

        let membershipLevel;

        if(member.membership === 3 || member.membership === "Gold") {
            membershipLevel = "Gold Member";
        }
        else {
            membershipLevel = "Silver Member";
        }

        card.innerHTML = `
            <img src="${member.image}"
                alt="${member.name} logo"
                loading="lazy">
            
            <div class="spotlight-content">
                <h3>${member.name}</h3>
                <p>
                    <strong>Membership:</strong>
                    ${membershipLevel}
                </p>
                <p>
                    <strong>Phone:</strong>
                    ${member.phone}
                </p>
                <p>
                    <strong>Address</strong>
                    ${member.address}
                </p>
                <p>
                    <strong>Website:</strong>
                    <a href="${member.website}"
                    target="_blank"
                    rel="noopener noreferrer"> Visit Website </a>
                </p>
            </div>
        `;

        spotlightCont.appendChild(card);
    });
}

async function getEvents() {
    try {
        const response = await fetch("data/events.json");
    
        if(!response.ok) {
            throw new Error("Unable to retrieve event information.");
        }

        const events = await response.json();

        displayEvents(events);
    }

    catch(error) {
        console.error("Events error:", error);
        document.querySelector('#event-list').innerHTML = "<p>Events are currently unavailable.</p>";
    }
}

function displayEvents(events) {
    const eventList = document.querySelector('#event-list');

    eventList.innerHTML = "";

    const today = new Date();
    const todayString = today.toISOString().split("T")[0];

    const upcomingEvents = events.filter((event) => 
        event.date >= todayString).sort((a, b) => a.date.localeCompare(b.date));
    const eventsToDisplay = upcomingEvents.slice(0, 3);
    if (eventsToDisplay.length === 0) {
        eventList.innerHTML = "<p>There are currently no upcoming events.</p>";
        return;
    }

    eventsToDisplay.forEach((event) => {
       const eventDate = new Date(`${event.date}T00:00:00`);
       
       const formattedDate = eventDate.toLocaleDateString("en-US", {
        month: "long",
        day: "numeric",
        year: "numeric"
       });

       const card = document.createElement('article');

       card.classList.add('event-card');

       card.innerHTML = `
            <h3>${event.name}</h3>
            <p>
                <strong>Date:</strong>
                ${formattedDate}
            </p>
            <p>
                <strong>Time:</strong>
                ${event.time}
            </p>
            <p>
                <strong>Location:</strong>
                ${event.location}
            </p>
            <p>${event.description}</p>
       `;

       eventList.appendChild(card);
    });
}

getEvents();
getWeather();
getSpotlights();