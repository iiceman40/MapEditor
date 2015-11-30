app.controller('MaterialsController', function ($scope, MaterialsService) {
	$scope.materialManager = materialManager;
	$scope.materials = materialManager.materials;

	// get the materials data with the help of the MeshesService

	MaterialsService.getMaterialBlueprints().then(function (data) {
		$scope.materialBlueprints = data;
		$scope.materialManager.initMaterials(data);
	});

});