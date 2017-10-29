//Codigo viejo que se utilizo antes de implementar las opciones interactivas de combinacion (numero de pelotas, tipos de
//combinacion, etc). Siga bajando para ver realmente el codigo final
/* 
function calculate(){
	var layout = {
		title: "P(A) vs Repeticiones",
		xaxis: {
			title: "Repeticiones",
			titlefont: {
				color: "lightgrey",
				size: 18,
				family: "Ariel, sans-serif"
			}
		},
		yaxis: {
			title: "P(A)",
			titlefont: {
				color: "lightgrey",
				size: 18,
				family: "Ariel, sans-serif"
			}
		}

	};
	var data = [{
    	x: [],
    	y: [],
    	type: 'scatter'
    },
    {
    	x: [],
    	y: [],
    	type: 'scatter'
    },
    {
    	x: [],
    	y: [],
    	type: 'scatter'
    }];

    var probabilidad_promedio = 0;
    var pelotas = [];
	for(var i = 0; i < 40; i++){
		//Se autogeneran 10 pelotas rojas, 15 pelotas blancas y 15 verdes
		pelotas[i] = (i < 10)? "rojo" : (i >= 10 && i < 25)? "blanco": "verde";
	}

	for(var size = 0; size < data.length; size++){

		var evento_sucedio = 0;
		var intentos = 0;
		data[size].x.push(intentos);
		data[size].y.push(evento_sucedio);	

		while(intentos < 10000){			
			intentos++;
			data[size].x.push(intentos);
			var pelotas_escogidas = [];

			while(pelotas_escogidas.length < 2){
				//seleccion es un numero entre 0 y el ultimo item del arreglo
				var seleccion = Math.floor(Math.random()*(pelotas.length));
				pelotas_escogidas.push(pelotas[seleccion]);
				pelotas.splice(seleccion, 1);
			}

			var flag = true;
			for (var i = 0; i < pelotas_escogidas.length; i++) {
				if(pelotas_escogidas[i] != "rojo"){
					flag = false;
				}
			}

			if(flag){
				evento_sucedio++;
				data[size].y.push(evento_sucedio/intentos);
			}else{
				data[size].y.push(evento_sucedio/intentos);
			}
			//Se regresan las pelotas seleccionadas para repetir el experimento
			for (var i = 0; i < pelotas_escogidas.length; i++) {
				pelotas.push(pelotas_escogidas[i]);
			}
		}
		probabilidad_promedio += evento_sucedio/intentos;
	}
	Plotly.newPlot('myDiv', data, layout);
	document.getElementById('result').innerHTML = (probabilidad_promedio/data.length).toFixed(6);
}
*/


