<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" href="assets/css/style.css">
	<script type="module" src="assets/js/script.js"></script>
	<title> <?php echo $title; ?> </title>
</head>
<body>
<div class="main-container">
	<div class="search-container">
		<input type="text" name="bird-name" placeholder="Type a bird's generic name">
		<input type="button" name="search-bird-name" value="Search">
	</div>
	<div class="bird-recordings">
		<?php echo $content; ?>
	</div>
</div>
<?php echo $script; ?>
</body>
</html>
