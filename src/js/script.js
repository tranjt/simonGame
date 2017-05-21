

// player
// 	score
// 	pressedButtons 


// gameboard
// 	buttons
// 	render()
// 	playsound()

/*gameOption
	count()
	start()
	strict()
	on/off*/

// simongame
// 	player
// 	gameboard
// 	gameOption
// 	getNextS
// reset



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

const lightButtons = document.querySelectorAll("div.lightButton");
const audioFiles = document.querySelectorAll("audio.audioFile");
const gameCounter = document.querySelector("h1.gameCounter");
const startButton = document.querySelector("button#startButton");
const strictButton = document.querySelector("button#strictButton");
const strictLight = document.querySelector("button#strictLight");
const onOffButton = document.querySelector("button#onOffButton");

onOffButton.addEventListener('click', gameOnOff); //change this shit
startButton.addEventListener('click', gameStart); //change this shit

lightButtons.forEach(function(button) {
	button.addEventListener('click', makeMove); //change this
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

}

function gameStart() {

// emit() game started call restart???
//turn count on

}

function makeMove(){
	//emit playerclicked
}



const player = function () {
	this.score;
	this.pressedButtons = [];
	
}
//remove default shit
const gameBoard = function (buttons = lightButtons, sounds = audioFiles) { //add sounds as arguemnt or make it ?
	this.buttons = buttons;
	this.sounds = sounds;	
}

gameBoard.prototype.importSound = function(audioArr) { //not needed delte
	this.sounds = audioArr;
}

gameBoard.prototype.buttonBlink = function(index, cssClass) {	
	this.buttons[index].classList.add(cssClass);
	setTimeout (() => {
		this.buttons[index].classList.remove(cssClass);
	}, 700);
}

gameBoard.prototype.playsound = function(index) {
	this.sounds[index].play();	
}

gameBoard.prototype.clickable = function() {
	
}



const gameOption = function() {
	this.onoffState = false;
	this.gameCounterOff = "--";
	this.gameCounter = 0;
}

gameOption.prototype.setOnOff = function() {
	
}

gameOption.prototype.start = function() {
	
}

gameOption.prototype.setStrict = function() { //function or just value
	
}

const simonGame = function (player, gameBoard, gameOption) {
	this.player = player;
	this.gameBoard = gameBoard;
	this.gameOption = gameOption;
	this.playedList = [];
	this.playerTurn = false;
}


simonGame.prototype.init = function() { //hook up listener
	//this.gameBoard.importSound(["src/sound/simonSound1.mp3", src/sound/simonSound1.mp3])
	
}

simonGame.prototype.start = function() { //remove this just restart is fine?
	
}

simonGame.prototype.reStart = function() { //reset stuff  //call getnextmove
	
}

simonGame.prototype.playerClicked = function() { 
	
}
simonGame.prototype.validateMove = function() { 
	
}

simonGame.prototype.playSequence = function(stepList = this.playedList) { //remove default maybe

	for (let i = 0; i < stepList.length; i++) {
		setTimeout (() => {
			this.gameBoard.buttonBlink(stepList[i], "light");
			this.gameBoard.playsound(stepList[i]);		
		}, 800*i);
	}
}

const testplayer = new player();
const testgameBoard = new gameBoard();
const testgameOption = new gameOption();
const testgame = new simonGame(testplayer, testgameBoard, testgameOption); //for now remove maybe do without new


simonGame.prototype.doNextMove = function() { 
	console.log(this.playerTurn);
		//need to check player turn?
	this.playedlist.push(Math.floor(Math.random()*4));
	this.playSequence(this.playedlist);  //maybe not the board doing this
	 setTimeout (()=> {		
	 	this.playerTurn = true; //check if "this" is corretct
	 	console.log(this.playerTurn);
	 }, 800*this.playedlist.length);
		
}




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
