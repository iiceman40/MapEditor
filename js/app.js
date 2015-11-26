var app = angular.module('editorApplication', []);
console.log('app init');

app.controller('MeshesController', function ($scope, $http) {
	$scope.meshManager = meshManager;

	$http.get('data/abstractMeshBlueprint.json').then(function (abstractMeshBlueprintResponse) {
		$scope.abstractMeshBlueprint = abstractMeshBlueprintResponse.data;
		console.log($scope.abstractMeshBlueprint);

		$http.get('data/meshBlueprints.json').then(function (meshBlueprintsResponse) {
			$scope.meshBlueprints = meshBlueprintsResponse.data;
			console.log($scope.meshBlueprints);

			// initialize mesh blueprints
			var abstractMeshBlueprint = $scope.abstractMeshBlueprint;
			for (var i = 0; i < $scope.meshBlueprints.length; i++) {

				// merge actual meshes with abstract mesh properties
				var meshBlueprint = $scope.meshBlueprints[i];
				for (var optionName in abstractMeshBlueprint.options) {
					if (abstractMeshBlueprint.options.hasOwnProperty(optionName)) {
						// copy from the options from teh abstract to the actual blueprint
						if (!meshBlueprint.options.hasOwnProperty(optionName)) {
							meshBlueprint.options[optionName] = abstractMeshBlueprint.options[optionName];
						}
					}
				}

				// copy all mesh properties defined in the abstract mesh to the actual mesh
				meshBlueprint.properties = {};
				for (var propertyName in abstractMeshBlueprint.properties) {
					if(abstractMeshBlueprint.properties.hasOwnProperty(propertyName)) {
						meshBlueprint.properties[propertyName] = abstractMeshBlueprint.properties[propertyName];
					}
				}
			}

			console.log($scope.meshBlueprints);

		});
	});

	$scope.create = function ($index) {
		var meshBlueprint = $scope.meshBlueprints[$index];
		var abstractMeshBlueprint = $scope.abstractMeshBlueprint;

		var options = {};
		for (var option in meshBlueprint.options) {
			// copy from the options blueprint to the mesh constructor
			if (meshBlueprint.options.hasOwnProperty(option)) {
				options[option] = meshBlueprint.options[option].value;
			}
		}

		console.log('creating mesh');
		var mesh = $scope.meshManager.create(meshBlueprint.id, options);
		console.log('mesh created ', mesh);
		// set property values
		$scope.meshManager.applyProperties(mesh, meshBlueprint.properties)
	}
});