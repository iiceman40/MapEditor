var canvas, engine, scene;
var meshManager;

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
		var meshesScope = getScope('MeshesController');
		var meshManager = meshesScope.meshManager;

		if(event.target == canvas && Math.abs(tempMouseX - event.x) < 10 && Math.abs(tempMouseY - event.y) < 10) {
			var pickResult = scene.pick(scene.pointerX, scene.pointerY);
			meshesScope.$apply(function () {
				meshManager.selectMesh(pickResult);
			});
		}

	});

});