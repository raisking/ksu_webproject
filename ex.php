
<!DOCTYPE html>
<html>
	<head>
		<title>Google Books Search</title>
		<script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
		
		<!-- Latest compiled and minified CSS -->

		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap.min.css">

		<!-- Optional theme -->
		<link rel="stylesheet" href="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/css/bootstrap-theme.min.css">

		<!-- Latest compiled and minified JavaScript -->
		<script src="https://maxcdn.bootstrapcdn.com/bootstrap/3.3.5/js/bootstrap.min.js"></script>
	
		<style>
			body {
				margin-left : 10%;
				margin-right : 10%;
			}
			form {
				margin : 0 auto;
			}
			.row {
				padding : 20px;
			}
			
			.book {
				padding: 0;
				border: none;
				background: none;
			}
		</style>
	</head>
		<body>

		<h1 id = "title">Google Book Search</h1>
		<div class = "form">
			<form class = "searchForm" method = "get">
				<input class = "input" type = "text" name = "querie" placeholder = "querie" style = "width : 66.67%;"/>
				<button id = "searchButton" style = "display: inline-block;" name = "searchButton" type = "submit" value="1">Search</button>
			</form>
			
		</div>
		<div id = "results">
			<form class = "book" method = "get">
			</form>
			<!--Single book display -->
			<div class = "singleBook"><br><br></div>
		</div>
		
		<script>
			$(function() {
				var json = ;
				var input = null;
				var book = null;
				
				//alert("queried " + input);
				
				if (json != null){
					// Changing the value of the input text		
					$(".input").val(input);
					
					// check to see if it's a single book rather than a list of books
					if(book) {
						
						var title = json.items[0].volumeInfo.subtitle != null ? json.items[0].volumeInfo.subtitle :
									json.items[0].volumeInfo.title;
						
						var bookInfo = "<p><b>Book Title: " + title + "</b></p>"; // Title of book
						
						bookInfo += "<p><b>Authors:</b> ";
						for(var j = 0; j < json.items[0].volumeInfo.authors.length; j++){
							bookInfo += j == 0 ? "" : ", ";
							bookInfo += json.items[0].volumeInfo.authors;
						}
						bookInfo += "</p>"; // End paragraph for authors
						
						bookInfo += "<p><b>Published Date: </b>" + json.items[0].volumeInfo.publishedDate + "</p>"; // Published date
						bookInfo += "<p><b>Description: </b>" + json.items[0].volumeInfo.description + "</p>"; // Description
						bookInfo += "<p><b>ISBN 13: </b>" + json.items[0].volumeInfo.industryIdentifiers[1].identifier + "</p>"; // ISBN 13
						var bookImage = "<img src = '" + json.items[0].volumeInfo.imageLinks.thumbnail +
											"' alt = 'Book Image' align = 'left' clear = 'none' height = '250' width = '250'/>"; // Image link, 128px x 163px
											
						$(".singleBook").append("<div class = 'col-md-3'>" + bookImage + "</div>" +
												"<div class = 'col-md-9' style = 'height : 250px;'>" + bookInfo +
											"</div>");
					}
					
					else {
						var booksPerPage = 10;
						//alert("total books: " + json.totalItems);
						
						for(var i = 0; i < booksPerPage; i++) {
							var image = "<img src = '" + json.items[i].volumeInfo.imageLinks.thumbnail +
										"' alt = 'Book Image' height = '128' width = '163'/>";
							var title = json.items[i].volumeInfo.subtitle != null ? json.items[i].volumeInfo.subtitle :
								json.items[i].volumeInfo.title;

							var bookLink = json.items[i].selfLink;
							bookLink = bookLink.substring(44); // Getting the last link
							
							$(".book").append("<div class = 'row col-md-6'>" +
											image + "<br>" + "<button name = 'book' value = '" +
											bookLink + "'>" + title + "</button>"+ "</div>");
						}
						
						var numberOfPages = Math.ceil(json.totalItems / booksPerPage) > 10 ? 10 :
											Math.ceil(json.totalItems / booksPerPage);
						// Paging
						if(json.totalItems > booksPerPage){
										
							for(var j = 1; j <= numberOfPages; j++)
								$(".searchForm").append("<button type = 'submit' name = 'searchButton' value = '" + j + "'>" + j +"</button>");
							
						}
						
					}
				}
				else{
					alert("No book was found for: " + input);
				}
			});
			
		</script>

	</body>
</html>