class Controller {
	constructor(model, view) {
		this.model = model
		this.view = view
	}

	keyboardEvent(keyName){
		switch (keyName) {
			case "ArrowDown":
				console.log("ArrowDown");
			break;
			case "ArrowUp":
				console.log("ArrowUp");
			break;
			case "ArrowLeft":
				console.log("ArrowLeft");
			break;
			case "ArrowRight":
				start();
				console.log("ArrowRight");
			break;
			default:
				this.view.canvas.valideLine(23);
			return; 
		}
	}
}


class Model{

	static HORIZONTAL_SIZE = 10;
	static VERTICAL_SIZE = 24;

	constructor(){
		this.tab = new Array(Model.VERTICAL_SIZE);

		for(let i = 0 ; i<Model.VERTICAL_SIZE; i++){
			this.tab[i] = new Array(Model.HORIZONTAL_SIZE);
			this.tab[i].fill();
		}

		this.currentPiece = new Piece();

	}

	isOverlap(){

	}

	play(){
		this.currentPiece.printMatrix()
	}
}


class Piece{

	static tabPieces = [
						[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
						[[1,1],[1,1]],
						[[0,0,0],[1,1,1],[0,1,0]],
						[[0,0,0],[1,1,1],[1,0,0]],
						[[0,0,0],[1,1,1],[0,0,1]],
						[[1,1,0],[0,1,1],[0,0,0]],
						[[0,1,1],[1,1,0],[0,0,0]]
						]

	constructor(){
		let number = Math.floor(Math.random() * 7);
		this.tetrominos = Piece.tabPieces[number];
	}

	rotation() {
 
		let N = this.getSizeOfMatrice();
		// cas de base
		if (N == 0) {
			return;
		}
 
		// Transpose la matrice
		for (let i = 0; i < N; i++)
		{
			for (let j = 0; j < i; j++) {
				let temp = this.tetrominos[i][j];
				this.tetrominos[i][j] = this.tetrominos[j][i];
				this.tetrominos[j][i] = temp;
			}
		}
          
		// permute les colonnes
		for (let i = 0; i < N; i++)
		{
			for (let j = 0; j < N/2; j++) {
				let temp = this.tetrominos[i][j];
				this.tetrominos[i][j] = this.tetrominos[i][N - j - 1];
				this.tetrominos[i][N - j - 1] = temp;
			}
		}
	}

	getSizeOfMatrice(){
		return this.tetrominos.length;
	}
     
	printMatrix()
	{
		let N = this.getSizeOfMatrice();
		let string = "";
		for(let i=0;i<N;i++){
			for(let j=0; j<N; j++){
				string += this.tetrominos[i][j].toString() + " ";
			}
			string += "\n";
		}
		console.log(string);
		return;
	}
}

class View {
	constructor(canvas) {
		this.canvas = canvas
	}
}


function start(){
	
	app.view.canvas.initCanvasGrid();
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
	app.view.canvas.drawGrid(Grille);
}

class Canvas {

	static HEIGHT = 24;
	static WIDTH = 10;
	static SIZE_CASE = 30;
	static PIXEL_HEIGHT = Canvas.HEIGHT * Canvas.SIZE_CASE;
	static PIXEL_WIDTH = Canvas.WIDTH * Canvas.SIZE_CASE;
	static PALETTE = ['#0ad6ff','#4efd54', "#bc13fe", "#cfff04", "#fe019a", "#ff073a"];
	static BLOCK_SPACE = 1;

	constructor(div_id) {
		this.div_id = div_id;
		this.ctx = document.getElementById(div_id).getContext('2d');
	}

	initCanvasGrid(){
		this.ctx.fillStyle = "#121212";
		this.ctx.fillRect(0, 0, Canvas.SIZE_CASE * Canvas.WIDTH, Canvas.SIZE_CASE * Canvas.HEIGHT);
		this.ctx.strokeStyle='white';
		this.ctx.lineWidth=0.2;
		
		this.ctx.beginPath(); // Start
		for (var col=0; col < Canvas.WIDTH; col++) {
			this.ctx.moveTo(col*Canvas.SIZE_CASE,0);
			this.ctx.lineTo(col*Canvas.SIZE_CASE, Canvas.PIXEL_HEIGHT); // Draw a line 
		}
		for (var line=0; line <= Canvas.HEIGHT; line++) {
			this.ctx.moveTo(0, line*Canvas.SIZE_CASE);
			this.ctx.lineTo(Canvas.PIXEL_WIDTH, line*Canvas.SIZE_CASE); // Draw a line 
		}
		this.ctx.stroke(); // End	
	}

	drawGrid(grid){
		for (var i = 0; i < Canvas.HEIGHT; i++) {
			for (var j = 0; j < Canvas.WIDTH; j++) {
				if(grid[i][j]!=0){
					this.ctx.fillStyle = Canvas.PALETTE[grid[i][j]];
					this.ctx.fillRect(j*Canvas.SIZE_CASE + Canvas.BLOCK_SPACE, i*Canvas.SIZE_CASE + Canvas.BLOCK_SPACE, Canvas.SIZE_CASE - 2 * Canvas.BLOCK_SPACE, Canvas.SIZE_CASE - 2 * Canvas.BLOCK_SPACE);
				}
			}
		}
	}

	async valideLine(line){
		for (var i = 0; i <4; i++) {
			for (var j = 0; j < Canvas.WIDTH; j++) {
				if (i % 2 == 0){
					this.ctx.fillStyle = "white";
					this.ctx.fillRect(j*Canvas.SIZE_CASE+Canvas.BLOCK_SPACE, line*Canvas.SIZE_CASE+Canvas.BLOCK_SPACE, Canvas.SIZE_CASE-2*Canvas.BLOCK_SPACE, Canvas.SIZE_CASE-2*Canvas.BLOCK_SPACE);
				}else{
					this.ctx.fillStyle = "#121212";
					this.ctx.fillRect(j*Canvas.SIZE_CASE+Canvas.BLOCK_SPACE, line*Canvas.SIZE_CASE+Canvas.BLOCK_SPACE, Canvas.SIZE_CASE-2*Canvas.BLOCK_SPACE, Canvas.SIZE_CASE-2*Canvas.BLOCK_SPACE);
				}
			}
			await sleep(100);
		}
	}
}




function sleep(ms) {
  return new Promise(resolve => setTimeout(resolve, ms));
}



const app = new Controller(new Model(), new View(new Canvas('dessin')))

document.addEventListener('keyup', (event) => {
	const nomTouche = event.key;
	app.keyboardEvent(nomTouche);	
}, false);

app.view.canvas.initCanvasGrid();