var books = [];
var authors = {};
var rank = [];

//NavBar Controller
document.addEventListener('DOMContentLoaded', () => {

	// Get all "navbar-burger" elements
	const $navbarBurgers = Array.prototype.slice.call(document.querySelectorAll('.navbar-burger'), 0);

	// Check if there are any navbar burgers
	if ($navbarBurgers.length > 0) {

		// Add a click event on each of them
		$navbarBurgers.forEach(el => {
			el.addEventListener('click', () => {

				// Get the target from the "data-target" attribute
				const target = el.dataset.target;
				const $target = document.getElementById(target);

				// Toggle the "is-active" class on both the "navbar-burger" and the "navbar-menu"
				el.classList.toggle('is-active');
				$target.classList.toggle('is-active');

			});
		});
	}
});

//Importers
var openTxt = function (event) {
	var input = event.target;

	//Foreach booklist, add the books to the books array
	Array.from(input.files).forEach(file => {

		//Create a new reader
		var reader = new FileReader();

		//When read the list, save the books in the books list
		reader.onload = function () {
			var text = reader.result;
			var names = text.split("\n");

			names.forEach(name => {
				if (name)
					books.push(name.toLowerCase());

			});

			updateRank();
		};

		//Read book list
		reader.readAsText(file);
	});
};

var importState = function (event) {
	var input = event.target;

	//Create a new reader
	var reader = new FileReader();

	//When read the list, save the books in the books list
	reader.onload = function () {
		var result = JSON.parse(reader.result);
			
		books = JSON.parse(result.books);
		rank = JSON.parse(result.rank);
		authors = JSON.parse(result.authors);

		updateRank();
	};

	//Read book list
	reader.readAsText(input.files[0]);
};

//Exporters
var exportState = function(){
	var data = {"books": JSON.stringify(books), "authors": JSON.stringify(authors), "rank": JSON.stringify(rank)};
	exportToJsonFile(data);
}
	
var exportToJsonFile = function(jsonData) {
    let dataStr = JSON.stringify(jsonData);
    let dataUri = 'data:application/json;charset=utf-8,'+ encodeURIComponent(dataStr);

    let exportFileDefaultName = 'books-save.json';

    let linkElement = document.createElement('a');
    linkElement.setAttribute('href', dataUri);
    linkElement.setAttribute('download', exportFileDefaultName);
    linkElement.click();
}

//Books Updaters
var updateRank = function () {
	//Create Rank of most ocurrences of the books
	var booksGroup = _.groupBy(books, book => book);

	//Order by most ocurrences
	rank = _.orderBy(booksGroup, [countArray => countArray.length, x => x[0]], 'desc');

	//Clean Sections
	document.getElementById("topBooks").innerHTML = "";
	document.getElementById("goodBooks").innerHTML = "";

	for (var i = 0; i < 3 && rank.length > 0; i++) {
		var book = rank.shift();

		var title = book[0];
		var author = authors[book[0]] != undefined ? authors[book[0]] : "";
		var ocurrences = book.length;
				
		var card = `
		<div class="card" style="margin-bottom: 10px">
		  <div class="card-content">
		    <p class="title" style="text-transform: capitalize;">
		      ${title}
		    </p>
		    <p class="subtitle" style="text-transform: capitalize;">
			   ${author}
		    </p>
		  </div>
		  <footer class="card-footer">
		    <p class="card-footer-item">
		      Ocurrences: ${ocurrences}
		    </p>
		    <p class="card-footer-item">
			  <a onClick="editBook('${title}')" >Edit</a>
		    </p>
		  </footer>
		</div>`
		document.getElementById("topBooks").innerHTML += card;
	}

	loadNextPage();
}

var loadNextPage = function () {
	for (var i = 0; i < 5 && rank.length > 0; i++) {
		var book = rank.shift();
		
		var title = book[0];
		var author = authors[book[0]] != undefined ? authors[book[0]] : "";
		var ocurrences = book.length;

		var card = `
		<div class="card" style="margin-bottom: 10px">
		  <div class="card-content">
		    <p class="title" style="text-transform: capitalize;">
		      ${title}
		    </p>
		    <p class="subtitle" style="text-transform: capitalize;">
			   ${author}
		    </p>
		  </div>
		  <footer class="card-footer">
		    <p class="card-footer-item">
		      Ocurrences: ${ocurrences}
		    </p>
		    <p class="card-footer-item">
			  <a onClick="editBook('${title}')">Edit</a>
		    </p>
		  </footer>
		</div>`
		document.getElementById("goodBooks").innerHTML += card;
	}
}

//Editor`s functions
var toggleEditorModal = function () {
	document.getElementById("editorModal").classList.toggle("is-active");
}

var editBook = function (bookname) {
	selectedBook = bookname;

	document.getElementById("editorTitle").value = bookname;
	document.getElementById("editorAuthor").value = authors[selectedBook] != undefined ? authors[selectedBook] : "";

	toggleEditorModal();
}

var saveBook = function(){
	books.map(function(item) { return item.toLowerCase() == selectedBook ?  document.getElementById("editorTitle").value : item.toLowerCase();});
	authors[selectedBook] = document.getElementById("editorAuthor").value;
	updateRank();
	toggleEditorModal();
}
