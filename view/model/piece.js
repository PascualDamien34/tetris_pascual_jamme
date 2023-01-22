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