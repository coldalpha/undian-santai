<?php
// update_status.php
header("Content-Type: application/json");
require_once("db.php"); // koneksi ke database

$data = json_decode(file_get_contents("php://input"), true);

if (!isset($data["nip"])) {
    echo json_encode(["success" => false, "message" => "NIP tidak disediakan"]);
    exit;
}

$nip = $data["nip"];

$stmt = $pdo->prepare("UPDATE peserta SET status = 1 WHERE nip = ?");
$success = $stmt->execute([$nip]);

if ($success) {
    echo json_encode(["success" => true]);
} else {
    echo json_encode(["success" => false, "message" => "Gagal update"]);
}
?>
