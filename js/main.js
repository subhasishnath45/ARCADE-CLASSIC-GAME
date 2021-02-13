var canvas;
var canvasContext;
var ballX = 50;
var ballY = 50;
var ballSpeedX = 10;
var ballSpeedY = 5;

var paddle1Y = 250;
var paddle2Y = 250;

var player1Score = 0;
var player2Score = 0;

const PADDLE_HEIGHT = 100;
const PADDLE_THICKNESS = 10;
const WINNING_SCORE = 3;
var showingWinScreen = false;

function calculateMousePos(evt){
    var rect = canvas.getBoundingClientRect();
    var root = document.documentElement;
    var mouseX = evt.clientX - rect.left - root.scrollLeft;
    var mouseY = evt.clientY - rect.top - root.scrollTop;
    // return mouseX;
    // return mouseY;
    return {
        x: mouseX,
        y:mouseY
    };
}
function handleMouseClick(){
    // console.log("Mouse Click after Game Over");
    if(showingWinScreen){
        console.log("Mouse Click after Game Over");
        player1Score = 0;
        player2Score = 0;
        showingWinScreen = false;
    }
}
window.onload = function() {
	canvas = document.getElementById('gameCanvas');
	canvasContext = canvas.getContext('2d');

	var framesPerSecond = 30;
	setInterval(function() {
			moveEverything();
			drawEverything();
            // console.log(player2Score);	
		}, 1000/framesPerSecond);
    
    // When we click we want to restart the game.
    canvas.addEventListener('mousedown',handleMouseClick);
    // player1 controls the left paddle.
    canvas.addEventListener('mousemove',function(evt){
        var mousePos = calculateMousePos(evt);
        // bind the left paddle to the mouse position.
        paddle1Y = mousePos.y - (PADDLE_HEIGHT / 2);
    });

}

function moveEverything() {
    if(showingWinScreen){
        return;
    }
    computerMovement();
	// ballX = ballX + ballSpeedX;
    ballX += ballSpeedX;
    // ballY = ballY + ballSpeedY;
    ballY += ballSpeedY;
	if(ballX < 0) {
        if(ballY > paddle1Y && ballY < paddle1Y+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
            // will decide the direction and speed
            // based on where in the paddle the ball touches.
			var deltaY = ballY
					-(paddle1Y+PADDLE_HEIGHT/2);
            // ball speed will increase based on deltaY value.
			ballSpeedY = deltaY * 0.35;
        }else{
            player2Score++;
            ballReset();
            
        }
	}
	if(ballX > canvas.width) {
        if(ballY > paddle2Y && ballY < paddle2Y+PADDLE_HEIGHT){
            ballSpeedX = -ballSpeedX;
			var deltaY = ballY
					-(paddle2Y+PADDLE_HEIGHT/2);
			ballSpeedY = deltaY * 0.35;
        }else{
            player1Score++;
            ballReset();
            
        }
	}
    if(ballY < 0){
        // flip the direction 
        ballSpeedY = -ballSpeedY;
    }
    if(ballY > canvas.height){
        // flip the direction 
        ballSpeedY = -ballSpeedY;
    }
}

function drawNet(){
    for(var i = 0; i < canvas.height; i+=40){
        colorRect(canvas.width / 2, i, 2, 20, 'white');
    }
}

function drawEverything() {
	// next line blanks out the screen with black
	colorRect(0,0,canvas.width,canvas.height,'black');
    // When showingWinScreen is true.
    // We show the winner and game over message.
    if(showingWinScreen){
        canvasContext.fillStyle = "White";
        if(player1Score >= WINNING_SCORE){
            // console.log("Left Player Won.");
            canvasContext.fillText("Left Player Won.", canvas.width / 2.5, canvas.height / 1.5 );
        }else if(player2Score >= WINNING_SCORE){
            // console.log("Right Player Won.");
            canvasContext.fillText("Right Player Won.", canvas.width / 2.5, canvas.height / 1.5 );
        }
        canvasContext.fillText("GAME OVER. CLICK TO CONTINUE.", canvas.width / 3, canvas.height / 2);
        return;
    }
    // drawing our net.
    drawNet();
	// this is left player paddle
	colorRect(0,paddle1Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'#ffffff');

    // right paddle for computer
    colorRect(canvas.width - PADDLE_THICKNESS,paddle2Y,PADDLE_THICKNESS,PADDLE_HEIGHT,'white');
	// next line draws the ball
	// colorRect(ballX,100,10,10,'red');
    colorCircle(ballX, ballY, 10, 'red');

    // text to show scores.
    canvasContext.fillText(player1Score,100,100);
    canvasContext.fillText(player2Score, canvas.width - 100, 100);
    canvasContext.font = '20px Arial';

}

function colorRect(leftX,topY, width,height, drawColor) {
	canvasContext.fillStyle = drawColor;
	canvasContext.fillRect(leftX,topY, width,height);
}

function colorCircle(centerX, centerY, radius, drawColor){
    canvasContext.fillStyle = drawColor;
    // starting the path
    canvasContext.beginPath();
    // arc()
    canvasContext.arc(centerX,centerY,radius,0,2*Math.PI, true);
    // fill the circle.
    canvasContext.fill();
}

// reset the ball
function ballReset(){
    if(player1Score >= WINNING_SCORE || player2Score >= WINNING_SCORE){
        // player1Score = 0;
        // player2Score = 0;
        showingWinScreen = true;
    }
    ballSpeedX = -ballSpeedX;
    ballX = canvas.width / 2;
    ballY = canvas.height / 2;
}

function computerMovement(){

    // calculate the center of the right paddle.
    var paddle2Ycenter = paddle2Y + (PADDLE_HEIGHT / 2);

    // if the right paddle is above the ball
    if(paddle2Ycenter < ballY - 35){
        // Move the ball down.
        paddle2Y = paddle2Y + 6;
    }else if(paddle2Ycenter > ballY + 35){
        // Move the ball up.
        paddle2Y = paddle2Y - 6;
    }

}