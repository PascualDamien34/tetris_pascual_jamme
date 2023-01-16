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
		this.nextPiece = new Piece();

		this.play = this.play.bind(this);
		this.downFallInterval = this.downFallInterval.bind(this);

		this.score = 0;
	}
	
	bindDisplayTetris (callback) {
		this.displayTetris = callback;
	}

	bindBlinkLine (callback) {
		this.blinkLine = callback;
	}

	bindUpdateScore (callback) {
		this.updateScore = callback;
	}

	bindEndGame(callback) {
		this.endGame = callback;
	}

	actionKeyBoard(keyName){
		switch (keyName) {
			case "ArrowDown":
				this.down();
			break;
			case "ArrowUp":
				if(this.currentPiece.y>=0){
					this.currentPiece.rotation();
				}
			break;
			case "ArrowLeft":
				if(this.isPossibleMouveLeft() && !this.isOverLapLeft()){
					this.currentPiece.x -= 1;
				}
			break;
			case "ArrowRight":
				if(this.isPossibleMouveRight()  && !this.isOverLapRight()){
					this.currentPiece.x += 1;
				}
			break;
			case " ":
				this.downFall();
			break;
		}
	}

	isPossibleMouveLeft(){
		let N = this.currentPiece.getSizeOfMatrice();
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				if(this.currentPiece.tetrominos[i][j]!=0 && this.tab[this.currentPiece.y+i][this.currentPiece.x+j-1]!=0){
					return false;
				}
			}
		}
		return true;
	}

	isPossibleMouveRight(){
		let N = this.currentPiece.getSizeOfMatrice();
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				if(this.currentPiece.tetrominos[i][j]!=0 && this.tab[this.currentPiece.y+i][this.currentPiece.x+j+1]!=0){
					return false;
				}
			}
		}
		return true;
	}

	play(){
		
		if(this.isOverLapLeft()){
			this.replaceLeft()
		}
		if(this.isOverLapRight()){
			this.replaceRight()
		}

		if(this.isOverLapBot()){
			this.replaceBot();
			//changer de piece
			this.changePiece();
		}
		if(this.isOnPiece()){
			this.currentPiece.y -= 1;
			//changer de piece
			this.changePiece();
		}


		this.displayTetris(this.mergeGrid(),this.getNextPiece4x4());

		this.checkLine();
		

	}

	isOverLapLeft(){
		let N = this.currentPiece.getSizeOfMatrice();
		if(this.currentPiece.x<0){
			for (let i = 0; i < this.currentPiece.x * (-1); i++) {
				for(let j = 0; j<N; j++){
					if(this.currentPiece.tetrominos[j][i]!=0){
						return true;
					}
				}
			}
		}
		return false;
	}
	replaceLeft(){
		while(this.isOverLapLeft()){
			this.currentPiece.x += 1;
		}
	}

	isOverLapRight(){
		let N = this.currentPiece.getSizeOfMatrice();
		if(this.currentPiece.x + N > Model.HORIZONTAL_SIZE){
			for (let i = N-1; i > Model.HORIZONTAL_SIZE - this.currentPiece.x-1; i--) {
				for(let j = 0; j<N; j++){
					if(this.currentPiece.tetrominos[j][i]!=0){
						return true;
					}
				}
			}
		}
		return false;
	}
	replaceRight(){
		while(this.isOverLapRight()){
			this.currentPiece.x -= 1;
		}
	}

	isOverLapBot(){
		let N = this.currentPiece.getSizeOfMatrice();
		if(this.currentPiece.y + N > Model.VERTICAL_SIZE){
			for (let i = Model.VERTICAL_SIZE - this.currentPiece.y; i < N; i++) {
				for(let j = 0; j<N; j++){
					if(this.currentPiece.tetrominos[i][j]!=0){
						return true;
					}
				}
			}
		}
	}
	replaceBot(){
		while(this.isOverLapBot()){
			this.currentPiece.y -= 1;
		}
	}

	changePiece(){
		let N = this.currentPiece.getSizeOfMatrice();
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				if(this.currentPiece.tetrominos[i][j]!=0){
					this.tab[this.currentPiece.y+i][this.currentPiece.x+j] = this.currentPiece.tetrominos[i][j];
				}
			}
		}
		this.currentPiece = this.nextPiece;
		this.nextPiece = new Piece();
		if(this.isOnPiece()){
			this.endGame();
		}
		this.score += 10;
		this.updateScore(this.score);
	}


	isOnPiece(){
		let N = this.currentPiece.getSizeOfMatrice();
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				if(this.currentPiece.tetrominos[i][j]!=0 && this.tab[this.currentPiece.y+i][this.currentPiece.x+j]!=0){
					return true;
				}
			}
		}
		return false;
	}


	mergeGrid(){
		//copie du tab
		let tabCopy = new Array(Model.VERTICAL_SIZE);
		for(let i = 0 ; i<Model.VERTICAL_SIZE; i++){
			tabCopy[i] = new Array(Model.HORIZONTAL_SIZE);
			tabCopy[i].fill(0);
		}
		for (let i = 0; i < this.tab.length; i++) {
			for (let j = 0; j < this.tab[0].length; j++) {
				tabCopy[i][j] = this.tab[i][j];
			}
		}

		let N = this.currentPiece.getSizeOfMatrice();
		for (let i = this.currentPiece.y; i < N + this.currentPiece.y; i++) {
			if(i >= Model.VERTICAL_SIZE){
				break;
			}
			for (let j = this.currentPiece.x; j < N + this.currentPiece.x; j++) {
				if(j<0){
					continue;
				}
				if(j>= Model.HORIZONTAL_SIZE){
					break;
				}
				
				if(this.currentPiece.tetrominos[i - this.currentPiece.y][j - this.currentPiece.x]!=0){
					tabCopy[i][j]=this.currentPiece.tetrominos[i - this.currentPiece.y][j - this.currentPiece.x];
				}
			}
		}
		return tabCopy;
	}

	getNextPiece4x4(){
		let nextPiece4x4 = new Array(4);
		for (let i = 0; i< nextPiece4x4.length; i++){
			nextPiece4x4[i] = new Array(4);
			nextPiece4x4[i].fill(0);
		}

		let N = this.nextPiece.getSizeOfMatrice();
		for (let i = this.nextPiece.y; i < N + this.nextPiece.y; i++){
			for (let j = 0; j < N; j++){
				if(this.nextPiece.tetrominos[i - this.nextPiece.y][j]!=0){
					if(N!=2){
						nextPiece4x4[i+1][j]=this.nextPiece.tetrominos[i - this.nextPiece.y][j];
					}else{
						nextPiece4x4[i+1][j+1]=this.nextPiece.tetrominos[i - this.nextPiece.y][j];
					}
				}
			}
		}
		return nextPiece4x4;
	}

	down(){
		this.currentPiece.y += 1;
		this.play(); // evite les bug, si down puis touche puis play, bug au niveau des arrays
	}

	downFall(){
		this.downFallPiece = this.nextPiece;
		if(this.downInterval == null){
			this.downInterval = setInterval(this.downFallInterval, 10);
		}

	}

	downFallInterval(){
		if(this.downFallPiece == this.currentPiece){
			clearInterval(this.downInterval)
			this.downInterval = null;
		}else{
			this.down();
		}

	}

	checkLine(){
		for (let i = 0; i < Model.VERTICAL_SIZE; i++) {
			let count = 0;
			for (let j = 0; j < Model.HORIZONTAL_SIZE; j++) {
				if(this.tab[i][j]!=0){
					count ++;
				}
			}
			if(count==Model.HORIZONTAL_SIZE){
				this.delLine(i)
			}
		}
	}

	delLine(i){
		//a verifier validation line en haut
		this.blinkLine(i);
		for (let j = 0; j < Model.HORIZONTAL_SIZE; j++) {
			this.tab[i][j]=0;
		}
		while(i>0){
			for (let j = 0; j < Model.HORIZONTAL_SIZE; j++) {
				this.tab[i][j]=this.tab[i-1][j]
			}
			i--;
		}
		this.score += 100;
		this.updateScore(this.score);
	}
}

