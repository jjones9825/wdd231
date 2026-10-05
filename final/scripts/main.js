const menuButton = document.querySelector("#menu-button");
const primaryNav = document.querySelector("#primary-nav");

if (menuButton && primaryNav) {
    menuButton.addEventListener("click", () => {
        const isOpen = primaryNav.classList.toggle("open");

        menuButton.setAttribute("aria-expanded", isOpen);

        menuButton.setAttribute("aria-label", isOpen ? "Close navigation menu" : "Open navigation menu");

        const menuIcon = menuButton.querySelector(".menu-icon");

        if (menuIcon) {
            menuIcon.textContent = isOpen ? "X" : "☰";
        }
    });

    const navLinks = primaryNav.querySelectorAll("a");

    navLinks.forEach((link) => {
        link.addEventListener("click", () => {
            primaryNav.classList.remove("open");
            
            menuButton.setAttribute("aria-expanded", "false");

            menuButton.setAttribute("aria-label", "Open navigation menu");

            const menuIcon = menuButton.querySelector(".menu-icon");

            if (menuIcon) {
                menuIcon.textContent = "☰";
            }
        });
    });
}

const currentYear = document.querySelector("#current-year");

if (currentYear) {
    currentYear.textContent = new Date().getFullYear();
}

const currentPage = window.location.pathname.split("/").pop() || "index.html";

const navigationLinks = document.querySelectorAll(".primary-nav a");

navigationLinks.forEach((link) => {
    const linkPage = link.getAttribute("href");

    if (!linkPage) {
        return;
    }

    const cleanLinkPage = linkPage.split("/").pop();
    if (cleanLinkPage === currentPage) {
        navigationLinks.forEach((navLink) => {
            navLink.classList.remove("active");
            navLink.removeAttribute("aria-current");
        });

        link.classList.add("active");
        link.setAttribute("aria-current", "page");
    }
});