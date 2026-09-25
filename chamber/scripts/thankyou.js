const params = new URLSearchParams(window.location.search);

//Get Values
const firstName = params.get('first-name');
const lastName = params.get('last-name');
const email = params.get('email');
const phone = params.get('phone');
const organization = params.get('organization');
const timestamp = params.get('timestamp');

//Display

document.querySelector('#display-first-name').textContent = firstName || "Not provided";
document.querySelector('#display-last-name').textContent = lastName || "Not provided";
document.querySelector('#display-email').textContent = email || "Not provided";
document.querySelector('#display-phone').textContent = phone || "Not provided";
document.querySelector('#display-organization').textContent = organization || "Not provided";

//TimeStamp

if (timestamp) {
    const submittedDate = new Date(timestamp);

    document.querySelector('#display-timestamp').textContent = submittedDate.toLocaleString();
}

else {
    document.querySelector('#display-timestamp').textContent = "Not available";
}
