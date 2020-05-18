import * as PIXI from 'pixi.js';
class Helper {

	constructor(){
	
	}
	
	async createBtn(prop){
		
			var propText = prop.text;
			var propContainer = prop.propContainer;
			var label = propText.label;
			var fontFamily = propText.fontFamily;
			var fontSize = propText.fontSize;
			var fill = propText.fill;
			var fill = propText.fill;
			var x = propText.x;
			var y = propText.y;
			let text = new PIXI.Text(label,{fontFamily : fontFamily, fontSize: fontSize, fill : fill});
			text.anchor.set(0.5, 0.5);
			var container = await this.createWindow(propContainer)
			text.x = container.width/2;
			text.y = container.height/2;
			container.addChild(text);
			container.buttonMode = true;
			container.interactive = true;
		
			return container;
	}
	
	async createWindow(prop){ 
			var regX = prop.regX;
			var regY = prop.regY;
			var width = prop.width;
			var height = prop.height;
			var x = prop.x;
			var y = prop.y;
			var color = prop.color;
			if(prop.radius){
				var radius = prop.radius;
			}else{
				var radius = 0;
			}
			if(prop.lineStyle){
				var size = prop.lineStyle.size;
				var colorLineStyle = prop.lineStyle.color
			}
			
			let container = new PIXI.Container();
			var overlay = new PIXI.Graphics();
			if(prop.lineStyle){
				overlay.lineStyle(size, colorLineStyle, 1);
			}
			overlay.beginFill(color, 1);
			if(prop.radius && prop.radius != 0 ){
				overlay.drawRoundedRect(regX, regY, width , height, radius);
			}else{
				overlay.drawRect(regX, regY, width , height);
			}
			overlay.endFill();
			container.x = x;
			container.y = 100;
			container.addChild(overlay);
			return container;
			
	}

}
export default  Helper;