class Piece{

	static tabPieces = [
						[[0,0,0,0],[1,1,1,1],[0,0,0,0],[0,0,0,0]],
						[[2,2],[2,2]],
						[[0,0,0],[3,3,3],[0,3,0]],
						[[0,0,0],[4,4,4],[4,0,0]],
						[[0,0,0],[5,5,5],[0,0,5]],
						[[0,0,0],[6,6,0],[0,6,6]],
						[[0,0,0],[0,7,7],[7,7,0]]
						]

	constructor(){
		let number = Math.floor(Math.random() * 7);
		
		let N = Piece.tabPieces[number].length;
		this.tetrominos = new Array(N);

		for(let i = 0 ; i<N; i++){
			this.tetrominos[i] = new Array(N);
		}
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				this.tetrominos[i][j] = Piece.tabPieces[number][i][j];
			}
		}

		if(N == 2){
			this.y = 0;
		}else{	
			this.y = -1;
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
		return;
	}
}

class View {
	constructor(canvas,canvas2) {
		this.canvas = canvas;
		this.canvas2 = canvas2;
	}
	
	displayTetris (Tetris_value,next_piece) {
		this.canvas.initCanvasGrid();
		this.canvas.drawGrid(Tetris_value);
		this.canvas2.initCanvasGrid();
		this.canvas2.drawGrid(next_piece);
	}

