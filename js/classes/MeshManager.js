var MeshManager = function (scene) {
	var self = this;

	this.scene = scene;

	this.meshes = {};
	this.selectedMesh = null;

	// init meshes by checking if there are already meshes in the scene
	for(var i = 0; i < scene.meshes.length; i++){
		var mesh  = scene.meshes[i];
		self.meshes[mesh.id] = mesh;
	}

};

/**
 * creates a new mesh with a unique id
 * @param id
 * @param options
 * @returns {*}
 */
MeshManager.prototype.create = function (id, options) {
	var type = id.charAt(0).toUpperCase() + id.slice(1);
	var name = '';
	// create a unique id by checking if it already exists
	while(!name || this.meshes.hasOwnProperty(name)){
		name = 'new_' + id + '_' + Math.floor(Math.random() * 10000000);
	}
	var mesh = BABYLON.MeshBuilder['Create' + type](name, options, this.scene);
	// keep track of meshes and add them to an array
	this.meshes[name] = mesh;
	return mesh;
};

/**
 * finds a mesh by its id, removes it from the meshes list and disposes the mesh
 * @param id
 */
MeshManager.prototype.dispose = function(id){

};

/**
 * applies a set of properties to a given mesh
 * @param mesh
 * @param properties
 */
MeshManager.prototype.applyProperties = function (mesh, properties) {
	for (var propertyName in properties) {
		if(properties.hasOwnProperty(propertyName)) {
			var property = properties[propertyName];
			// copy from the options from teh abstract to the actual blueprint
			if (mesh.hasOwnProperty(propertyName)) {
				if (property.hasOwnProperty('type')) {
					console.log(property.type);
					switch (property.type) {
						case 'Vector3':
							// set property on mesh as a BABYLON.Vector3
							mesh[propertyName] = new BABYLON.Vector3(property.x, property.y, property.z);
							break;
						default:
							// set property on mesh as a string or integer value
							if (property.hasOwnProperty('value')) {
								console.log('setting value ', property.value, ' for roperty ' + propertyName);
								mesh[propertyName] = property.value;
							}
					}
				}
			}
		}
	}
};

/**
 * select a mesh in the scene based on the given pickResult
 * @param pickResult
 */
MeshManager.prototype.selectMesh = function(pickResult){
	if(pickResult.hit){
		var pickedMesh = pickResult.pickedMesh;
		this.selectedMesh = pickedMesh;
	}
};