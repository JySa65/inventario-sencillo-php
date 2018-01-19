window.addEventListener('load', function(){
	id_b = document.getElementById('id_buscar');	
	id_b.addEventListener('blur', toggleBuscar);
	id_b.addEventListener('keyup', buscar);
})
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

function toggleBuscar(){
	var tb = $("#tgBuscar");
	var tbi = tb.find("input");
	if(tb.hasClass("slideInDown")){
		tbi.attr("disabled", "");
		tb.animateCss("slideOutUp fixed-top", function(){});
	}else{	
		tbi.val("").removeAttr("disabled")
		tb.animateCss("slideInDown fixed-top", function(){
			tbi.focus();
		});
	}
}
function cargarVentana(datos){
	$.ajax({
		url: 'templates/compraForm.php',
		type: 'GET',
		dataType: 'text/html',
		data: datos
	})
	.always(function(data) {
		if(data.readyState == 4 && data.status == 200){
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
function buscar(ev){
	datos = document.getElementsByTagName('table')[0].children[1].children;
	inp = ev.target.value.toUpperCase();
	if(inp.length > 0){
		var re;
		for(var i = 0; i<datos.length; i++){
			texto = datos[i].children[2].textContent.toUpperCase();
			letra = ev.key;
			re = new RegExp(`(^|.)+${inp}+(.|$)`);
			if (!re.test(texto)){
				datos[i].classList.add('d-none');
			}else{
				datos[i].classList.remove('d-none');
			}
		}
	}else{
		for(var i = 0; i<datos.length; i++){
			datos[i].classList.remove('d-none');
		}
	}
	return true;
}