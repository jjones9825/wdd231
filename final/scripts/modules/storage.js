const readingListKey = "bookNookReadingList";

export function getReadingList() {
    try {
        const savedBooks = localStorage.getItem(readingListKey);

        return savedBooks ? JSON.parse(savedBooks) : [];
    }

    catch (error) {
        console.error("Unable to read reading list:", error);

        return [];
    }
}

function saveReadingList(readingList) {
    localStorage.setItem(readingListKey, JSON.stringify(readingList));
}

export function isBookSaved(bookId) {
    const readingList = getReadingList();

    return readingList.some((id) => String(id) === String(bookId));
}

export function toggleReadingList(bookId) {
    const readingList = getReadingList();

    const existingIndex = readingList.findIndex((id) => String(id) === String(bookId));

    if (existingIndex === -1) {
        readingList.push(bookId);
    }

    else {
        readingList.splice(existingIndex, 1);
    }

    saveReadingList(readingList);
    return readingList;
}