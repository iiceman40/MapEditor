app.controller('CreateMeshController', function ($scope, MeshesService) {
	console.log('init CreateMeshController');
	$scope.meshManager = meshManager;

	// get the mesh data with the help of the MeshesService
	MeshesService.getCompleteMeshBlueprints().then(function(data) {
		$scope.meshBlueprints = data.meshBlueprints;
		$scope.abstractMeshBlueprint = data.abstractMeshBlueprint;
	});

	$scope.create = function ($index) {
		var meshBlueprint = $scope.meshBlueprints[$index];

		var options = {};
		for (var option in meshBlueprint.options) {
			// copy from the options blueprint to the mesh constructor
			if (meshBlueprint.options.hasOwnProperty(option)) {
				options[option] = meshBlueprint.options[option].value;
			}
		}

		var mesh = $scope.meshManager.create(meshBlueprint.id, options);
		$scope.meshManager.applyProperties(mesh, meshBlueprint.properties)
	}
});