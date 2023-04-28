<?php
// main db connection
require_once('db-conn.php');

$created_by = $_GET['created_by'];

try {
    // create connection
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

    // prepare and execute 
    $stmt2 = $pdo->prepare("SELECT * FROM audit_trails where created_by = '$created_by' ORDER BY id DESC");
    $stmt2->execute();
    $data = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(array("error" => $e->getMessage()));
    // echo json_encode(array("error" => 'Error'));
}
