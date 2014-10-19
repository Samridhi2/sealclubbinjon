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
	this.MOVEPERTICK = 20;

	this.bodyX = 0;
	this.bodyY = 0;

	this.armX = this.ARMXBUFFER/SCALE;
	this.armY = this.ARMYBUFFER/SCALE;
	this.armAngle = 0;

	//used in drawing rotated arm
	this.armXAdjustment = 30;
	this.armYAdjustment = 30;

	//updates the body's position based on keypress input
	this.updateBody = function(e) {
		var keyCode = e.keyCode;
		console.log(keyCode);
		//console.log(player.bodyX);
		switch (keyCode) {
			case 65: {
				player.bodyX = player.bodyX + (-1)*player.MOVEPERTICK;
				break;
			}
			case 37: {
				player.bodyX += (-1)*player.MOVEPERTICK;
				break;
			}
			case 39: {
				player.bodyX += player.MOVEPERTICK;
				break;
			}
			case 68: {
				player.bodyX += player.MOVEPERTICK;
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

	this.update = function() {
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

	this.x = 0;
	this.y = canvas.height - this.img.height;
	this.dx = 0;
	this.dy = 0;
	this.colliding = false;
	this.sealScale = 2;

	//constants
	this.XDECAY = .2;
	this.YDECAY = .5;
	this.DECAY = .2;
	this.RANDOMMOVEMENTBOUNDX = 200;
	this.RANDOMMOVEMENTBOUNDY = 5;
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
			this.dx = this.getRandomMovement();
			this.dy = this.getRandomMovement();
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
	    //should be adjusted for better gravity simulation
				  //Math.sign(this.dy)*(Math.abs(this.dy))+this.DECAY/SCALE;
		//console.log(this.dx);
		//console.log(this.dy);
	}

	this.draw = function() {
		ctx.drawImage(this.img,this.x,this.y,this.img.width/this.sealScale/SCALE,this.img.height/this.sealScale/SCALE);
	}
	this.isOnGround = function() {
		var result = (this.y >= (canvas.height - this.img.height/SCALE - this.DECAY/SCALE));
		//console.log(result);
		return result;
	}
	this.decayMovement = function() {
		if (this.state === this.RANDOM) {
			this.dx = Math.sign(this.dx)*(Math.abs(Math.abs(this.dx)-this.DECAY/SCALE));
			this.dy = //Math.sign(this.dy)*(Math.abs(this.dy-this.DECAY/SCALE));
					  this.dy + this.YDECAY;//*Math.abs(this.dy);
		}
		else {

		}
	}
	this.getRandomMovement = function() {
		var sign = Math.random() < .5 ? -1 : 1;
		return sign*Math.floor(Math.random()*this.RANDOMMOVEMENTBOUND);
	}
	this.isStationary = function() {
		//DOESN'T WORK
		var result = ( (Math.abs(this.dx) - .2 < 0)  && (Math.abs(this.dy) - .7 < 0));
					 //(this.dx === 0 && this.dy <= this.DECAY/SCALE && this.y >= canvas.height - this.img.height - this.DECAY/SCALE);
		//console.log(result);
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

	window.addEventListener("keydown",player.updateBody, false);
	window.addEventListener("mousemove",player.updateArmAngle,false);

	//begin game loop
	//window.setInterval(update, 10);
	update();
}

function draw() {
	//erase
	ctx.clearRect(0,0,1000,1000);

	//draw body
	ctx.drawImage(player[player.currentBody],
					player.bodyX,
					player.bodyY,
					player.body.width/SCALE,
					player.body.height/SCALE);
	//draw arm
	////drawImageRot(player.arm,player.armX,player.armY,player.arm.width/SCALE,player.arm.height/SCALE,player.armAngle);
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




//taken from StackOverflow 
//http://stackoverflow.com/questions/2677671/how-do-i-rotate-a-single-object-on-an-html-5-canvas
/*
function drawImageRot(img,x,y,width,height,deg){
	//Convert degrees to radian 
	var rad = deg * Math.PI / 180;

    //Set the origin to the center of the image
    ctx.translate(x + width / 2, y + height / 2);

    //Rotate the canvas around the origin
    ctx.rotate(rad);

    //draw the image    
    ctx.drawImage(img,width / 2 * (-1),height / 2 * (-1),width,height);

    //reset the canvas  
    ctx.rotate(rad * ( -1 ) );
    ctx.translate((x + width / 2) * (-1), (y + height / 2) * (-1));
}
*/