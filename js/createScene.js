var createScene = function () {

	var scene = new BABYLON.Scene(engine);

	var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2, Math.PI/3, 10, new BABYLON.Vector3(0, 0, 0), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, true);

	var light = new BABYLON.HemisphericLight("light1", new BABYLON.Vector3(0, 1, 0), scene);
	light.intensity = 0.7;

	var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 1, scene);
	sphere.position.y = 0.5;
	sphere.position.x = -1;

	sphere.visibility = 0.5;

	var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);

	return scene;

};