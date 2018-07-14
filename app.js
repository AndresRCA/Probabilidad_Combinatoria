/* jshint esversion: 6 */
Vue.component('home',{
    template: '#home',
    data: function(){
    	return {
    		red_min: 2, //these are the combinations
	    	green_min: 2,
	    	white_min: 2,
	    	red_max: 6, //these are the full numbers
	    	green_max: 4,
	    	white_max: 3,
			isSubmitted: false,    	
	    	notification: {}
    	};
    },
    computed: {
        total_balls: function(){
        	//Aqui basicamente tengo que convertir el input en int, por lo fastidioso de html y javascript
        	var red = parseInt(this.red_min, 10);
        	var white = parseInt(this.green_min, 10);
        	var green = parseInt(this.white_min, 10);		      	      
            return red+white+green;
        },
        balls_inBox: function(){
        	var red_max = parseInt(this.red_max, 10);
		    var white_max = parseInt(this.white_max, 10);
		    var green_max = parseInt(this.green_max, 10);
		    var balls = [];
        	for(var i = 0; i < red_max; i++){
		    	balls.push("red");
		    }
		    for(i = 0; i < white_max; i++){
		    	balls.push("white");
		    }
		    for(i = 0; i < green_max; i++){
		    	balls.push("green");
		    }
		    return balls;
        },
        balls_combination: function(){
        	var red_min = parseInt(this.red_min, 10);
			var white_min = parseInt(this.white_min, 10);
			var green_min = parseInt(this.green_min, 10);
			var balls = [];
        	for(var i = 0; i < red_min; i++){
		    	balls.push("red");
		    }
		    for(i = 0; i < white_min; i++){
		    	balls.push("white");
		    }
		    for(i = 0; i < green_min; i++){
		    	balls.push("green");
		    }
		    return balls;
        }
    },
    methods: {
    	calculate: function(){
    		if(this.red_min == "" || this.white_min == "" || this.green_min == "" || this.red_max == "" || this.white_max == "" || this.green_max == ""){
				return alert("You must define every field before realizing the experiment");
			}
		    //first I parse the strings from the html input fields to work with numbers
		    var red_max = parseInt(this.red_max, 10);
		    var white_max = parseInt(this.white_max, 10);
		    var green_max = parseInt(this.green_max, 10);
			var red_min = parseInt(this.red_min, 10);
			var white_min = parseInt(this.white_min, 10);
			var green_min = parseInt(this.green_min, 10);
			var total_choosen_balls = red_min + white_min + green_min;

			if(red_min < 0 || red_max < 0 || green_min < 0 || green_max < 0 || white_min < 0 || white_max < 0){
				return alert("You can't enter any negative numbers");
			}
    		if(red_min > red_max || white_min > white_max || green_min > green_max){
    			return alert("You can't enter a combination that posseses a higher number of balls than the existing ones");
    		}
    		//I set a loading class in the button
    		document.getElementById('calculate').classList.add('is-loading'); //should work, but it doesn't appear
    		//this is the graph style
			var layout = {
				title: "P(A) vs Repetitions",
				xaxis: {
					title: "Repetitions",
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
			//the curves go here
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

		    //average probability of the 3 curves
		    var average_probability = 0;
		    var balls = this.balls_inBox;

			for(var size = 0; size < data.length; size++){

				var event_ocurred = 0;
				var tries = 0;
				data[size].x.push(tries);
				data[size].y.push(event_ocurred);	

				while(tries < 10000){			
					tries++;
					data[size].x.push(tries);

					var choosen_balls = [];

					while(choosen_balls.length < total_choosen_balls){
						//selection is a number between 0 and the last item in the array
						var selection = Math.floor(Math.random()*(balls.length));
						//the ball is selected
						choosen_balls.push(balls[selection]);
						//the ball is removed from the box
						balls.splice(selection, 1);
					}

					var flag = true;
					var red_extracted = 0;
					var white_extracted = 0;
					var green_extracted = 0;

					choosen_balls.forEach(ball => {
						switch(ball){
							case "red":
								red_extracted++;
								break;
							case "white":
								white_extracted++;
								break;
							case "green":
								green_extracted++;
						}
					});

					if(red_extracted < red_min || white_extracted < white_min || green_extracted < green_min){
						flag = false;
						data[size].y.push(event_ocurred/tries);
					}else{
						event_ocurred++;
						data[size].y.push(event_ocurred/tries);
					}
					//the selected balls are returned to repeat the experiment
					choosen_balls.forEach(item => {
						balls.push(item);
					});
				}
				average_probability += event_ocurred/tries;
			}
			Plotly.newPlot('myDiv', data, layout);
			document.getElementById('result').innerHTML = (average_probability/data.length);
			document.getElementById('calculate').classList.remove('is-loading');
			this.notification.status = 'success';
			this.notification.message = 'Item successfully added to the database';
			this.isSubmitted = true; //this shows the upload notification
			setTimeout(() => {
				this.isSubmitted = false;
			}, 2000);
		}
    },
    mounted: function(){
		var layout = {
			title: "P(A) vs Repetitions",
			xaxis: {
				title: "Repetitions",
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

	    var red_max = this.red_max;
	    var white_max = this.white_max;
	    var green_max = this.green_max;

	    var red_min = this.red_min;
		var white_min = this.white_min;
		var green_min = this.green_min;
		var total_choosen_balls = red_min + white_min + green_min;

	    var average_probability = 0;
	    var balls = this.balls_inBox;

		for(var size = 0; size < data.length; size++){

			var event_ocurred = 0;
			var tries = 0;
			data[size].x.push(tries);
			data[size].y.push(event_ocurred);	

			while(tries < 10000){			
				tries++;
				data[size].x.push(tries);

				var choosen_balls = [];

				while(choosen_balls.length < total_choosen_balls){
					var selection = Math.floor(Math.random()*(balls.length));
					choosen_balls.push(balls[selection]);
					balls.splice(selection, 1);
				}

				var flag = true;
				var red_extracted = 0;
				var white_extracted = 0;
				var green_extracted = 0;

				choosen_balls.forEach(ball => {
					switch(ball){
						case "red":
							red_extracted++;
							break;
						case "white":
							white_extracted++;
							break;
						case "green":
							green_extracted++;
					}
				});
				if(red_extracted < red_min || white_extracted < white_min || green_extracted < green_min){
						flag = false;
						data[size].y.push(event_ocurred/tries);
				}else{
					event_ocurred++;
					data[size].y.push(event_ocurred/tries);
				}
				choosen_balls.forEach(item => {
					balls.push(item);
				});
			}
			average_probability += event_ocurred/tries;
		}
		Plotly.newPlot('myDiv', data, layout);
		document.getElementById('result').innerHTML = (average_probability/data.length).toFixed(6); //Si lo desea puede eliminar ese .toFixed(6), sirve nada mas para mostrar solo 6 numeros despues de la coma	
    }
});

Vue.component('previous_stats',{
	template: '#previous-stats',
	props: ['previous_data'], //I have a long way to make this similar to the laravel counterpart
	mounted: function(){
		var layout = {
		title: "P(A) vs Repetitions",
		xaxis: {
			title: "Repetitions",
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
	    }];
	    for(var i = 0; i < this.previous_data.length; i++){
	    	data[0].x.push(i + 1);
	    	data[0].y.push(this.previous_data[i].probability);
	    }
	    Plotly.newPlot('line', data, layout);
	}
});

new Vue({
    el: '#app',
    data: {
		current_view: 'home',
		previous_data: [{
			red_min: 2,
	    	green_min: 2,
	    	white_min: 2,
	    	red_max: 6,
	    	green_max: 4,
	    	white_max: 3,
	    	probability: 0.15843333333333334,
	    	created_at: "06/03/2018 20:43"
		}, {
			red_min: 2,
	    	green_min: 2,
	    	white_min: 2,
	    	red_max: 6,
	    	green_max: 4,
	    	white_max: 3,
	    	probability: 0.159,
	    	created_at: "06/05/2018 23:23"
		}, {
			red_min: 2,
	    	green_min: 2,
	    	white_min: 2,
	    	red_max: 6,
	    	green_max: 4,
	    	white_max: 3,
	    	probability: 0.1584,
	    	created_at: "06/06/2018 15:51"
		}]
    }
});