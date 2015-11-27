var app = angular.module('editorApplication', []);

/**
 * CONTROLLERS
 */
app.controller('CreateMeshController', function ($scope, MeshesService) {
	console.log('init CreateMeshController');
	$scope.meshManager = meshManager;

	// get the mesh data with the help of the MeshesService
	MeshesService.getCompleteMeshBlueprints().then(function(data) {
		console.log(data);
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

app.controller('ListMeshesController', function ($scope, MeshesService) {
	console.log('init ListMeshesController');
	$scope.meshManager = meshManager;
});

app.controller('SelectedMeshController', function ($scope, MeshesService) {
	console.log('init SelectedMeshController');
	$scope.meshManager = meshManager;

	// get the mesh data with the help of the MeshesService
	MeshesService.getCompleteMeshBlueprints().then(function(data) {
		console.log(data);
		$scope.meshBlueprints = data.meshBlueprints;
		$scope.abstractMeshBlueprint = data.abstractMeshBlueprint;
	});
});

/**
 * SERVICES
 */
app.factory('MeshesService', function($http) {
	console.log('init MeshesService');
	var promise;
	return {
		getCompleteMeshBlueprints: function(){
			if(!promise) {
				promise = $http.get('data/abstractMeshBlueprint.json').then(function (abstractMeshBlueprintResponse) {
					var abstractMeshBlueprint = abstractMeshBlueprintResponse.data;

					return $http.get('data/meshBlueprints.json').then(function (meshBlueprintsResponse) {
						var meshBlueprints = meshBlueprintsResponse.data;

						// initialize mesh blueprints
						for (var i = 0; i < meshBlueprints.length; i++) {

							// merge actual meshes with abstract mesh properties
							var meshBlueprint = meshBlueprints[i];
							for (var optionName in abstractMeshBlueprint.options) {
								if (abstractMeshBlueprint.options.hasOwnProperty(optionName)) {
									// copy from the options from teh abstract to the actual blueprint
									if (!meshBlueprint.options.hasOwnProperty(optionName)) {
										meshBlueprint.options[optionName] = abstractMeshBlueprint.options[optionName];
									}
								}
							}
						}
						return {
							meshBlueprints: meshBlueprints,
							abstractMeshBlueprint: abstractMeshBlueprint
						};

					});

				});
			}
			return promise;
		}
	};
});