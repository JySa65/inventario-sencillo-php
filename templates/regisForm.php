<?php
require(__DIR__ . "/../funciones.php");
if ($_SERVER["REQUEST_METHOD"] == "POST") {
	header("Content-type: application/json; charset=utf-8");
	$rsp = array("title" => "Guardado no completado!", "content" => "Un error inesperado! favor comunicarse con los desarrolladores de la aplicacion.", "color" => "danger", "icon" => "thumbs-o-down", "error" => 1);
	echo "string";

	if(isset($_GET['callback'])){
		echo $_GET['callback'] . "(" . json_encode($rsp) . ")";
	}
}
?>
<nav class="navbar navbar-expand bg-secondary justify-content-between fixed-top">
	<button type="navbar-brand" class="btn btn-secondary ml-2" style="box-shadow:none;" onclick="cambiarVentana()"><i class="fa fa-reply fa-fw"></i><span class="d-none d-sm-inline">VOLVER</span></button>
	<ul class="navbar-nav flex-row">
		<li class="nav-item">
			<a class="nav-link font-weigh-bold mr-2 ">Registrar Ventas de Producto</a>
		</li>
	</ul>
</nav>
<br><br>
<div class="container" style="overflow:auto;">
	<form action="templates/regisForm.php" name="formCompra" method="POST" onsubmit="return hacerSubmit(event)">
		<input name="token" type="hidden">
		<br>
		<div class="form-row">
			<div class="form-group col-12">
				<label for="id_pro">Nombre Del Producto</label>
				<input type="text" class="form-control" id="id_pro" name="prod" placeholder="Nombre Del Producto..!">
			</div>
			<div class="form-group col-12">
				<label for="id_pro">Precio Inicial</label>
				<input type="text" class="form-control" id="id_pre" name="prec" placeholder="Precio Inicial..!">
			</div>
			<div class="form-group col-12">
				<button type="submit" class="btn btn-block btn-lg btn-success"><i class="fa fa-save fa-fw"></i> Guardar</button>
			</div>
		</div>
	</form>
	<br>
</div>
