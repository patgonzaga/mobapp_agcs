<?php
// main db connection
require_once('db-conn.php');

$rfid = $_GET['rfid'];
$rfid = trim($rfid);

$plate_number = $_GET['plate'];
$plate_number = trim($plate_number);
$plate_number = preg_replace('/[^a-zA-Z0-9\']/', '', $plate_number);
$plate_number = substr($plate_number, 0, 7);

$time_in = date('Y-m-d H:i:s');
if (empty($rfid) || empty($plate_number)) {
    // http_response_code(400);
    $res['msg'] = 'Invalid input parameters';
    echo "false";
    exit;
}

try {
    // create connection
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // prepare and execute 
    $stmt = $pdo->prepare("SELECT * FROM registered_plates WHERE rfid = :rfid AND plate_no = :plate");
    $stmt->execute([':rfid' => $rfid, ':plate' => $plate_number]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        $stmt = $pdo->prepare("INSERT INTO `logs`(`plate_no`,`rfid`,`time_in`) VALUES (:plate,:rfid,:time_in)");
        $stmt->execute([':rfid' => $rfid, ':plate' => $plate_number, ':time_in' => $time_in]);

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
