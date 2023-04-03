<?php

namespace controller;

class IndexController extends MainController {

	public function index() {
		$this->render_template([
				"module_scripts" => ["assets/js/index-script"],
		]);
	}
}
