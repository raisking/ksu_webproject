<?php
	//the file_get_contents function will get the content from the URL
    //the following URL search the books with "php" keywords - you may accept that from user input
    // see http://it-ebooks-api.info/ for service API guide
    $service_point ="http://it-ebooks-api.info/v1/search/php";
	$resource=file_get_contents($service_point);
?>