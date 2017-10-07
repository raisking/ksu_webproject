<!DOCTYPE html>

<html>
<head>
	<title>IT eBooks Search</title>
    <script src="https://code.jquery.com/jquery-2.1.4.min.js"></script>
</head>

<body>

<?php
    $service_point ="http://jsonplaceholder.typicode.com/posts/1/comments";
	$resource=file_get_contents($service_point);
?>

<script>
    $(function(){
        //dump json file content to a JavaScript JSON object
        var json = <?php echo $resource; ?>;

        var resultsHTML="";
        for (i in json)
        {
            resultsHTML+="<h3>"+json[i].id+". ";
            resultsHTML+=json[i].name+ " - ";
            resultsHTML+=json[i].email+ "</h3>";
            resultsHTML+="<p>"+json[i].body+ "</p>";
            resultsHTML+="<hr>";
        }
        $("#results").html(resultsHTML);
    })
</script>

<h1>Comments</h1>
<div id="results"></div>

</body>


</html>