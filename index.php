<!DOCTYPE html>
<html lang="es">
<head>
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>GLABAL</title>
	<!-- CSS -->
	<link rel="icon" href="static/img/favicon.png" type="image/png"/>
	<link rel="stylesheet" href="static/css/bootstrap.min.css">
	<link rel="stylesheet" href="static/css/animate.css">
	<link rel="stylesheet" href="static/css/icons.css">
	<!-- JS -->
	<script src="static/js/jquery-3.min.js"></script>
	<script src="static/js/popper.min.js"></script>
	<script src="static/js/bootstrap.min.js"></script>
	<script src="static/js/buscador.js"></script>
	<style>
	table td {
		padding-left: 0px!important;
		padding-right: 0px!important;
		vertical-align: middle!important;
		user-drag: none; 
		user-select: none;
		-moz-user-select: none;
		-webkit-user-drag: none;
		-webkit-user-select: none;
		-ms-user-select: none;
	}
	table > hr {
		margin: 1px 0px;
	}</style>
</head>
<body>
	<div id="tgBuscar" class="d-none">
		<div class="row container-fluid mt-2">
			<div class="col-12">
				<div class="input-group">
					<input type="text" class="form-control" id="id_buscar" placeholder="Ingrese Producto...!" style="box-shadow: none;">
					<div class="input-group-append">
						<button class="btn btn-danger" onclick="toggleBuscar()"><i class="fa fa-times"></i></button>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="ventOn"><?php require("templates/main.php"); ?></div>
	<div id="ventOff" class="d-none"></div>
	<div class="modal fade" data-backdrop="false" style="background: rgba(0,0,0,0.8);">
		<div class="modal-dialog modal-dialog-centered">
			<div class="modal-content">
				<div class="modal-header border-bottom border-info">
					<h5 class="modal-title" id="modaltitle"></h5>
				</div>
				<div class="modal-body p-0">
					<div class="row">
						<div class="col-12">
							<div class="list-group">
								<a href="#!" class="list-group-item list-group-item-action" id="add_compra"><i class="fa fa-fw fa-shopping-basket"></i> Añadir Compra</a>
								<a href="#!" class="list-group-item list-group-item-action" id="add_venta"><i class="fa fa-fw fa-shopping-cart"></i> Añadir Venta</a>
								<a href="#!" class="list-group-item list-group-item-action"><i class="fa fa-fw fa-file-pdf-o"></i> Reporte</a>
								<a class="list-group-item list-group-item-action" data-toggle="collapse" href="#multiCollapseExample1" role="button" aria-expanded="false" aria-controls="multiCollapseExample1"><i class="fa fa-fw fa-plus"></i> Mas....</a>
								<div class="collapse multi-collapse" id="multiCollapseExample1">
									<div class="list-group">
										<a href="#!" class="list-group-item list-group-item-action" id="add_producto"><span class="pr-4"></span><i class="fa fa-fw fa-shopping-bag"></i> Añadir Nuevo Producto</a>
										<a href="#!" class="list-group-item list-group-item-action" id="add_rgeneral"><span class="pr-4"></span><i class="fa fa-fw fa-file-pdf-o"></i> Reporte Genereal</a>
									</div>
								</div>
								<a href="#!" class="list-group-item list-group-item-action" data-dismiss="modal"><i class="fa fa-fw fa-mail-reply"></i> Cerrar</a>
							</div>
						</div>
					</div>
				</div>
			</div>
		</div>
	</div>
	<div id="contentAlert" style='position:fixed;top:10px;left:10px;width: calc(100% - 20px);'></div>
</body>
</html>	