'use strict';

var MeshManager = function (scene) {
	console.log('initiating Meshmanager');
	var self = this;

	this.scene = scene;

	this.meshes = {};
	this.meshBlueprintToPlace = null;
	this.selectedMeshes = [];
	this.selectedMesh = function () {
		if (this.selectedMeshes.length > 0) {
			return this.selectedMeshes[0];
		} else {
			return null;
		}
	};
	this.editControl = null;

	this.initMeshesInScene(this.scene);

	//this.initMeshesInScene(scene);
};

/**
 * creates a new mesh with a unique id
 * @param meshBlueprint
 * @returns {*}
 */
MeshManager.prototype.create = function (meshBlueprint) {
	// read options from blueprint
	var options = {};
	for (var option in meshBlueprint.options) {
		// copy from the options blueprint to the mesh constructor
		if (meshBlueprint.options.hasOwnProperty(option)) {
			options[option] = meshBlueprint.options[option].value;
		}
	}

	// generate type and name
	var id = meshBlueprint.id;
	var type = id.charAt(0).toUpperCase() + id.slice(1);
	var name = '';

	// create a unique id by checking if it already exists
	while (!name || this.meshes.hasOwnProperty(name)) {
		name = 'new_' + id + '_' + Math.floor(Math.random() * 10000000);
	}

	// create mesh
	var mesh = BABYLON.MeshBuilder['Create' + type](name, options, this.scene);

	// apply properties to the newly create mesh
	this.applyProperties(mesh, meshBlueprint.properties);

	// keep track of meshes and add them to an array
	this.meshes[name] = mesh;
	this.selectMesh(mesh);

	return mesh;
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
					switch (property.type) {
						case 'Vector3':
							// set property on mesh as a BABYLON.Vector3
							mesh[propertyName] = new BABYLON.Vector3(property.x, property.y, property.z);
							break;
						default:
							// set property on mesh as a string or integer value
							if (property.hasOwnProperty('value')) {
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
MeshManager.prototype.pickMesh = function (pointerX, pointerY, event) {
	var self = this;
	var pickResult = scene.pick(pointerX, pointerY, function (mesh) {
		// only select meshes that exist in the editors meshes list
		return self.meshes.hasOwnProperty(mesh.id);
	});

	if (pickResult.hit) {
		if (this.meshBlueprintToPlace && event.button == 2) {
			self.placeMesh(pickResult.pickedMesh, pickResult.pickedPoint);
		} else {
			this.selectMesh(pickResult.pickedMesh);
		}
	}
};

/**
 * places the mesh set in meshBlueprintToPlace at a given position
 * @param targetMesh
 * @param targetPoint
 */
MeshManager.prototype.placeMesh = function(targetMesh, targetPoint){
	var gridSize = 1;

	var mesh = this.create(this.meshBlueprintToPlace);
	var relativeClickPosition = targetPoint.subtract(targetMesh.position);

	var maxValue = -Infinity;
	var maxAxis = null;
	var minValue = Infinity;
	var minAxis = null;

	// iterate over axes to determine the clicked side of the mesh
	for (axis in relativeClickPosition) {
		if (relativeClickPosition.hasOwnProperty(axis)) {
			if(relativeClickPosition[axis] > maxValue){
				maxValue = relativeClickPosition[axis];
				maxAxis = axis;
			}
			if(relativeClickPosition[axis] < minValue){
				minValue = relativeClickPosition[axis];
				minAxis = axis;
			}
		}
	}

	var boundingBoxMeshToPlace = mesh.getBoundingInfo().boundingBox;
	var boundingBoxTargetMesh = targetMesh.getBoundingInfo().boundingBox;
	var targetPosition = targetMesh.position.clone();

	var axis = minAxis;
	var deltaMeshToPlace = boundingBoxMeshToPlace.minimum[axis];
	var deltaTargetMesh = boundingBoxTargetMesh.maximum[axis];

	if(Math.abs(relativeClickPosition[maxAxis]) > Math.abs(relativeClickPosition[minAxis])) {
		axis = maxAxis;
		deltaMeshToPlace = boundingBoxMeshToPlace.maximum[axis];
		deltaTargetMesh = boundingBoxTargetMesh.minimum[axis];
	}
	targetPosition[axis] += deltaTargetMesh * -1 + deltaMeshToPlace;
	var targetPositionInGrid = targetPosition;

	// check if target mesh is some kind of flat ground like tiledGround, ground or plane
	var targetMeshBoundingBox = targetMesh.getBoundingInfo().boundingBox;
	if(targetMeshBoundingBox.maximum.y == targetMeshBoundingBox.minimum.y){
		targetPositionInGrid = new BABYLON.Vector3(
			Math.round(targetPoint.x * gridSize) / gridSize,
			Math.round(targetPosition.y * gridSize) / gridSize,
			Math.round(targetPoint.z * gridSize) / gridSize
		);
	}

	mesh.position = targetPositionInGrid;
};

MeshManager.prototype.cancelPlacing = function(){
	this.meshBlueprintToPlace = null;
};

/**
 * selects a mesh by a given id
 * @param id
 */
MeshManager.prototype.selectMeshById = function (id) {
	this.selectMesh(this.meshes[id]);
};

/**
 * activates the edit control to by triggering an init or switching to it
 * @param mesh
 * @param scene
 */
MeshManager.prototype.activateEditControl = function(mesh, scene){
	//mesh.rotationQuaternion = null;
	if(!this.editControl) {
		this.initEditControl(mesh, scene);
	} else {
		this.editControl.switchTo(mesh);
	}
};

/**
 * initializes the edit control tool
 * @param mesh
 * @param scene
 */
MeshManager.prototype.initEditControl = function(mesh, scene){
	var EditControl = org.ssatguru.babylonjs.component.EditControl;
	this.editControl = new EditControl(mesh, scene.activeCamera, canvas, 0.5);
	this.editControl.setTransSnapValue(0.1);
	this.editControl.setTransSnap(true);
	this.editControl.enableTranslation();
	//this.editControl.enableRotation();
	//this.editControl.enableScaling();
};

/**
 * selects (or deselects if already selected) a given mesh
 * @param mesh
 */
MeshManager.prototype.selectMesh = function (mesh) {
	if (this.selectedMeshes.indexOf(mesh) > -1) {
		this.deselectMesh(mesh);
	} else {
		this.deselectAllMeshes();
		this.selectedMeshes.push(mesh);
		this.highlightMesh(mesh);
		this.activateEditControl(mesh, scene);
	}
};

/**
 * clears the currently selected mesh
 */
MeshManager.prototype.deselectMesh = function (mesh) {
	if(this.editControl) {
		this.editControl.detach();
		this.editControl = null;
	}
	this.clearHighlightedMesh(mesh);
	var indexOfMesh = this.selectedMeshes.indexOf(mesh);
	if (indexOfMesh > -1) {
		this.selectedMeshes.splice(indexOfMesh, 1);
	}
};

/**
 * clears all currently selected meshes
 */
MeshManager.prototype.deselectAllMeshes = function () {
	if(this.editControl) {
		this.editControl.detach();
		this.editControl = null;
	}
	this.clearAllHighlightedMeshes();
	this.selectedMeshes = [];
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
	if(mesh.customOutline){
		mesh.customOutline.dispose();
	}
	if (mesh == this.selectedMesh) {
		this.selectedMesh = null;
	}
	delete this.meshes[mesh.id];
	mesh.dispose();

	if(this.editControl) {
		this.editControl.detach();
		this.editControl = null;
	}
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
	redMaterial.emissiveColor = new BABYLON.Color3(1, 0, 0);

	outline.flipFaces(true);

	outline.scaling = new BABYLON.Vector3(1.05, 1.05, 1.05);
	outline.material = redMaterial;
	outline.visibility = mesh.visibility;

	outline.parent = mesh;
	outline.position = BABYLON.Vector3.Zero();
	outline.rotation = BABYLON.Vector3.Zero();

	mesh.customOutline = outline;
};

/**
 * clears the currently selected mesh highlighting
 */
MeshManager.prototype.clearHighlightedMesh = function (mesh) {
	if (mesh && mesh.customOutline) {
		mesh.customOutline.dispose();
	}
};

/**
 * clears the highlighting od all currently selected meshes
 */
MeshManager.prototype.clearAllHighlightedMeshes = function () {
	for (var i = 0; i < this.selectedMeshes.length; i++) {
		this.selectedMeshes[i].customOutline.dispose();
	}
};

/**
 * resets the mesh manager
 */
MeshManager.prototype.reset = function(scene){
	this.scene = scene;

	this.meshes = {};
	this.meshBlueprintToPlace = null;
	this.selectedMeshes = [];
	if(this.editControl) {
		this.editControl.detach();
	}
	this.editControl = null;

	this.initMeshesInScene(scene);
};

/**
 * init meshes by checking if there are already meshes in the scene
 */
MeshManager.prototype.initMeshesInScene = function(){
	console.log(scene.meshes);
	for (var i = 0; i < this.scene.meshes.length; i++) {
		var mesh = this.scene.meshes[i];
		while (this.meshes.hasOwnProperty(mesh.id)) {
			mesh.id = mesh.id + '_' + Math.floor(Math.random() * 10000000);
		}
		this.meshes[mesh.id] = mesh;
	}
};