<?php

namespace controller;

class MainController {

	public function render_template($data) {
		$module_scripts = $data["module_scripts"] ?? [];
		$title = $data["title"] ?? "";
		$content = isset($data["template"]) ? $this->hydrate_template($data["template"], $data["data"]) : "";
		$scripts = $data["scripts"] ?? [];

		require dirname(__DIR__, 2) . "/templates/base_template.php";
	}

	public function hydrate_template($raw_template, $data) {
		$hydrated_template = "";

		if ($this->is_associative($data)) {
			$hydrated_template = $this->template_replace_all($raw_template, $data);
		}
		else {
			foreach ($data as $row) {
				$hydrated_template .= $this->template_replace_all($raw_template, $row);
			}
		}
		return $hydrated_template;
	}

	public function template_replace_all($template, $data) {
		foreach ($data as $key => $value) {
			$value = filter_var($value, FILTER_VALIDATE_INT) ? strval($value) : $value;
			$template = str_replace("{{ $key }}", $value, $template);
		}
		return $template;
	}

	public function is_associative($arr) {
		return !(array() === $arr) && array_keys($arr) !== range(0, count($arr) - 1);
	}
}
