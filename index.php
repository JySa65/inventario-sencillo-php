<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);

$ho = "localhost";
$us = "root";
$pa = "root";
$db = "inventario";
$po = "3306";
$con = mysqli_connect($ho, $us, $pa, $db, $po);
$prod = $con->query("SELECT pro.*, (SELECT aux.monto FROM precios AS aux WHERE aux.id=MAX(pre.id)) AS monto FROM productos AS pro LEFT JOIN precios AS pre ON pro.id=pre.id_prod GROUP BY pre.id_prod");
?>
<!DOCTYPE html>
<html lang="es">
<head>
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>GLABAL</title>
	<!-- CSS -->
	<link rel="stylesheet" href="bootstrap/bootstrap.min.css">
	<!-- JS -->
	<script src="bootstrap/jquery-3.min.js"></script>
	<script src="bootstrap/bootstrap.min.js"></script>
	<style>
	table td {
		padding-left: 0px!important;
		padding-right: 0px!important;
		vertical-align: middle!important;
	}
	hr {
		margin: 5px 0px;
	}</style>
</head>
<body>
	<div id="ventana1">
		<table class="table table-bordered table-hover table-striped text-center">
			<thead>
				<tr>
					<th class="hidden-sm-down">Cod</th>
					<th>Disp</th>
					<th>Producto <input type="submit" onclick="$('.modal').modal('show');"></th>
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
	</div>
	<div id="ventana2"></div>
	<div class="modal">
		<div class="modal-dialog modal-dialog-centered modal-lg">
			<div class="modal-content">
				<div class="modal-body">
					<div class="row">
						<div class="col-md-4">.col-md-4</div>
						<div class="col-md-4 ml-auto">.col-md-4 .ml-auto</div>
					</div>
					<div class="row">
						<div class="col-md-3 ml-auto">.col-md-3 .ml-auto</div>
						<div class="col-md-2 ml-auto">.col-md-2 .ml-auto</div>
					</div>
					<div class="row">
						<div class="col-md-6 ml-auto">.col-md-6 .ml-auto</div>
					</div>
					<div class="row">
						<div class="col-sm-9">
							Level 1: .col-sm-9
							<div class="row">
								<div class="col-8 col-sm-6">
									Level 2: .col-8 .col-sm-6
								</div>
								<div class="col-4 col-sm-6">
									Level 2: .col-4 .col-sm-6
								</div>
							</div>
						</div>
					</div>
				</div>
				<div class="modal-footer">
					<button type="button" class="btn btn-primary">Save changes</button>
					<button type="button" class="btn btn-danger" data-dismiss="modal">Close</button>
				</div>
			</div>
		</div>
	</div>
	<script>
		function abrirVentana(){

		}
		function cambiarVentana(id1){
			var v1 = document.getElementById(id1);
			v1.classList.add("slideInRight animate")
		}

		function testAnim(x) {
			$('#animationSandbox').removeClass().addClass(x + ' animated').one('webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend', function(){
				$(this).removeClass();
			});
		};

		$(document).ready(function(){
			$('.js--triggerAnimation').click(function(e){
				e.preventDefault();
				var anim = $('.js--animations').val();
				testAnim(anim);
			});

			$('.js--animations').change(function(){
				var anim = $(this).val();
				testAnim(anim);
			});
		});


	</script>
</body>
</html>