app.controller('CreateMeshController', function ($scope, MeshesService) {
	console.log('init CreateMeshController');
	$scope.meshManager = meshManager;
	$scope.placeMultiple = false;

	// get the mesh data with the help of the MeshesService
	MeshesService.getCompleteMeshBlueprints().then(function (data) {
		$scope.meshBlueprints = data.meshBlueprints;
		$scope.abstractMeshBlueprint = data.abstractMeshBlueprint;
	});

	$scope.create = function ($index) {
		return $scope.meshManager.create($scope.meshBlueprints[$index]);
	};

	$scope.createAndPlace = function ($index) {
		$scope.meshManager.meshBlueprintToPlace = $scope.meshBlueprints[$index];
	};

	$scope.blueprintIsSelected = function ($index) {
		return $scope.meshManager.meshBlueprintToPlace === $scope.meshBlueprints[$index];
	}

});