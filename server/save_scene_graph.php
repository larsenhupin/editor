<?php
$myFile =  "scenes/" . $_POST["name"] . ".json";
$fh = fopen($myFile, 'w');
$stringData = $_POST["data"];
echo fwrite($fh, $stringData);
fclose($fh)
?>