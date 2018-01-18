<?php
if ($_SERVER["REQUEST_METHOD"] != "GET"){
	exit();
}
require( __DIR__ . "/../conexion.php");
$prod = $con->query("SELECT pro.*, (SELECT aux.monto FROM precios AS aux WHERE aux.id=MAX(pre.id)) AS monto FROM productos AS pro LEFT JOIN precios AS pre ON pro.id=pre.id_prod GROUP BY pre.id_prod");
?>
<table class="table table-bordered table-hover table-striped text-center">
	<thead>
		<tr>
			<th class="hidden-sm-down">Cod</th>
			<th>Disp</th>
			<th>Producto <input type="submit" onclick="cambiarVentana();"></th>
			<th>Precio</th>
			<th>Opc.</th>
		</tr>
	</thead>
	<tbody>
		<?php
		while ($row = $prod->fetch_assoc()){
			?>					
			<tr>
				<td class="hidden-sm-down"><?= $row["id"] ?></td>
				<td><?= $row["disponible"] ?></td>
				<td><?= $row["nombre"] ?></td>
				<td><?= number_format($row["monto"], 2) ?></td>
				<td><button class="btn btn-sm btn-primary">VENTA</button><hr><button class="btn btn-sm btn-danger">COMPRA</button></td>
			</tr>
			<?php
		}
		?>
	</tbody>
</table>