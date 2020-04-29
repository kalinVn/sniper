const requestAnimationFrame = window.requestAnimationFrame || window.mozRequestAnimationFrame ||
 window.webkitRequestAnimationFrame || window.msRequestAnimationFrame;
class Game{
	
	constructor(){
		this.app;
		this._sniper;
		this._startWindow;
		this._canvas;
		
	}
	
	init(){
		this.app = new PIXI.Application( {width : 960, height : 950,backgroundColor: 0x252729});
		document.body.appendChild(this.app.view);
		this.app.stage.interactive = true;
		this._sniper = new Sniper(this.app);
		let width = 860;
		let x = this.app.screen.width / 2 - (width / 2 );
		let propStartWindow = {
			regX : 0,
			regY : 0,
			width : 860,
			height : 400,
			x : x,
			y : 100,
			radius : 20,
			color : 0x3E4144,
			lineStyle : {
				size : 10,
				color : 0x333638
			}	
		};
		let helper = new Helper();
		this._startWindow = helper.createWindow(propStartWindow);
		this.app.stage.addChild(this._startWindow);
		
		let propBtn = {
			text : {
				label : 'Start Game',
				fontFamily : 'Arial',
				fontSize : 27,
				fill : "white"	
			},
			
			propContainer : {
				regX : 0,
				regY : 0,
				width : 300,
				height : 60,
				x : x,
				y : 0,
				radius : 5,
				color : 0x8BC558
			}
			
		};
		let buttonHelper = new Helper();
		let btn = buttonHelper.createBtn(propBtn);
		this._startWindow.addChild(btn);
		btn.x = this._startWindow.width/2 - btn.width/2;
		btn.y = this._startWindow.height/2 - btn.height/2;
		btn.on('pointerdown', function(){
			let tl = new TimelineMax({onComplete : this._onStartGame.bind(this) });
			tl
			.to(this._startWindow, 0.3, {y : this._startWindow.y + 50})
			.to(this._startWindow, 0.3, {y : -(this._startWindow.height) });
			
		}.bind(this));	
	}
	
	_onStartGame(){
		this._sniper.initSniper();
		this.app.stage.removeChild(this._startWindow);
		this._canvas = document.querySelector('canvas');
		this._canvas.addEventListener('mousemove', this._onMouseMove.bind(this));
		this._canvas.addEventListener('contextmenu', this._onContextMenu.bind(this), false);
		this._canvas.addEventListener('click', this._onClick.bind(this), false);
	}	

	_onClick(e){
		e.preventDefault();
		var mousePosition = this._localCoord();
		var rocket = new Rocket(this.app);
		var sniperPosition = this._sniper.getPosition();
		var rotation = this._sniper.getRotation();
		rocket.init(sniperPosition, rotation, mousePosition );

			
	}
	
	_onContextMenu(e){
		e.preventDefault();
		var position = this._localCoord();
		this._sniper.walk(position);
	
	}
	
	_onMouseMove(){
		if(this._sniper.sprite){
			var position = this._localCoord();
			this._sniper.rotate(position);
		}
	}
	
	_localCoord(){
		var rect = this._canvas.getBoundingClientRect();
		var position =  {
		  x: event.clientX - rect.left,
		  y: event.clientY - rect.top
		};
		return position;
	}
	
}