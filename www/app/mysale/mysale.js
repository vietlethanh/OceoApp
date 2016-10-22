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
.controller('CreateSaleCtrl', ['$scope', '$q', 'security','APP_CONFIG', '$cordovaFileTransfer','$ionicLoading', '$ionicPopup', '$cordovaImagePicker','$cordovaCamera',
	function($scope, $q, security, APP_CONFIG, $cordovaFileTransfer,$ionicLoading, $ionicPopup,$cordovaImagePicker,$cordovaCamera) {
		
		// private properties -------------------------------------------------------------
		var userId = security.getCurrentUserId(),
		// public properties -------------------------------------------------------------
		
		// scope properties -------------------------------------------------------------
		$scope.images = [];
		$scope.newsale = {};
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
                    destinationType: Camera.DestinationType.FILE_URI,
                    sourceType: Camera.PictureSourceType.CAMERA,
                    allowEdit: true,
                    encodingType: Camera.EncodingType.JPEG,
                    targetWidth: 300,
                    targetHeight: 300,
                    popoverOptions: CameraPopoverOptions,
                    saveToPhotoAlbum: true
                };
   
                    $cordovaCamera.getPicture(options).then(function (imageUri) {
                        //$scope.imgURI = "data:image/jpeg;base64," + imageData;
                        $scope.images.push(imageUri);
                    }, function (err) {
                        // An error occured. Show a message to the user
                    });
            };
                
            $scope.choosePhoto = function () {
              var options = {
                quality: 75,
                destinationType: Camera.DestinationType.FILE_URI,
                sourceType: Camera.PictureSourceType.PHOTOLIBRARY,
                allowEdit: false,
                //encodingType: Camera.EncodingType.JPEG,
                targetWidth: 300,
                targetHeight: 300,
                popoverOptions: CameraPopoverOptions,
                saveToPhotoAlbum: false
            	};

                $cordovaCamera.getPicture(options).then(function (imageUri) {
                    //$scope.imgURI = "data:image/jpeg;base64," + imageData;
                    // File name only
				    var filename = imageUri.split("/").pop();
				    console.log(cordova.file.externalRootDirectory);
				    console.log(imageUri);
				     // Destination URL 
     				var url = "http://kookoo.local:8080/bg_sale.php";
				    var options = {
				          fileKey: "file",
				          fileName: filename,
				          chunkedMode: false,
				          mimeType: "image/jpg",
				          params : {'directory':'upload', 'fileName':filename}
				      };
				           
				    $cordovaFileTransfer.upload(url, imageUri, options).then(function (result) {
				          console.log("SUCCESS: " + JSON.stringify(result.response));
				      }, function (err) {
				          console.log("ERROR: " + JSON.stringify(err));
				      }, function (progress) {
				          // PROGRESS HANDLING GOES HERE
				      });
                    $scope.images.push(imageUri);
                }, function (err) {
                    // An error occured. Show a message to the user
                });
            };
            //public method -------------------------------------------------------------
			$scope.save = function(form){
				if(form.invalid){
					return;
				}
				addSale();
			};
			
			var addSale = function($event){
				if(!$scope.newsale){
					return;
				}
				$ionicLoading.show();
				return Sale.addSale($scope.newsale, userId)
				.then(function(res){
					$scope.newsale= {};
							
					//return loadData();
				});
			};
		};

		init();
	}
]);