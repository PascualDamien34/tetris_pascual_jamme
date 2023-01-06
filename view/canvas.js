window.onload = function() {
	Draw_grid();
}

function Draw_grid(){
	console.log('okokok')
	const canvas = new Canvas('dessin');
	canvas.initCanvasGrid(24,10);


}
//const app = new Controller(new Model(), new View('dessins'));


class Canvas {
	constructor(div_id) {
		this.div_id = div_id;
		this.p_tag;
		this.ctx = document.getElementById(this.div_id).getContext('2d');
	}

	// Binding.
	bindGetCNF (callback) {
		this.getCNF = callback; // On veut pouvoir demander au Model (depuis le Controller) une nouvelle Chuck Norris Fact.
	}

	initView () {
	let div = document.querySelector(`#${this.div_id}`);
		this.p_tag = document.createElement('p');
		this.p_tag.innerHTML = 'Click to display a new Chuck Norris Fact.';
		let button = document.createElement('button');
		button.innerHTML = 'New Chuck Norris Fact';
		button.addEventListener('click', () => {
			this.getCNF();
		});
		div.appendChild(this.p_tag);
		div.appendChild(button);
	}

	displayCNF (cnf_value) {
		if (this.p_tag) {
			this.p_tag.innerHTML = cnf_value;
		}
	}

	initCanvasGrid(height,width){
		this.ctx.strokeStyle='white';
		this.ctx.lineWidth=0.2;
		var size_case = 30; //px
		var pixel_height = height * size_case; 
		var pixel_width = width * size_case;
		console.log(pixel_height,pixel_width)
		this.ctx.beginPath(); // Start a new path
		for (var col=0; col < height; col++) {
			this.ctx.moveTo(col*size_case,0); // Move the pen to (30, 50)
			this.ctx.lineTo(col*size_case, pixel_height); // Draw a line to (150, 100)
		}
		for (var line=0; line <= height; line++) {
			this.ctx.moveTo(0, line*size_case); // Move the pen to (30, 50)
			this.ctx.lineTo(pixel_width, line*size_case); // Draw a line to (150, 100)
		}
		this.ctx.stroke(); // Render the path	
	}

	draw_
}