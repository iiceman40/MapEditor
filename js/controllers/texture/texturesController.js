app.controller('TexturesController', function ($scope, TexturesService) {
	$scope.textureManager = textureManager;
	$scope.textures = textureManager.textures;

	TexturesService.getTextureBlueprints().then(function (data) {
		$scope.textureBlueprints = data;
		$scope.textureManager.texturesData = data;
		$scope.textureManager.initTextures(data);
	});

});