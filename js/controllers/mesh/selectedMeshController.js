app.controller('SelectedMeshController', function ($scope, MeshesService) {
	console.log('init SelectedMeshController');
	$scope.meshManager = meshManager;

	// get the mesh data with the help of the MeshesService
	MeshesService.getCompleteMeshBlueprints().then(function(data) {
		$scope.meshBlueprints = data.meshBlueprints;
		$scope.abstractMeshBlueprint = data.abstractMeshBlueprint;
	});
});
