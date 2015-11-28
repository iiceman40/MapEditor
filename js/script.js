var canvas, engine, scene;
var meshManager;
var app = angular.module('editorApplication', []);

$(document).ready(function () {

	canvas = document.getElementById("renderCanvas");
	engine = new BABYLON.Engine(canvas, true);

	scene = createScene();

	meshManager = new MeshManager(scene);

	engine.runRenderLoop(function () {
		scene.render();
	});

	window.addEventListener("resize", function () {
		engine.resize();
	});

	// Events
	var tempMouseX, tempMouseY;
	window.addEventListener("mousedown", function (event) {
		tempMouseX = event.x;
		tempMouseY = event.y;
	});

	window.addEventListener("mouseup", function (event) {
		var meshesScope = getScope('ListMeshesController');

		if(event.target == canvas && Math.abs(tempMouseX - event.x) < 10 && Math.abs(tempMouseY - event.y) < 10) {
			meshesScope.$apply(function () {
				meshManager.pickMesh(scene.pointerX, scene.pointerY);
			});
		}

	});

});