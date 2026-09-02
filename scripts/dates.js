const currentyear = document.querySelector("#currentyear");

const today = new Date();

currentyear.innerHTML = `<span class="currentyear">${today.getFullYear()}</span>`;

document.getElementById("lastModified").innerHTML = document.lastModified;