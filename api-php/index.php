<?php
require('iframe.php');
require('/mnt/x/Data/www/MAD/apps/exdon/includes/classes/API.php');
require('vendor/autoload.php');

// $mongo = new MongoDB\Driver\Manager("mongodb://localhost:27017"); // connect
// $mongo = new MongoClient();
$mongo = new \MongoDB\Client;
$db = $mongo->Nodet;
$trees_collection = $db->Tree;

header("Access-Control-Allow-Origin: *");
header("Content-Type: application/json");
// header('Access-Control-Allow-Headers: Origin, X-Requested-With, Content-Type, Access-Control-Allow-Origin');
// header('Access-Control-Allow-Methods: POST, GET, OPTIONS, PUT, DELETE');

$api = new API;

$api->get('/trees/{tree_id}', function($tree_id_str) use ($trees_collection) {
	$tree_id = new MongoDB\BSON\ObjectId($tree_id_str);
	$document = $trees_collection->findOne(array("_id" => $tree_id));

	$tree = array(
		'name'	=> $document->name,
		'id'	=> $tree_id_str,
		'data'	=> $document->data
	);

	showSuccess(array('data' => $tree));
});

$api->post('/trees/{tree_id}', function($tree_id_str) use ($trees_collection) {
	$tree_id = new MongoDB\BSON\ObjectId($tree_id_str);
	$post_raw = file_get_contents("php://input");
	$post = json_decode($post_raw);

	$tree = array(
		"data" => $post->data->data,
		"name" => $post->tree_name
	);
	$trees_collection->updateOne(["_id" => $tree_id], ['$set' => $tree]);

	showSuccess(array('data' => $tree));
});

$api->post('/trees', function() {
	global $trees_collection;

	$post_raw = file_get_contents("php://input");
	$post = json_decode($post_raw);

	$insert = $trees_collection->insertOne(array(
		"data" => $post->data->data,
		"name" => $post->tree_name
	));
	$id = $insert->getInsertedId();

	if($insert->getInsertedCount())	showSuccess(array('id' => $id));
	else showError("Can't insert document");
});

$api->get('/trees', function() use ($trees_collection) {
	$cursor = $trees_collection->find();

	$all_trees = array();
	foreach ($cursor as $document) {
		$id = new MongoDB\BSON\ObjectId($document->_id);
		$tree = array(
			'name'	=> $document->name,
			'id'	=> $id->__toString(),
			'data'	=> false
		);

		$all_trees[] = $tree;
	}

	showSuccess(array('data' => $all_trees));
});


$api->notFound(function() {
	http_response_code(404);
	print "404";
});

$api->handle();

function showSuccess($message, $extra = array()) {
	showSituation('success', $message, $extra);
}

function showError($message, $extra = array()) {
	showSituation('error', $message, $extra);
}

function showSituation($status, $message, $extra) {
	$other_status = ($status == 'success') ? 'error' : 'success';
	$return = array($status => true, $other_status => false);

	if(is_string($message)) {
		$return[$status] = $message;

	} elseif(is_array($message)) {
		$return = array_merge($return, $message);
	} 

	$return = array_merge($return, $extra);

	print json_encode($return);
}
