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

}