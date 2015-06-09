<?php
$data = array(
	'1' => array(
		'title' => 'Lorem Ipsum'
		),
	'2' => array(
		'title' => 'Lorem Ipsum Dolor'
		)
	);

if (filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT) == '1') {
	$data = $data[1];
} else if (filter_input(INPUT_POST, 'id', FILTER_SANITIZE_NUMBER_INT) == '2') {
	$data = $data[1];
} else {
	$data = array('error' => 'Lorem Ipsum Dolor Sit Error', 'query' => $_SERVER['QUERY_STRING']);
}

header('Content-Type: application/json');
echo json_encode($data);
?>