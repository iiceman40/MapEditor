app.factory('TexturesService', function($http) {
	console.log('init TexturesService');
	var promise;
	return {
		getTextureBlueprints: function(){
			if(!promise) {
				promise = $http.get('data/textureBlueprints.json').then(function (textureBlueprintsResponse) {
					return textureBlueprintsResponse.data;
				});
			}
			return promise;
		}
	};
});