<?php

namespace router;

use routes\Routes;

class Router {

	private $routes;


	public function __construct() {
		$routes = new Routes();
		$this->routes = $routes->get_routes();

		$this->parse_uri();
	}

	public function parse_uri() {
		$path = parse_url($_SERVER["REQUEST_URI"])["path"];
		$method = strtolower($_SERVER["REQUEST_METHOD"]);
		$route = $this->get_route("path", $path);

		if (!empty($route) && in_array($method, $route["methods"])) {
			$data = $this->get_data($method);
			$this->get_controller($route, $data);
		}
		else {
			// TODO: Display 404 page
		}
	}

	private function get_route($key, $value) {
		return array_reduce($this->routes, function ($carry, $item) use ($key, $value) {
			if ($item[$key] === $value) {
				$carry = $item;
			}
			return $carry;
		});
	}

	private function get_data($method) {
		return match ($method) {
			"post"  => $_POST,
			default => [],
		};
	}

	public function get_controller($route, $data) {
		$controller = $route["controller"];
		$controller_method = $route["controller_method"];

		require_once dirname(__DIR__) . "/controller/$controller.php";
		$controller_path = "controller\\$controller";
		$controller_instance = new $controller_path();
		$controller_instance->$controller_method($data);
	}
}
