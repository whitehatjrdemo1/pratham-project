var PLAY = 1;
var END = 0;
var gameState = PLAY;

var jerry, jerry_runningImg;
var jerry_jump, jerry_jumpImg;
var jerry_caught, jerry_caughtImg;
var tom, tom_runningImg;

var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4;

var ground, invisibleGround, bkgroundImg;

var restart;

var cheese, cheeseImg;

var themeSound;

var score = 0;

function preload() {
  jerry_runningImg = loadImage("jerry-running.png");

  tom_runningImg = loadImage("running_tom.png");

  bkgroundImg = loadImage("ground.png");

  jerry_caughtImg = loadImage("tom_caught_jerry.png");

  jerry_jumpImg = loadImage("jerry_jumping.png");

  obstacle1 = loadImage("obstacles1.png");
  obstacle2 = loadImage("obstacles2.png");
  obstacle3 = loadImage("obstacle3.png");
  obstacle4 = loadImage("obstacles4.png");

  restartImg = loadImage("restart.png");

  cheeseImg = loadImage("cheese.png");

  themeSound = loadSound("tom-and-jerry-ringtone.mp3");

}

function setup() {
  createCanvas(windowWidth, windowHeight);

  jerry = createSprite(250, height - 15, 20, 50);
  jerry.addImage(jerry_runningImg);
  jerry.scale = 0.05;

  tom = createSprite(100, height - 15, 20, 50);
  tom.addImage(tom_runningImg);
  tom.scale = 0.1;

  invisibleGround = createSprite(width / 2, height - 15, width, 15);
  invisibleGround.visible = false;


  ground = createSprite(width / 2, height - 600, 400, 20);
  ground.addImage(bkgroundImg);
  ground.scale = 2;
  ground.velocityX = -6;

  jerry_caught = createSprite(width / 2, height / 2 - 40, 50, 50);
  jerry_caught.addImage(jerry_caughtImg);
  jerry_caught.scale = 0.5;

  restart = createSprite(width / 2, height / 1.1);
  restart.addImage(restartImg);
  restart.scale = 0.4;

  //cheese = createSprite(width/2,height/2);
  //cheese.addImage(cheeseImg);
  //cheese.scale = 0.05; 

  //jerry_jump = createSprite(width/2,height/2);
  //jerry_jump.addImage( jerry_jumpImg);
  //jerry_jump.scale = 0.1; 
  //jerry_jump.visible=false;

  jerry_caught.visible = false;
  restart.visible = false;


  foodGroup = new Group();
  obstaclesGroup = new Group();

  score = 0;

  invisibleGround.visible = false

  themeSound.loop();

}

function draw() {
  background("white");



  if (gameState === PLAY) {
    jerry.depth = ground.depth;
    jerry.depth = jerry.depth + 1;

    tom.depth = ground.depth;
    tom.depth = tom.depth + 1;

    ground.velocityX = -(6 + 3 * score / 20);

    ground.visible = true;
    tom.visible = true;
    jerry.visible = true;

    if ((touches.length > 0 || keyDown("space")) && jerry.y >= height - 80) {
      jerry.velocityY = -16;
      // jumpSound.play(); 
      touches = [];
    }

    jerry.velocityY = jerry.velocityY + 0.5;

    if (obstaclesGroup.isTouching(tom)) {
      //collidedSound.play()
      tom.velocityY = -16;
    }
    tom.velocityY = tom.velocityY + 0.9;



    if (ground.x < 0) {
      ground.x = width / 2;

    }
    jerry.collide(invisibleGround);
    tom.collide(invisibleGround);

    spawnfood();
    spawnObstacles();

    if (foodGroup.isTouching(jerry)) {
      score = score + 5;
      foodGroup.destroyEach();
    }

    if (obstaclesGroup.isTouching(jerry)) {
      themeSound.stop();
      gameState = END;
    }
    if (tom.isTouching(jerry)) {
      //collidedSound.play()
      gameState = END;
    }
  } else if (gameState === END) {
    jerry_caught.visible = true;
    restart.visible = true;




    ground.velocityX = 0;
    jerry.velocityY = 0;
    tom.velocityY = 0;

    //set velcity of each game object to 0
    //// ground.visible =false;
    //jerry.visible = false;
    //tom.visible
    obstaclesGroup.setVelocityXEach(0);
    foodGroup.setVelocityXEach(0);

    //change the trex animation
    //trex.changeAnimation("collided",trex_collided);

    //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    foodGroup.setLifetimeEach(-1);

    if (touches.length > 0 || mousePressedOver(restart)) {
      reset();
      touches = [];
    }

    ground.visible = false;
    foodGroup.destroyEach();
    obstaclesGroup.destroyEach();
    tom.visible = false;
    jerry.visible = false;


    //textSize(25);
    //fill("black")
    //text("Game Over",width/3,height/11);

    textSize(20);
    fill("blue")
    text("Press To Restart ~", width / 6, height / 1.09);


  }



  drawSprites();
  textSize(20);
  fill("black")
  text("Score: " + score, width / 1.3, 50);
  score.depth = ground.depth;
  score.depth = score.depth + 1;
}

function spawnObstacles() {
  if (frameCount % 80 === 0) {
    var obstacle = createSprite(width, height - 50, 20, 30);
    obstacle.setCollider('circle', 0, 0, 200)
    //obstacle.debug = true

    obstacle.velocityX = -(6 + 3 * score / 100);

    //generate random obstacles
    var rand = Math.round(random(1, 4));
    switch (rand) {
      case 1:
        obstacle.addImage(obstacle3);
        break;
      case 2:
        obstacle.addImage(obstacle4);
        break;
      case 3:
        obstacle.addImage(obstacle1);
        break;
      case 4:
        obstacle.addImage(obstacle2);
        break;
      default:
        break;
    }

    //assign scale and lifetime to the obstacle           
    obstacle.scale = 0.2;
    obstacle.lifetime = 300;
    obstacle.depth = jerry.depth;
    jerry.depth += 1;
    //add each obstacle to the group
    obstaclesGroup.add(obstacle);
  }
}

function spawnfood() {
  //write code here to spawn the clouds
  if (frameCount % 80 === 0) {
    var cheese = createSprite(width / 2, height / 3);
    cheese.setCollider('circle', 0, 0, 100)
    //cheese.debug = true;
    cheese.y = Math.round(random(250, 300));
    cheese.x = Math.round(random(350, 600));
    cheese.addImage(cheeseImg);
    cheese.scale = 0.05;
    cheese.velocityX = -5;

    //assign lifetime to the variable
    cheese.lifetime = 300;

    //adjust the depth
    cheese.depth = jerry.depth;
    jerry.depth = jerry.depth + 1;

    //add each cloud to the group
    foodGroup.add(cheese);
  }

}

function reset() {
  gameState = PLAY;
  jerry_caught.visible = false;
  restart.visible = false;

  tom.visible = true;
  jerry.vissible = true;
  tom.velocityY = 0;

  obstaclesGroup.destroyEach();
  foodGroup.destroyEach();

  themeSound.play();

  score = 0;

}
