<?php

namespace src;

class AutoLoader {

	static function register() {
		spl_autoload_register(array(__CLASS__, "autoLoad"));
	}

	static function autoLoad($class) {
		$class = str_replace('\\', '/', $class);
		require __DIR__ . "/$class.php";
	}
}

AutoLoader::register();
