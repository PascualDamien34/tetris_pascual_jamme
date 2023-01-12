
window.onload = function() {
	//start();
}

function start(){
	
	canvas.initCanvasGrid();
	var Grille = [	[1,0,0,0,0,1,0,0,0,4],
					[0,1,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,3,0,0],
					[0,0,0,0,0,0,0,2,0,0],
					[0,0,0,0,0,0,0,1,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,4,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,3,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,5,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[0,0,0,0,0,0,0,0,0,0],
					[3,5,1,2,3,4,4,4,5,5]]
	canvas.drawGrid(Grille);
}

class Canvas {
	constructor(div_id) {
		this.div_id = div_id;
		this.p_tag;
		this.ctx = document.getElementById(this.div_id).getContext('2d');
		this.height = 24;
		this.width = 10;
		this.size_case = 30;
		this.pixel_height = this.height * this.size_case; 
		this.pixel_width = this.width * this.size_case;
		this.palette = ['#0ad6ff','#4efd54', "#bc13fe", "#cfff04", "#fe019a", "#ff073a"];
	}

	/*// Binding.
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
	}*/

	initCanvasGrid(){
		this.ctx.fillStyle = "#121212";
		this.ctx.fillRect(0, 0, this.size_case * this.width, this.size_case * this.height);
		this.ctx.strokeStyle='white';
		this.ctx.lineWidth=0.2;
		console.log(this.pixel_height,this.pixel_width)
		this.ctx.beginPath(); // Start
		for (var col=0; col < this.width; col++) {
			this.ctx.moveTo(col*this.size_case,0);
			this.ctx.lineTo(col*this.size_case, this.pixel_height); // Draw a line 
		}
		for (var line=0; line <= this.height; line++) {
			this.ctx.moveTo(0, line*this.size_case);
			this.ctx.lineTo(this.pixel_width, line*this.size_case); // Draw a line 
		}
		this.ctx.stroke(); // End	
	}

	drawGrid(grid){
		for (var i = 0; i < this.height; i++) {
			for (var j = 0; j < this.width; j++) {
				if(grid[i][j]!=0){
					this.ctx.fillStyle = this.palette[grid[i][j]];
					this.ctx.fillRect(j*this.size_case + 1, i*this.size_case + 1, this.size_case - 2, this.size_case - 2);
				}
			}
		}
	}

	async valideLine(line){
		for (var i = 0; i <4; i++) {
			for (var j = 0; j < this.width; j++) {
				if (i % 2 == 0){
					this.ctx.fillStyle = "white";
					this.ctx.fillRect(j*this.size_case + 1, line*this.size_case + 1, this.size_case - 2, this.size_case - 2);
				}else{
					this.ctx.fillStyle = "#121212";
					this.ctx.fillRect(j*this.size_case + 1, line*this.size_case + 1, this.size_case - 2, this.size_case - 2);
				}
			}
			await sleep(100);
		}
	}
}




function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}