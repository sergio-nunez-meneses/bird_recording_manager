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
}
