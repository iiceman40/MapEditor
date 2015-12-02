app.controller('SelectedMeshController', function ($scope, MeshesService) {
	console.log('init SelectedMeshController');
	$scope.meshManager = meshManager;
	$scope.materialManager = materialManager;
	$scope.lightingManager = lightingManager;

	$scope.previouslySelectedMeshId = null;
	$scope.selectedMeshId = null;

	$scope.$watch('lightingManager.idsForShadowGeneratorRenderList', function (newValue, oldValue) {
		console.log('render list changed', newValue, oldValue);
		var selectedMesh = $scope.meshManager.selectedMeshes[0];

		if(selectedMesh) {
			var renderList = $scope.lightingManager.shadowGenerator.getShadowMap().renderList;
			var index = renderList.indexOf(selectedMesh);

			if (newValue.hasOwnProperty(selectedMesh.id) && newValue[selectedMesh.id] && index == -1) {
				renderList.push(selectedMesh);
			} else if ((!newValue.hasOwnProperty(selectedMesh.id) || !newValue[selectedMesh.id]) && index != -1) {
				renderList.splice(index, 1);
			}
		}
	}, true);

	// get the mesh data with the help of the MeshesService
	MeshesService.getCompleteMeshBlueprints().then(function (data) {
		$scope.meshBlueprints = data.meshBlueprints;
		$scope.abstractMeshBlueprint = data.abstractMeshBlueprint;
	});
});
