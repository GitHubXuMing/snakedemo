function SnakeGame() {
	this.init = function() { //实现游戏界面
		this.draw();
		this.move();
	}
	this.draw = function() { //画背景，画蛇，画食物
		//画背景
		var canvas = document.querySelector("#snakegame").getContext("2d");
		canvas.drawImage(bgImg, 0, 0, 600, 480);
		//画蛇
		this.drawSnake();
		//画食物
		this.drawFood();
	}
	//画蛇
	this.drawSnake = function() {

	}
	//画食物
	this.drawFood = function() {

	}
	//蛇移动
	this.move = function() {

	}
}