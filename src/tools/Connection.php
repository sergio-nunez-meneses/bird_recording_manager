<?php

namespace tools;

use PDO;

require __DIR__ . "/../../config/config.php";

class Connection {

	public $pdo;

	public function __construct() {
		$this->pdo = new PDO(
				"mysql:host=" . DB_HOST . ";port=" . DB_PORT . ";charset=" . DB_CHAR . ";dbname=" . DB_NAME,
				DB_USER,
				DB_PASSWORD,
				PDO_OPTIONS
		);
	}
}
