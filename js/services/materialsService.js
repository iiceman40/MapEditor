app.factory('MaterialsService', function($http) {
	console.log('init MaterialsService');
	var promise;
	return {
		getMaterialBlueprints: function(){
			if(!promise) {
				promise = $http.get('data/materialBlueprints.json').then(function (materialBlueprintsResponse) {
					return materialBlueprintsResponse.data;
				});
			}
			return promise;
		}
	};
});