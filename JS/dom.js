const books = [];
const RENDER_EVENT = 'render-book';

function addBook() {
    // Mendapatkan data buku form
    const textBook = document.getElementById('title').value;
    const timestamp = document.getElementById('Author').value;
    const textBook1 = document.getElementById('Years').value;

    const generatedID = generatedId();
    const bookObject = generatedBookObject(generatedID, textBook, timestamp, textBook1, false);
    books.push(bookObject);

    document.dispatchEvent(new Event(RENDER_EVENT));
    // localStroge
    saveData();
}

function generatedId() {
    // Membuat random ID untuk generatedBookObject()
    return +new Date();
}

function generatedBookObject(id, title, author, years, isCompleted) {
    // array pada DOM
    return {
        id,
        title,
        author,
        years,
        isCompleted,
    };
}

document.addEventListener(RENDER_EVENT, function() {
    // completedBOOKList = belum selesai dibaca
    //  uncompletedBOOKList = sudah selesai dibaca

    const uncompletedBOOKList = document.getElementById('books');
    uncompletedBOOKList.innerHTML = '';

    const completedBOOKList = document.getElementById('completed-books');
    completedBOOKList.innerHTML = '';

    for (bookItem of books) {
        const bookElement = makeBook(bookItem);

        if (bookItem.isCompleted) completedBOOKList.append(bookElement);
        else uncompletedBOOKList.append(bookElement);
    }
});

function makeBook(bookObject) {
    // membuat element yang tersimpan dalam DOM
    const textTitle = document.createElement('h2');
    textTitle.innerText = bookObject.title;

    const textAuthor = document.createElement('h5');
    textAuthor.innerText = bookObject.author;

    const textTimestamp = document.createElement('p');
    textTimestamp.innerText = bookObject.years;

    const textContainer = document.createElement('div');
    textContainer.classList.add('inner');
    textContainer.append(textTitle, textAuthor, textTimestamp);

    const container = document.createElement('div');
    container.classList.add('item', 'shadow');
    container.append(textContainer);
    container.setAttribute('id', `book-${bookObject.id}`);

    if (bookObject.isCompleted) {
        // menangkap undoButton
        const undoButton = document.createElement('button');
        undoButton.classList.add('undo-button');

        undoButton.addEventListener('click', function() {
            undoTaskFromCompleted(bookObject.id);
        });

        // menangkap trashButton
        const trashButton = document.createElement('button');
        trashButton.classList.add('trash-button');

        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(bookObject.id);
        });

        container.append(undoButton, trashButton);
    } else {
        // icon checkButton dan trashButton pada belum selesai dibaca
        const checkButton = document.createElement('button');

        const trashButton = document.createElement('button');
        checkButton.classList.add('check-button');
        trashButton.classList.add('trash-button');

        checkButton.addEventListener('click', function() {
            addTaskToCompleted(bookObject.id);
        });

        trashButton.addEventListener('click', function() {
            removeTaskFromCompleted(bookObject.id);
        });
        container.append(checkButton);
        container.append(trashButton);
    }

    return container;
}

function addTaskToCompleted(bookId) {
    // menjalankan fungsi checkButton
    const bookTarget = findBook(bookId);
    if (bookTarget == null) return;

    bookTarget.isCompleted = true;
    document.dispatchEvent(new Event(RENDER_EVENT));
    // localStroge
    saveData();
}

function findBook(bookId) {
    // mencari book dengan ID yang sesuai dengan arry books
    for (bookItem of books) {
        if (bookItem.id === bookId) {
            return bookItem;
        }
    }
    return null;
}

function removeTaskFromCompleted(bookId) {
    // menjalankan remove
    const bookTarget = findBookIndex(bookId);
    if (bookTarget === -1) return;
    books.splice(bookTarget, 1);

    document.dispatchEvent(new Event(RENDER_EVENT));
    // localStroge
    saveData();
}

function undoTaskFromCompleted(bookId) {
    // menjalankan undo
    const bookTarget = findBook(bookId);
    if (bookTarget === null) return;

    bookTarget.isCompleted = false;

    document.dispatchEvent(new Event(RENDER_EVENT));
    // localStroge
    saveData();
}