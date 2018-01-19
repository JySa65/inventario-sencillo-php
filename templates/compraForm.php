<?php
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["prod"]) && !empty($_GET["prod"]) && isset($_GET["token"]) && !empty($_GET["token"])) {
	$nProd = &$_GET["prod"]; 
	$nToken = &$_GET["token"]; 
	?>
	<div class="nav text-center bg-info" style="height:48px;">
		<button type="button" class="btn btn-info" style="box-shadow:none;" onclick="cambiarVentana();"><i class="fa fa-reply fa-fw"></i> VOLVER</button>
		<div class="nav-link font-weigh-bold"><h5>Compra de Producto</h5></div>
	</div>	
	<div class="container" style="height:calc(100% - 48px);overflow:auto;">
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
				<br>
				<button type="submit" class="btn btn-success"><i class="fa fa-save fa-fw"></i> Guardar</button>
				<br>
			</div>
		</form>
	</div>
	<script>
		$("#ventOff").css({"position": "fixed", "height": "100%"});
	</script>
	<?php 
} ?>