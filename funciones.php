<?php
function getExiste($arg = array()) {	
	foreach ($arg as $v) {
		if(!varExiste($_GET[$v])){
			return false;
		}
	}
	return true;
}

function postExiste($arg = array()) {	
	foreach ($arg as $v) {
		if(!varExiste($_POST[$v])){
			return false;
		}
	}
	return true;
}
function varExiste(&$v){
	if (!isset($v) || empty($v)){
		return false;
	}
	return true;
}
function is_positive(&$v){
	if(is_numeric($v)){
		if($v > 0){
			return true;
		}
	}
	return false;
}