
$(document).ready(function () {
    $("ul").hide();
});
$("button").click(function () {
    $("ul").show();
    $(function () {
        var term = document.getElementById('search').value; //or get the value from a textbox user input; you can Google how to do it.
        var parameter = "?q=" + term + "&startIndex=0&maxResults=20";
        var service_point = "https://www.googleapis.com/books/v1/volumes/" + parameter;
        $.getJSON(service_point, function (json) {
            console.log(json);
            var total = json.totalItems;
            $("#total").text(total);
            var resultHTML = "";
            for (i in json.items) {
                var booktitle = json.items[i].volumeInfo.title;
                var bookid = json.items[i].id;
                var cover = "";
                if (json.items[i].volumeInfo.imageLinks != null)
                    cover = json.items[i].volumeInfo.imageLinks.smallThumbnail;
                resultHTML += "<div class='bookdiv'>";
                resultHTML += "<img src='" + cover + "' style='float: left' />";
                resultHTML += "<a href='bookinfo.html?id=" + bookid + "'>" + booktitle + "</a>";
                resultHTML += "</div>";
            }
            $("#results").html(resultHTML);
            $(".bookdiv").css("width", "300px");
        });
    });
});
