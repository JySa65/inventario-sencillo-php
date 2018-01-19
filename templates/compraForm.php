<?php
require(__DIR__ . "/../funciones.php");
if ($_SERVER["REQUEST_METHOD"] == "POST" && postExiste(array("token", "cant", "pre", "disp"))) {
	header("Content-type: application/json; charset=utf-8");
	$_POST['pre'] = str_replace(",", ".", $_POST['pre']);
	$token = &$_POST['token'];
	$pre = &$_POST['pre'];
	$cant = &$_POST['cant'];
	$rsp = array("error" => null, "title" => "defautl", "content" => "defautl", "color" => "danger");
	if(is_positive($cant) && is_positive($pre)){
		require(__DIR__ . "/../conexion.php");
		$rs = $con->query("INSERT INTO registros(id, id_prod, cant, tipo) VALUES (NULL, '".$token."' , '".$cant."', '1')");
		if($rs){
			$con->query("INSERT INTO precios(id, id_prod, monto) VALUES (NULL, '".$token."', '".$pre."')");
			$con->query("UPDATE productos SET disponible='".($_POST['disp'] + $_POST['cant'])."' WHERE id= '".$token."'");
		}
	}else{
		$rsp["error"] = "La cantidad o el precio deben ser numeros positivos";
	}
	echo $_GET['callback'] . "(" . json_encode($rsp) . ")";
} elseif ($_SERVER["REQUEST_METHOD"] == "GET" && getExiste(array("prod", "token", "precio", "disp"))) {
	$nProd = &$_GET["prod"]; 
	$nToken = &$_GET["token"]; 
	$nPre = &$_GET["precio"]; 
	$nDisp = &$_GET["disp"];
	?>
	<nav class="navbar fixed-top text-center bg-info">
		<button type="navbar-brand" class="btn btn-info" style="box-shadow:none;" onclick="cambiarVentana()"><i class="fa fa-reply fa-fw"></i> VOLVER</button>
		<div class="navbar-link font-weigh-bold">Compra de Producto</div>
	</nav>
	<br><br>
	<div class="container" style="overflow:auto;">
		<form action="templates/compraForm.php" name="formCompra" method="POST" onsubmit="return hacerSubmit(event)">
			<input name="disp" type="hidden" value="<?= $nDisp; ?>">
			<input name="token" type="hidden" value="<?= $nToken; ?>">
			<br>
			<div class="form-row">
				<div class="form-group col-12">
					<label for="prod">Nombre del Producto:</label>
					<input class="form-control" type="text" name="prod" id="prod" placeholder="Producto" disabled value="<?= $nProd; ?>">
				</div>
				<div class="form-group col-12">
					<label for="cant">Cantidad Adquirida:</label>
					<input class="form-control" type="text" name="cant" id="cant" placeholder="Cantidad Ej: 2">
				</div>
				<div class="form-group col-12">
					<label for="pre">Precio de Venta:</label>
					<input class="form-control" type="text" name="pre" id="pre" placeholder="Monto Ej: 1000,02" value="<?= $nPre; ?>">
				</div>
				<div class="form-group col-12">
					<br>
					<button type="submit" class="btn btn-block btn-success"><i class="fa fa-save fa-fw"></i> Guardar</button>
				</div>
			</div>
		</form>
		<br>
	</div>
	<?php 
} ?>