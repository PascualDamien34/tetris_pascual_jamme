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
		this.isOnPiece = this.isOnPiece.bind(this);

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
				//derniere modif
				let clonePiece = clone(this.currentPiece);
				clonePiece.rotation();
				if(this.currentPiece.y>=0 && !this.isOnPiece(clonePiece,this.tab)){
					this.currentPiece.rotation();
				}
			break;
			case "ArrowLeft":
				if(this.isPossibleMouveLeft() && !this.isOverLapLeft(this.currentPiece)){
					this.currentPiece.x -= 1;
				}
			break;
			case "ArrowRight":
				if(this.isPossibleMouveRight()  && !this.isOverLapRight(this.currentPiece)){
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
		if(this.isOverLapLeft(this.currentPiece)){
			this.replaceLeft()
		}
		if(this.isOverLapRight(this.currentPiece)){
			this.replaceRight()
		}

		if(this.isOverLapBot(this.currentPiece)){
			this.replaceBot();
			this.changePiece();
		}
		if(this.isOnPiece(this.currentPiece,this.tab)){
			this.currentPiece.y -= 1;
			this.changePiece();
		}
		this.displayTetris(this.mergeGrid(this.currentPiece,this.tab),this.getNextPiece4x4());
		this.checkLine();
	}

	isOverLapLeft(piece){
		let N = piece.getSizeOfMatrice();
		if(piece.x<0){
			for (let i = 0; i < piece.x * (-1); i++) {
				for(let j = 0; j<N; j++){
					if(piece.tetrominos[j][i]!=0){
						return true;
					}
				}
			}
		}
		return false;
	}
	replaceLeft(){
		while(this.isOverLapLeft(this.currentPiece)){
			this.currentPiece.x += 1;
		}
	}

	isOverLapRight(piece){
		let N = piece.getSizeOfMatrice();
		if(piece.x + N > Model.HORIZONTAL_SIZE){
			for (let i = N-1; i > Model.HORIZONTAL_SIZE - piece.x-1; i--) {
				for(let j = 0; j<N; j++){
					if(piece.tetrominos[j][i]!=0){
						return true;
					}
				}
			}
		}
		return false;
	}
	replaceRight(){
		while(this.isOverLapRight(this.currentPiece)){
			this.currentPiece.x -= 1;
		}
	}

	isOverLapBot(piece){
		let N = piece.getSizeOfMatrice();
		if(piece.y + N > Model.VERTICAL_SIZE){
			for (let i = Model.VERTICAL_SIZE - piece.y; i < N; i++) {
				for(let j = 0; j<N; j++){
					if(piece.tetrominos[i][j]!=0){
						return true;
					}
				}
			}
		}
	}
	replaceBot(){
		while(this.isOverLapBot(this.currentPiece)){
			this.currentPiece.y -= 1;
		}
	}

	changePiece(){
		let N = this.currentPiece.getSizeOfMatrice();
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				if(this.currentPiece.tetrominos[i][j]!=0){
					if(this.currentPiece.y==-1 && i == 0){
						this.endGame();
					}else{
						this.tab[this.currentPiece.y+i][this.currentPiece.x+j] = this.currentPiece.tetrominos[i][j];
					}
				}
			}
		}
		this.currentPiece = this.nextPiece;
		this.nextPiece = new Piece();
		if(this.isOnPiece(this.currentPiece,this.tab)){
			this.endGame();
		}
		this.score += 10;
		this.updateScore(this.score);
	}
	isOnPiece(piece,tab){
		let N = piece.getSizeOfMatrice();
		for (let i = 0; i < N; i++) {
			for (let j = 0; j < N; j++) {
				if(piece.tetrominos[i][j]!=0 && tab[piece.y+i][piece.x+j]!=0){
					return true;
				}
			}
		}
		return false;
	}
	mergeGrid(piece,tab){
		let tabCopy = new Array(Model.VERTICAL_SIZE);
		for(let i = 0 ; i<Model.VERTICAL_SIZE; i++){
			tabCopy[i] = new Array(Model.HORIZONTAL_SIZE);
			tabCopy[i].fill(0);
		}
		for (let i = 0; i < tab.length; i++) {
			for (let j = 0; j < tab[0].length; j++) {
				tabCopy[i][j] = tab[i][j];
			}
		}
		let N = piece.getSizeOfMatrice();
		for (let i = piece.y; i < N + piece.y; i++) {
			if(i >= Model.VERTICAL_SIZE){
				break;
			}
			for (let j = piece.x; j < N + piece.x; j++) {
				if(j<0){
					continue;
				}
				if(j>= Model.HORIZONTAL_SIZE){
					break;
				}
				if(piece.tetrominos[i - piece.y][j - piece.x]!=0 && i!=-1){
					tabCopy[i][j]=piece.tetrominos[i - piece.y][j - piece.x];
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
		this.getSizeOfMatrice = this.getSizeOfMatrice.bind(this);
		let number = Math.floor(Math.random() * 7);
		this.id = Math.floor(Math.random() * 100000);
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
		if (N == 0) {
			return;
		}
		for (let i = 0; i < N; i++){
			for (let j = 0; j < i; j++) {
				let temp = this.tetrominos[i][j];
				this.tetrominos[i][j] = this.tetrominos[j][i];
				this.tetrominos[j][i] = temp;
			}
		}
		for (let i = 0; i < N; i++){
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

	printMatrix(){
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
	constructor(canvas,canvas2,preview) {
		this.canvas = canvas;
		this.canvas2 = canvas2;
		this.preview = preview;
	}
	
	displayTetris (Tetris_value,next_piece) {
		this.canvas.initCanvasGrid();
		this.canvas.drawGrid(Tetris_value);
		if(this.preview){
			this.canvas2.initCanvasGrid();
			this.canvas2.drawGrid(next_piece);
		}
	}

	blinkLine(Line_value){
		this.canvas.valideLine(Line_value);
	}

	updateScore(score){
		document.getElementById('score').innerHTML = score;
	}
}

class Canvas {

	static PALETTE = ['#0ad6ff','#1DCD23', "#bc13fe", "#cfff04", "#fe019a", "#ff073a",'#2243FF'];
	static BLOCK_SPACE = 1;

	constructor(id,height,width,size) {
		this.height = height;
		this.width = width;
		this.size = size;
		this.pixel_height = height * this.size;
		this.pixel_width =  width * this.size;
		this.ctx = document.getElementById(id).getContext('2d');
	}

	initCanvasGrid(){
		this.ctx.fillStyle = "#121212";
		this.ctx.fillRect(0, 0, this.size * this.width, this.size * this.height);
		this.ctx.strokeStyle='white';
		this.ctx.lineWidth=0.2;
		
		this.ctx.beginPath();
		for (let col=0; col <= this.width; col++) {
			this.ctx.moveTo(col*this.size,0);
			this.ctx.lineTo(col*this.size, this.pixel_height); // Draw a line 
		}
		for (let line=0; line <= this.height; line++) {
			this.ctx.moveTo(0, line*this.size);
			this.ctx.lineTo(this.pixel_width, line*this.size); // Draw a line 
		}
		this.ctx.stroke();
	}

	drawGrid(grid){
		for (let i = 0; i < this.height; i++) {
			for (let j = 0; j < this.width; j++) {
				if(grid[i][j]!=0){
					this.ctx.fillStyle = Canvas.PALETTE[grid[i][j]-1];//-1 car les pieces commencent à 1 sur le tableau de pieces
					this.ctx.fillRect(j*this.size + Canvas.BLOCK_SPACE, i*this.size + Canvas.BLOCK_SPACE, this.size - 2 * Canvas.BLOCK_SPACE, this.size - 2 * Canvas.BLOCK_SPACE);
				}
			}
		}
	}

	async valideLine(line){
		for (let i = 0; i <4; i++) {
			for (let j = 0; j < this.width; j++) {
				if (i % 2 == 0){
					this.ctx.fillStyle = "white";
					this.ctx.fillRect(j*this.size+Canvas.BLOCK_SPACE, line*this.size+Canvas.BLOCK_SPACE, this.size-2*Canvas.BLOCK_SPACE, this.size-2*Canvas.BLOCK_SPACE);
				}else{
					this.ctx.fillStyle = "#121212";
					this.ctx.fillRect(j*this.size+Canvas.BLOCK_SPACE, line*this.size+Canvas.BLOCK_SPACE, this.size-2*Canvas.BLOCK_SPACE, this.size-2*Canvas.BLOCK_SPACE);
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
		this.bindIsOverLapLeft = this.bindIsOverLapLeft.bind(this);
		this.bot.bindIsOverLapLeft(this.bindIsOverLapLeft);
		this.bindIsOverLapRight = this.bindIsOverLapRight.bind(this);
		this.bot.bindIsOverLapRight(this.bindIsOverLapRight);
		this.bindIsOverLapBot = this.bindIsOverLapBot.bind(this);
		this.bot.bindIsOverLapBot(this.bindIsOverLapBot);
		this.bindIsOnPiece = this.bindIsOnPiece.bind(this);
		this.bot.bindIsOnPiece(this.bindIsOnPiece);
		this.bindMergeGrid = this.bindMergeGrid.bind(this);
		this.bot.bindMergeGrid(this.bindMergeGrid);
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
	bindIsOverLapLeft (piece) {
		return this.model.isOverLapLeft(piece);
	}
	bindIsOverLapRight (piece) {
		return this.model.isOverLapRight(piece);
	}
	bindIsOverLapBot (clonePiece) {
		return this.model.isOverLapBot(clonePiece);
	}
	bindIsOnPiece (piece,tab) {
		return this.model.isOnPiece(piece,tab);
	}
	bindMergeGrid (piece,tab) {
		return this.model.mergeGrid(piece,tab);
	}
	bindBlinkLine (Line_value) {
		this.view.blinkLine(Line_value);
	}
	bindUpdateScore (score) {
		this.view.updateScore(score);
	}

	bindEndGame(){
		this.game = false;
		clearInterval(this.intervalBot);
		clearInterval(this.intervalPlay);
		clearInterval(this.intervalDown);
		clearInterval(this.model.downInterval);

		if(train){
			var l = [];
			l.push(this.model.score);
			l.push(this.bot.coefW);
			l.push(this.bot.coefX);
			l.push(this.bot.coefY);
			l.push(this.bot.coefZ);
			l.push(this)
			let score = 0;
			for (let i = 1; i <= 250; i++) {
				if(this == tab[i-1]){
					l.push(i-1)
				}
				if(tab[i-1].model.score>score){
					score = tab[i-1].model.score
				}
			}
			resultat.push(l)
			console.log(score)
			console.log("coefW",this.bot.coefW,"coefX",this.bot.coefX,"coefY",this.bot.coefY,"coefZ",this.bot.coefZ)
			document.getElementById('score2').innerHTML = score;
		}
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

		this.coefW = -0.23967712739020697;  	//-0.27788784480168816;	 	//Min Hauteur max
		this.coefX = 0.016713747415713076;  	//0.03828500208421597;	 	//Max Nombre de ligne faite
		this.coefY = -0.7919406833255183;  	//-0.7737833332059656;			//Min Trou
		this.coefZ = -0.10286078820120625;  	//-0.11003878903690407;			//Min Hauteur variation

		this.height = 24;
		this.width = 10;
		this.queue = [];
	}

	bindBotAction (callback) {
		this.botAction = callback;
	}
	bindIsOverLapLeft (callback) {
		this.isOverLapLeft = callback;
	}
	bindIsOverLapRight (callback) {
		this.isOverLapRight = callback;
	}
	bindIsOverLapBot (callback) {
		this.isOverLapBot = callback;
	}
	bindIsOnPiece (callback) {
		this.isOnPiece = callback;
	}
	bindMergeGrid (callback) {
		this.mergeGrid = callback;
	}

	play(tab,currentPiece){
		let lst = this.checkAllPosibility(tab,currentPiece);
		let arraysMove = ["ArrowDown","ArrowUp","ArrowLeft","ArrowRight"," "];

		if(this.queue.length==0){
			this.queue.push("ArrowDown");
			for (let i = 0;i<lst[1];i++) {
				this.queue.push("ArrowUp");
			}
			let calcul = currentPiece.x - lst[2];
			if(calcul>0){
				for (let i = 0;i<calcul;i++) {
					this.queue.push("ArrowLeft");
				}
			}else if(calcul<0){
				calcul = calcul * -1;
				for (let i = 0;i<calcul;i++) {
					this.queue.push("ArrowRight");
				}
			}
			this.queue.push(" ");
			let length = this.queue.length;
			for (let i = 0;i<length;i++) {	
				let first = this.queue.shift();
				this.botAction(first);
			}

		}
		
	}

	checkAllPosibility(tab,currentPiece){
		let clonePiece = clone(currentPiece);
		let number = Math.floor(Math.random() * 5);
		let N = clonePiece.getSizeOfMatrice();
		let returnList = [-100000,0,0,0]
		let r,i,j;
		for (r = 0; r < 4; r++) {
			for (i = -N; i < this.width + N; i++) {
				clonePiece.x = i;
				if(!this.isOverLapLeft(clonePiece)&&!this.isOverLapRight(clonePiece)){
					for(j = 0; j < this.height; j++){
						clonePiece.y = j;
						if(this.isOverLapBot(clonePiece) || this.isOnPiece(clonePiece,tab)){
							clonePiece.y -= 1;
							let tabCopy = this.mergeGrid(clonePiece,tab)
							let score = this.calcScore(tabCopy);
							if(score>returnList[0]){
								returnList[0] = score;
								returnList[1] = r;
								returnList[2] = i;
								returnList[3] = j;
								returnList[4] = tabCopy;
							}
							break;
						}
					}
				}
			}
			clonePiece.rotation();
		}
		return returnList;
	}

	calcScore(grid){
		let H = 24;	//Hauteur max
		let N = 0;	//Nombre de ligne faite
		let T = 0;	//Trou
		let V = 0;	//Hauteur variation
		let temp1 = 0;
		let temp2 = 0;

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
		for (let i = 0; i < this.width; i++) {
			for(let j = 0; j < this.height; j++){
				if(grid[j][i]!=0){
					temp1 = j;
					break;
				}
				if(j==this.height-1){
					temp1 = 24;
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
		return this.coefW * H + this.coefX * N + this.coefY * T + this.coefZ * V;
	}
}

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

function clone(originalObject){ //Permet de copier un objet avec les function sans garder l'héredité
    if((typeof originalObject !== 'object') || originalObject === null){ 
        throw new TypeError("originalObject parameter must be an object which is not null"); 
    } 
  
    var deepCopy = JSON.parse(JSON.stringify(originalObject)); 
  
    // Une petite récursivité 
    function deepProto(originalObject, deepCopy){ 
        deepCopy.__proto__ = Object.create(originalObject.constructor.prototype); 
        for(var attribute in originalObject){ 
            if(typeof originalObject[attribute] === 'object' && originalObject[attribute] !== null){ 
                deepProto(originalObject[attribute], deepCopy[attribute]); 
            } 
        } 
    } 
    deepProto(originalObject, deepCopy); 
  
    return deepCopy; 
} 

