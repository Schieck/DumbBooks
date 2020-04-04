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

			//updateRank();
		};

		//Read book list
		reader.readAsText(file);
	});
};