/*Cocoon.Ad.AdMob.configure({
	android: {
		banner:"ca-app-pub-3940256099942544/6300978111"
	}
});
var banner = Cocoon.Ad.AdMob.createBanner();
*/
document.getElementsByClassName("game-explanation")[0].style.display = 'none';
function explana() {
     var exp = document.getElementsByClassName("game-explanation");
     var howimg = document.getElementsByClassName("qn")[0];
    if (exp[0].style.display === 'none') {
        exp[0].style.display = 'block';
        howimg.classList.remove('fa-question');
        howimg.classList.add('fa-window-close');
    } else {
        exp[0].style.display = 'none';
        howimg.classList.remove('fa-window-close');
        howimg.classList.add('fa-question');
    }
}

var getaudio = $('#player')[0];
var audiostatus = 'on';
$('.speaker').click(function(){
    if (audiostatus=='on') {
        audiostatus ='off';
        $('.speaker').addClass('speakerplay');
    } else {
        audiostatus = 'on';
        $('.speaker').removeClass('speakerplay');
    }
})
$("#btna").click(function(){
  $("#starts").hide();
  $(".grid-start-container").hide();
  $(".grid-container").show();
  $(".game-container").show();
  $(".game-container-start").hide();
  $(".start-screen").hide();
  $(".restart-button").show();
  $(".timer-container").css('display', 'inline-block');
  $(".best-container").css('display', 'inline-block');
  $(".pause-container").css('display', 'inline-block');
  window.requestAnimationFrame(function () {
    new GameManager(4, 0, KeyboardInputManager, HTMLActuator, LocalStorageManager);
  });
}); 


var screen = document.getElementById('screen');
var Clock = {
  totalSeconds: 0,
  init: function () {
    $("#hour").text('00'+':');
      $("#min").text('00'+':');
      $("#sec").text('00');  
  },
  start: function () {
    var self = this;
    this.interval = setInterval(function () {
      self.totalSeconds += 1;
      $("#hour").text(('0'+Math.floor(self.totalSeconds / 3600)).slice(-2)+':');
      $("#min").text(('0'+Math.floor(self.totalSeconds / 60 % 60)).slice(-2)+':');
      $("#sec").text(('0'+(parseInt(self.totalSeconds % 60))).slice(-2));
    }, 1000);
  },
  pause: function () {
    clearInterval(this.interval);
    delete this.interval;
     },
  stop: function () {
    clearInterval(this.interval);
    delete this.interval;
  },
  resume: function () {
    if (!this.interval) this.start();
  }
};

function GameManager(size, timer, InputManager, Actuator, StorageManager) {
  this.size           = size;
  this.inputManager   = new InputManager;
  this.storageManager = new StorageManager;
  this.actuator       = new Actuator;
  this.timer = 0;
  this.startTiles     = 2;
  this.inputManager.on("move", this.move.bind(this));
  this.inputManager.on("restart", this.restart.bind(this));
  this.setup();
  $('#pauseButton').val('Resume');
  $('#pauseimg').addClass("fa-pause-circle");
  paused = 0;
  screen.style.display = "none";  
  Clock.start();
}

//if (Clock.totalSeconds>60) {banner.show();}

var paused = 0;
if (paused) {
    screen.style.display = "inherit";
} else {
  screen.style.display = "none";  
}

$('#pauseButton').click(function () {
       var $this = $(this);
       if($this.val()=='Pause'){
			$this.val('Resume');
                        $('#pauseimg').addClass("fa-pause-circle");
                        $('#pauseimg').removeClass("fa-play-circle");
                        Clock.resume();
                        paused = 0;
                        screen.style.display = "none";
		} else {
			$this.val('Pause');
                        $('#pauseimg').addClass("fa-play-circle");
                        $('#pauseimg').removeClass("fa-pause-circle");
                        Clock.pause();
                        paused = 1;
                        screen.style.display = "inherit";
		}
});


