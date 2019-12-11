function SnakeGame() {
	this.cav = document.querySelector("#snakegame");
	this.canvas = this.cav.getContext("2d");
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
	//定义分值
	this.score = 0;
	//1-实现游戏界面
	this.init = function() { 
		this.score = 0;
		//根据设备，重置画布的宽度和高度
		this.isPCDevice();	
		this.draw();
		this.move();
	} 
	
	//2-画背景，画蛇，画食物
	this.draw = function() { 	
		//2.1画背景
		this.canvas.drawImage(bgImg, 0, 0, this.width, this.height);
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
					x:parseInt(this.stepX/2-2+i),//保证第三个节点的位置在屏幕中心
					y:parseInt(this.stepY/2),
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
		this.food.x = parseInt(Math.floor(Math.random()*this.stepX));
		this.food.y = parseInt(Math.floor(Math.random()*this.stepY));
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
	//3.1判断运行设备是PC端还是移动端,如果是PC端，返回true
	this.isPCDevice = function(){
		var info = window.navigator.userAgent;
		var flag = info.indexOf("Windows") != -1?true:false;
		//如果是手机屏幕，全屏显示
		if(!flag){
			this.cav.width = window.innerWidth;//画布宽度设置
			this.cav.height = window.innerHeight;//画布高度设置
			this.width = parseInt(window.innerWidth);//画布初始宽度
			this.height = parseInt(window.innerHeight);//画布初始高度
			this.stepX = parseInt(this.width/this.step);//栅格X
			this.stepY = parseInt(this.height/this.step);//栅格Y
		}
		return flag;
	}
	//3.2响应PC端键盘事件
	this.pcHandle = function(){
		//技巧：把SnakeGame的this赋值给一个变量，该变量可以被事件方法使用
		var snake = this;
		//启动事件时，用的this指代的是事件源对象，即document
		document.onkeydown = function(event){
			event = event||window.event;
			var keyCode = event.keyCode;
			//根据操作，改变蛇snake自己的属性值
			switch(keyCode){
				case 37://LEFT
					if(snake.snakeBodyList[0].direct != 'east'){
						snake.snakeBodyList[0].img = westImg;
						snake.snakeBodyList[0].direct = 'west';
					}
					break;
				case 38://UP
					if(snake.snakeBodyList[0].direct != 'south'){
						snake.snakeBodyList[0].img = northImg;
						snake.snakeBodyList[0].direct = 'north';
					}
					break;
				case 39://RIGHT
					if(snake.snakeBodyList[0].direct != 'west'){
						snake.snakeBodyList[0].img = eastImg;
						snake.snakeBodyList[0].direct = 'east';
					}
					break;
				case 40://DOWN
					if(snake.snakeBodyList[0].direct != 'north'){
						snake.snakeBodyList[0].img = southImg;
						snake.snakeBodyList[0].direct = 'south';
					}
					break;
			}
		}
	}
	//3.3相应手机键盘触屏事件
	this.phoneHandle = function(){
		var snake = this;
		document.addEventListener('touchstart',function(ev){
			ev = ev||window.event;
			//获得触屏的X,Y坐标
			var touchX = parseInt(ev.changedTouches[0].clientX);
			var touchY = parseInt(ev.changedTouches[0].clientY);
			//根据蛇头的方向，决定移动方向
			var shead = snake.snakeBodyList[0];
			if(shead.direct=='north' || shead.direct == 'south'){
				if(touchX < shead.x*snake.step){
					shead.img = westImg;
					shead.direct='west';
				}else{
					shead.img = eastImg;
					shead.direct='east';					
				}
			}else{//蛇头是west或者east方向
				if(touchY < shead.y*snake.step){
					shead.img = northImg;
					shead.direct='north';
				}else{
					shead.img = southImg;
					shead.direct='south';					
				}
			}
			
		});		
	}
	//3.4实现蛇移动
	this.move = function() {
		//根据设备，决定响应的事件
		if(this.isPCDevice()){
			this.pcHandle();
		}else{
			this.phoneHandle();
		}
		//根据蛇最新的属性值，进行动画绘制（定时器）
		var snake = this;
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
			//判断是否吃到了食物
			snake.eatFood();
			//对整个游戏界面进行重绘
			snake.draw();
			//判断游戏是否结束
			var gameOverFlag = snake.isGameOver();
			if(gameOverFlag){
				snake.stopTimer();
				if(confirm('Your score is :'+snake.score+'\n Try Again?')){
					//清空蛇身数组，恢复初始状态
					snake.snakeBodyList = new Array();
					//重绘
					snake.init();
				}
			}
		},200);
	}
	//4-游戏结束
	//4.1 清除定时器
	this.stopTimer = function(){
		clearInterval(this.timer);
	}
	//4.2 判断游戏是否结束
	this.isGameOver = function(){
		var sHead = this.snakeBodyList[0];
		//撞墙死
		if(sHead.x > this.stepX-1||sHead.x < 0||sHead.y>this.stepY-1|| sHead.y < 0){
			return true;
		}
		//撞自己死
		for(var i=1;i<this.snakeBodyList.length;i++){
			if(sHead.x == this.snakeBodyList[i].x && sHead.y == this.snakeBodyList[i].y){
				return true;
			}
		}
		return false;
	}
	
	//5-蛇吃食物，计分
	this.eatFood = function(){
		//实现逻辑，如果蛇头与食物的坐标重合，食物消失，在随机点重新出现，蛇身+1
		var shead = this.snakeBodyList[0];
		if(shead.x == this.food.x && shead.y == this.food.y){
			this.food.exist = false;
			//思路：追加一个新节点，坐标（-10，-10），当运行move方法时，最后一个节点将获得倒数第二个节点的值，draw方法被调用，
			var length = this.snakeBodyList.length;
			this.snakeBodyList[length] = {
				x:-10,
				y:-10,
				img:bodyImg,
				direct:this.snakeBodyList[length-1].direct
			};
			//加分
			this.score += 10;
		}
	}
}

