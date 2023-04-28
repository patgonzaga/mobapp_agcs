<?php
// main db connection
require_once('db-conn.php');

$id = $_GET['id'];
$status = $_GET['status'];
try {
    // create connection
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

    // prepare and execute 
    $stmt2 = $pdo->prepare("UPDATE users SET status = '$status' where id = $id");
    $stmt2->execute();
    $stmt2 = $pdo->prepare("SELECT * FROM users where is_admin = 0");
    $stmt2->execute();
    $data = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(array("error" => $e->getMessage()));
    // echo json_encode(array("error" => 'Error'));
}
