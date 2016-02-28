var SceneManager = function (scene) {
	var self = this;

	this.scene = scene;
	this.meshManager = null;
};

SceneManager.prototype.setMeshManger = function(meshManager){
	this.meshManager = meshManager;
};

SceneManager.prototype.saveScene = function () {
	console.log('SceneMananger - saving scene');
	this.meshManager.deselectAllMeshes();
	var serializedScene = BABYLON.SceneSerializer.Serialize(scene);
	var strScene = JSON.stringify(serializedScene);
	console.log(scene.cameras, serializedScene.cameras);

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
		if(self.scene.cameras) {
			self.scene.activeCameras.push(self.scene.cameras[0]);
			self.scene.activeCamera.attachControl(canvas, true);
			console.log(self.scene.activeCamera.position);
		}
		this.meshManager.reset(self.scene);
	});
};

/**
 * TODO FIXME
 */
SceneManager.prototype.newScene = function(){
	//console.log(this.scene.activeCamera);
	//this.scene.activeCamera.detachControl(canvas);
	engine.stopRenderLoop();
	scene.dispose();

	scene = createScene();

	sceneManager = new SceneManager(scene);
	meshManager = new MeshManager(scene);
	textureManager = new TextureManager(scene);
	materialManager = new MaterialManager(scene);
	lightingManager = new LightingManager(scene);

	engine.runRenderLoop(function () {
		scene.render();
	});

	this.scene = scene;
};