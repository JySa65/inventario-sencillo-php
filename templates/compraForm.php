<?php
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["prod"]) && !empty($_GET["prod"]) && isset($_GET["token"]) && !empty($_GET["token"])) {
	$nProd = &$_GET["prod"]; 
	$nToken = &$_GET["token"]; 
	?>
	<div class="nav text-center bg-info">
		<button type="button" class="btn btn-info border-right" style="box-shadow:none;" onclick="cambiarVentana();"><i class="fa fa-reply fa-fw"></i> VOLVER</button>
		<div class="nav-link font-weigh-bold"><h5>Compra de Producto</h5></div>
	</div>	
	<div class="container">
		<form method="POST">
			<input type="hidden" value="<?= $nToken; ?>">
			<div class="form-row">
				<div class="form-group col-12">
					<label for="prod">Producto</label>
					<input class="form-control" type="prod" id="prod" placeholder="Producto" disabled value="<?= $nProd; ?>">
				</div>
				<div class="form-group col-12">
					<label for="cant">Cantidad</label>
					<input class="form-control" type="cant" id="cant" placeholder="Cantidad: 1 2 3...">
				</div>
				<div class="form-group col-12">
					<label for="cant">Cantidad</label>
					<input class="form-control" type="cant" id="cant" placeholder="Cantidad: 1 2 3...">
				</div>
				<br>
				<button type="submit" class="btn btn-block btn-success"><h3><i class="fa fa-save fa-fw"></i> Guardar</h3></button>
			</div>
		</form>
	</div>
	<?php } ?>