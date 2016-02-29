var LightingManager = function (scene) {
	var self = this;

	this.scene = scene;
	this.light = null;
	this.shadowGenerator = null;
	this.idsForShadowGeneratorRenderList = {};

	this.init();
};

LightingManager.prototype.init = function(){
	this.light = new BABYLON.DirectionalLight("light1", new BABYLON.Vector3(-0.5, -1, -0.5), this.scene);
	this.light.intensity = 0.7;

	this.shadowGenerator = new BABYLON.ShadowGenerator(1024, this.light);
	this.shadowGenerator.useVarianceShadowMap = true;
};

LightingManager.prototype.reset = function(scene){
	this.scene = scene;
	this.init();
};