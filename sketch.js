function setup() {
  raiseCanvas ( 400 , 400 );
}

function draw() {
  background(220);
}
let ball;
let playerPaddle;
let computerPaddle;
let playerScore = 0;
let computerScore = 0;
let errorFactor = 0.30; // 30% chance de the opponent missing the ball

function setup() {
  createCanvas(800, 400);
  ball = new Ball();
  playerPaddle = new Paddle(true);
  computerPaddle = new Paddle(false);
}

function draw() {
  background(0);
  
  // Display scores
  fill(255);
  textSize(32);
  textAlign(CENTER, CENTER);
  text(playerScore, width / 4, 30);
  text(computerScore, 3 * width / 4, 30);
  
  // Update and show ball
  ball.update();
  ball.show();
  
  // Update and show paddles
  playerPaddle.update();
  playerPaddle.show();
  computerPaddle.update(ball);
  computerPaddle.show();
  
  // Check for collisions
  ball.checkPaddleCollision(playerPaddle);
  ball.checkPaddleCollision(computerPaddle);
  
  // Check if ball is out of bounds
  if (ball.x < 0) {
    computerScore++;
    ball.reset();
  } else if (ball.x > width) {
    playerScore++;
    ball.reset();
  }
}

class Ball {
  constructor() {
    this.reset();
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xspeed = random(3, 5) * (random(1) > 0.5 ? 1 : -1);
    this.yspeed = random(3, 5) * (random(1) > 0.5 ? 1 : -1);
    this.r = 12;
  }

  update() {
    this.x += this.xspeed;
    this.y += this.yspeed;

    if (this.y < this.r || this.y > height - this.r) {
      this.yspeed *= -1;
    }
  }

  checkPaddleCollision(paddle) {
    if (this.x > paddle.x && this.x < paddle.x + paddle.w && this.y > paddle.y && this.y < paddle.y + paddle.h) {
      this.xspeed *= -1;
    }
  }

  show() {
    fill(255);
    noStroke();
    ellipse(this.x, this.y, this.r * 2);
  }
}

class Paddle {
  constructor(isPlayer) {
    this.w = 10;
    this.h = 100;
    this.isPlayer = isPlayer;
    this.x = isPlayer ? 0 : width - this.w;
    this.y = height / 2 - this.h / 2;
    this.yspeed = 5;
  }

  update(ball = null) {
    if (this.isPlayer) {
      if (keyIsDown(UP_ARROW)) {
        this.y -= this.yspeed;
      } else if (keyIsDown(DOWN_ARROW)) {
        this.y += this.yspeed;
      }
    } else {
      // Simple AI with error factor
      if (ball) {
        if (random(1) > errorFactor) {
          // AI follows the ball with a chance of error
          if (ball.y < this.y + this.h / 2) {
            this.y -= this.yspeed;
          } else if (ball.y > this.y + this.h / 2) {
            this.y += this.yspeed;
          }
        }
      }
    }
    
    this.y = constrain(this.y, 0, height - this.h);
  }

  show() {
    fill(255);
    noStroke();
    rect(this.x, this.y, this.w, this.h);
  }
}
