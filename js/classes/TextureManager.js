var TextureManager = function (scene) {
	this.scene = scene;
	this.texturesData = null;
	this.textures = {}
};

TextureManager.prototype.initTextures = function (texturesData) {
	for (var i = 0; i < texturesData.length; i++) {
		this.addTexture(texturesData[i]);
	}
	console.log(this.textures);
};

TextureManager.prototype.addTexture = function (data) {
	return this.textures[data.id] = new BABYLON.Texture(data.url, this.scene);
};

TextureManager.prototype.reset = function (scene) {
	this.scene = scene;
	this.textures = {}
	if(this.texturesData) {
		this.initTextures(this.texturesData);
	}
};