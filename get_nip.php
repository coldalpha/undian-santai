<?php
require_once("db.php");

$stmt = $pdo->prepare("SELECT nama, nip FROM peserta WHERE status = 0");
$stmt->execute();
$rows = $stmt->fetchAll(PDO::FETCH_ASSOC);

echo json_encode($rows);
