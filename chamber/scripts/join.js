const timestamp = document.querySelector('#timestamp');

if (timestamp) {
    timestamp.value = new Date().toISOString();
}

const modalLinks = document.querySelectorAll('.modal-link');

modalLinks.forEach(link => {
    link.addEventListener("click", () => {
        const modalId = link.dataset.modal;
        const modal = document.querySelector(`#${modalId}`);

        modal.showModal();
    });
});

const closeButtons = document.querySelectorAll('.close-modal');

closeButtons.forEach(button => {
    button.addEventListener("click", () => {
        button.closest('dialog').close();
    });
});