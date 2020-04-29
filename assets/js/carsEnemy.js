const carEnemies = {
  _cars: [],
  _timeInsert: 0,
  _velocity: 15,
  insert: function(){
    this._cars.push({
      x: (Math.floor(Math.random() * (590 - 50)) + 50),
      y: 0,
      width: 66,
      height: 51,
      color: 'red'
    });
    
    this._timeInsert = 10;
  },

  update: function(x = 0) {
    if(this._timeInsert == 0){
      this.insert();
    }else
      this._timeInsert--;
      
      for(let i = 0, tam = this._cars.length; i < tam; i++) {
        var cars = this._cars[i];
        if (
          verifyColision(
            { x: cars.x, y: cars.y, width: cars.width, height: cars.height },
            { x: playerCarSelected.x, y: playerCarSelected.y, width: playerCarSelected.width, height: playerCarSelected.height }
          )
        ) {
          actualGameState = gameState.lose;
          return false;
        } else if (cars.y >= playerCarSelected.y + playerCarSelected.height) {
          this._cars.splice(i, 1);
          score++;
          tam--;
          i--;
        }

        cars.y += this._velocity;
      }
  },

  draw: function() {
    for (let j = 0, tam = this._cars.length; j < tam; j++) {
      var car = this._cars[j];
      drawCar(car);
    }

    this.update();
  },

  clean: function() {
    this._cars = [];
  }
}