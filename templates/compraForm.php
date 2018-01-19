<?php
if ($_SERVER["REQUEST_METHOD"] == "GET" && isset($_GET["prod"]) && !empty($_GET["prod"])) {
	$nProd = &$_GET["prod"]; ?>
	<div class="nav text-center bg-info">
		<button type="button" class="btn btn-info" style="box-shadow:none;">VOLVER</button>
		<div class="nav-link">Compra de Producto</div>
	</div>
	<!-- <ul class="nav justify-content-center bg-info">
		<li class="nav-item">
			
		</li>
	</ul> -->
	<div class="container">
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
			<button type="submit" class="btn btn-block btn-primary">Guardar</button>
			<button type="submit" class="btn btn-block btn-secondary">Volver</button>
		</div>

		<br>
	</div>
	<?php } ?>