	blinkLine(Line_value){
		this.canvas.valideLine(Line_value);
	}

	updateScore(score){
		document.getElementById('score').innerHTML = score;
	}

}

class Canvas {

	static SIZE_CASE = 30;
	static PALETTE = ['#0ad6ff','#1DCD23', "#bc13fe", "#cfff04", "#fe019a", "#ff073a",'#2243FF'];
	static BLOCK_SPACE = 1;

	constructor(id,height,width) {
		this.height = height;
		this.width = width;
		this.pixel_height = height * Canvas.SIZE_CASE;
		this.pixel_width =  width * Canvas.SIZE_CASE;
		this.ctx = document.getElementById(id).getContext('2d');
	}

	initCanvasGrid(){
		//this.ctx.fillStyle = getRandomColor();
		this.ctx.fillStyle = "#121212";
		this.ctx.fillRect(0, 0, Canvas.SIZE_CASE * this.width, Canvas.SIZE_CASE * this.height);
		this.ctx.strokeStyle='white';
		this.ctx.lineWidth=0.2;
		
		this.ctx.beginPath(); // Start
		for (let col=0; col <= this.width; col++) {
			this.ctx.moveTo(col*Canvas.SIZE_CASE,0);
			this.ctx.lineTo(col*Canvas.SIZE_CASE, this.pixel_height); // Draw a line 
		}
		for (let line=0; line <= this.height; line++) {
			this.ctx.moveTo(0, line*Canvas.SIZE_CASE);
			this.ctx.lineTo(this.pixel_width, line*Canvas.SIZE_CASE); // Draw a line 
		}
		this.ctx.stroke(); // End	
	}

