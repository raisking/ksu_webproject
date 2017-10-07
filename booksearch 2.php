<!DOCTYPE html>

<html>
<head>
	<title>Google Books Search</title>
    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
</head>

<body>
<h1 id="title"></h1>


<h1> Google Book Search </h1>

<form action= "https://www.googleapis.com/books/v1/volumes?q=" method="get">
</form>
<input id="search"> <button>Search</button>
<h2>Total: <span id="total"></span></h2>
<div id="results" style="display: flex; flex-wrap: wrap;"></div>

 
 <script>
$(document).ready(function(){
$("ul").hide();
});
  $("button").click(function(){
    $("ul").show();
    $(function(){
		var term = document.getElementById('search').value; //or get the value from a textbox user input; you can Google how to do it.
		var parameter="?q="+term+"&startIndex=0&maxResults=40"; 
		var service_point="https://www.googleapis.com/books/v1/volumes/"+parameter;
        $.getJSON(service_point, function (json)
        {
			console.log(json);
			var total=json.totalItems;
			$("#total").text(total); 
			
			var resultHTML="";
			for (i in json.items)
			{
				var booktitle=json.items[i].volumeInfo.title;
				var bookid=json.items[i].id;
				var cover="";
				if (json.items[i].volumeInfo.imageLinks != null)
					cover=json.items[i].volumeInfo.imageLinks.smallThumbnail;

				resultHTML+="<div class='bookdiv'>";
				resultHTML+="<img src='"+cover+"' style='float: left' />";
				resultHTML+="<a href='bookinfo.php?id="+bookid+"'>"+booktitle+"</a>";
				resultHTML+="</div>";;
			}
			$("#results").html(resultHTML); 
			$(".bookdiv").css("width", "300px");
		});
    });
  });

</script>

</body>
</html>