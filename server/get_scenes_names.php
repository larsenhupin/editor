<?php
$dir    = 'scenes';
$files = scandir($dir);
echo json_encode($files);
?>