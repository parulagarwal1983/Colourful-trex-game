var PLAY = 1;
var END = 0;
var gameState = PLAY;

var trex, trex_running, trex_collided;
var ground, invisibleGround, groundImage;

var cloudsGroup, cloudImage;
var obstaclesGroup, obstacle1, obstacle2, obstacle3, obstacle4, obstacle5, obstacle6;

var score;
var gameOverImg,restartImg
var jumpSound , checkPointSound, dieSound

function preload(){
  
  trex_running = loadAnimation("Dino both leg down (stand).png","Dino right leg up -.png","Dino both leg down (stand).png","Dino left leg up.png");
  
  trex_collided = loadAnimation("Dino collided.png");
  
  trexjump = loadImage("Dino both leg down (stand).png");
  
  groundImage = loadImage("ground.png");
  
  cloudImage = loadImage("Cloud.png");
  
  obstacle1 = loadImage("Cactus1.png");
  obstacle2 = loadImage("Cactus2.png");
  obstacle3 = loadImage("Cactus3.png");
  obstacle4 = loadImage("Cactus4.png");
  obstacle5 = loadImage("Cactus5.png");
  obstacle6 = loadImage("Cactus6.png");
  
  restartImg = loadImage("Reset button.png")
  gameOverImg = loadImage("Gameover.png")
  
  jumpSound = loadSound("jump.mp3")
  dieSound = loadSound("die.mp3")
  checkPointSound = loadSound("checkPoint.mp3")
  
  bgImage = loadImage("desert.jpg")
  sunImage = loadImage("Sun.png")
}

function setup() {
  
  createCanvas(windowWidth,windowHeight);
  
  ground = createSprite(width/2,height-60,windowWidth,windowHeight);
  ground.addImage("ground",groundImage);
  ground.scale = windowWidth/580
  ground.x = ground.width /2;
  
  
  sun = createSprite(width-100,height-420,10,10);
  sun.addImage(sunImage)
  sun.scale = windowWidth/2000
  
  
  trex = createSprite(width-580,height-100,20,50);
  trex.addAnimation("running", trex_running);
  trex.addAnimation("collided", trex_collided);
  trex.scale = windowWidth/2000;
  
  gameOver = createSprite(windowWidth/2,(windowHeight/2)+60);
  gameOver.addImage(gameOverImg);
  
  restart = createSprite(windowWidth/2,windowHeight/2);
  restart.addImage(restartImg);
  
 
  gameOver.scale = windowWidth/1900;
  restart.scale = windowWidth/3500;
  
  
  invisibleGround = createSprite(300,height-40,windowWidth,10);
  invisibleGround.visible = false;
  
  //create Obstacle and Cloud Groups
  obstaclesGroup = new Group();
  cloudsGroup = new Group();

  
  trex.setCollider("circle",50,0,150);
  trex.debug = false
  
  score = 0;
  
}


function draw() {
 
  background("lightblue");
  
  fill("black")
  textSize(23)
  text("Score: "+ score,windowWidth-130,30);
  
  
  if(gameState === PLAY){

    gameOver.visible = false;
    restart.visible = false;
    
    ground.velocityX = -(4 + 3* score/100)
    //scoring
    score = score + Math.round(getFrameRate()/22);
     
    console.log(getFrameRate());
    
    if(score>0 && score%100 === 0){
       checkPointSound.play() 
    }
    
    if (ground.x < 0){
      ground.x = ground.width/2;
    }
    
    //jump when the space key is pressed
    if((touches.y>0 || keyDown("space"))&& trex.y >= windowHeight-100) {
        trex.velocityY = -19;
        jumpSound.play();
        trex.changeAnimation(trexjump);
        touches = [];
    }
    
    //add gravity
    trex.velocityY = trex.velocityY + 0.8
  
    //spawn the clouds
    spawnClouds();
  
    //spawn obstacles on the ground
    spawnObstacles();
    
    if(obstaclesGroup.isTouching(trex)){
        gameState = END;
        dieSound.play()  
    }
  }
  
   else if (gameState === END) {
      gameOver.visible = true;
      restart.visible = true;
     
     //change the trex animation
      trex.changeAnimation("collided", trex_collided);
    
     
     
      ground.velocityX = 0;
      trex.velocityY = 0
     
      if(mousePressedOver(restart) || touches.y>0) {
        reset();
        touches = [];
      }
      
     
      //set lifetime of the game objects so that they are never destroyed
    obstaclesGroup.setLifetimeEach(-1);
    cloudsGroup.setLifetimeEach(-1);
     
     obstaclesGroup.setVelocityXEach(0);
     cloudsGroup.setVelocityXEach(0);    
   }
  
 
  //stop trex from falling down
  trex.collide(invisibleGround);


  drawSprites();
}

function spawnObstacles(){
 if (frameCount % 70 === 0){
   var obstacle = createSprite(windowWidth-1,windowHeight-90,10,40);
   obstacle.velocityX = -(6 + score/100);
   
    //generate random obstacles
    var rand = Math.round(random(1,6));
    switch(rand) {
      case 1: obstacle.addImage(obstacle1);
              break;
      case 2: obstacle.addImage(obstacle2);
              break;
      case 3: obstacle.addImage(obstacle3);
              break;
      case 4: obstacle.addImage(obstacle4);
              break;
      case 5: obstacle.addImage(obstacle5);
              break;
      case 6: obstacle.addImage(obstacle6);
              break;
      default: break;
    }
   
    //assign scale and lifetime to the obstacle           
    obstacle.scale = windowWidth/2400;
    obstacle.lifetime = 300;
 
   //add each obstacle to the group
    obstaclesGroup.add(obstacle);
 }
}

function spawnClouds() {
  //write code here to spawn the clouds
  if (frameCount % 200 === 0) {
    var cloud = createSprite(windowWidth-1,120,40,10);
    cloud.y = Math.round(random(windowHeight-550,windowHeight-400));
    cloud.addImage(cloudImage);
    cloud.scale = windowHeight/1000;
    cloud.velocityX = -3;
    
     //assign lifetime to the variable
    cloud.lifetime = 200;
    
    //adjust the depth
    cloud.depth = trex.depth;
    trex.depth = trex.depth + 1;
    
    gameOver.depth = cloud.depth+1;
    restart.depth = gameOver.depth;
    
    //add each cloud to the group
    cloudsGroup.add(cloud);
  }
}

function reset(){
  cloudsGroup.destroyEach();
  obstaclesGroup.destroyEach();
  gameState = PLAY;
  trex.changeAnimation("running", trex_running);
  score = 0;
}