<?php
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["prod"]) && !empty($_GET["prod"]) && isset($_GET["token"]) && !empty($_GET["token"])) {
	$nProd = &$_GET["prod"]; 
	$nToken = &$_GET["token"]; 
	?>
	<nav class="navbar fixed-top text-center bg-info">
		<button type="navbar-brand" class="btn btn-info" style="box-shadow:none;" onclick="cambiarVentana();"><i class="fa fa-reply fa-fw"></i> VOLVER</button>
		<div class="navbar-link font-weigh-bold">Compra de Producto</div>
	</nav>
	<br><br>
	<div class="container" style="overflow:auto;">
		<form method="POST">
			<input type="hidden" value="<?= $nToken; ?>">
			<br>
			<div class="form-row">
				<div class="form-group col-12">
					<label for="prod">Producto</label>
					<input class="form-control" type="prod" id="prod" placeholder="Producto" disabled value="<?= $nProd; ?>">
				</div>
				<div class="form-group col-12">
					<label for="cant">Cantidad</label>
					<input class="form-control" type="cant" id="cant" placeholder="Cantidad: 1, 2, 3">
				</div>
				<div class="form-group col-12">
					<label for="cant">Precio Venta</label>
					<input class="form-control" type="cant" id="cant" placeholder="Monto: 1000,02">
				</div>
				<div class="form-group col-12">
					<label for="cant">Cantidad</label>
					<input class="form-control" type="cant" id="cant" placeholder="Cantidad: 1, 2, 3">
				</div>
				<div class="form-group col-12">
					<label for="cant">Precio Venta</label>
					<input class="form-control" type="cant" id="cant" placeholder="Monto: 1000,02">
				</div>
				<br>
				<button type="submit" class="btn btn-block btn-success"><i class="fa fa-save fa-fw"></i> Guardar</button>
			</div>
		</form>
		<br>
	</div>
	<script>
		//$("#ventOff").css({"position": "fixed", "height": "100%"});
	</script>
	<?php 
} ?>