// Restart the game
GameManager.prototype.restart = function () {
  Clock.stop();
  Clock.totalSeconds = 0;
  this.storageManager.clearGameState();
  this.actuator.continueGame(); // Clear the game won/lost message
  //this.setup();
  $(".game-container-start").show();
  $(".start-screen").show();
  $(".game-container").hide();
  this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;
    this.timer       = 0;
    this.bestScore   = this.storageManager.getBestScore();
  $('#pauseButton').val('Resume');
  paused = 0;
};

// Return true if the game is lost, or has won and the user hasn't kept playing
GameManager.prototype.isGameTerminated = function () {
  if (this.over || (this.won && !this.keepPlaying)) {
    return true;
  } else {
    return false;
  }
};

// Set up the game
GameManager.prototype.setup = function () {
  
  var previousState = this.storageManager.getGameState();
    this.grid        = new Grid(this.size);
    this.score       = 0;
    this.over        = false;
    this.won         = false;
    this.keepPlaying = false;
    this.timer       = 0;
    this.bestScore   = this.storageManager.getBestScore();
    paused = 0;
    // Add the initial tiles
    this.addStartTiles();
  // Update the actuator
  this.actuate();
}

// Set up the initial tiles to start the game with
GameManager.prototype.addStartTiles = function () {
  for (var i = 0; i < this.startTiles; i++) {
    this.addRandomTile();
  }
};

// Adds a tile in a random position
GameManager.prototype.addRandomTile = function () {
  if (this.grid.cellsAvailable()) {
    var value = randomnum(slideIndex);
    var tile = new Tile(this.grid.randomAvailableCell(), value);
    this.grid.insertTile(tile);
  }
};

// Sends the updated grid to the actuator
GameManager.prototype.actuate = function () {
    // Clear the state when the game is over (game over only, not win)
  if (this.over) {
    this.storageManager.clearGameState();
    Clock.stop();
  } else {
    this.storageManager.setGameState(this.serialize());
  }

  this.actuator.actuate(this.grid, {
    score:      this.score,
    over:       this.over,
    won:        this.won,
    bestScore:  this.storageManager.getBestScore(),
    terminated: this.isGameTerminated(),
    timer:      this.timer
    
  });

};

// Represent the current game as an object
GameManager.prototype.serialize = function () {
  return {
    grid:        this.grid.serialize(),
    score:       this.score,
    over:        this.over,
    won:         this.won,
    keepPlaying: this.keepPlaying,
    timer:       this.timer,
    bestScore:   this.bestScore
  };
};

// Save all tile positions and remove merger info
GameManager.prototype.prepareTiles = function () {
  this.grid.eachCell(function (x, y, tile) {
    if (tile) {
      tile.mergedFrom = null;
      tile.savePosition();
    }
  });
};

// Move a tile and its representation
GameManager.prototype.moveTile = function (tile, cell) {
    if (!paused) {
  this.grid.cells[tile.x][tile.y] = null;
  this.grid.cells[cell.x][cell.y] = tile;
  tile.updatePosition(cell);
  if (audiostatus=='on'){
      getaudio.play();
     // $('.speaker').addClass('speakerplay');
  } else {
  //    $('.speaker').removeClass('speakerplay');
  } 
    };
};

