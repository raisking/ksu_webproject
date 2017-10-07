<!DOCTYPE html>

<html>
<head>
	<title>HTTP REST method PUT demo</title>
</head>

<body>

<script>
    $(function(){
        $.ajax('http://jsonplaceholder.typicode.com/posts/1', {
          method: 'PUT',
          data: {
            id: 1,
            title: 'foo',
            body: 'bar',
            userId: 1
          }
        }).then(function(data) {
          console.log(data);
        });
    })
</script>

<p>Use browser developer tools Console to check the logged response. This example is only for demonstration purpose only. The AJAX method will be covered later.</p>
</body>


</html>