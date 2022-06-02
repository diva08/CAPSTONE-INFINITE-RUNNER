var PLAY = 1;
var END = 0;
var gameState = PLAY;

var ground, ground_image, invisible_ground;
var mario, mariorun, mario_collided, marioImage, pufferFish, pufferFish_running;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;
var jumpSound, dieSound, checkpointSound;
var score;
var gameOver, restart, gameOverImage, restartImage;

function preload() {
  ground_image = loadImage("Background.png");
  mariorun = loadAnimation("run1.png", "run2.png", "run3.png");
  pufferFish_running = loadAnimation("puffer_fish.png", "pufferFish2.png");
  obstacle1 = loadImage("obstacle1.png");
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  gameOverImage = loadImage("gameover.jpg");
  restartImage = loadImage("restart1.png");
  dead = loadImage("dead.png");
  marioImage = loadImage("idle.png");
}

function setup() {
  createCanvas(600, 500);

  ground = createSprite(400, 250, 0, 0);
  ground.shapeColor = "white";
  ground.addImage("ground_image", ground_image);
  ground.scale = 2.5;
  ground.velocityX = -2

  mario = createSprite(300, 420, 600, 10);
  mario.addAnimation("mariorun", mariorun);
  mario.addImage("dead", dead);
  mario.addImage("marioImage", marioImage);
  mario.scale = 1.5;
  
  mario.debug = false;
  mario.setCollider("rectangle", 0, 0, mario.width, mario.height)


  pufferFish = createSprite(50, 280, 600, 10);
  pufferFish.addAnimation("pufferFish_running", pufferFish_running);
  pufferFish.scale = 1.2;
  pufferFish.debug = false;
  

  invisible_ground = createSprite(300, 470, 600, 10);
  invisible_ground.visible = false;

  gameOver = createSprite(300, 200);
  gameOver.addImage(gameOverImage);

  restart = createSprite(300, 300);
  restart.addImage(restartImage);
  restart.scale = 0.2;

  obstaclesGroup = new Group();

  score = 0;
}

function draw() {
  background("black");
  
  mario.velocityY = mario.velocityY + 0.8;
  mario.collide(invisible_ground);

  pufferFish.velocityX = mario.velocityX;


  if (gameState === PLAY) {
    gameOver.visible = false;
    restart.visible = false;
    ground.visible = true;
    mario.changeImage("mariorun", mariorun)
    
    score = score + Math.round(getFrameRate() / 60);

    spawnObstacles();
    if (obstaclesGroup.isTouching(pufferFish)) {
      pufferFish.velocityY = -12;
    }
    ground.velocityX = -(4 + 3 * score / 100);

    if (ground.x < 30) {
      ground.x = ground.width / 2;
    }

    if (score > 0 && score % 100 === 0) {
      checkPointSound.play()
    }

    if ((keyDown("space") && mario.y >= 220)) {
      mario.velocityY = -10;
      jumpSound.play();
    }

    if (mario.isTouching(obstaclesGroup)) {
      gameState = END;
      dieSound.play();
    }
  } else if (gameState === END) {
    gameOver.visible = true;
    restart.visible = true;
    ground.velocityX = 0;
    mario.velocityY = 0
    mario.changeImage("dead", dead);
    obstaclesGroup.destroyEach();
    

    if (pufferFish.isTouching(mario)) {
      mario.changeImage("dead", dead);
      gameState = END;
    }
    

    if (mousePressedOver(restart)) {
      reset();
    }
  }


  drawSprites();
  fill("red");
  textSize(20);
  text("Score: " + score, 500, 50);
}

function reset() {
  gameState = PLAY;
  score = 0;
}

function spawnObstacles() {
  if (frameCount % 60 === 0) {
    var obstacle = createSprite(600, 410, 10, 40);
    obstacle.velocityX = -6; //+ score/100);

    
    var rand = Math.round(random(1, 4));
    obstacle.addImage(obstacle1);
    obstacle.scale = 1;
    obstaclesGroup.add(obstacle);
    obstacle.debug = false;
    obstacle.setCollider("circle", 0, 0, 1);
  }

}

