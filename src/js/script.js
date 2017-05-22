

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

function makeMove(event){
	events.emit("PlayerHasMoved", event.target.className.split(" ")[1]);
	
	//emit playerclicked
}



const player = function () {
	this.score;
	this.pressedButtons = [];
	
}
//remove default mabye?
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
	}, 550);
}

gameBoard.prototype.playsound = function(index) {
	console.log("inside playsound " + index);
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
	this.currentSelect = 0;
	this.playerTurn = false;
}


simonGame.prototype.init = function() { //hook up listener	
	events.on("PlayerHasMoved", this.playerClicked.bind(this)); 	
}

simonGame.prototype.start = function() { //remove this just restart is fine?
	
}

simonGame.prototype.reStart = function() { //reset stuff  //call getnextmove
	this.playedList = [];
	this.currentSelect = 0;
	this.playerTurn = false;
	this.doNextMove();
}

//if is full doNextMove
//else playsequise again
simonGame.prototype.playerClicked = function(index) {
	 if (this.playerTurn) {
	 	this.playerTurn = false; //
		this.gameBoard.buttonBlink(index, "light");
		this.gameBoard.playsound(index);
		
		setTimeout (() =>{
			if (this.validateMove(index)){				
				if (this.currentSelect === this.playedList.length ) {					
					this.currentSelect = 0;					
					this.doNextMove();
					return;
				}				
			}
			else {				 		
				 setTimeout (()=> {	
				 	this.playSequence(this.playedList);
				 	this.currentSelect = 0;	
			 		this.playerTurn = true; 				 	
				 }, 1000);
			}
			this.playerTurn = true;//figure out better way to lock this 
		}, 700);////
	}
	
}

//if player select is true and it's not the last in playerList do ++
simonGame.prototype.validateMove = function(index) { 	
	if (this.playedList[this.currentSelect] === parseInt(index) ) {		
		this.currentSelect++;
		console.log("validate true");
		return true;
	}
	this.currentSelect = 0;
	console.log("validate false");
	return false;
}

simonGame.prototype.playSequence = function(stepList) { //remove default maybe
	console.log("inside playSequence stepList.length " + stepList.length);
	console.log(this.playedList);
	for (let i = 0; i < stepList.length; i++) {
		setTimeout (() => {			
			this.gameBoard.buttonBlink(stepList[i], "light");
			this.gameBoard.playsound(stepList[i]);		
		}, 700+ 700*i);
	}
}


simonGame.prototype.doNextMove = function() { 	
	this.playerTurn = false;
	this.playedList.push(Math.floor(Math.random()*4));
	setTimeout( () => {
		this.playSequence(this.playedList);
		//console.log(this.playedList); 
	}, 1800);	
	//this.playSequence(this.playedList);  
	 setTimeout (()=> {		
	 	this.playerTurn = true; 	 	
	 }, 1500 + 700 * this.playedList.length);
		
}


const testplayer = new player();
const testgameBoard = new gameBoard();
const testgameOption = new gameOption();
const testgame = new simonGame(testplayer, testgameBoard, testgameOption); //for now remove maybe do without new
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
