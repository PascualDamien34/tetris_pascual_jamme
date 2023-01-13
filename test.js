class Model {

	static HORIZONTAL_SIZE = 10;
	static VERTICAL_SIZE = 24;

	constructor() {
		this.tab = new Array(Model.VERTICAL_SIZE);

		for(let i = 0 ; i<Model.VERTICAL_SIZE; i++){
			this.tab[i] = new Array(Model.HORIZONTAL_SIZE);
			this.tab[i].fill(0);
		}

		this.currentPiece = new Piece();

		this.play = this.play.bind(this);
		this.down = this.down.bind(this);
	}
	
	 // Binding.
	 bindDisplayTetris (callback) {
	   // Définition d'une nouvelle propriété pouvant être utilisée à partir d'une instance de Model.
	   this.DisplayTetris = callback; // On veut pouvoir actualiser la View (depuis le Controller) quand nous récupérons les données.
	 }

	actionKeyBoard(keyName){
		switch (keyName) {
			case "ArrowDown":
				this.down();
			break;
			case "ArrowUp":
				this.currentPiece.rotation();
			break;
			case "ArrowLeft":
				this.currentPiece.x += -1;
			break;
			case "ArrowRight":
				this.currentPiece.x += 1;
			break;
			case "Space":
				console.log("Space");
				downFall();
			break;
		}
	}

	play(){
		//this.currentPiece.printMatrix();
		

		
		//console.log("L",this.isOverLapLeft());
		console.log("R",this.isOverLapRight());
		//remettre piece dans la grille auto


		this.DisplayTetris(this.mergeGrid());

	}

	isOverLapLeft(){
		if(this.currentPiece.x<0){
			for (var j = 0; j < this.currentPiece.getSizeOfMatrice(); j++) {
				for (var i = 0; i < this.currentPiece.x * (-1) ; i++) {
					if(this.currentPiece.tetrominos[j][i]==1){
						return true;
					}
				}
			}
		}
		return false;
	}

	isOverLapRight(){
		let N = this.currentPiece.getSizeOfMatrice();
		if(this.currentPiece.x + N > Model.HORIZONTAL_SIZE){
			for (var j = 0; j < N; j++) {
				for (var i = N-1; i > (this.currentPiece.x + N - Model.HORIZONTAL_SIZE) ; i--) {
					if(this.currentPiece.tetrominos[j][i]==1){
						return true;
					}
				}
			}
		}
		return false;
	}

	mergeGrid(){
		//merge grid
		let tabCopy = new Array(Model.VERTICAL_SIZE);

		for(let i = 0 ; i<Model.VERTICAL_SIZE; i++){
			tabCopy[i] = new Array(Model.HORIZONTAL_SIZE);
			tabCopy[i].fill(0);
		}
		for (var i = 0; i < this.tab.length; i++) {
			for (var j = 0; j < this.tab[0].length; j++) {
				tabCopy[i][j] = this.tab[i][j];
			}
		}

		let N = this.currentPiece.getSizeOfMatrice()
		for (var i = this.currentPiece.y; i < N + this.currentPiece.y; i++) {
			if(i >= Model.VERTICAL_SIZE){
				break;
			}
			for (var j = this.currentPiece.x; j < N + this.currentPiece.x; j++) {
				if(j<0){
					continue;
				}
				if(j>= Model.HORIZONTAL_SIZE){
					break;
				}
				//console.log("i=",i," j=",j, "tab=",tabCopy[i][j])
				tabCopy[i][j]=this.currentPiece.tetrominos[i - this.currentPiece.y][j - this.currentPiece.x];
			}
		}
		return tabCopy;
	}

	down(){
		this.currentPiece.y += 1;
	}

	downFall(){
		console.log("downFall");
	}
}

class Piece{

	static tabPieces = [
						[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
						[[1,1],[1,1]],
						[[0,0,0],[1,1,1],[0,1,0]],
						[[0,0,0],[1,1,1],[1,0,0]],
						[[0,0,0],[1,1,1],[0,0,1]],
						[[0,0,0],[1,1,0],[0,1,1]],
						[[0,0,0],[0,1,1],[1,1,0]]
						]

	constructor(){
		let number = Math.floor(Math.random() * 7);
		this.tetrominos = Piece.tabPieces[number];

		let N = this.getSizeOfMatrice();
		if(N == 2){
			this.y = 1;
		}else{	
			this.y = 0;
		}
		if (N==4){
			this.x = 3;
		}else{
			this.x = 4;
		}
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
	   this.canvas = canvas;
	 }
	
	 displayTetris (Tetris_value) {
		this.canvas.initCanvasGrid();
		this.canvas.drawGrid(Tetris_value);
	}
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
		//this.ctx.fillStyle = getRandomColor();
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
	
class Controller {
	 constructor(model, view) {
	   this.model = model;
	   this.view = view; 

	   this.bindDisplayTetris = this.bindDisplayTetris.bind(this);
	   this.model.bindDisplayTetris(this.bindDisplayTetris);


	   this.intervalPlay = setInterval(this.model.play, 100);
	   this.intervalDown = setInterval(this.model.down, 1000);
	 }
	 
	 bindDisplayTetris (Tetris_value) {
	   this.view.displayTetris(Tetris_value);
	 }

	 buttonAI(){
		console.log("test")
	}

	keyboardEvent(keyName){
		this.model.actionKeyBoard(keyName);
	}


}

const app = new Controller(new Model(), new View(new Canvas('dessin')));

document.addEventListener('keyup', (event) => {
	const nomTouche = event.key;
	app.keyboardEvent(nomTouche);	
}, false);

function getRandomColor() {
  var letters = '0123456789ABCDEF';
  var color = '#';
  for (var i = 0; i < 6; i++) {
    color += letters[Math.floor(Math.random() * 16)];
  }
  return color;
}