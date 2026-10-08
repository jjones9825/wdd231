import {
    getReadingList,
    toggleReadingList
} from "./modules/storage.js";

const readingListGrid = document.querySelector("#reading-list-grid");
const emptyReadingList = document.querySelector("#empty-reading-list");

const totalBooks = document.querySelector("#total-books");
const favoriteGenre = document.querySelector("#favorite-genre");
const totalPages = document.querySelector("#total-pages");
const savedBookCount = document.querySelector("#saved-book-count");

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
let savedBooks = [];
let currentBook = null;

async function getBooks () {
    try {
        const response = await fetch("data/books.json");

        if (!response.ok) {
            throw new Error (`Unable to load books: ${response.status}`);
        }

        books = await response.json();

        loadReadingList();
    }

    catch (error) {
        console.error("Error loading books:", error);

        if(readingListGrid) {
            readingListGrid.innerHTML = `
                <p class="loading-message">
                    We're sorry. Your reading list could not be loaded right now.
                    Please try again later.
                </p>
            `;
        }
    }
}

function loadReadingList() {
    const savedIds = getReadingList();

    savedBooks = books.filter((book) => 
        savedIds.some((savedId) => String(savedId) === String(book.id))
    );

    displayReadingList();
    displayStats();
}

function displayReadingList() {
    if (!readingListGrid || !emptyReadingList) {
        return;
    }

    if (savedBooks.length === 0) {
        readingListGrid.innerHTML = "";
        emptyReadingList.hidden = false;
        return;
    }

    emptyReadingList.hidden = true;

    readingListGrid.innerHTML = savedBooks.map((book) => createBookCard(book)).join("");

    addBookCardListeners();
}

function createBookCard(book) {
    return `
        <article class="book-card">

            <img class="book-card-image" src="${book.cover}" alt="Cover of ${book.title}" width="300" height="450" loading="lazy">

            <div class="book-card-content">
                <p class="book-genre">${book.genre}</p>

                <h3>${book.title}</h3>

                <p class="book-author">${book.author}</p>

                <p class="book-rating">★ ${book.rating}</p>
                
                <button type="button" class="button button-secondary details-button" data-id="${book.id}">
                    View Details
                </button>

                <button type="button" class="button remove-button" data-id="${book.id}" aria-label="Remove ${book.title} from your reading list">
                    Remove from List
                </button>
            </div>
        </article>
    `;
}

function addBookCardListeners() {
    const detailButtons = document.querySelectorAll(".details-button");

    detailButtons.forEach((button) => {
        button.addEventListener("click", () => {
                const bookId = button.dataset.id;

                openBookModal(bookId);
        });
    });

    const removeButtons = document.querySelectorAll(".remove-button");

    removeButtons.forEach((button) => {
        button.addEventListener("click", () => {
            const bookId = button.dataset.id;

            removeFromReadingList(bookId);
        });
    });
}

function removeFromReadingList(bookId) {
    toggleReadingList(bookId);

    loadReadingList();
}

function displayStats() {
    const bookTotal = savedBooks.length;

    const pageTotal = savedBooks.reduce((total, book) => total + Number(book.pages), 0);

    const genreCounts = {};

    savedBooks.forEach((book) => {
        if (genreCounts[book.genre]) {
            genreCounts[book.genre]++;
        }
        else {
            genreCounts[book.genre] = 1;
        }
    
    });

    const mostPopularGenre = Object.entries(genreCounts).sort((a, b) => b[1] - a[1]) [0]?.[0] || "-";

    if (totalBooks) {
        totalBooks.textContent = bookTotal;
    }

    if (savedBookCount) {
        savedBookCount.textContent = bookTotal;
    }

    if (totalPages) {
        totalPages.textContent = pageTotal.toLocaleString();
    }

    if (favoriteGenre) {
        favoriteGenre.textContent = mostPopularGenre;
    }
}

function openBookModal(bookId) {
    currentBook = books.find((book) => String(book.id) === String(bookId));

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

function updateModalSaveButton() {
    if (!currentBook || !modalSave) {
        return;
    }

    const savedIds = getReadingList();

    const isSaved = savedIds.some((id) => String(id) === String(currentBook.id));

    if (isSaved) {
        modalSave.textContent = "✔ Remove from Reading List";
    }

    else {
        modalSave.textContent = "Save to Reading List";
    }
}

function closeBookModal() {
    if (bookModal) {
        bookModal.close();
    }

    currentBook = null;
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

        loadReadingList();
        
        closeBookModal();
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