<!DOCTYPE html>

<html>
<head>
	<title>IT eBooks Search</title>
    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
</head>

<body>

<?php
	//the file_get_contents function will get the content from the URL
    //the following URL search the books with "php" keywords - you may accept that from user input
    // see http://it-ebooks-api.info/ for service API guide
    $service_point ="http://it-ebooks-api.info/v1/search/javascript";
	$resource=file_get_contents($service_point);
?>
    <form>
        <p>Enter Search Terms:</p>
        <input type="text" name="q" value=""/>
        <p>Select Page Number:</p>
   
        <input type="submit" value="Search"/> 
    </form>
	
<div id="results" style="display: flex; flex-wrap: wrap;"></div>
<h1>Book Reseach Results</h1>
<script>
    $(function(){
        //dump json file content to a JavaScript JSON object
        var json = <?php echo $resource; ?>;

        var booksHTML="";
        for (i in json.Books)
        {
            booksHTML+="<br><img src='"+json.Books[i].Image+ "' height='100' style='float:left'>";
            booksHTML+="<h3>"+json.Books[i].Title+ "</h3>";
            booksHTML+="<a href='itebooks-book.php?id="+json.Books[i].ID+"'>Link to detail book information</a><br>";
            booksHTML+="<a href='http://it-ebooks-api.info/v1/book/"+json.Books[i].ID+"'>See this book's JSON</a>"
            booksHTML+="<hr>";
        }
        $("#results").html(booksHTML);
    })
</script>



<div id="results"></div>

</body>


</html>