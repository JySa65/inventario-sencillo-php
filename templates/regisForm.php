<?php
require(__DIR__ . "/../funciones.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
	header("Content-type: application/json; charset=utf-8");
	$rsp = array("title" => "Guardado no completado!", "content" => "Un error inesperado! favor comunicarse con los desarrolladores de la aplicacion.", "color" => "danger", "icon" => "thumbs-o-down", "error" => 1);
	if(postExiste(array('token','prod', 'prec'))){
		require(__DIR__ . "/../conexion.php");
		$rs = $con->query("INSERT INTO productos(id, nombre, disponible) VALUES (NULL, '".$_POST['prod']."', '0')");
		if($rs){
			$con->query("INSERT INTO precios(id, id_prod, monto, fecha) VALUES (NULL, '".$con->insert_id."', '".$_POST['prec']."', '".date("Y-m-d")."')");
			$rsp["error"] = 0;
			$rsp["icon"] = "thumbs-o-up";
			$rsp["content"] = "El producto fue registrado con exito, espere mientras recargamos la pagina.";
			$rsp["title"] = "Guardado con exito!";
			$rsp["color"] = "success";
		}else{
			$rsp["content"] = "El producto no fue registrado...!";
		}
	}
	if(isset($_GET['callback'])){
		echo $_GET['callback'] . "(" . json_encode($rsp) . ")";
	}
}elseif ($_SERVER["REQUEST_METHOD"] == "GET"){
	$token = base64_encode(time().rand(5, 15));

	?>
	<nav class="navbar navbar-expand bg-secondary justify-content-between fixed-top">
		<button type="navbar-brand" class="btn btn-secondary" style="box-shadow:none;" onclick="cambiarVentana()"><i class="fa fa-reply fa-fw"></i><span class="d-none d-sm-inline">VOLVER</span></button>
		<ul class="navbar-nav flex-row">
			<li class="nav-item">
				<a class="nav-link font-weigh-bold mr-2 ">Registrar Ventas de Producto</a>
			</li>
		</ul>
	</nav>
	<br><br>
	<div class="container" style="overflow:auto;">
		<form action="templates/regisForm.php" name="formRegis" method="POST" onsubmit="return hacerSubmit(event)">
			<input name="token" type="hidden" value="<?= $token ?>">
			<br>
			<div class="form-row">
				<div class="form-group col-12">
					<label for="id_pro">Nombre Del Producto</label>
					<input type="text" class="form-control" id="id_pro" name="prod" placeholder="Nombre Del Producto..!" autocomplete="off">
				</div>
				<div class="form-group col-12">
					<label for="id_pro">Precio Inicial</label>
					<input type="text" class="form-control" id="id_pre" name="prec" placeholder="Precio Inicial..!" autocomplete="off">
				</div>
				<div class="form-group col-12">
					<button type="submit" class="btn btn-block btn-lg btn-success"><i class="fa fa-save fa-fw"></i> Guardar</button>
				</div>
			</div>
		</form>
		<br>
	</div>
	<?php 
}
?>