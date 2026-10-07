import {
    getReadingList, isBookSaved, toggleReadingList
} from "./modules/storage.js";



const bookGrid = document.querySelector("#book-grid");
const bookCount = document.querySelector("#book-count");
const bookSearch = document.querySelector("#book-search");
const clearSearch = document.querySelector("#clear-search");
const sortBooks = document.querySelector("#sort-books");
const genreFilters = document.querySelector("#genre-filters");
const noResults = document.querySelector("#no-results");
const resetFilters = document.querySelector("#reset-filters");

const bookModal = document.querySelector("#book-modal");
const modalClose = document.querySelector("#modal-close");
const modalCover = document.querySelector("#modal-cover");
const modalGenre = document.querySelector("#modal-genre");
const modalTitle = document.querySelector("#modal-title");
const modalAuthor = document.querySelector("#modal-author");
const modalYear = document.querySelector("#modal-year");
const modalPages = document.querySelector("#modal-pages");
const modalRating = document.querySelector("#modal-rating");
const modalDescription = document.querySelector("#modal-description");
const modalSave = document.querySelector("#modal-save");

let books = [];
let filteredBooks = [];
let currentBook = null;

const readingListKey = "bookNookReadingList";

async function getBooks() {
    try {
        const response = await fetch("data/books.json");

        if (!response.ok) {
            throw new Error(`Unable to load books: ${response.status}`);
        }

        books = await response.json();

        filteredBooks = [...books];

        setDefaultFilter();

        displayBooks();

        checkURLParameters();
    }

    catch(error) {
        console.error("Error loading books:", error);

        if (bookGrid) {
            bookGrid.innerHTML = `
                <p class="loading-message">
                    We're sorry. The books could not be loaded right now. Please try again later.
                </p>
            `;
        }
    }
}

function setDefaultFilter() {
    const filterButtons = document.querySelectorAll(".filter-button");

    filterButtons.forEach((button) => {
        const isAll = button.dataset.genre === "All";

        button.classList.toggle("active", isAll);

        button.setAttribute("aria-pressed", isAll);
    });

}

function displayBooks() {
    if (!bookGrid) {
        return;
    }

    if (filteredBooks.length === 0) {
        bookGrid.innerHTML = "";

        noResults.hidden = false;

        updateBookCount();

        return;
    }

    noResults.hidden = true;

    bookGrid.innerHTML = filteredBooks.map((book) => createBookCard(book)).join("");

    updateBookCount();

    addBookCardListeners();
}

function createBookCard(book) {
    const saved = isBookSaved(book.id);

    return `
        <article class="book-card">
            <img
                class="book-card-image"
                src="${book.cover}"
                alt="Cover of ${book.title}"
                width="300"
                height="450"
                loading="lazy"
            >

            <div class="book-card-content">
                <p class="book-genre">
                    ${book.genre}
                </p>

                <h3>${book.title}</h3>

                <p class="book-author">
                    ${book.author}
                </p>

                <p class="book-rating">
                    ★ ${book.rating}
                </p>

                <button type="button" class="button button-secondary details-button" data-id="${book.id}">
                    View Details
                </button>

                <button type="button" class="button button-secondary save-button ${saved ? "saved" : ""}" data-id="${book.id}" aria-label="${saved ? "Remove" : "Save"} ${book.title} ${saved ? "from" : "to"} your reading list">
                    ${saved ? "✓ Saved" : "+ Save"}
                </button>
            </div>
        </article>
    `;
}

function updateSaveButtons() {
    const saveButtons = document.querySelectorAll(".save-button");

    saveButtons.forEach((button) => {
        const bookId = button.dataset.id;
        const saved = isBookSaved(bookId);

        const book = books.find((item) => String(item.id) === String(bookId));

        if (saved) {
            button.textContent = "✔ Saved";
            button.classList.add("saved");

            button.setAttribute("aria-label", `Remove ${book.title} from your reading list`);
        }

        else {
            button.textContent = "+ Save";
            button.classList.remove("saved");

            button.setAttribute("aria-label", `Save ${book.title} to your reading list`);
        }
    });
}

function addBookCardListeners() {
    const detailButtons = document.querySelectorAll(".details-button");

    detailButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const bookId = button.dataset.id;

            openBookModal(bookId);
        });
    });

    const saveButtons = document.querySelectorAll(".save-button");

    saveButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const bookId = button.dataset.id;
            toggleReadingList(bookId);
            updateSaveButtons();
        });
    });
}

function searchBooks() {
    const searchTerm = bookSearch.value.trim().toLowerCase();

    const activeButton = document.querySelector(".filter-button.active") ?.dataset.genre || "All";

    const activeGenre = activeButton?.dataset.genre || "All";
    
    filteredBooks = books.filter((book) => {
        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm);

        const matchesGenre = activeGenre === "All" || book.genre === activeGenre;

        return matchesSearch && matchesGenre;
    });

    sortFilteredBooks();
    displayBooks();
}

