var createScene = function () {

	var scene = new BABYLON.Scene(engine);

	var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2, Math.PI/3, 10, new BABYLON.Vector3(0, 0, 0), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, true);

	scene.activeCameras.push(camera);

	var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 1, scene);
	sphere.position.x = -1;

	//var ground = BABYLON.Mesh.CreateGround("ground1", 16, 16, 2, scene);
	var precision = {
		"w" : 1,
		"h" : 1
	};
	var subdivisions = {
		'h' : 17,
		'w' : 17
	};
	var ground = BABYLON.Mesh.CreateTiledGround("Tiled Ground", -8.5, -8.5, 8.5, 8.5, subdivisions, precision, scene, false);
	ground.receiveShadows = true;
	ground.position.y = -0.5;


	//scene.debugLayer.show();

	return scene;

};