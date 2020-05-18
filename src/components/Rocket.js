import Vector2D from "../components/Vector2D.js";
import * as PIXI from 'pixi.js';
const rocketJson = require("../images/explosion.json");
class Rocket {

	constructor(app){
		this._frame = 0;
		this._frames = [];
		this.app = app;
		this.position = new Vector2D(0, 0);
	}
	
	async init(position, rotation, mousePosition ){
		this.position = position;
		
		let loader = new PIXI.Loader();
		var id = "rocket";
		let resp = await this._clearCache(loader)
		let url = "./src/images/rocket.png";
		let texture = await this._loadResource(resp, id, url)
		this._rocketTexture = texture;
		this._onRocketLoaded(mousePosition, rotation) ;
	}
	
	_clearCache(loader){
		return new Promise( (resolve, reject) => {
			PIXI﻿.utils.clearTextureCache();
			loader.reset();
			resolve( loader);
		});
		
	}
	_onRocketLoaded(mousePosition, rotation) {
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
	}
	
	_loadResource(loader, id, url) {
		return  new Promise(  (resolve, reject) => {
			let loadRocket = loader.add(id, url).load ( () => {
				let texture = loader.resources[id].texture;
				if(!texture){
					texture = loader.resources[id].textures;
					console.log(texture);

				}
				if(!loadRocket){
					reject("Rocket is not loaded");
				}else{
					resolve(texture);
				}
			});
		});
	
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
	
	async _onRocketExplode(explosionTexture){
		return new Promise( (resolve, reject) => {
			this.app.stage.removeChild(this.sprite);
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
			let response = {
				explosionTexture : explosionTexture,
				frames : frames,
				frame : frame

			}
			resolve(response)
		});
	}
	
	async _expolode(mousePosition){
	
		let loader = new PIXI.Loader();
		let id = "spritesheet";
		let url = "./src/images/explosion.png";
		//let loadRocket = loader.add(id, url).load ( (loader) => {
			
			 //var texture = PIXI.Texture.from('Explosion_1.png');
			 // let treasureHunter = loader.resources[require('../images/explosion.json')].textures;
			//console.log(texture);
		//});
		//return;
		let resp = await this._clearCache(loader);
		let explosionTexture = await this._loadResource(resp, id, url);
		let respTexture = await this._onRocketExplode(explosionTexture) ;
		await this._animateExplosion(respTexture.explosionTexture, respTexture.frames, respTexture.frame);		
		
	}

	async _loadResourceExplosion(loader, id, url){
		return  new Promise(  (resolve, reject) => {
			let loadRocket = loader.add(id, url).load ( (resp) => {
				let explosionTexture = resp.resources[id].texture;
				
				this._onRocketExplode(explosionTexture) 
				
			});
		});

	}
	
	async _animateExplosion(explosionTexture, frames, frame){
		
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