<?php
	$file = fopen("scenes/" . $_POST["scenename"] . ".json", "r");
	$fileContent = fread($file,filesize("scenes/" . $_POST["scenename"] . ".json"));
	echo $fileContent;
	fclose($file);
?>