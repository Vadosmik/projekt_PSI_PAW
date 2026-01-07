<?php
class Database
{
  // private $host = "host.docker.internal";
  private $host = "localhost";
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

function fetchData($tableName, $conditions = []) {
    $db = (new Database())->getConnection();
    
    $query = "SELECT * FROM $tableName";
    
    // Jeśli są jakieś warunki, dynamicznie budujemy WHERE
    if (!empty($conditions)) {
        $clauses = [];
        foreach ($conditions as $key => $value) {
            $clauses[] = "$key = :$key";
        }
        $query .= " WHERE " . implode(' AND ', $clauses);
    }

    $stmt = $db->prepare($query);

    // Dynamicznie podstawiamy wartości (bindowanie)
    foreach ($conditions as $key => $value) {
        $stmt->bindValue(":$key", $value);
    }

    $stmt->execute();
    return $stmt->fetchAll(PDO::FETCH_ASSOC);
}
?>