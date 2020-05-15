
import * as PIXI from 'pixi.js';
import {gsap, TimelineMax} from "gsap/all";
import Sniper from "../components/Sniper.js";
import Rocket from "../components/Rocket.js";
import Helper from "../ui/Helper.js";

class Game{
	
	constructor(){
		this.app;
		this._sniper;
		this._startWindow;
		this._canvas;
		gsap.registerPlugin(TimelineMax);
		
	}
	
	init(){
		this.app = new PIXI.Application( {width : 960, height : 950,backgroundColor: 0x252729});
		document.body.appendChild(this.app.view);
		this.app.stage.interactive = true;
	
		this._sniper = new Sniper(this.app);
		//this._sniper = new Sniper(this.app);
		
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
		btn.on('pointerdown',async () => {
			 await this.onStartWindowPointerDown();
			
			
		
		});	
	}
	
	onStartWindowPointerDown(){
		return new Promise( (res,rej) => {
			let tl = new TimelineMax({onComplete : () => {
					this._onStartGame();
				} 
			});
			tl
			.to(this._startWindow, 0.3, {y : this._startWindow.y + 50})
			.to(this._startWindow, 0.3, {y : -(this._startWindow.height) });
			res(tl);
		}).catch((error) => {
		  console.log("Timeline error Game onStartWindowPointerDown function");
		});
	
	}
	
	_onStartGame(){
		this._sniper.initSniper();
		this.app.stage.removeChild(this._startWindow);
		this._canvas = document.querySelector('canvas');
		this._canvas.addEventListener('mousemove',() => {
			this._onMouseMove()
		});
		this._canvas.addEventListener('contextmenu',e => {
			this._onContextMenu(e)
		}, false);
		this._canvas.addEventListener('click', e => {
			this._onClick(e);
		}, false);
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
export default  Game;