var SceneManager = function (scene) {
	var self = this;

	this.scene = scene;
	this.meshManager = null;
	this.materialManager = null;
	this.textureManager = null;
	this.lightManager = null;
};

SceneManager.prototype.setMeshManger = function(meshManager){
	this.meshManager = meshManager;
};

SceneManager.prototype.setMaterialManger = function(materialManager){
	this.materialManager = materialManager;
};

SceneManager.prototype.setTextureManager = function(textureManager){
	this.textureManager = textureManager;
};

SceneManager.prototype.setLightManger = function(lightManager){
	this.lightManager = lightManager;
};

SceneManager.prototype.saveScene = function () {
	console.log('SceneMananger - saving scene');
	this.scene = scene;
	this.meshManager.deselectAllMeshes();

	var serializedScene = BABYLON.SceneSerializer.Serialize(this.scene);
	var strScene = JSON.stringify(serializedScene);
	console.log('comparing scene and serialized version of the scene: ', this.scene, serializedScene);

	if(typeof(Storage) !== "undefined") {
		localStorage.setItem("scene", strScene);
	} else {
		// Sorry! No Web Storage support..
	}
};

SceneManager.prototype.loadScene = function () {
	var strScene = localStorage.getItem("scene");
	BABYLON.SceneLoader.Load("", "data:"+strScene, engine, function (newScene) {
		self.scene.dispose();
		self.scene = newScene;

		self.textureManager.reset(self.scene);
		self.meshManager.reset(self.scene);
		self.materialManager.reset(this.textureManager, self.scene);

		console.log(newScene);

		if(self.scene.cameras.length) {
			self.scene.activeCameras.push(self.scene.cameras[0]);
		} else {
			console.log('Warning: no camera found, creating a new camera');
			var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2, Math.PI/3, 10, new BABYLON.Vector3(0, 0, 0), self.scene);
			camera.setTarget(BABYLON.Vector3.Zero());
			self.scene.activeCameras.push(camera);
		}
		self.scene.activeCamera.attachControl(canvas, true);
	});
};

SceneManager.prototype.newScene = function(){
	engine.stopRenderLoop();
	this.scene.dispose();

	this.scene = createScene();

	this.textureManager.reset(self.scene);
	this.meshManager.reset(this.scene);
	this.materialManager.reset(this.textureManager, self.scene);
	this.lightManager.reset(this.scene);


	engine.runRenderLoop(function () {
		self.scene.render();
	});

	scene = this.scene;
};