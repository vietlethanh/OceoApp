angular.module('OceoECommerce.Resource.Ads', [
	'OceoECommerce.Utils',
	'angular-data.DSCacheFactory',
	'OceoECommerce.Config',
])
.factory('Ads', ['$http','HttpUtil',
	function($http, HttpUtil){
		var r = {
			getHomeAds: function(){
				var opts = HttpUtil.opts({
					cache: true
				});
				return $http.get('/dynamic/gethome', opts);
			},
		}
		return r;
	}
]);