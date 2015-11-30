var MeshManager = function (scene) {
	var self = this;

	this.scene = scene;

	this.meshes = {};
	this.selectedMesh = null;
	this.selectedMeshOutline = null;

	// init meshes by checking if there are already meshes in the scene
	for (var i = 0; i < scene.meshes.length; i++) {
		var mesh = scene.meshes[i];
		while (this.meshes.hasOwnProperty(mesh.id)) {
			mesh.id = mesh.id + '_' + Math.floor(Math.random() * 10000000);
		}
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
	while (!name || this.meshes.hasOwnProperty(name)) {
		name = 'new_' + id + '_' + Math.floor(Math.random() * 10000000);
	}
	var mesh = BABYLON.MeshBuilder['Create' + type](name, options, this.scene);
	// keep track of meshes and add them to an array
	this.meshes[name] = mesh;
	this.selectMesh(mesh);
	return mesh;
};

/**
 * // TODO disposes the mesh manger
 * @param id
 */
MeshManager.prototype.dispose = function (id) {

};

/**
 * applies a set of properties to a given mesh
 * @param mesh
 * @param properties
 */
MeshManager.prototype.applyProperties = function (mesh, properties) {
	for (var propertyName in properties) {
		if (properties.hasOwnProperty(propertyName)) {
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
								console.log('setting value ', property.value, ' for property ' + propertyName);
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
 * @param pointerX
 * @param pointerY
 */
MeshManager.prototype.pickMesh = function (pointerX, pointerY) {
	var self = this;
	var pickResult = scene.pick(pointerX, pointerY, function (mesh) {
		var existsInMeshes = self.meshes.hasOwnProperty(mesh.id);
		return existsInMeshes;
	});
	if (pickResult.hit) {
		this.selectMesh(pickResult.pickedMesh);
	}
};

/**
 * selects a mesh by a given id
 * @param id
 */
MeshManager.prototype.selectMeshById = function (id) {
	this.selectMesh(this.meshes[id]);
};

/**
 * selects (or deselects if already selected) a given mesh
 * @param mesh
 */
MeshManager.prototype.selectMesh = function (mesh) {
	if (this.selectedMesh == mesh) {
		this.deselectMesh();
	} else {
		this.deselectMesh();
		this.selectedMesh = mesh;
		this.highlightMesh(mesh);
	}
};

/**
 * clears the currently selected mesh
 */
MeshManager.prototype.deselectMesh = function () {
	this.clearHighlightedMesh();
	this.selectedMesh = null;
};

/**
 * disposes a mesh with a given id
 * @param id
 */
MeshManager.prototype.disposeMeshWithId = function (id) {
	var mesh = this.meshes[id];
	this.disposeMesh(mesh);
};

MeshManager.prototype.disposeMesh = function (mesh) {
	if (mesh == this.selectedMesh) {
		this.selectedMesh = null;
	}
	delete this.meshes[mesh.id];
	mesh.dispose();
};

/**
 * highlights the currently selected mesh
 * @param mesh
 */
MeshManager.prototype.highlightMesh = function (mesh) {
	var outline = mesh.clone();
	var geometry = mesh.geometry.copy('outline_geo');
	geometry.applyToMesh(outline);

	var redMaterial = new BABYLON.StandardMaterial('redMat', scene);
	redMaterial.diffuseColor = new BABYLON.Color3(1, 0, 0);

	outline.flipFaces(true);

	outline.scaling = new BABYLON.Vector3(1.05, 1.05, 1.05);
	outline.material = redMaterial;

	outline.parent = mesh;
	outline.position = BABYLON.Vector3.Zero();

	this.selectedMesh.customOutline = outline;
};

/**
 * clears the currently selected mesh
 */
MeshManager.prototype.clearHighlightedMesh = function () {
	console.log('clearing highlighting', this.selectedMesh);
	if (this.selectedMesh) {
		this.selectedMesh.customOutline.dispose();
	}
};