<?php

namespace routes;

class Routes {

	private array $routes = [
			[
					"name"              => "ajax",
					"path"              => "/ajax",
					"controller"        => "AjaxController",
					"controller_method" => "index",
					"methods"           => ["post"],
			],
			[
					"name"              => "index",
					"path"              => '/',
					"controller"        => "IndexController",
					"controller_method" => "index",
					"methods"           => ["get"],
			],
			[
					"name"              => "recording_index",
					"path"              => "/recording",
					"controller"        => "RecordingController",
					"controller_method" => "index",
					"methods"           => ["get"],
			],
			[
					"name"              => "recording_new",
					"path"              => "/recording/new",
					"controller"        => "RecordingController",
					"controller_method" => "new",
					"methods"           => ["get", "post"],
			],
	];

	public function get_routes() {
		return $this->routes;
	}
}
