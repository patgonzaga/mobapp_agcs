<?php
// main db connection
require_once('db-conn.php');

$email = $_GET['email'];
$user_name = $_GET['username'];
$pass_word = $_GET['password'];

$module = 'User registration.';
$action = 'New user';
$created_by = $email;
$created_at = date('Y-m-d H:i:s');

$res = [];

try {
    // create connection
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);

    // prepare and execute 
    $stmt = $pdo->prepare("SELECT * FROM users WHERE username = '$user_name'");
    $stmt->execute();
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        header('Content-Type: application/json; charset=utf-8');
        $res['msg'] = 'Username already exist!';
        $res['status'] = false;

        echo json_encode($res);
        exit;
    }

    $stmt2 = $pdo->prepare("INSERT INTO `users`(`email`, `username`, `password`) VALUES ('$email','$user_name','$pass_word')");
    $stmt2->execute();

    $stmt3 = $pdo->prepare("SELECT * FROM users WHERE username = '$user_name'");
    $stmt3->execute();
    $data3 = $stmt3->fetch(PDO::FETCH_ASSOC);

    header('Content-Type: application/json; charset=utf-8');

    if ($data3) {

        $insertStmt = $pdo->prepare("INSERT INTO `audit_trails`(`module`, `action`, `created_by`,`created_at`) VALUES ('$module','$action','$user_name','$created_at')");
        $insertStmt->execute();

        $data3['msg'] = 'Successfully registered!';
        $data3['status'] = true;

        echo json_encode($data3);
        exit;
    } else {
        $res['msg'] = 'Failed to register.';
        $res['status'] = false;

        echo json_encode($res);
        exit;
    }
} catch (PDOException $e) {
    echo json_encode(array("error" => $e->getMessage()));
    // echo json_encode(array("error" => 'Error'));
}
