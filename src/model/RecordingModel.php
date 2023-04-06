<?php

namespace model;

class RecordingModel extends MainModel {

	public function find_all($data = []) {
		$where = "";
		$placeholders = [];

		if (!empty($data)) {
			$where .= "WHERE ";
			$i = 0;

			foreach ($data as $key => $value) {
				$where .= "$key=:$key";
				$placeholders[$key] = $value;

				if ($i < (count($data) - 1)) {
					$where .= " AND ";
				}
				$i++;
			}
		}
		return $this->run_query("SELECT * FROM recording {$where}", $placeholders);
	}

	public function find_one($file_name) {
		$sql = "SELECT * FROM recording WHERE file_name=:file_name";

		return $this->run_query($sql, ["file_name" => $file_name]);
	}

	public function insert($data) {
		$sql = "INSERT INTO recording (bird_name, file_name, date_added) VALUES (:bird_name, :file_name, NOW())";

		return $this->run_query($sql, $data);
	}
}
