angular.module('OceoECommerce.Resource.Sale', [
	'OceoECommerce.Utils',
	'angular-data.DSCacheFactory'
])
.factory('Sale', ['$q','$http','DSCacheFactory','HttpUtil','CacheUtil','AppUtil','APP_CONFIG',
	function($q, $http, DSCacheFactory, HttpUtil, CacheUtil, AppUtil, APP_CONFIG){
		var r = {
			
			addSale: function(product){			
			
				var opts = HttpUtil.opts({
					intercetorParams: {api: false}
					
				});
				return $http.post( APP_CONFIG.KooKooAPI+'/bg_sale.php',product, opts);					
			},
		}
		return r;
	}
]);