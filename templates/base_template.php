<!DOCTYPE html>
<html lang="en">
<head>
	<meta charset="utf-8">
	<meta name="viewport" content="width=device-width, initial-scale=1">
	<link rel="stylesheet" type="text/css" href="assets/css/style.css">
	<?php if (!empty($module_scripts)) : ?>
		<?php foreach ($module_scripts as $script_path) : ?>
			<script type="module" src="<?php echo $script_path; ?>.js"></script>
		<?php endforeach; ?>
	<?php endif; ?>
	<title>
	<?php if (!empty($title)) : ?>
		<?php echo $title; ?>
	<?php else : ?>
		Bird recording manager
	<?php endif; ?>
	</title>
</head>
<body>
<div class="error-container hidden"></div>
<div class="main-container">
	<div class="search-container">
		<input type="text" name="bird-name" value="dendrocopos major" placeholder="Type a bird's generic name">
		<input type="button" name="search-button" value="Search">
	</div>
	<?php if (!empty($content)) : ?>
		<?php echo $content; ?>
	<?php endif; ?>
</div>
<?php if (!empty($scripts)) : ?>
	<?php foreach ($scripts as $script_path) : ?>
		<script src="<?php echo $script_path; ?>.js"></script>
	<?php endforeach; ?>
<?php endif; ?>
</body>
</html>
