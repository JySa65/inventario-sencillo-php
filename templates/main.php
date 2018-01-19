<?php
if ($_SERVER["REQUEST_METHOD"] != "GET"){
	exit();
}
require( __DIR__ . "/../conexion.php");
$prod = $con->query("SELECT pro.*, (SELECT aux.monto FROM precios AS aux WHERE aux.id=MAX(pre.id)) AS monto FROM productos AS pro LEFT JOIN precios AS pre ON pro.id=pre.id_prod GROUP BY pre.id_prod");
?>
<<<<<<< HEAD
<div  id="preTable">
	<table class="table table-bordered table-hover table-striped text-center" id="mytable">
		<thead>
			<th class="d-none d-sm-none d-md-table-cell">Codigo</th>
			<th class="d-table-cell d-md-none d-lg-none d-xl-none">Disp.</th>
			<th class="d-none d-sm-none d-md-table-cell">Disponibilidad</button></th>
			<th onclick="toggleBuscar()" id="quitar_css" class="d-table-cell d-md-none d-lg-none d-xl-none btn btn-danger btn-sm">Producto</th>
			<th onclick="toggleBuscar()" class="d-none d-sm-none d-md-table-cell">Producto <i class="fa fa-search" style="background: #dc3545; padding: 3px 4px 4px 6px; box-shadow: 1px 1px 0px #444; color: white; border-radius: 5px;"></i></button></th>
			<th>Precio</th>
			<th class="d-none d-sm-table-cell">Opciones</th>
		</thead>
		<tbody>
			<?php
			while ($row = $prod->fetch_assoc()){ ?>					
			<tr>
				<td class="d-none d-sm-none d-md-table-cell"><?= $row["id"] ?></td>
				<td><?= $row["disponible"] ?></td>
				<td><?= $row["nombre"] ?></td>
				<td><?= number_format($row["monto"], 2, ",", ".") ?></td>
				<td class="d-none d-sm-table-cell">
					<button class="btn btn-sm btn-secondary" onclick="cargarVentana('templates/ventaForm.php', {prod: '<?= $row["nombre"] ?>', token: '<?= $row["id"] ?>', precio: '<?= number_format($row["monto"], 2, ",", "") ?>', disp: '<?= $row["disponible"] ?> '});">
						<i class="fa fa-shopping-cart fa-fw fa-2x"></i> <i class="fa fa-minus fa-fw"></i>
					</button> - 
					<button class="btn btn-sm btn-info" onclick="cargarVentana('templates/compraForm.php', {prod: '<?= $row["nombre"] ?>', token: '<?= $row["id"] ?>', precio: '<?= number_format($row["monto"], 2, ",", "") ?>', disp: '<?= $row["disponible"] ?> '});">
						<i class="fa fa-shopping-cart fa-fw fa-2x"></i> <i class="fa fa-plus fa-fw"></i>
					</button>
				</td>
			</tr>
			<?php } ?>
		</tbody>
	</table>
</div>
<nav aria-label="Page navigation example"><ul class="pagination justify-content-center" id="pagina"></ul></nav>
=======
<nav class="navbar navbar-expand bg-secondary justify-content-between">
	<a class="navbar-brand text-white ml-2" href="#">Bodega Glabal</a>
	<div>
		<button class="btn btn-info btn-sm mr-2" onclick="cargarVentana('templates/regisForm.php', {});"><span class="d-none d-sm-none d-md-table-cell"><i class="fa fa-fw fa-shopping-bag" ></i>Nuevo Producto</span> <span class="d-table-cell d-md-none d-lg-none d-xl-none"><i class="fa fa-plus"></i></span></button>
		<button class="btn btn-danger btn-sm mr-2 d-none d-sm-none d-md-table-cell" onclick="toggleBuscar()"><i class="fa fa-fw fa-search"></i> Buscar Producto</button>
	</div>
</nav>
<table class="table table-bordered table-hover table-striped text-center" id="mytable">
	<thead>
		<th class="d-none d-sm-none d-md-table-cell">Codigo</th>
		<th class="d-table-cell d-md-none d-lg-none d-xl-none">Disp.</th>
		<th class="d-none d-sm-none d-md-table-cell">Disponibilidad</button></th>
		<th onclick="toggleBuscar()" id="quitar_css" class="d-table-cell d-md-none d-lg-none d-xl-none btn btn-danger btn-sm">Producto</th>
		<th class="d-none d-sm-none d-md-table-cell">Producto</button></th>
		<th>Precio</th>
		<th class="d-none d-sm-table-cell">Opciones</th>
	</thead>
	<tbody>
		<?php
		while ($row = $prod->fetch_assoc()){ ?>					
		<tr>
			<td class="d-none d-sm-none d-md-table-cell"><?= $row["id"] ?></td>
			<td><?= $row["disponible"] ?></td>
			<td><?= $row["nombre"] ?></td>
			<td><?= number_format($row["monto"], 2, ",", ".") ?></td>
			<td class="d-none d-sm-table-cell">
				<button class="btn btn-sm btn-secondary" onclick="cargarVentana('templates/ventaForm.php', {prod: '<?= $row["nombre"] ?>', token: '<?= $row["id"] ?>', precio: '<?= number_format($row["monto"], 2, ",", "") ?>', disp: '<?= $row["disponible"] ?> '});">
					<i class="fa fa-shopping-cart fa-fw fa-2x"></i> <i class="fa fa-minus fa-fw"></i>
				</button> - 
				<button class="btn btn-sm btn-info" onclick="cargarVentana('templates/compraForm.php', {prod: '<?= $row["nombre"] ?>', token: '<?= $row["id"] ?>', precio: '<?= number_format($row["monto"], 2, ",", "") ?>', disp: '<?= $row["disponible"] ?> '});">
					<i class="fa fa-shopping-cart fa-fw fa-2x"></i> <i class="fa fa-plus fa-fw"></i>
				</button>
			</td>
		</tr>
		<?php } ?>
	</tbody>
</table>
<nav aria-label="Page navigation example">
	<ul class="pagination justify-content-center" id="pagina">
	</ul>
</nav>
>>>>>>> 0279135b5f5c836b78e5e251e680131080e7f243
