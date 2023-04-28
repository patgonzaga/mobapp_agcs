<?php
require_once('db-conn.php');

$fullname = $_GET['fullname'] ?? '';
$plate_no = $_GET['plate_no'] ?? '';
$rfid = $_GET['rfid'] ?? '';
$address = $_GET['address'] ?? '';
$contact_no = $_GET['contact_no'] ?? '';
$license_no = $_GET['license_no'] ?? '';
$created_by = $_GET['created_by'] ?? '';
$created_at = date('Y-m-d H:i:s');

// Sanitize the plate number
$plate_no = preg_replace('/[^a-zA-Z0-9\']/', '', $plate_no);

$res = [];

if (empty($fullname) || empty($plate_no) || empty($license_no) || empty($created_by) || empty($rfid) || empty($address) || empty($contact_no)) {
    // http_response_code(400);
    $res['msg'] = 'Invalid input parameters';
    echo json_encode($res);
    exit;
}

try {
    $pdo = new PDO("mysql:host=$servername;dbname=$dbname", $username, $password);
    $pdo->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);

    // Check if plate number already exists
    $stmt = $pdo->prepare("SELECT * FROM registered_plates WHERE plate_no = :plate_no");
    $stmt->execute([':plate_no' => $plate_no]);
    $data = $stmt->fetch(PDO::FETCH_ASSOC);

    if ($data) {
        // http_response_code(409);
        $res['msg'] = 'Plate number already exists';
        echo json_encode($res);
        exit;
    }

    // Insert plate registration details
    $stmt = $pdo->prepare("INSERT INTO registered_plates (fullname, plate_no, license_no, created_by,created_at,rfid,address,contact_no) 
                            VALUES (:fullname, :plate_no, :license_no, :created_by, :created_at, :rfid, :address, :contact_no)");
    $stmt->execute([':fullname' => $fullname, ':plate_no' => $plate_no, ':license_no' => $license_no, ':created_by' => $created_by, ':created_at' => $created_at, ':rfid' => $rfid, ':address' => $address, ':contact_no' => $contact_no]);

    // Insert audit trail
    $stmt = $pdo->prepare("INSERT INTO audit_trails (module, action, created_by,created_at) 
                            VALUES (:module, :action, :created_by,:created_at)");
    $stmt->execute([':module' => 'Plate registration', ':action' => "Registered Plate no: $plate_no under $fullname with license no: $license_no", ':created_by' => $created_by, ':created_at' => $created_at]);

    // http_response_code(201);
    $res['msg'] = 'Plate registered successfully';
    echo json_encode($res);
} catch (PDOException $e) {
    // http_response_code(500);
    error_log($e->getMessage());
    $res['msg'] = $e->getMessage();
    echo json_encode($res);
}