// Move tiles on the grid in the specified direction
GameManager.prototype.move = function (direction) {
    if (!paused) {
  // 0: up, 1: right, 2: down, 3: left
  var self = this;
  if (this.isGameTerminated()) return; // Don't do anything if the game's over

  var cell, tile;
  var vector     = this.getVector(direction);
  var traversals = this.buildTraversals(vector);
  var moved      = false;

  // Save the current tile positions and remove merger information
  this.prepareTiles();

  // Traverse the grid in the right direction and move tiles
  traversals.x.forEach(function (x) {
    traversals.y.forEach(function (y) {
      cell = { x: x, y: y };
      tile = self.grid.cellContent(cell);

      if (tile) {
        var positions = self.findFarthestPosition(cell, vector);
        var next      = self.grid.cellContent(positions.next);

        // Only one merger per row traversal?
        if (next && next.value != tile.value && !next.mergedFrom) {
          if ((next.value==2 && tile.value==8)||(next.value==8 && tile.value==2)) {
              var tv=2;
          } else {
              var tv = Math.max(tile.value, next.value);
          }
          var merged = new Tile(positions.next, tv);
          merged.mergedFrom = [tile, next];

          self.grid.insertTile(merged);
          self.grid.removeTile(tile);
          // Converge the two tiles' positions
          tile.updatePosition(positions.next);
        } else {
          self.moveTile(tile, positions.farthest);
        }
//self.moveTile(tile, positions.farthest);
        if (!self.positionsEqual(cell, tile)) {moved = true;}  // The tile moved from its original cell!
      }
    });
  });
  
  this.timer = Clock.totalSeconds;

  if (moved) {
    this.addRandomTile();
    if (!this.movesAvailable()) {
      this.won = false;
      this.keepPlaying = false;
      this.over = true; // Game over!
    }
  
    
//utk change below
    var winner = 1;
       for (var x = 0; x < this.size; x++) {
        for (var y = 2; y < this.size; y++) {
            if (this.grid.cells[x][y] === null || this.grid.cells[x][y].value!==2)
                winner = 0;
        }
    };
     
    if (winner === 1) {
      this.won = true; // Game over!
      Clock.stop();
      if (this.storageManager.getBestScore() > this.timer || this.storageManager.getBestScore() == 0) {
        this.storageManager.setBestScore(this.timer);
      }
    }
    this.actuate();
  }
  };
};

// Get the vector representing the chosen direction
GameManager.prototype.getVector = function (direction) {
  // Vectors representing tile movement
  var map = {
    0: { x: 0,  y: -1 }, // Up
    1: { x: 1,  y: 0 },  // Right
    2: { x: 0,  y: 1 },  // Down
    3: { x: -1, y: 0 }   // Left
  };

  return map[direction];
};

// Build a list of positions to traverse in the right order
GameManager.prototype.buildTraversals = function (vector) {
  var traversals = { x: [], y: [] };

  for (var pos = 0; pos < this.size; pos++) {
    traversals.x.push(pos);
    traversals.y.push(pos);
  }

  // Always traverse from the farthest cell in the chosen direction
  if (vector.x === 1) traversals.x = traversals.x.reverse();
  if (vector.y === 1) traversals.y = traversals.y.reverse();

  return traversals;
};

GameManager.prototype.findFarthestPosition = function (cell, vector) {
  var previous;

  // Progress towards the vector direction until an obstacle is found
  do {
    previous = cell;
    cell     = { x: previous.x + vector.x, y: previous.y + vector.y };
  } while (this.grid.withinBounds(cell) &&
           this.grid.cellAvailable(cell));

  return {
    farthest: previous,
    next: cell // Used to check if a merge is required
  };
};

GameManager.prototype.movesAvailable = function () {
  return this.grid.cellsAvailable() || this.tileMatchesAvailable();
};

GameManager.prototype.tileMatchesAvailable = function () {
  var self = this;
  var tile;

  for (var x = 0; x < this.size; x++) {
    for (var y = 0; y < this.size; y++) {
      tile = this.grid.cellContent({ x: x, y: y });

      if (tile) {
        for (var direction = 0; direction < 4; direction++) {
          var vector = self.getVector(direction);
          var cell   = { x: x + vector.x, y: y + vector.y };

          var other  = self.grid.cellContent(cell);

          if (other && other.value !== tile.value) {
            return true;
          }
        }
      }
    }
  }
 return false;
};

GameManager.prototype.positionsEqual = function (first, second) {
  return first.x === second.x && first.y === second.y;
};
