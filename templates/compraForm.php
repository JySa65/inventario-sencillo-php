<?php
require(__DIR__ . "/../funciones.php");
if ($_SERVER["REQUEST_METHOD"] == "POST"){
	header("Content-type: application/json; charset=utf-8");
	$rsp = array("title" => "Guardado no completado!", "content" => "Un error inesperado! favor comunicarse con los desarrolladores de la aplicacion.", "color" => "danger", "icon" => "thumbs-o-down", "error" => 1);
	if(postExiste(array("token", "cant", "pre", "disp"))) {
		$_POST['pre'] = str_replace(",", ".", $_POST['pre']);
		$token = &$_POST['token'];
		$pre = &$_POST['pre'];
		$cant = &$_POST['cant'];
		if(is_positive($cant)){
			if(is_positive($pre)){
				require(__DIR__ . "/../conexion.php");
				$rs = $con->query("INSERT INTO registros(id, id_prod, cant, tipo) VALUES (NULL, '".$token."' , '".$cant."', '1')");
				if($rs){
					if ($ppre = $con->query("SELECT (SELECT aux.monto FROM precios AS aux WHERE aux.id=MAX(pre.id)) AS monto FROM productos AS pro LEFT JOIN precios AS pre ON '".$token."'=pre.id_prod GROUP BY pre.id_prod")){
						if ($row = $ppre->fetch_assoc()){ 
							if($row["monto"] != $pre){
								$con->query("INSERT INTO precios(id, id_prod, monto, fecha) VALUES (NULL, '".$token."', '".$pre."', '". date("Y-m-d") ."')");		
							}
						}
					}
					$con->query("UPDATE productos SET disponible='".($_POST['disp'] + $cant)."' WHERE id= '".$token."'");
					$rsp["error"] = 0;
					$rsp["icon"] = "thumbs-o-up";
					$rsp["content"] = "La compra del producto fue registrada con exito, espere mientras recargamos la pagina.";
					$rsp["title"] = "Guardado con exito!";
					$rsp["color"] = "success";
				}
			}else{
				$rsp["content"] = "El precio de venta del producto debe ser un numero positivo.";
			}
		}else{
			$rsp["content"] = "La cantidad comprada del producto debe ser un numero positivo.";
		}
	}else{
		$rsp["content"] = "Faltan datos en la solicitud.";
	}
	if(isset($_GET['callback'])){
		echo $_GET['callback'] . "(" . json_encode($rsp) . ")";
	}
} elseif ($_SERVER["REQUEST_METHOD"] == "GET" && getExiste(array("prod", "token", "precio", "disp"))) {
	$nProd = &$_GET["prod"]; 
	$nToken = &$_GET["token"]; 
	$nPre = &$_GET["precio"]; 
	$nDisp = &$_GET["disp"];
	?>
	<nav class="navbar navbar-expand fixed-top bg-info">
		<button type="navbar-brand" class="btn btn-info" style="box-shadow:none;" onclick="cambiarVentana()"><i class="fa fa-reply fa-fw"></i> VOLVER</button>
		<ul class="navbar-nav flex-row">
			<li class="nav-item">
				<a class="nav-link font-weigh-bold">Registrar Compra de Producto</a>
			</li>
		</ul>
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
					<input class="form-control text-center" type="text" name="prod" id="prod" placeholder="Producto" disabled value="<?= $nProd; ?>">
				</div>
				<div class="form-group col-12">
					<label for="cant">Cantidad Adquirida:</label>
					<input class="form-control text-center" type="text" name="cant" id="cant">
				</div>
				<div class="form-group col-12">
					<label for="pre">Precio de Venta:</label>
					<input class="form-control text-center" type="text" name="pre" id="pre" placeholder="Monto Ej: ####,##" value="<?= $nPre; ?>">
				</div>
				<div class="form-group col-12">
					<br>
					<button type="submit" class="btn btn-block btn-lg btn-success"><i class="fa fa-save fa-fw"></i> Guardar</button>
				</div>
			</div>
		</form>
		<br>
	</div>
	<?php 
} ?>