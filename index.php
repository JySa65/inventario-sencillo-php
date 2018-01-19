<?php
ini_set('display_errors', 1);
ini_set('display_startup_errors', 1);
error_reporting(E_ALL);
?>
<!DOCTYPE html>
<html lang="es">
<head>
	<meta name="viewport" content="width=device-width, user-scalable=no, initial-scale=1.0, maximum-scale=1.0, minimum-scale=1.0">
	<meta http-equiv="Content-Type" content="text/html;charset=UTF-8">
	<title>GLABAL</title>
	<!-- CSS -->
	<link rel="stylesheet" href="static/css/bootstrap.min.css">
	<link rel="stylesheet" href="static/css/animate.css">
	<!-- font inconos -->
	<link rel="stylesheet" href="static/css/icons.css">

	<!-- JS -->
	<script src="static/js/jquery-3.min.js"></script>
	<script src="static/js/popper.min.js"></script>
	<script src="static/js/bootstrap.min.js"></script>
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
	<div class="row">
		<div class="col-sm-12">
			<div class="container text-right">
				<br>
				<button class="btn btn-danger" id="pop" data-toggle="popover" data-placement="left"><i class="fa fa-search"></i></button>
				<br><br>
			</div>
		</div>
	</div>
	<div id="ventOn"><?php require("templates/main.php"); ?></div>
	<div id="ventOff" class="d-none"></div>
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
		function cargarVentana(datos){
			$.ajax({
				url: 'templates/compraForm.php',
				type: 'GET',
				dataType: 'text/html',
				data: datos
			})
			.always(function(data) {
				if(data.readyState == 4 && data.status == 200){
					console.log(data);
					$("#ventOff").html(data.responseText);
					cambiarVentana();
				}
			});
			
		}
		function cambiarVentana(elementIn = "ventOff", elementOut = "ventOn", effect = "slide"){
			var eOut = $("#"+elementOut);
			var eIn = $("#"+elementIn);
			eOut.animateCss(effect + "OutLeft fixed-top", function(){});
			eIn.animateCss(effect + "InRight", function(){
				eOut.attr("id", elementIn);
				eIn.attr("id", elementOut);
			});
		}
		$.fn.extend({
			animateCss: function (animationName, callback) {
				var animationEnd = 'webkitAnimationEnd mozAnimationEnd MSAnimationEnd oanimationend animationend';
				this.removeClass();
				this.addClass('animated ' + animationName).one(animationEnd, function() {
					if (callback) {
						callback();
					}
				});
				return this;
			}
		});
	</script>
	<script>
		html = "<div class='popover' role='tooltip'><div class='arrow'></div><h3 class='popover-header'></h3><div class='popover-body'>qwdqwd</div>wefwef</div>"
		$(function () {
			$('#pop').popover({
				template:html
			})
		})
	</script>
</body>
</html>