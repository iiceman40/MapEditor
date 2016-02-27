var createScene = function () {

	var scene = new BABYLON.Scene(engine);

	var camera = new BABYLON.ArcRotateCamera("camera", -Math.PI/2, Math.PI/3, 10, new BABYLON.Vector3(0, 0, 0), scene);
	camera.setTarget(BABYLON.Vector3.Zero());
	camera.attachControl(canvas, true);

	scene.activeCameras.push(camera);

	var sphere = BABYLON.Mesh.CreateSphere("sphere1", 16, 1, scene);
	sphere.position.x = -1;

	var ground = BABYLON.Mesh.CreateGround("ground1", 6, 6, 2, scene);
	ground.receiveShadows = true;
	ground.position.y = -0.5;


	//scene.debugLayer.show();

	return scene;

};