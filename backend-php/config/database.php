<?php
class Database
{
  private $host = "host.docker.internal";
  private $db_name = "postgres";
  private $username = "postgres";
  private $password = "postgres";
  private $schema = "project_php";
  public $conn;

  public function getConnection()
  {
    $this->conn = null;
    try {
      // DSN dla PostgreSQL
      $dsn = "pgsql:host=" . $this->host . ";port=5432;dbname=" . $this->db_name;
      $this->conn = new PDO($dsn, $this->username, $this->password);

      // Ustawienie schematu
      $this->conn->exec("SET search_path TO " . $this->schema);
      $this->conn->setAttribute(PDO::ATTR_ERRMODE, PDO::ERRMODE_EXCEPTION);
    } catch (PDOException $exception) {
      echo "Błąd połączenia: " . $exception->getMessage();
    }
    return $this->conn;
  }
}

// function fetchData($tableName, $conditions = [])
// {
//   $db = (new Database())->getConnection();

//   $query = "SELECT * FROM $tableName";

//   if (!empty($conditions)) {
//     $clauses = [];
//     foreach ($conditions as $key => $value) {
//       $clauses[] = "$key = :$key";
//     }
//     $query .= " WHERE " . implode(' AND ', $clauses);
//   }

//   $stmt = $db->prepare($query);

//   foreach ($conditions as $key => $value) {
//     $stmt->bindValue(":$key", $value);
//   }

//   $stmt->execute();
//   return $stmt->fetchAll(PDO::FETCH_ASSOC);
// }

// function insertData($tableName, $data)
// {
//   $db = (new Database())->getConnection();
//   if ($db === null)
//     return null;

//   $keys = array_keys($data);
//   $fields = implode(', ', $keys);
//   $placeholders = ':' . implode(', :', $keys);

//   $query = "INSERT INTO $tableName ($fields) VALUES ($placeholders)";

//   try {
//     $stmt = $db->prepare($query);
//     foreach ($data as $key => $value) {
//       if (is_bool($value)) {
//         $stmt->bindValue(":$key", $value ? 1 : 0, PDO::PARAM_INT);
//       } else {
//         $stmt->bindValue(":$key", $value);
//       }
//     }
//     $stmt->execute();
//     return $db->lastInsertId();
//   } catch (PDOException $e) {
//     error_log("SQL Error: " . $e->getMessage());
//     http_response_code(500);
//     echo json_encode(["error" => $e->getMessage()]);
//     exit;
//   }
// }

// function updateData($tableName, $data, $conditions)
// {
//   $db = (new Database())->getConnection();

//   $updateParts = [];
//   foreach ($data as $key => $value) {
//     $updateParts[] = "$key = :val_$key";
//   }

//   $conditionParts = [];
//   foreach ($conditions as $key => $value) {
//     $conditionParts[] = "$key = :cond_$key";
//   }

//   $query = "UPDATE $tableName SET " . implode(', ', $updateParts) . " WHERE " . implode(' AND ', $conditionParts);

//   $stmt = $db->prepare($query);

//   foreach ($data as $key => $value) {
//     if (is_bool($value)) {
//       $stmt->bindValue(":val_$key", $value ? 1 : 0, PDO::PARAM_INT);
//     } else {
//       $stmt->bindValue(":val_$key", $value);
//     }
//   }

//   foreach ($conditions as $key => $value) {
//     $stmt->bindValue(":cond_$key", $value);
//   }

//   return $stmt->execute();
// }

// function deleteData($tableName, $conditions)
// {
//   $db = (new Database())->getConnection();

//   if (empty($conditions)) {
//     return false;
//   }

//   $clauses = [];
//   foreach ($conditions as $key => $value) {
//     $clauses[] = "$key = :$key";
//   }

//   $query = "DELETE FROM $tableName WHERE " . implode(' AND ', $clauses);

//   $stmt = $db->prepare($query);

//   foreach ($conditions as $key => $value) {
//     $stmt->bindValue(":$key", $value);
//   }

//   return $stmt->execute();
// }
//