function SnakeGame() {
	this.canvas = document.querySelector("#snakegame").getContext("2d");
	this.width = 600;//画布初始宽度
	this.height = 480;//画布初始高度
	this.step = 20;//步长
	this.stepX = this.width/this.step;//栅格X=30
	this.stepY = this.height/this.step;//栅格Y=24
	//生成一个数组属性，存放蛇头+蛇身,初始值为null，length=0
	this.snakeBodyList = new Array();
	//追加食物属性
	this.food = {
		x:0,
		y:0,
		img:foodImg,
		exist:false //食物是否已经存在，并且没有被吃掉
	}
	//蛇移动时，需要定义一个定时器Timer,可以在游戏结束的时候关闭
	this.timer = null;
	
	
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
		//生成5个节点的蛇身数据（此时，图片全部是bodyImg）
		if(this.snakeBodyList.length<1){
			for(var i=0;i<5;i++){
				this.snakeBodyList[i] = {
					x:this.stepX/2-2+i,//保证第三个节点的位置在屏幕中心
					y:this.stepY/2,
					img:bodyImg,
					direct:'west' 
				}
				this.snakeBodyList[0].img = westImg;//修改蛇头，图片更改为westImg
			}
		}
		//根据数组数据，在canvas中画蛇
		for(var j=0;j<this.snakeBodyList.length;j++){
			var snake = this.snakeBodyList[j];
			this.canvas.drawImage(
				snake.img,
				snake.x*this.step,
				snake.y*this.step,
				this.step,
				this.step);
		}
		 
	}
	//2.3画食物
	/*
	  根据游戏规则:
   	* 1-蛇在移动过程中(页面刷新时),食物没有被吃掉的时候,依然保持出现的位置,而不是随机再生成新的食物
   	* 2-食物出现的位置不能在蛇身上
   	* 解决方案:
   	* 1-判断食物是否已经存在,如果存在,保持原来的坐标,如果不存在,创建新的
   	* 2-将食物出现的位置x,y与蛇身数组进行比较,不相同则画出食物
	 */
	this.drawFood = function() {
		if(this.food.exist==true){
			this.canvas.drawImage(this.food.img,this.
				food.x*this.step,this.food.y*this.step,this.step,this.step);
			return;
		}
		//生成随机位置
		this.food.x = Math.floor(Math.random()*this.stepX);
		this.food.y = Math.floor(Math.random()*this.stepY);
		//判断是否与蛇身重叠，如果true，重新运行drawFood方法，否则，在新位置画蛇
		var flag = false;
		for(var i in this.snakeBodyList){
			var snake = this.snakeBodyList[i];
			if(snake.x == this.food.x && snake.y == this.food.y){
				flag = true;
				break;
			}
		}
		if(flag){
			this.drawFood();
		}else{
			this.canvas.drawImage(
				this.food.img,
				this.food.x*this.step,
				this.food.y*this.step,
				this.step,
				this.step);
			this.food.exist=true;
		}
	}
	//3-蛇移动
	this.move = function() {
		//技巧：把SnakeGame的this赋值给一个变量，该变量可以被事件方法使用
		var snake = this;
		//启动事件时，用的this指代的是事件源对象，即document
		document.onkeydown = function(event){
			event = event||window.event;
			var keyCode = event.keyCode;
			//根据操作，改变蛇snake自己的属性值
			switch(keyCode){
				case 37://LEFT
					snake.snakeBodyList[0].img = westImg;
					snake.snakeBodyList[0].direct = 'west';
					break;
				case 38://UP
					snake.snakeBodyList[0].img = northImg;
					snake.snakeBodyList[0].direct = 'north';
					break;
				case 39://RIGHT
					snake.snakeBodyList[0].img = eastImg;
					snake.snakeBodyList[0].direct = 'east';
					break;
				case 40://DOWN
					snake.snakeBodyList[0].img = southImg;
					snake.snakeBodyList[0].direct = 'south';
					break;
			}
		}
		//根据蛇最新的属性值，进行动画绘制（定时器）
		this.timer = setInterval(function(){
			//首先，蛇身体每一个节点获得前一个节点的位置
			for(var i=snake.snakeBodyList.length-1;i>0;i--){
				snake.snakeBodyList[i].x = snake.snakeBodyList[i-1].x;
				snake.snakeBodyList[i].y = snake.snakeBodyList[i-1].y;
			}
			//其次，根据方向snake.direct，对蛇头进行处理
			switch(snake.snakeBodyList[0].direct){
				case 'west':
					snake.snakeBodyList[0].x--;
					break;
				case 'east':
					snake.snakeBodyList[0].x++;
					break;
				case 'north':
					snake.snakeBodyList[0].y--;
					break;
				case 'south':
					snake.snakeBodyList[0].y++;
					break;
			}
			//对整个游戏界面进行重绘
			snake.draw();
		},200);
	}
}

