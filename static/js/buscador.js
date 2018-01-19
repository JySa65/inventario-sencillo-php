window.addEventListener('load', function(){
	id_b = document.getElementById('id_buscar');
	id_b.addEventListener('keyup', buscar);
	
	dat = trr();
	
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
	paginator(1, trr(1));
});

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
		$('#quitar_css').addClass('btn btn-danger');
		tbi.attr("disabled", "");
		//NO FUNCIONA EN LA TABLET
		tb.animateCss("slideOutUp fixed-top", function(){ });
	}else{	
		$('#quitar_css').removeClass('btn btn-danger');
		tbi.val("").removeAttr("disabled");
		tb.animateCss("slideInDown fixed-top", function(){
			tbi.focus();
		});
	}
}


function cargarVentana(template, datos){
	$.ajax({
		url: template,
		type: 'GET',
		dataType: 'text/html',
		data: datos
	}).always(function(data) {
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

function cambiarVentana(elementIn, elementOut, effect){
	if(!elementIn){
		elementIn = "ventOff";
	}
	if(!elementOut){
		elementOut = "ventOn";
	}
	if(!effect){
		effect = "slide";
	}
	ocultarinpu();
	var eOut = $("#"+elementOut);
	var eIn = $("#"+elementIn);
	eOut.animateCss(effect + "OutLeft fixed-top", function(){});
	eIn.animateCss(effect + "InRight", function(){
		eOut.attr("id", elementIn);
		eIn.attr("id", elementOut);
	});
}
function ocultarinpu(){
	if($("#tgBuscar").hasClass("slideInDown")){
		$('#quitar_css').addClass('btn btn-danger');
		$("#tgBuscar").find("input").val("").attr("disabled", "");
		$("#tgBuscar").animateCss("slideOutUp fixed-top", function(){});
	}
}
function trr(tipo){
	if(!tipo){
		 tipo = 1;
	}
	if(tipo == 1){
		return document.getElementsByTagName('table')[0].children[1].children; 	
	}
	return $("tbody > tr[class!='d-none']");
}
function buscar(ev){
	var i;
	datos = trr(1)
	inp = ev.target.value.toUpperCase();
	if(inp.length > 0){
		var re;
		for(i=0; i<datos.length; i++) {
			texto = datos[i].children[2].textContent.toUpperCase();
			letra = ev.key;
			re = new RegExp("(^|.)+" + inp + "+(.|$)");
			if (!re.test(texto)){
				datos[i].classList.add('d-none');
			}else{
				datos[i].classList.remove('d-none');
			} 

		}
	}else{
		for(i = 0; i<datos.length; i++){
			datos[i].classList.remove('d-none');
		}
	}
	paginator(1, trr(2))
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

var xy;
function paginator(pagact, tr){
	if(!pagact){
		pagact = 1;
	}
	xy = tr;
	var datoMues = 2;
	numbPage = Math.ceil(tr.length/datoMues);
	if(pagact <= numbPage){
		total = pagact*datoMues;
		total2 = (total>=tr.length) ? tr.length : total
		for(var i=0; i<tr.length; i++){
			tr[i].classList.add('d-none');
		}		
		for(var i=(total)-datoMues; i<(total2); i++ ){
			tr[i].classList.remove('d-none');
		}	
	} 
	html = ""
	for(var i=1; i<=numbPage; i++){
		html+= '<li class="page-item'
		ad = ' onclick="paginator(' + i + ', xy)"'
		if(i == pagact){
			html += ' active"'
			ad =""
		}
		html += '"><a class="page-link"'+ ad +'>' + i + '</a></li>'
	}
	disabled = " disabled"
	pagact1 = 0
	if(pagact>1){
		pagact1 = pagact - 1;
		disabled="";
	}
	prev = '<li class="page-item'+ disabled +'"><a class="page-link" href="#" onclick="paginator(' + pagact1 + ', xy)"><<</a></li>'
	
	disabled = " disabled"
	if(pagact < numbPage){
		pagact += 1;
		disabled="";
	}
	next = '<li class="page-item'+ disabled +'"><a class="page-link" href="#" onclick="paginator(' + pagact + ', xy)">>></a></li>'
	$("#pagina").html(prev + html + next)
}