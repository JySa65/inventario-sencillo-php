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
		tbi.val("").removeAttr("disabled");
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
function hacerSubmit(ev){
	$.ajax({
		url: ev.target.action,
		type: ev.target.method,
		dataType: 'jsonp',
		data:  $(ev.target).serialize()
	})
	.done(function(data) {
		var el = $("#contentAlert").append("<div class='animated fadeIn'><div class='alert alert-dismissible alert-" + data.color + "'><h4 class='alert-heading'><i class='fa fa-fw fa-" + data.icon + "'></i>" + data.title + "<button type='button' class='close' data-dismiss='alert' aria-label='Close'><span aria-hidden='true'>&times;</span></button></h4><p>" + data.content + "</p></div></div>");
		el = el.children(0);
		setTimeout(function(ev){
			el.animateCss("fadeOut", function(){
				el.remove();
				if(data.error==0){
					window.location.reload();
				}
			});
		}, 3000);
	});
	return false;
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

function MouseTouchDown(ev, el) {
	gtime = ev.timeStamp;
	idInt = setTimeout(function(){
		if(gtime){
			a = el.children[2].textContent.toUpperCase();
			document.getElementById("modaltitle").innerText = a;
			add_eve("add_compra", 1, el);
			add_eve("add_venta", 0, el);
			$('.modal').modal('show');
		}
	}, 1500);
}

function add_eve(id, pos, el){
	document.getElementById(id).onclick = function(ev2){
		el.getElementsByTagName('button')[pos].click();
		$('.modal').modal('hide');
	}
}

function MouseTouchUp(ev, el) {
	gtime = false;
	clearTimeout(idInt);
}

$('.collapse').collapse()