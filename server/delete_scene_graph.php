<?php
	echo rename ("scenes/" . $_POST["text"] . ".json", "deleted_scenes/" . $_POST["text"] . ".json");
?>