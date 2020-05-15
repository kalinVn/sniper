import Vector2D from "../components/Vector2D.js";
import * as PIXI from 'pixi.js';
class Rocket {

	constructor(app){
		this._frame = 0;
		this._frames = [];
		this.app = app;
		this.position = new Vector2D(0, 0);
	}
	
	init(position, rotation, mousePosition ){
		this.position = position;
		
		let loader = new PIXI.Loader();
		var id = "rocket";
		PIXI﻿.utils.clearTextureCache();
		loader.reset();
		loader.add(id, "./src/images/rocket.png").load(function(){
			this._rocketTexture = loader.resources[id].texture;
			let width = 26;
			let height = 49;
			let x = 0;
			let y = 0;
			for(let i = 0; i < 4; i++ ){
				this._frames.push(
					new PIXI.Rectangle(i * width, 0, width, height),
				);
			}
			this._rocketTexture.frame = this._frames[this._frame];
			this.sprite = new PIXI.Sprite(this._rocketTexture);
			this.sprite.anchor.set(0, 0.5);
			this.sprite.x = this.position.x;
			this.sprite.y = this.position .y;
			this.app.stage.addChild(this.sprite);
			this.sprite.angle = rotation;
			this.position = new Vector2D(this.sprite.x, this.sprite.y);
			mousePosition = new Vector2D(mousePosition.x, mousePosition.y);
			this._direction  = mousePosition.substract(this.position);
			this._move(mousePosition);
		}.bind(this));
	}
	
	_move(mousePosition){
		if(this._frame == this._frames.length){
			this._frame = 0;
		}
		var unitVector = this._direction.mult(1 / this._direction.length());
		if(this._direction.length()  < 5){
			this._rocketTexture.frame = this._frames[0];
			this._frames = [];
			this._frame = 0;
			this._expolode(mousePosition)
			return;
		}
		this.position.x = this.sprite.x += unitVector.x * 10;
		this.position.y = this.sprite.y += unitVector.y * 10;
		this._direction = mousePosition.substract(this.position);
		this._rocketTexture.frame = this._frames[this._frame];
		this._frame++;
		requestAnimationFrame(this._move.bind(this, mousePosition));
	}
	
	_expolode(mousePosition){
		let loader = new PIXI.Loader();
		let id = "explosion";
		PIXI﻿.utils.clearTextureCache();
		loader.reset();
		loader.add(id, "./src/images/explosion.png").load(function(){
			this.app.stage.removeChild(this.sprite);
			var explosionTexture = loader.resources[id].texture;
			let width = 128;
			let height = 128;
			let x = 0;
			let y = 0;
			var frames = [];
			var frame = 0;
			for(let i = 0; i < 40; i++ ){
				frames.push(
					new PIXI.Rectangle(i * width, 0, width, height),
				);
			}
			explosionTexture.frame = frames[frame];
			var explosionSprite = new PIXI.Sprite(explosionTexture);
			explosionSprite.anchor.set(0.5, 0.5);
			explosionSprite.x = this.position.x;
			explosionSprite.y = this.position .y;
			this.app.stage.addChild(explosionSprite);
			this._animateExplosion(explosionTexture, frames, frame);
		}.bind(this));
	}
	
	_animateExplosion(explosionTexture, frames, frame){
		if(frame > frames.length - 1){
			this.app.stage.removeChild(explosionTexture);
			return;
		}
		if(explosionTexture){
			explosionTexture.frame = frames[frame];
			frame++;
			requestAnimationFrame(this._animateExplosion.bind(this, explosionTexture, frames, frame));
		}
	}
	

}
export default  Rocket;