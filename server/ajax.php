<?php

$arr_file_types = ['glb', 'gltf'];

$path = $_FILES['file']['name'];
$ext = pathinfo($path, PATHINFO_EXTENSION);

if(!(in_array($ext, $arr_file_types))){
	// return error messages
	echo "false";
	return;
}

if(!file_exists('uploads')){
	mkdir('uploads', 0777);
}

move_uploaded_file($_FILES['file']['tmp_name'], 'uploads/' . time() . '_' . $_FILES['file']['name']);


// echo a js object
echo 'uploads/' . time() . '_' . $_FILES['file']['name'];