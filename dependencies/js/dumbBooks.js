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
			  <a>Edit</a>
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
			  <a>Edit</a>
		    </p>
		  </footer>
		</div>`
		document.getElementById("goodBooks").innerHTML += card;
	}
}
