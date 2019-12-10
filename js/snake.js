function SnakeGame() {
	this.canvas = document.querySelector("#snakegame").getContext("2d");
	this.width = 600;//画布初始宽度
	this.height = 480;//画布初始高度
	this.step = 20;//步长
	this.stepX = this.width/this.step;//栅格X=30
	this.stepY = this.height/this.step;//栅格Y=24
	//生成一个数组属性，存放蛇头+蛇身,初始值为null，length=0
	this.snakeBodyList = new Array();
	
	//1-实现游戏界面
	this.init = function() { 
		this.draw();
		this.move();
	} 
	
	//2-画背景，画蛇，画食物
	this.draw = function() { 
		//2.1画背景		
		this.canvas.drawImage(bgImg, 0, 0, 600, 480);
		//2.2画蛇 
		this.drawSnake();
		//2.3画食物
		this.drawFood();
	}
	//2.2-画蛇
	this.drawSnake = function() { 

		 
	}
	//2.3画食物
	this.drawFood = function() {

	}
	//3-蛇移动
	this.move = function() {

	}
}