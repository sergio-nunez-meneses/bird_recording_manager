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
		$recordings = $recording_model->find_all($request);

		return [
				"recordings" => $recordings,
		];
	}
}
