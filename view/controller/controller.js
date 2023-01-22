
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
			console.log("ArrowRight");
		break;
		default:
			canvas.valideLine(23);
		return; 
	}
  }
}
const mod = new Model();
const app = new Controller(new Model(), new View(new Canvas('dessin')))

document.addEventListener('keyup', (event) => {
	const nomTouche = event.key;
	keyboardEvent(nomTouche);	
}, false);

app.view.canvas.initCanvasGrid();