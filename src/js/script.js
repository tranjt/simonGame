const lightButtons = document.querySelectorAll("div.lightButton");
const audioFiles = document.querySelectorAll("audio.audioFile");
const startButton = document.querySelector("button#startButton");
const strictButton = document.querySelector("button#strictButton");
const strictLight = document.querySelector("button#strictLight");
const onOffButton = document.querySelector("button#onOffButton");
const gameCounter = document.querySelector("h1#gameCounter");

onOffButton.addEventListener('click', gameOnOff); 
startButton.addEventListener('click', gameStart); 
lightButtons.forEach(function(button) {
	button.addEventListener('click', makeMove); 
});

//pubsub
const events = {
  events: {},
  on: function (eventName, fn) {
    this.events[eventName] = this.events[eventName] || [];
    this.events[eventName].push(fn);
  },
  off: function(eventName, fn) {
    if (this.events[eventName]) {
      for (let i = 0; i < this.events[eventName].length; i++) {
        if (this.events[eventName][i] === fn) {
          this.events[eventName].splice(i, 1);
          break;
        }
      };
    }
  },
  emit: function (eventName, data) {
    if (this.events[eventName]) {
      this.events[eventName].forEach(function(fn) {
        fn(data);
      });
    }
  }
};

function gameOnOff() {
//hook up if game is listening to player click or not
	events.emit("TurnOnOff", event.target.className.split(" ")[1]);

}

function gameStart() {
	events.emit("StartGame", event.target.className.split(" ")[1]);
// emit() game started call restart???
//turn count on

}

function makeMove(event){
	events.emit("PlayerHasMoved", event.target.className.split(" ")[1]);	
	//emit playerclicked
}

/*
	Game Board
*/
//remove default mabye?
const GameBoard = function (buttons = lightButtons, sounds = audioFiles) { //add sounds as arguemnt or make it ?
	this.buttons = buttons;
	this.sounds = sounds;	
}

GameBoard.prototype.importSound = function(audioArr) { //not needed delte
	this.sounds = audioArr;
}

GameBoard.prototype.buttonBlink = function(index, cssClass) {	
	this.buttons[index].classList.add(cssClass);
	setTimeout(() => {
		this.buttons[index].classList.remove(cssClass);
	}, 550);
}

GameBoard.prototype.playsound = function(index) {
	console.log("inside playsound " + index);
	this.sounds[index].play();	
}

/*
	Game Option
*/
const GameOption = function() {
	this.strict = false;
	this.onoffState = false;	
	this.gameCounter = 0;
}

GameOption.prototype.setOnOff = function() {
	this.gameOption.onoffState = this.gameOption.onoffState ? false : true;
	if (this.gameOption.onoffState === false) {
		this.gameOption.gameCounter = "";		
	} 
	else this.gameOption.gameCounter = 0;

	this.gameOption.updateGameCounter(gameCounter);	
}

GameOption.prototype.updateGameCounter = function(htmlgameCounter) {
	htmlgameCounter.innerHTML = this.gameCounter;
}

GameOption.prototype.displayeError = function(htmlgameCounter) {	
	htmlgameCounter.innerHTML = "!!!";
	setTimeout(() => {
		htmlgameCounter.innerHTML = this.gameCounter;
	}, 550);
}

GameOption.prototype.setStrict = function() { //function or just value
	
}

/*
	Simon Game
*/
const SimonGame = function (gameBoard, gameOption) {	
	this.gameBoard = gameBoard;
	this.gameOption = gameOption;
	this.playedList = [];
	this.currentSelect = 0;
	this.playerTurn = false;
}


SimonGame.prototype.init = function() { //hook up listener	
	events.on("PlayerHasMoved", this.playerClicked.bind(this)); 	
	events.on("StartGame", this.reStart.bind(this)); 
	events.on("TurnOnOff", this.gameOption.setOnOff.bind(this));	
}

SimonGame.prototype.reStart = function() { //reset stuff  //call getnextmove
	if (this.gameOption.onoffState) {
		this.playedList = [];
		this.currentSelect = 0;
		this.playerTurn = false;
		this.gameOption.gameCounter = 0;
		this.gameOption.updateGameCounter(gameCounter);	
		this.doNextMove();
	}
}

//if is full doNextMove
//else playsequise again handlePlayerClick
SimonGame.prototype.playerClicked = function(index) {
	 if (this.playerTurn && this.gameOption.onoffState) {
	 	this.playerTurn = false;		
	 	let isValidMove = this.validateMove(index);
	 	if (isValidMove) {
	 		this.gameBoard.buttonBlink(index, "light");
			this.gameBoard.playsound(index);
	 	}
	 	else {
			this.gameOption.displayeError(gameCounter);
	 		this.gameBoard.buttonBlink(index, "dark");	 
			this.gameBoard.playsound(index);
	 	}

		setTimeout(() => {				
			if (isValidMove) {
				this.currentSelect++;	 				
				if (this.currentSelect === this.playedList.length ) {					
					this.currentSelect = 0;					
					this.doNextMove();
					return;
				}
				this.playerTurn = true;				
			}
			else {				
				this.currentSelect = 0;//not needed already done in validate or remove the one in validate 
				this.playSequence(this.playedList);
			}			 
		}, 700);
	}	
}

//if player select is true and it's not the last in playerList do ++
SimonGame.prototype.validateMove = function(index) { 	
	if (this.playedList[this.currentSelect] === parseInt(index) ) {				
		console.log("validate true");
		return true;
	}
	//this.currentSelect = 0; //remove this instead clearer
	console.log("validate false");
	return false;
}

/////// the lock out here instead 
SimonGame.prototype.playSequence = function(stepList) { //remove default maybe
	console.log("inside playSequence stepList.length " + stepList.length);
	console.log(this.playedList);
	this.playerTurn = false;
	for (let i = 0; i < stepList.length; i++) {
		setTimeout(() => {			
			this.gameBoard.buttonBlink(stepList[i], "light");
			this.gameBoard.playsound(stepList[i]);
			if (i === (stepList.length-1)) this.playerTurn = true;
		}, 700 + 700*i);
	}
}

SimonGame.prototype.doNextMove = function() { 	
	this.playedList.push(Math.floor(Math.random()*4));
	this.gameOption.gameCounter++;
	
	setTimeout(() => {
		this.playSequence(this.playedList);		
		this.gameOption.updateGameCounter(gameCounter);
	}, 1000);			
}


const testgameBoard = new GameBoard();
const testgameOption = new GameOption();
const testgame = new SimonGame(testgameBoard, testgameOption); 
testgame.init();






//make player 
//maker board
//option

// to start game switch start
////hook up listener for buttons
//game init set player turn etc
// bot do nextmove, 
////random generate next buttonplay, 
////add to playedlist, 
////then play it, 
////swith to player


//listen to player click validateMove 
////if all ok, update score switch to bot move again, 
////if wrong lock buttons player upt the playedlist again. then set player to aktive again.
/////if wrong in strict mode game over?

//if turn off reset turn off everything
