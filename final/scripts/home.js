import {
    getReadingList
} from "./modules/storage.js";

// ELEMENTS

const featuredBooksContainer = document.querySelector("#featured-books");
const readingListCount = document.querySelector("#reading-list-count");

// BOOK DATA

let books = [];

// FETCH BOOKS

async function getBooks() {
    try {
        const response = await fetch("data/books.json");

        if (!response.ok) {
            throw new Error(`Unable to load books: ${response.status}`);
        }

        books = await response.json();

        displayFeaturedBooks();
    }

    catch (error) {
        console.error("Error loading books:", error);

        if (featuredBooksContainer) {
            featuredBooksContainer.innerHTML = `
                <p class="loading-message">
                    We couldn't load the featured books right now.
                    Please try again later.
                </p>
            `;
        }
    }
}

function displayFeaturedBooks() {
    if (!featuredBooksContainer) {
        return;
    }

    const featuredBooks = books.slice(0, 4);

    featuredBooksContainer.innerHTML = featuredBooks.map((book) => createBookCard(book)).join("");
}

function createBookCard(book) {
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
                <h3>
                    ${book.title}
                </h3>
                <p class="book-author">
                    ${book.author}
                </p>
                <p class="book-genre">
                    ${book.genre}
                </p>
                <a class="button button-secondary" href="books.html?book=${book.id}" aria-label="View details for ${book.title}">
                    Details
                </a>
            </div>
        </article>
    `;
}

function displayReadingListCount() {
    if (!readingListCount) {
        return;
    }

    const savedBooks = getReadingList();

    readingListCount.textContent = savedBooks.length;
}

// function getReadingList() {
//     try {
//         const savedBooks = localStorage.getItem("bookNookReadingList");

//         return savedBooks ? JSON.parse(savedBooks) : [];
//     }

//     catch(error) {
//         console.error("Unable to read the reading list:", error);
//         return [];
//     }
// }

getBooks();

displayReadingListCount();