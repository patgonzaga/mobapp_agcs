<?php
// main db connection
require_once('db-conn.php');


try {
    // create connection
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

    // prepare and execute 
    $stmt2 = $pdo->prepare("SELECT a.*, b.fullname FROM registered_plates a LEFT JOIN users b ON (a.created_by = b.username)");
    $stmt2->execute();
    $data = $stmt2->fetchAll(PDO::FETCH_ASSOC);

    header('Content-Type: application/json; charset=utf-8');
    echo json_encode($data);
} catch (PDOException $e) {
    echo json_encode(array("error" => $e->getMessage()));
    // echo json_encode(array("error" => 'Error'));
}
