window.addEventListener('load', function(){
	function abrirVentana(){

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
					//$(this).removeClass('animated ' + animationName);
				});
			return this;
		}
	});

	hl = `<input type="text" class="form-control" id="id_buscar" placeholder="Ingrese Algo...!" 
	onkeyup="return buscar(Event)">`
	$(function () {
		$('#pop').popover({
			html:true,
			content:hl
		})
	})

})
function buscar(ev){
	datos = document.getElementsByTagName('table')[0].children[1].children;
	for(var i = 0; i<datos.length; i++){
		texto = datos[i].children[2].textContent	
	}
}