//Esto es un framework MVC que me ayuda a manejar las variables dentro del html y mostrarlas
var app = new Vue({
    el: '#app',
    //data es un objeto que contiene las variables que utilizo dentro de html y dentro del archivo .js
    data: {
        pelotas: [{
        	color: "rojo", //el color solo esta aqui para indicar que tipo de pelota es, para el lector del programa
        	cantidad: 6
        },
        {
        	color: "blanco",
        	cantidad: 4
        },{
        	color: "verde",
        	cantidad: 3
        }],

        combinaciones: [{
        	color: "rojo", //el color solo esta aqui para indicar que tipo de pelota es, para el lector del programa
        	cantidad: 2
        },
        {
        	color: "blanco",
        	cantidad: 2
        },
        {
        	color: "verde",
        	cantidad: 2
        }]
    },
    //computed es una variable especial que se automodifica si uno de las variables de la que depende cambia
    //como por ejemplo la suma de las pelotas dentro de la caja 
    computed: {
        pelotas_total: function(){
        	//Aqui basicamente tengo que convertir el input en int, por lo fastidioso de html y javascript
        	var rojas = parseInt(this.pelotas[0].cantidad);
        	var blancas = parseInt(this.pelotas[1].cantidad);
        	var verdes = parseInt(this.pelotas[2].cantidad);		      	      
            return rojas+blancas+verdes;
        }
    },
    methods: {
    	calculate: function(){
    		if(this.combinaciones[0].cantidad == "" || this.combinaciones[1].cantidad == "" || this.combinaciones[2].cantidad == "" || this.pelotas[0].cantidad == "" || this.pelotas[1].cantidad == "" || this.pelotas[2].cantidad == ""){
				return alert("Debes definir cada parametro antes de realizar el experimento");
			}
		    //Otra vez, pasarlo a Int para poder realizar operaciones
		    var cantidad_rojas = parseInt(this.pelotas[0].cantidad);
		    var cantidad_blancas = parseInt(this.pelotas[1].cantidad);
		    var cantidad_verdes = parseInt(this.pelotas[2].cantidad);

			var combinacion_rojas = parseInt(this.combinaciones[0].cantidad);
			var combinacion_blancas = parseInt(this.combinaciones[1].cantidad);
			var combinacion_verdes = parseInt(this.combinaciones[2].cantidad);

			//El error sucedia en esta condicion, originalmente estaba comparando strings y por alguna razon funcionaba con numeros pequenos pero con numeros altos esta condicion se cumplia cuando no debia hacerlo
			//Tal vez tenga que ver con las propiedades de un string al momento de hacer comparaciones de < >, tal vez sea algo de javascript, no estoy claro en la causa, pero pasarlos a Int si lo resolvio,
			//no habia que buscar mucho la solucion  
    		if(combinacion_rojas > cantidad_rojas || combinacion_blancas > cantidad_blancas || combinacion_verdes > cantidad_verdes){
    			return alert("No puedes ingresar una combinacion que posee un numero mayor a la cantidad de pelotas existentes");
    		}
    		//Esto simplemente es para el estilo de la grafica
			var layout = {
				title: "P(A) vs Repeticiones",
				xaxis: {
					title: "Repeticiones",
					titlefont: {
						color: "lightgrey",
						size: 18,
						family: "Ariel, sans-serif"
					}
				},
				yaxis: {
					title: "P(A)",
					titlefont: {
						color: "lightgrey",
						size: 18,
						family: "Ariel, sans-serif"
					}
				}
			};
			//Aqui van las curvas
			var data = [{
		    	x: [],
		    	y: [],
		    	type: 'scatter'
		    },
		    {
		    	x: [],
		    	y: [],
		    	type: 'scatter'
		    },
		    {
		    	x: [],
		    	y: [],
		    	type: 'scatter'
		    }];

		    //probabilidad promedio de las 3 curvas, se encuentra al final
		    var probabilidad_promedio = 0;
		    var pelotas = [];

		    //En un codigo anterior logre rellenar el arreglo con un solo for, se veia asi:
		    /*for(var i = 0; i < 40; i++){
				//Se autogeneran 10 pelotas rojas, 15 pelotas blancas y 15 verdes
				pelotas[i] = (i < 10)? "rojo" : (i >= 10 && i < 25)? "blanco": "verde";
			}*/
			//Creo que solo funcionaba para ese caso porque cuando trate de pasarlo a este tipo de situacion, no me daba bien,
			//me fui por lo mas simple aqui, por performance probablemente deba arreglar esto, son bastantes ciclos anidados en
			//todo este codigo
		    for(var i = 0; i < cantidad_rojas; i++){
		    	pelotas.push("rojo");
		    }
		    for(var i = 0; i < cantidad_blancas; i++){
		    	pelotas.push("blanco");
		    }
		    for(var i = 0; i < cantidad_verdes; i++){
		    	pelotas.push("verde");
		    }

			for(var size = 0; size < data.length; size++){

				var evento_sucedio = 0;
				var intentos = 0;
				data[size].x.push(intentos);
				data[size].y.push(evento_sucedio);	

				while(intentos < 10000){			
					intentos++;
					data[size].x.push(intentos);

					var pelotas_escogidas = [];
					var pelotas_total_escogidas = combinacion_rojas + combinacion_blancas + combinacion_verdes;

					while(pelotas_escogidas.length < pelotas_total_escogidas){
						//seleccion es un numero entre 0 y el ultimo item del arreglo
						var seleccion = Math.floor(Math.random()*(pelotas.length));
						//se selecciona la pelota
						pelotas_escogidas.push(pelotas[seleccion]);
						//se elimina la pelota de la caja
						pelotas.splice(seleccion, 1);
					}

					var flag = true;
					var rojas_extraidas = 0;
					var blancas_extraidas = 0;
					var verdes_extraidas = 0;

					for(var i = 0; i < pelotas_escogidas.length; i++){
						//se cuentan las pelotas seleccionadas para ver si luego coinciden con la combinacion ingresada
						//aqui abajo hay un console.log por si quiere ver cuales pelotas se escogieron
						//console.log(pelotas_escogidas);
						switch(pelotas_escogidas[i]){
							case "rojo":
								rojas_extraidas++;
								break;
							case "blanco":
								blancas_extraidas++;
								break;
							case "verde":
								verdes_extraidas++;
						}
					}
					//aqui hay unos console.log por si quiere comprobar si el evento se dio, mientras que observa el console.log de las pelotas escogidas
					//console.log("antes: "+flag);
					if(rojas_extraidas < combinacion_rojas || blancas_extraidas < combinacion_blancas || verdes_extraidas < combinacion_verdes){
						flag = false;
					}
					//console.log("despues: "+flag);
					if(flag){
						evento_sucedio++;
						data[size].y.push(evento_sucedio/intentos);
					}else{
						data[size].y.push(evento_sucedio/intentos);
					}
					//Se regresan las pelotas seleccionadas para repetir el experimento
					for (var i = 0; i < pelotas_escogidas.length; i++) {
						pelotas.push(pelotas_escogidas[i]);
					}
				}
				probabilidad_promedio += evento_sucedio/intentos;
			}
			Plotly.newPlot('myDiv', data, layout);
			document.getElementById('result').innerHTML = (probabilidad_promedio/data.length).toFixed(6); //Si lo desea puede eliminar ese .toFixed(6), sirve nada mas para mostrar solo 6 numeros despues de la coma
		}
    },
    //Aqui la funcion la tengo que copiar porque no la puedo llamar del objeto methods, ya que dice que calculate no esta definida
    //mounted es la funcion que llama cuando la pagina se termina de cargar, como onload="calculate()" pero diferente por cuestiones del framework
    mounted: function(){
    	//Esta funcion si no necesita alguna excepcion que te regrese, siempre va a ser correcto al momento de cargar

		//Esto simplemente es para el estilo de la grafica
		var layout = {
			title: "P(A) vs Repeticiones",
			xaxis: {
				title: "Repeticiones",
				titlefont: {
					color: "lightgrey",
					size: 18,
					family: "Ariel, sans-serif"
				}
			},
			yaxis: {
				title: "P(A)",
				titlefont: {
					color: "lightgrey",
					size: 18,
					family: "Ariel, sans-serif"
				}
			}
		};
		//Aqui van las curvas
		var data = [{
	    	x: [],
	    	y: [],
	    	type: 'scatter'
	    },
	    {
	    	x: [],
	    	y: [],
	    	type: 'scatter'
	    },
	    {
	    	x: [],
	    	y: [],
	    	type: 'scatter'
	    }];

	    //Otra vez, pasarlo a Int para poder realizar operaciones
	    var cantidad_rojas = parseInt(this.pelotas[0].cantidad);
	    var cantidad_blancas = parseInt(this.pelotas[1].cantidad);
	    var cantidad_verdes = parseInt(this.pelotas[2].cantidad);

	    //probabilidad promedio de las 3 curvas, se encuentra al final
	    var probabilidad_promedio = 0;
	    var pelotas = [];

	    //En un codigo anterior logre rellenar el arreglo con un solo for, se veia asi:
	    /*for(var i = 0; i < 40; i++){
			//Se autogeneran 10 pelotas rojas, 15 pelotas blancas y 15 verdes
			pelotas[i] = (i < 10)? "rojo" : (i >= 10 && i < 25)? "blanco": "verde";
		}*/
		//Creo que solo funcionaba para ese caso porque cuando trate de pasarlo a este tipo de situacion, no me daba bien,
		//me fui por lo mas simple aqui, por performance probablemente deba arreglar esto, son bastantes ciclos anidados en
		//todo este codigo
	    for(var i = 0; i < cantidad_rojas; i++){
	    	pelotas.push("rojo");
	    }
	    for(var i = 0; i < cantidad_blancas; i++){
	    	pelotas.push("blanco");
	    }
	    for(var i = 0; i < cantidad_verdes; i++){
	    	pelotas.push("verde");
	    }

		for(var size = 0; size < data.length; size++){

			var evento_sucedio = 0;
			var intentos = 0;
			data[size].x.push(intentos);
			data[size].y.push(evento_sucedio);	

			while(intentos < 10000){			
				intentos++;
				data[size].x.push(intentos);

				var pelotas_escogidas = [];
				var combinacion_rojas = parseInt(this.combinaciones[0].cantidad);
				var combinacion_blancas = parseInt(this.combinaciones[1].cantidad);
				var combinacion_verdes = parseInt(this.combinaciones[2].cantidad);
				var pelotas_total_escogidas = combinacion_rojas + combinacion_blancas + combinacion_verdes;

				while(pelotas_escogidas.length < pelotas_total_escogidas){
					//seleccion es un numero entre 0 y el ultimo item del arreglo
					var seleccion = Math.floor(Math.random()*(pelotas.length));
					//se selecciona la pelota
					pelotas_escogidas.push(pelotas[seleccion]);
					//se elimina la pelota de la caja
					pelotas.splice(seleccion, 1);
				}

				var flag = true;
				var rojas_extraidas = 0;
				var blancas_extraidas = 0;
				var verdes_extraidas = 0;

				for(var i = 0; i < pelotas_escogidas.length; i++){
					//se cuentan las pelotas seleccionadas para ver si luego coinciden con la combinacion ingresada
					//aqui abajo hay un console.log por si quiere ver cuales pelotas se escogieron
					//console.log(pelotas_escogidas);
					switch(pelotas_escogidas[i]){
						case "rojo":
							rojas_extraidas++;
							break;
						case "blanco":
							blancas_extraidas++;
							break;
						case "verde":
							verdes_extraidas++;
					}
				}
				//aqui hay unos console.log por si quiere comprobar si el evento se dio, mientras que observa el console.log de las pelotas escogidas
				//console.log("antes: "+flag);
				if(rojas_extraidas < combinacion_rojas || blancas_extraidas < combinacion_blancas || verdes_extraidas < combinacion_verdes){
					flag = false;
				}
				//console.log("despues: "+flag);
				if(flag){
					evento_sucedio++;
					data[size].y.push(evento_sucedio/intentos);
				}else{
					data[size].y.push(evento_sucedio/intentos);
				}
				//Se regresan las pelotas seleccionadas para repetir el experimento
				for (var i = 0; i < pelotas_escogidas.length; i++) {
					pelotas.push(pelotas_escogidas[i]);
				}
			}
			probabilidad_promedio += evento_sucedio/intentos;
		}
		Plotly.newPlot('myDiv', data, layout);
		document.getElementById('result').innerHTML = (probabilidad_promedio/data.length).toFixed(6); //Si lo desea puede eliminar ese .toFixed(6), sirve nada mas para mostrar solo 6 numeros despues de la coma	
    }
});