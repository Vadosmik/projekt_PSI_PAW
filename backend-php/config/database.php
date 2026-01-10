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