function filterByGenre(genre) {

    const filterButtons = document.querySelectorAll(".filter-button");
    
    filterButtons.forEach((button) => {

        const isSelected = button.dataset.genre === genre;
        button.classList.toggle("active", isSelected);

        button.setAttribute("aria-pressed", isSelected);
    });

    const searchTerm = bookSearch.value.trim().toLowerCase();

    filteredBooks = books.filter((book) => {
        const matchesGenre = genre === "All" || book.genre === genre;

        const matchesSearch = book.title.toLowerCase().includes(searchTerm) || book.author.toLowerCase().includes(searchTerm);

        return matchesGenre && matchesSearch;
    });
    
    sortFilteredBooks();

    displayBooks();
}

function sortFilteredBooks() {
    const sortValue = sortBooks.value;

    filteredBooks.sort((bookA, bookB) => {
        if (sortValue === "title") {
            return bookA.title.localeCompare(bookB.title);
        }

        if (sortValue === "author") {
            return bookA.author.localeCompare(bookB.author);
        }

        if (sortValue === "year") {
            return bookB.year - bookA.year;
        }

        if (sortValue === "rating") {
            return bookB.rating - bookA.rating;
        }

        return 0;
    });
}

function updateBookCount() {
    if (!bookCount) {
        return;
    }

    bookCount.textContent = filteredBooks.length;
}

function openBookModal(bookId) {
    currentBook = books.find((book => String(book.id) === String(bookId)));

    if (!currentBook || !bookModal) {
        return;
    }

    modalCover.src = currentBook.cover;

    modalCover.alt = `Cover of ${currentBook.title}`;

    modalGenre.textContent = currentBook.genre;

    modalTitle.textContent = currentBook.title;

    modalAuthor.textContent = `by ${currentBook.author}`;

    modalYear.textContent = currentBook.year;
    
    modalPages.textContent = currentBook.pages;

    modalRating.textContent = `★ ${currentBook.rating}`;

    modalDescription.textContent = currentBook.description;

    updateModalSaveButton();

    bookModal.showModal();
}

function closeBookModal() {
    if (bookModal) {
        bookModal.close();
    }

    currentBook = null;
}

function updateModalSaveButton() {
    if (!currentBook || !modalSave) {
        return;
    }

    const saved = isBookSaved(currentBook.id);

    if (saved) {
        modalSave.textContent = "✔ Remove from Reading List";
    }

    else {
        modalSave.textContent = "Save to Reading List";
    }
}

// function getReadingList() {
//     try {
//         const savedBooks = localStorage.getItem(readingListKey);

//         return savedBooks ? JSON.parse(savedBooks) : [];
//     }

//     catch(error) {
//         console.error("Unable to read reading list:", error);

//         return[];
//     }
// }

// function isBookSaved(bookId) {
//     const readingList = getReadingList();

//     return readingList.some((id) => String(id) === String(bookId));
// }

// function toggleReadingList(bookId) {
//     let readingList = getReadingList();

//     const existingIndex = readingList.findIndex((id) => String(id) === String(bookId));
    
//     if (existingIndex === -1) {
//         readingList.push(bookId);
//     }

//     else {
//         readingList.splice(existingIndex, 1);
//     }

//     localStorage.setItem(readingListKey, JSON.stringify(readingList));

//     displayBooks();

//     if (currentBook) {
//         updateModalSaveButton();
//     }
// }

function checkURLParameters() {
    const params = new URLSearchParams(window.location.search);

    const genre = params.get("genre");

    const bookId = params.get("book");

    if (genre) {
        const genreButton = document.querySelector(`.filter-button[data-genre="${genre}"]`);

        if (genreButton) {
            filterByGenre(genre);
        }
    }

    if (bookId) {
        openBookModal(bookId);
    }
}

function resetAllFilters() {
    bookSearch.value = "";

    sortBooks.value = "title";

    document.querySelectorAll(".filter-button").forEach((button) => {
        button.classList.remove("active");
        button.removeAttribute("aria-pressed");
    });

    const allButton = document.querySelector('.filter-button[data-genre="All"]');

    if (allButton) {
        allButton.classList.add("active");

        allButton.setAttribute("aria-pressed", "true");
    }

    filteredBooks = [...books];

    sortFilteredBooks();
    displayBooks();

}

if (bookSearch) {
    bookSearch.addEventListener("input", searchBooks);
}

if (clearSearch) {
    clearSearch.addEventListener("click", () => {
        bookSearch.value = "";

        searchBooks();

        bookSearch.focus();
    });
}

if (genreFilters) {
    genreFilters.addEventListener("click", (event) => {
        const button = event.target.closest(".filter-button");

        if (!button) {
            return;
        }

        filterByGenre(button.dataset.genre);
    });
}

if (sortBooks) {
    sortBooks.addEventListener("change", () => {
        sortFilteredBooks();

        displayBooks();
    });
}

if (resetFilters) {
    resetFilters.addEventListener("click", resetAllFilters);
}

if (modalClose) {
    modalClose.addEventListener("click", closeBookModal);
}

if (modalSave) {
    modalSave.addEventListener("click", () => {
        if (!currentBook) {
            return;
        }

        toggleReadingList(currentBook.id);
        updateModalSaveButton();
        updateSaveButtons();
    });
}

if (bookModal) {
    bookModal.addEventListener("click", (event) => {
        if (event.target === bookModal) {
            closeBookModal();
        }
    });
}

getBooks();
