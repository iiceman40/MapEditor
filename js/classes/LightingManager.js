var LightingManager = function (scene) {
	var self = this;

	this.scene = scene;
	this.shadowGenerator = null;
	this.idsForShadowGeneratorRenderList = {};

	this.init();
};

LightingManager.prototype.init = function(){
	var light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-0.5, -1, -0.5), scene);
	light.intensity = 0.7;

	this.shadowGenerator = new BABYLON.ShadowGenerator(1024, light);
	//this.shadowGenerator.getShadowMap().renderList.push(sphere);
	this.shadowGenerator.useVarianceShadowMap = true;
};