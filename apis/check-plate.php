<?php
// main db connection
require_once('db-conn.php');

$plate_number = $_GET['plate'];
$plate_number = trim($plate_number);
$plate_number = preg_replace('/[^a-zA-Z0-9\']/', '', $plate_number);
$plate_number = substr($plate_number, 0, 7);

if (empty($plate_number)) {
    http_response_code(400);
    $res['msg'] = 'Invalid input parameters';
    echo "false";
    exit;
}

try {
    // create connection
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // prepare and execute 
    $stmt = $pdo->prepare("SELECT * FROM registered_plates WHERE plate_no = ?");
    $stmt->execute([$plate_number]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {

        header('Content-Type: application/json; charset=utf-8');
        echo "true";
    } else {
        header('Content-Type: application/json; charset=utf-8');
        echo "false";
    }
} catch (PDOException $e) {
    header('Content-Type: application/json; charset=utf-8');
    echo json_encode(array("error" => $e->getMessage()));
}
