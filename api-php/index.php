<?php
require('iframe.php');
require('/mnt/x/Data/www/MAD/apps/exdon/includes/classes/API.php');
require('vendor/autoload.php');

// $mongo = new MongoDB\Driver\Manager("mongodb://localhost:27017"); // connect
// $mongo = new MongoClient();
$mongo = new \MongoDB\Client;
$db = $mongo->Nodet;
$trees_collection = $db->Tree;

// header("Access-Control-Allow-Origin: *");
// header("Content-Type: application/json");

$api = new API;

$api->post('/trees', function() {

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
		// $i = 0;
		// while(1) {
		// 	if(isset($document->$i)) 
		// 		$tree['data'][] = $document->$i;
		// 	else break;
		// 	$i++;
		// }

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