	drawGrid(grid){
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				if(grid[i][j]!=0){
					this.ctx.fillStyle = Canvas.PALETTE[grid[i][j]-1];//-1 car les pieces commencent à 1 sur le tableau de pieces
					this.ctx.fillRect(j*Canvas.SIZE_CASE + Canvas.BLOCK_SPACE, i*Canvas.SIZE_CASE + Canvas.BLOCK_SPACE, Canvas.SIZE_CASE - 2 * Canvas.BLOCK_SPACE, Canvas.SIZE_CASE - 2 * Canvas.BLOCK_SPACE);
				}
			}
		}
	}

	async valideLine(line){
		for (let i = 0; i <4; i++) {
			for (let j = 0; j < this.width; j++) {
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
	constructor(model, view, bot) {
		this.model = model;
		this.view = view;
		this.bot = bot; 

		this.bindDisplayTetris = this.bindDisplayTetris.bind(this);
		this.model.bindDisplayTetris(this.bindDisplayTetris);

		this.bindBotAction = this.bindBotAction.bind(this);
		this.bot.bindBotAction(this.bindBotAction);

		this.bindBlinkLine = this.bindBlinkLine.bind(this);
		this.model.bindBlinkLine(this.bindBlinkLine);

		this.bindUpdateScore = this.bindUpdateScore.bind(this);
		this.model.bindUpdateScore(this.bindUpdateScore);

		this.bindEndGame = this.bindEndGame.bind(this);
		this.model.bindEndGame(this.bindEndGame);



		this.intervalPlay = setInterval(this.model.play, 100);
		this.clock = this.clock.bind(this);
		this.playBot = this.playBot.bind(this);
		this.intervalDown = setInterval(this.clock, 1000);
		this.game = true;
		this.botActivate = false;
	}
	 
	bindDisplayTetris (Tetris_value,next_piece) {
		this.view.displayTetris(Tetris_value,next_piece);
	}

	bindBotAction (action) {
		this.model.actionKeyBoard(action);
	}

	bindBlinkLine (Line_value) {
		this.view.blinkLine(Line_value);
	}

	bindUpdateScore (score) {
		this.view.updateScore(score);
	}

	bindEndGame(){
		this.game = false;
		console.log("End Game");
		clearInterval(this.intervalPlay);
		clearInterval(this.intervalDown);
	}

	buttonAI(){
		this.botActivate = !this.botActivate;
		if(this.botActivate){
			this.intervalBot = setInterval(this.playBot, 100); //ici à mettre 20
		}else{
			clearInterval(this.intervalBot);
			this.intervalBot = null;
		}
	}

	playBot(){
		if(this.game){
			this.bot.play(this.model.tab,this.model.currentPiece);
		}
	}

	keyboardEvent(keyName){
		if(this.game && !this.botActivate){
			this.model.actionKeyBoard(keyName);
		}
	}

	clock(){
		let score = this.model.score * 0.5;
		let speed = 1000 - score;
		if(speed<101){
			speed=101;
		}
		clearInterval(this.intervalDown);
		if(this.game){
			this.model.down();
			this.intervalDown = setInterval(this.clock, speed);
		}		
	}
}

class Bot {
	constructor() {
		this.play.bind(this);
		this.score = 0;
		this.coefW = -1; 	//Min
		this.coefX = 1; 	//Max
		this.coefY = -1;	//Min
		this.coefZ = -1;	//Min
		this.height = 24;
		this.width = 10;
	}

	bindBotAction (callback) {
		this.botAction = callback;
	}

	play(tab,currentPiece){
		checkAllPosibility(tab,currentPiece);
		let number = Math.floor(Math.random() * 5);
		let arraysMove = ["ArrowDown","ArrowUp","ArrowLeft","ArrowRight"," "];
		this.botAction(arraysMove[number]);
	}

	checkAllPosibility(tab,currentPiece){
		//

		//mergegrid = grid

		//calcScore(grid)
	}

	calcScore(grid){
		let H = 24;	//Hauteur max
		let N = 0;	//Nombre de ligne faite
		let T = 0;	//Trou
		for (let i = 0; i < this.height; i++) {
			let count = 1;
			for(let j = 0; j < this.width; j++){
				if(grid[i][j]!=0 && H>i){
					H = i;
				}
				if(i!=0 && grid[i][j]==0 && grid[i-1][j]!=0){
					T++;
				}
				if(grid[i][j]!=0){
					count++;
				}
			}
			if(count == this.width){
				N++;
			}
		}
		H = 24 - H;

		let V = 0;	//Hauteur variation
		let temp1 = 0;
		let temp2 = 0;
		for (let i = 0; i < this.width; i++) {
			for(let j = 0; j < this.height; j++){
				if(grid[i][j]!=0){
					temp1 = j;
					break;
				}
			}
			if(i>0){
				let calc = temp2 - temp1;
				if(calc < 0){
					calc *= -1;
				}
				V += calc;
			}
			temp2 = temp1;


		}
	}
}

const app = new Controller(new Model(), new View(new Canvas('dessin',24,10),new Canvas('dessin2',4,4)), new Bot());

document.addEventListener('keyup', (event) => {
	const nomTouche = event.key;
	app.keyboardEvent(nomTouche);	
}, false);

let btn = document.getElementById('AI_button');
btn.addEventListener('click', (event) => {
	app.buttonAI();
	btn.blur();
});

function getRandomColor() {
	let letters = '0123456789ABCDEF';
	let color = '#';
	for (let i = 0; i < 6; i++) {
		color += letters[Math.floor(Math.random() * 16)];
	}
	return color;
}
function sleep(ms) {
	return new Promise(resolve => setTimeout(resolve, ms));
}