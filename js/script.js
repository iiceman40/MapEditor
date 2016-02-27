var canvas, engine, scene;
var meshManager, materialManager;
var app = angular.module('editorApplication', []);

$(document).ready(function () {

	document.addEventListener("contextmenu", function(e){
		e.preventDefault();
	}, false);

	window.onwheel = function(){ return false; };

	canvas = document.getElementById("renderCanvas");
	engine = new BABYLON.Engine(canvas, true);

	scene = createScene();

	sceneManager = new SceneManager(scene);
	meshManager = new MeshManager(scene);
	materialManager = new MaterialManager(scene);
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