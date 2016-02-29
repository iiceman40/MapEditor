var MaterialManager = function (scene) {
	this.scene = scene;
	this.materialsData = null;
	this.materials = {}
};

MaterialManager.prototype.initMaterials = function (materialsData) {
	for (var i = 0; i < materialsData.length; i++) {
		this.addMaterial(materialsData[i]);
	}
};

MaterialManager.prototype.addMaterial = function (data) {
	var material = new BABYLON.StandardMaterial(data.id, this.scene);

	if (data.hasOwnProperty('properties')){
		var properties = data.properties;
		if (properties.hasOwnProperty('diffuseColor') && properties.diffuseColor) {
			material.diffuseColor = new BABYLON.Color3(properties.diffuseColor[0], properties.diffuseColor[1], properties.diffuseColor[2]);
		}
	}

	if (data.hasOwnProperty('name') && data.name) {
		material.name = data.name;
	}

	this.materials[data.id] = material;

	return material;
};

MaterialManager.prototype.reset = function(scene){
	this.scene = scene;
	this.materials = {};
	if(this.materialsData) {
		this.initMaterials(this.materialsData);
	}
};