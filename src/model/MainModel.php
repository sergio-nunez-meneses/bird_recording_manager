<?php

namespace model;

use tools\Connection;

class MainModel {

	protected $db;

	public function __construct() {
		$connection = new Connection();
		$this->db = $connection->pdo;
	}

	protected function run_query($sql, $placeholders = []) {
		if (empty($placeholders)) {
			return $this->db->query($sql)->fetchAll();
		}

		$stmt = $this->db->prepare($sql);
		$stmt->execute($placeholders);

		if (str_contains(strtolower($sql), "select")) {
			return $stmt->fetchAll();
		}
		return $stmt->rowCount();
	}
}
