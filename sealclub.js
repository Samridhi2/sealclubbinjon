//SEALCLUBBIN' JON - THE GAME
//COPYRIGHT 2014 NICHOLAS BURKA
//WITH HELP FROM PAKDEE, PAUL, THEO AND OTHERS

//TO DO:
//	change setInterval to requestanimationframe
//  make global variables not that anymore



var canvas,
	ctx,
	player,
	entities,
	fps = 45;
const SCALE = 1;

function Player() {
	var img = new Image();
	img.src = "img/jon-bod.png";
	this.body = img;
	var army = new Image();
	army.src = "img/jon-arm-club.png";
	this.arm = army;
	var img2 = new Image();
	img2.src = "img/jon-bod-happy.png";
	this.bodyHappy = img2;
	this.currentBody = "body";

	//amount arm must be displaced to be properly located on image of Jon
	this.ARMXBUFFER = 100;
	this.ARMYBUFFER = 230;
	//amount x should change per tick
	this.MOVEPERTICK = 13;

	this.bodyX = 0;
	this.bodyY = 0;
	this.dx = 0;
	this.dy = 0;

	this.armX = this.ARMXBUFFER/SCALE;
	this.armY = this.ARMYBUFFER/SCALE;
	this.armAngle = 0;

	//used in drawing rotated arm
	this.armXAdjustment = 30;
	this.armYAdjustment = 30;

	//updates the body's position based on keypress input
	this.keyDown = function(e) {
		var keyCode = e.keyCode;
		console.log(keyCode);
		//console.log(player.bodyX);
		switch (keyCode) {
			case 65: {
				//player.bodyX = player.bodyX + (-1)*player.MOVEPERTICK;
				player.dx = (-1)*player.MOVEPERTICK;
				break;
			}
			case 37: {
				//player.bodyX += (-1)*player.MOVEPERTICK;
				player.dx = (-1)*player.MOVEPERTICK;
				break;
			}
			case 39: {
				//player.bodyX += player.MOVEPERTICK;
				player.dx = player.MOVEPERTICK;
				break;
			}
			case 68: {
				//player.bodyX += player.MOVEPERTICK;
				player.dx = player.MOVEPERTICK;
				break;
			}
			case 69: {
				player.currentBody = "bodyHappy";
				break;
			}
			case 81: {
				player.currentBody = "body";
				break;
			}
		}
	}

	this.keyUp = function(e) {
		var keyCode = e.keyCode;

		switch (keyCode) {
			case 65: {
				//player.bodyX = player.bodyX + (-1)*player.MOVEPERTICK;
				player.dx = 0;
				break;
			}
			case 37: {
				//player.bodyX += (-1)*player.MOVEPERTICK;
				player.dx = 0;
				break;
			}
			case 39: {
				//player.bodyX += player.MOVEPERTICK;
				player.dx = 0;
				break;
			}
			case 68: {
				//player.bodyX += player.MOVEPERTICK;
				player.dx = 0;
				break;
			}
			case 69: {
				//player.currentBody = "bodyHappy";
				break;
			}
			case 81: {
				//player.currentBody = "body";
				break;
			}
		}

	}
	this.updateBody = function() {
		this.bodyX = this.bodyX + this.dx;
		this.bodyY = this.bodyY + this.dy;
	}

	this.update = function() {
		this.updateBody();
		this.updateArm();
	}

	//updates the arms X and Y positions on setInterval
	this.updateArm = function() {
		player.armX = player.bodyX + player.ARMXBUFFER/SCALE;
		player.armY = player.bodyY + player.ARMYBUFFER/SCALE;
	}

	//makes player.armAngle number of DEGREES (not radians) to rotate image
	this.updateArmAngle = function(e) {
		//console.log(e.pageX);
		var x = e.pageX;
		var y = e.pageY;
		var rad = Math.atan2((player.bodyY+player.ARMYBUFFER/SCALE-y),(player.bodyX+player.ARMXBUFFER/SCALE+player.arm.width/SCALE-x));
		//console.log(rad);
		player.armAngle = rad;
						  //(180+(180+(rad*180/Math.PI)))%360;
	}
	this.drawBody = function() {
		ctx.drawImage(player[player.currentBody],
					player.bodyX,
					player.bodyY,
					player.body.width/SCALE,
					player.body.height/SCALE);
	}
	this.drawArmRot = function() {
		//save normal canvas context
		ctx.save();

		//translate canvas to the middle of jon's shoulder, 
		//with slight adjustment because of way the arm img is bounded
		ctx.translate(this.armX + player.arm.width/SCALE - this.armXAdjustment/SCALE,
						this.armY + this.armYAdjustment/SCALE);

		//rotate by armAngle
		ctx.rotate(player.armAngle);

		//since img is drawn with 0,0 at top left corner, offset by width + adjustment
		//for x and offset by y adjustment for y, and draw to scaled width and height
		ctx.drawImage(player.arm,
						-player.arm.width/SCALE+this.armXAdjustment/SCALE,
						-this.armYAdjustment/SCALE,
						player.arm.width/SCALE,
						player.arm.height/SCALE);

		//normality restored
		ctx.restore();
	}

}


