var TextureManager = function (assetsManager, scene) {
	this.scene = scene;
	this.assetsManager = assetsManager;
	this.texturesData = null;
	this.textures = {}
};

TextureManager.prototype.initTextures = function (texturesData) {
	var self = this;

	assetsManager.onFinish = function (tasks) {
		console.log('finished loading textures', self.textures);
		if(!materialManager.materials.length && materialManager.materialsData) {
			materialManager.initMaterials(materialManager.materialsData);
		}
	};

	for (var i = 0; i < texturesData.length; i++) {
		this.addTexture(texturesData[i]);
	}

	assetsManager.load();
};

TextureManager.prototype.addTexture = function (data) {
	var self = this;
	// TODO
	var textureTask = assetsManager.addTextureTask("texture task", data.url);
	textureTask.onSuccess = function(task) {
		return self.textures[data.id] = task.texture;
	};
};

TextureManager.prototype.reset = function (scene) {
	this.scene = scene;
	this.textures = {};
	if(this.texturesData) {
		this.initTextures(this.texturesData);
	}
};