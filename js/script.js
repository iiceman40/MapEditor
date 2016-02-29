var canvas, engine, scene;
var assetsManager, meshManager, materialManager, textureManager, lightingManager;
var app = angular.module('editorApplication', []);

$(document).ready(function () {

	// prevent context menu
	document.addEventListener("contextmenu", function(e){
		e.preventDefault();
	}, false);

	// prevent mouse wheel scroll
	window.onwheel = function(){ return false; };

	// extend string class to capitalize first letter
	String.prototype.capitalizeFirstLetter = function() {
		return this.charAt(0).toUpperCase() + this.slice(1);
	};

	canvas = document.getElementById("renderCanvas");
	engine = new BABYLON.Engine(canvas, true);

	scene = createScene();

	assetsManager = new BABYLON.AssetsManager(scene);
	assetsManager.useDefaultLoadingScreen = false;

	sceneManager = new SceneManager(scene);
	meshManager = new MeshManager(scene);
	textureManager = new TextureManager(assetsManager, scene);
	materialManager = new MaterialManager(textureManager, scene);
	lightingManager = new LightingManager(scene);

	engine.runRenderLoop(function () {
		scene.render();
	});


	// Events
	var tempMouseX, tempMouseY;
	window.addEventListener("mousedown", function (event) {
		tempMouseX = event.x;
		tempMouseY = event.y;
	});

	window.addEventListener("mouseup", function (event) {
		var meshesScope = getScope('SelectedMeshController');

		if(event.target == canvas && Math.abs(tempMouseX - event.x) < 10 && Math.abs(tempMouseY - event.y) < 10) {
			meshesScope.$apply(function () {
				meshManager.pickMesh(scene.pointerX, scene.pointerY, event);
			});
		}

	});

	window.addEventListener("resize", function () {
		engine.resize();
	});

});