function Seal() {

	var img = new Image();
	img.src = "img/seal.png";
	this.img = img;

	this.sealScale = 2;
	this.x = 0;
	this.y = canvas.height - this.img.height/this.sealScale/SCALE;
	this.dx = 0;
	this.dy = 0;
	this.colliding = false;

	//constants
	this.XDECAY = .2;
	this.YDECAY = .5;
	this.DECAY = .2;
	this.RANDOMMOVEMENTBOUNDX = 15;
	this.RANDOMMOVEMENTBOUNDY = 30;
	this.RANDOMMOVEMENTBOUND = 10;

	//states
	this.RANDOM = 0;
	this.ESCAPE = 1;
	this.state = this.RANDOM;

	this.update = function() {
		//this.colliding = this.checkCollision()
		
		if (this.checkCollision()) {
			this.dx = this.getCollisionDx();
			this.dy = this.getCollisionDy();
		}
		else if //(this.isOnGround() && this.isStationary()) {
				(this.isStationary()) {
			//console.log("working");
			this.dx = this.getRandomMovement(this.RANDOMMOVEMENTBOUNDX);
			this.dy = this.getRandomMovement(this.RANDOMMOVEMENTBOUNDY);
		}
		////////
		if (this.dx + this.x > canvas.width - this.img.width/this.sealScale/SCALE) {
			this.x = canvas.width - this.img.width/this.sealScale/SCALE;
			this.dx = 0;
		} 
		else if (this.dx + this.x < 0) {
			this.x = 0;
			this.dx = 0;
		}
		/////////
		if (this.dy + this.y < 0) {
			this.y = 0;
			this.dy = 0;
		}
		else if (this.dy + this.y > canvas.height - this.img.height/this.sealScale/SCALE) {
			console.log("happening");
			this.y = canvas.height - this.img.height/this.sealScale/SCALE;
			this.dy = 0;
		}

		this.x += this.dx;
		this.y += this.dy;

		//decay vals
		this.decayMovement();
	}

	this.draw = function() {
		ctx.drawImage(this.img,this.x,this.y,this.img.width/this.sealScale/SCALE,this.img.height/this.sealScale/SCALE);
	}
	this.isOnGround = function() {
		var result = (this.y >= (canvas.height - this.img.height/SCALE - this.DECAY/SCALE));
		return result;
	}
	this.decayMovement = function() {
		if (this.state === this.RANDOM) {
			this.dx = Math.sign(this.dx)*(Math.abs(this.dx-this.DECAY/SCALE));
			this.dy = this.dy + this.YDECAY; //always + YDECAY because gravity
		}
		else {

		}
	}
	this.getRandomMovement = function(bound) {
		var sign = Math.random() < .5 ? -1 : 1;
		return sign*Math.floor(Math.random()*bound);
	}
	this.isStationary = function() {
		var result = ( (Math.abs(this.dx) - .2 < 0) && (Math.abs(this.dy) - .7 < 0));
		return result;
	}
	this.checkCollision = function() {
		//MUST BE IMPLEMENTED
		return false;
	}
}

function Seal1() {

}

function init() {
	var div = document.getElementById("sealWrapper");
	canvas = document.createElement("canvas");
	canvas.id = "sealClubbinJon";
	canvas.height = 600;
	canvas.width = 1000;
	div.appendChild(canvas);
	ctx = canvas.getContext("2d");


	player = new Player();
	testSeal = new Seal();

	window.addEventListener("keydown",player.keyDown, false);
	window.addEventListener("keyup",player.keyUp, false);
	window.addEventListener("mousemove",player.updateArmAngle,false);

	//begin game loop
	update();
}

function draw() {
	//erase
	ctx.clearRect(0,0,1000,1000);

	//draw body
	player.drawBody();
	//draw arm
	player.drawArmRot();
}

function update() {
	setTimeout(function() {
        requestAnimationFrame(update);
        // Drawing code goes here
    }, 1000 / fps);
	//for (var i = 0; i < entities; i++) {entities[i].update();}
	player.update();
	testSeal.update();
	//gameController.update();
	//-->would decide whether to add new seals or not, randomly and based on counter
	//for entities, draw them
	draw();
	testSeal.draw();
}

init();