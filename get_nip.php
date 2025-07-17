<?php
// get_nip.php
$host = "localhost";
$user = "root";
$password = "";
$dbname = "agustusan";

$conn = new mysqli($host, $user, $password, $dbname);

$result = $conn->query("SELECT nama, nip FROM peserta");

$data = [];
while ($row = $result->fetch_assoc()) {
    $data[] = [
        "nama" => $row["nama"],
        "nip" => $row["nip"]
    ];
}

header('Content-Type: application/json');
echo json_encode($data);
$conn->close();
