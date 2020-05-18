import Vector2D from "../components/Vector2D.js";
import * as PIXI from 'pixi.js';
import {gsap, TimelineMax, PixiPlugin} from "gsap/all";

class Sniper {

	constructor(app){
		this.sprite;
		this.frames = [];
		this.app = app;
		this._sniperTexture;
		this.laser;
		this._direction = new Vector2D(0, 0);
		this.mouseMovePosition = new Vector2D(0, 0); 
		this._frame = 0;
		this._frames = [];
		gsap.registerPlugin(TimelineMax);
		PixiPlugin.registerPIXI(PIXI)
		gsap.registerPlugin(PixiPlugin);
	}
	
	async initSniper(){
		return new Promise( async (resolve,reject) => {
			let loader = await this._loadSniperSprite();	
			loader.onError.add((err) => {
				console.log("Error sprite loading");
			});
			resolve(loader)
			
		})
	}
	
	_loadSniperSprite(){
		let response = new Promise( (resolve, reject) => {
			let loader = this.app.loader.add("sniper", "./src/images/sniper.png").load( async (resp) => {
				this._sniperTexture = this.app.loader.resources["sniper"].texture;
				
				let width = 52.8;
				let height = 63;
				let x = 0;
				let y = 0;
				for(let i = 0; i < 8; i++ ){
					this._frames.push(
						new PIXI.Rectangle(i * width, 0, width, height),
					);
				}
				this._sniperTexture.frame = this._frames[this._frame];
				this.sprite = new PIXI.Sprite(this._sniperTexture);
				this.sprite.anchor.set(0.26, 0.26);
				this.sprite.x = 200;
				this.sprite.y = 200;
				this.app.stage.addChild(this.sprite);
				this.position = new Vector2D(this.sprite.x, this.sprite.y);
				
			} );
			resolve (loader);
		}).then( (loader) => {
			console.log("Sniper loaded");
			return loader;
		}).catch((error) => {
			console.log("Sniper error Snper class _loadSniperSprite");
		});
		
		return response;
	
	}
	
	
	
	_drawLaser(position){
		if(this.laser){
			this.laser.clear();
			this.app.stage.removeChild(this.laser);
		}
		this.laser = new PIXI.Graphics();
		this.laser.lineStyle(1, 0xb8f150d, 0.8);
		let x = this.sprite.x 	;
		let y = this.sprite.y;
		var len = 500;
		var v1 = new Vector2D(x, y);
		var v2 = new Vector2D(position.x, position.y);
		var normalVector = v2.substract(v1);
		var unitNormalVector = normalVector.mult(1 / normalVector.length());
		this.laser.moveTo(x, y);
		this.laser.lineTo(x + unitNormalVector.x * len, y + unitNormalVector.y * len);
		this.laser.endFill();
		this.app.stage.addChild(this.laser);
			
	}
	
	rotate(mousePosition){
		let rads = Math.atan2(mousePosition.y - this.sprite.y, mousePosition.x - this.sprite.x);
		let angle = rads * (180/ Math.PI);
		this.sprite.angle = angle + 90;
		this.mouseMovePosition = new Vector2D(mousePosition.x, mousePosition.y); 
		this._drawLaser(mousePosition);
	}
	
	walk(mousePos){
		this._animTeCircle(mousePos);
		if(this._reqAnimation){
			window.cancelAnimationFrame(this._reqAnimation);
			this._sniperTexture.frame = this._frames[0];
		}
		this.mousePosition =  new Vector2D(mousePos.x, mousePos.y);  
		this.mousePositionClick =  new Vector2D(mousePos.x, mousePos.y);  
		var direction  = this.mousePosition.substract(this.position);
		this._direction  = this.mousePosition.substract(this.position);
		this._frame = 1;
		this._update(direction);
		
	}
	
	
	_update(direction){
		if(this._frame == this._frames.length){
			this._frame = 0;
		}
		this.rotate(this.mouseMovePosition);
		var unitVector = this._direction.mult(1 / this._direction.length());
		if(this._direction.length()  < 3){
			this._sniperTexture.frame = this._frames[0];
			return;
		}
		
		this.position.x = this.sprite.x += unitVector.x * 3;
		this.position.y = this.sprite.y += unitVector.y * 3;
		this._direction  = this.mousePositionClick.substract(this.position);
		this._sniperTexture.frame = this._frames[this._frame];
		this._frame++;
		this._reqAnimation = requestAnimationFrame(this._update.bind(this, direction));
	
	}
	
	_animTeCircle(mousePos){
		var container = new PIXI.Container()
		var graphicsCircle = new PIXI.Graphics();
		graphicsCircle.lineStyle(1, 0xb8f150d, 0.7);
		graphicsCircle.drawCircle(0, 0, 10); 
		var container = new PIXI.Container();
		container.x = mousePos.x;
		container.y = mousePos.y;
		container.addChild(graphicsCircle);
		container.scale.x = 0;
		container.scale.y = 0;
		this.app.stage.addChild(container);
		var tl = new TimelineMax();
		tl.to(container, 0.5, { pixi : {scale: 2 } } )
		tl.to(graphicsCircle, 0.5, {pixi : {scale: 0 }} )
	}
	
	getPosition(){
		return this.position;
	}
	
	getRotation(){
		return this.sprite.angle;
	}
	
	weapons(){
	
	}


}
export default  Sniper;