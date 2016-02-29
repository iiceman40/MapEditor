app.controller('SceneController', function ($scope) {
	$scope.sceneManager = sceneManager;
	$scope.meshManager = meshManager;
	$scope.materialManager = materialManager;
	$scope.lightManager = lightingManager;

	$scope.sceneManager.setMeshManger($scope.meshManager);
	$scope.sceneManager.setMaterialManger($scope.materialManager);
	$scope.sceneManager.setLightManger($scope.lightManager);

	$scope.saveScene = function(){
		console.log('SceneController - saving scene');
		$scope.sceneManager.saveScene();
	};

	$scope.loadScene = function(){
		console.log('SceneController - loading scene');
		$scope.sceneManager.loadScene();
	};

	$scope.newScene = function(){
		console.log('SceneController - creating new scene');
		$scope.sceneManager.newScene();
	};

});