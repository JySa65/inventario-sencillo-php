window.addEventListener('load', function(){
	id_b = document.getElementById('id_buscar');	
	//id_b.addEventListener('blur', toggleBuscar);
	id_b.addEventListener('keyup', buscar);
	dat = trr()
	for(i=0; i<dat.length; i++){
		dat[i].addEventListener('mousedown', function(ev){
			MouseTouchDown(ev, this);
		});
		dat[i].addEventListener('mouseup', function(ev){
			MouseTouchUp(event, this);
		});
		dat[i].addEventListener('touchstart', function(ev){
			MouseTouchDown(ev, this);
		});
		dat[i].addEventListener('touchend',function(ev){
			MouseTouchUp(event, this);
		});
	}


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
		$('#pop').removeAttr('hidden');
	}else{	
		tbi.val("").removeAttr("disabled")
		tb.animateCss("slideInDown fixed-top", function(){
			tbi.focus();
		});
		$('#pop').attr('hidden', '');
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
function trr(){
	return document.getElementsByTagName('table')[0].children[1].children; 
}

function buscar(ev){
	datos = trr()
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
var gtime = [];
var idInt = 0;

function MouseTouchDown(ev, el1) {
	gtime = ev.timeStamp;
	idInt = setTimeout(function(){
		if(gtime){
			//ev.srcElement.remove();
			//$('.modal').modal('show');
			console.log(el1);
			console.log(ev)
		}
	}, 1500);
}

function MouseTouchUp(ev, el) {
	gtime = false;
	clearTimeout(idInt);
}
