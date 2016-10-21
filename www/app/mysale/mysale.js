angular.module('Oceo.MySale', [
	//'OceoECommerce.Resource.Sale',
	'OceoECommerce.Sheet',
	'OceoECommerce.Push',
	'ui.utils.masks'
])
.controller('MySaleCtrl', ['$q','$scope', 'security', '$ionicLoading','$ionicPopup',
	'APP_CONFIG','$Sheet','$ionicModal','MCMTracker','$ionicScrollDelegate','$timeout','phone', 'toaster',
	function($q,$scope, security,  $ionicLoading,$ionicPopup, APP_CONFIG, $Sheet, $ionicModal,MCMTracker, $ionicScrollDelegate,$timeout, phone, toaster){
		var vm = this;
		// private properties -------------------------------------------------------------
		var userId = security.getCurrentUserId(),
			currentUser = security.getCurrentUser(),
			shoppinglist = [];
		var shoppinglistGateWay = ShoppingList.getGateway();
		// public properties -------------------------------------------------------------
		$scope.isGuest = security.isGuestMode();
		$scope.cats = null;
		$scope.notes = [];
		$scope.newNote = {
			note: ''
		};
		$scope.emailPopup =  {
			email: currentUser ? currentUser.UserEmail: ''
		};
		$scope.mode = "view";
		$scope.enableShoppingList = !security.isGuestMode();
		$scope.userShoppingListName = null;
		// scope properties -------------------------------------------------------------
		// private method -------------------------------------------------------------
		function init(){
			

		}
		
		// Init -------------------------------------------------------------
		init();
		//loadActivedShoppingList();
		MCMTracker.trackView('MySale');		
	}
])
.controller('CreateSaleCtrl', ['$scope', '$q', 'security','APP_CONFIG', '$ionicLoading', '$ionicPopup', '$cordovaImagePicker','$cordovaCamera',
	function($scope, $q, security, APP_CONFIG, $ionicLoading, $ionicPopup,$cordovaImagePicker,$cordovaCamera) {
		
		// private properties -------------------------------------------------------------
		
		// public properties -------------------------------------------------------------
		
		// scope properties -------------------------------------------------------------
		
		// private method -------------------------------------------------------------
		var init = function(){
			var pickerOptions = {
			   		maximumImagesCount: 10,
				   	width: 800,
				   	height: 800,
				   	quality: 80
			};
			/*
			$cordovaImagePicker.getPictures(pickerOptions)
			    .then(function (results) {
			      for (var i = 0; i < results.length; i++) {
			        console.log('Image URI: ' + results[i]);
			      }
			    }, function(error) {
			      // error getting photos
			});  
			*/
			$scope.takePhoto = function () {
                  var options = {
                    quality: 75,
                    destinationType: Camera.DestinationType.DATA_URL,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: false
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageData) {
                        $scope.imgURI = "data:image/jpeg;base64," + imageData;
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
            };
                
            $scope.choosePhoto = function () {
              var options = {
                quality: 75,
                destinationType: Camera.DestinationType.DATA_URL,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: true,
                encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            	};

                $cordovaCamera.getPicture(options).then(function (imageData) {
                    $scope.imgURI = "data:image/jpeg;base64," + imageData;
                }, function (err) {
                    // An error occured. Show a message to the user
                });
            };
		};

		init();
	}
]);