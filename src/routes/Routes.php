<?php

namespace routes;
class Routes {

	private array $routes = [
			[
					"name"              => "index",
					"path"              => '/',
					"controller"        => "IndexController",
					"controller_method" => "index",
					"methods"            => ["get"],
			],
			[
					"name"              => "search_index",
					"path"              => "/search",
					"controller"        => "SearchController",
					"controller_method" => "index",
					"methods"            => ["get"],
			],
			[
					"name"              => "recording_index",
					"path"              => "/recording",
					"controller"        => "RecordingController",
					"controller_method" => "index",
					"methods"            => ["get"],
			],
			[
					"name"              => "recording_new",
					"path"              => "/recording/new",
					"controller"        => "RecordingController",
					"controller_method" => "new",
					"methods"            => ["get", "post"],
			],
	];

	public function get_routes() {
		return $this->routes;
	}
}
