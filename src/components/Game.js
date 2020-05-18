
import * as PIXI from 'pixi.js';
import {gsap, TimelineMax} from "gsap/all";
import Sniper from "../components/Sniper.js";
import Rocket from "../components/Rocket.js";
import Helper from "../ui/Helper.js";
const {promisify} = require("es6-promisify");

class Game{
	
	constructor(){
		this.app;
		this._sniper;
		this._startWindow;
		this._canvas;
		
	}
	
	async init(){
		gsap.registerPlugin(TimelineMax);
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
		this._startWindow =   await helper.createWindow(propStartWindow)
		//console.log(this._startWindow);
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
			let button = await buttonHelper.createBtn(propBtn);
			this._startWindow.addChild(button);
			button.x = this._startWindow.width/2 - button.width/2;
			button.y = this._startWindow.height/2 - button.height/2;
			button.on('pointerdown',async () => {
				await this.onStartWindowPointerDown(this._startWindow);
				await this._onStartGame(this._startWindow);
			});
			
			
		
		
		return;
		
		
			
	}
	
	async onStartWindowPointerDown(startWindow){
		
		let tl = new TimelineMax();
		
		
		tl
		.to(startWindow, 0.3, {y : startWindow.y + 50})
		.to(startWindow, 0.3, {y : -(startWindow.height) });
		
		return tl;
		
	
	}
	
	async _onStartGame(startWindow){
		await this._sniper.initSniper();
		await this._onSniperInit(startWindow);
	}	

	async _onSniperInit(startWindow){
		this.app.stage.removeChild(startWindow);
		this._canvas = document.querySelector('canvas');
		this._canvas.addEventListener('mousemove',() => this._onMouseMove() );
		this._canvas.addEventListener('contextmenu',e => this._onContextMenu(e), false);
		this._canvas.addEventListener('click', e => this._onClick(e), false);

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