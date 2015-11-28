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