document.addEventListener('DOMContentLoaded', function () {
    const inputBook = document.getElementById('inputBook');
    const submitData = document.getElementById('submitData');
    const incompleteLibraryList = document.getElementById('incompleteLibraryList');
    const completeLibraryList = document.getElementById('completeLibraryList');

    let books = [];

    function savingBooks() {
        localStorage.setItem('books', JSON.stringify(books));
        document.dispatchEvent(new Event("savebooks"));
    }

    function booksFromStorage() {
        const release = localStorage.getItem('books');
        const newData = JSON.parse(release);
    
        if (newData !== null) {
            books = newData;
            document.dispatchEvent(new Event("keepbooks"));
        }
    }    

    function booksToStorage() {
        savingBooks();
    }

    function newBookData(title, author, year, isComplete) {
        return {
            id: +new Date(),
            title,
            author,
            year: parseInt(year, 10),
            isComplete
        }
    }

    function updateLibrary() {
        incompleteLibraryList.innerHTML = '';
        completeLibraryList.innerHTML = '';

        books.forEach(book => {
            const listBooks = createListBooks(book);
            if (book.isComplete) {
                completeLibraryList.appendChild(listBooks);
            } else {
                incompleteLibraryList.appendChild(listBooks);
            }
        });
    }

    function toggleIsComplete(id) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books[index].isComplete = !books[index].isComplete;
            booksToStorage();
            updateLibrary();
        }
    }

    function addBook() {
        const inputBookTitle = document.getElementById('inputBookTitle').value;
        const inputBookAuthor = document.getElementById('inputBookAuthor').value;
        const inputBookYear = document.getElementById('inputBookYear').value;
        const inputBookIsComplete = document.getElementById('inputBookIsComplete').checked;

        const newBook = newBookData(inputBookTitle, inputBookAuthor, inputBookYear, inputBookIsComplete);
        books.push(newBook);
        booksToStorage();
        updateLibrary();

        document.getElementById('inputBookTitle').value = '';
        document.getElementById('inputBookAuthor').value = '';
        document.getElementById('inputBookYear').value = '';
        document.getElementById('inputBookIsComplete').checked = false;

        alert('Buku berhasil ditambahkan!');
    }

    function removeBook(id) {
        const index = books.findIndex(book => book.id === id);
        if (index !== -1) {
            books.splice(index, 1);
            booksToStorage();
            updateLibrary();
        }
    }

    submitData.addEventListener('click', function (e) {
        e.preventDefault();
        addBook();
    });

    searchBook.addEventListener('submit', function (e) {
        e.preventDefault();
        const research = searchBookTitle.value.toLowerCase().trim();
    
        const searchResults = books.filter(book => {
            return (
                book.title.toLowerCase().includes(research) ||
                book.author.toLowerCase().includes(research) ||
                book.year.toString().includes(research)
            );
        });
    
        searchSubmit(searchResults);
    });
    
    function searchSubmit(searchResults) {
        incompleteLibraryList.innerHTML = '';
        completeLibraryList.innerHTML = '';
    
        searchResults.forEach(book => {
            const listBooks = createListBooks(book);
            if (book.isComplete) {
                completeLibraryList.appendChild(listBooks);
            } else {
                incompleteLibraryList.appendChild(listBooks);
            }
        });
    }    
    
    function createListBooks(book) {
        const listBooks = document.createElement('article');
        listBooks.className = 'list_books';
        listBooks.style.margin = '1rem';

        const title = document.createElement('h3');
        title.textContent = 'Title: ' + book.title;
        title.style.color = 'whitesmoke';
        title.style.marginBottom = '1rem';

        const author = document.createElement('p');
        author.textContent = 'Author: ' + book.author;
        author.style.color = 'whitesmoke';
        author.style.marginBottom = '1rem';

        const year = document.createElement('p');
        year.textContent = 'Year: ' + book.year;
        year.style.color = 'whitesmoke';
        year.style.marginBottom = '1rem';

        const removeButton = createIndexButtons('Hapus buku', 'black', function () {
            removeBook(book.id);
        });

        removeButton.style.padding = '1rem';
        removeButton.style.margin = '1rem'
        removeButton.style.borderRadius = '15px';
        removeButton.style.backgroundColor = 'yellow';
        removeButton.style.border = '0';
        removeButton.style.color = 'black';

        let toggleButton;
        if (book.isComplete) {
            toggleButton = createIndexButtons('Belum selesai di Baca', 'brown', function () {
                toggleIsComplete(book.id);
            });
        } else {
            toggleButton = createIndexButtons('Selesai dibaca', 'blue', function () {
                toggleIsComplete(book.id);
            });
        }

        toggleButton.style.padding = '1rem';
        toggleButton.style.borderRadius = '15px';
        toggleButton.style.border = '15px';
        toggleButton.style.backgroundColor = 'gray';
        toggleButton.style.color = 'whitesmoke';

        const indexButtons = document.createElement('div');
        indexButtons.className = 'index';
        indexButtons.appendChild(toggleButton);
        indexButtons.appendChild(removeButton);

        listBooks.appendChild(title);
        listBooks.appendChild(author);
        listBooks.appendChild(year);
        listBooks.appendChild(indexButtons);

        return listBooks;
    }

    function createIndexButtons(text, className, clickHandler) {
        const button = document.createElement('button');
        button.textContent = text;
        button.classList.add(className);
        button.addEventListener('click', clickHandler);
        return button;
    }

    booksFromStorage();
    updateLibrary();
});

window.onscroll = function() {
    const anonymousElement = document.querySelector('.anonymous-element');

    if (anonymousElement) {
        const anonymousToToggle = document.querySelectorAll('.anonymous-to-toggle');
        anonymousToToggle.forEach(function(anonymous) {
            anonymous.classList.toggle('HTMLDocument.<anonymous>');
        });
    }
};

