const dashed = {
  _dashes: [],
  _timeInsert: 0,
  _velocity: 15,

  insert: function(){
    this._dashes.push({
      x: canvasGame.width / 3,
      y: 0,
      width: 5,
      height: 50,
      cor: '#fff'
    }, {
      x: (canvasGame.width / 3) * 2,
      y: 0,
      width: 5,
      height: 50,
      cor: '#fff'
    });

    this._timeInsert = 10;
  },

  update: function() {
    if(this._timeInsert == 0){
      this.insert();
    }else
      this._timeInsert--;
      
      for(let i = 0, tam = this._dashes.length; i < tam; i++) {
        var dashes = this._dashes[i];

        if (dashes.y <= -dashes.height) {
          this._dashes.splice(i, 1)
          tam--;
          i--;
        }
        
        dashes.y += this._velocity;
      }
  },
  
  draw: function() {
    this._dashes.forEach(dash => {
      canvasGameCtx.fillStyle = dash.cor;
      canvasGameCtx.fillRect(dash.x, dash.y, dash.width, dash.height);
    });

    this.update();
  },

  clean: function() {
    this._dashes = [];
  }
}