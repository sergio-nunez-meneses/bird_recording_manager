<?php

namespace controller;

use model\RecordingModel;

class AjaxController extends MainController {

	public function index($request) {
		$data = [];

		// TODO: Check if method exists & Sanitize data
		if ($request["action"]) {
			$ajax_method = $request["action"];
			unset($request["action"]);

			$data = $this->$ajax_method($request);
		}
		echo json_encode($data);
	}

	private function get_recordings($request) {
		$recording_model = new RecordingModel();
		$recordings = $recording_model->find_all($request)->fetchAll();

		return [
				"recordings" => $recordings,
		];
	}

	private function store_recording($request) {
		$recording_model = new RecordingModel();
		$record_exists = !empty($recording_model->find_one($request["file_name"])->fetch());
		$status_code = 400;
		$response_message = [];

		if (!$record_exists) {
			$recording = $recording_model->insert($request);
			$is_recording_stored = $recording->rowCount() === 1;
			$status_code = $is_recording_stored ? 201 : 500;
			$response_message[] = $is_recording_stored ? "File succesfully stored." : "Internal server error.";
		}
		else {
			$response_message[] = "File already exists.";
		}

		return [
				"status_code"      => $status_code,
				"response_message" => $response_message,
		];
	}
}
