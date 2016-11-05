angular.module('Oceo.MySale', [
	'OceoECommerce.Resource.Sale',
	'OceoECommerce.Sheet',
	'OceoECommerce.Push',
	'ui.utils.masks',
	'OceoECommerce.Utils',
	'vsGoogleAutocomplete',	

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
.controller('CreateSaleCtrl', ['$scope', '$q', 'security','Sale','APP_CONFIG','MapUtil', '$cordovaFileTransfer','$ionicLoading', '$ionicPopup', '$cordovaImagePicker','$cordovaCamera',
	function($scope, $q, security,Sale, APP_CONFIG,MapUtil, $cordovaFileTransfer,$ionicLoading, $ionicPopup,$cordovaImagePicker,$cordovaCamera) {
		
		// private properties -------------------------------------------------------------
		var userId = security.getCurrentUserId(),
			currentUser = security.getCurrentUser();
		console.log('UserID:' + userId);
		// public properties -------------------------------------------------------------
		
		// scope properties -------------------------------------------------------------
		$scope.images = [];
		$scope.newsale = {}
		$scope.autoAddress = {
			    name: '',
			    place:'',
			    components: {
			      placeId: '',
			      streetNumber: '', 
			      street: '',
			      city: '',
			      state: '',
			      countryCode: '',
			      country: '',
			      postCode: '',
			      district: '',
			      location: {
			        lat: '',
			        long: ''
			      }
			    }
			  };
		var currentLocation = {};
		MapUtil.getLocation().then(function(data){
			console.log('currentLocation');
			currentLocation.lat = data.coords.latitude;
			currentLocation.long = data.coords.longitude;
		});
		
		
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
           $scope.onAddressChange = function(event){
           	
                    setTimeout(function() {
                       if(!$scope.autoAddress.components.placeId )
                       {
	                       $scope.newsale.Address='';
	                       $ionicPopup.alert({
	                                         title: 'Thông báo',
	                                         template: 'Xin hãy chọn một địa chỉ trong danh sách!'
	                                         });	
	                       }
                       }, 2000);
           
           };
            $scope.disableTap = function(){
			    container = document.getElementsByClassName('pac-container');
			    // disable ionic data tab
			    angular.element(container).attr('data-tap-disabled', 'true');
			    // leave input field if google-address-entry is selected
			    angular.element(container).on("click", function(){
			        document.getElementById('ProductAddress').blur();
			    });
			  };
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
				if($scope.autoAddress && $scope.autoAddress.components && $scope.autoAddress.components.placeId )
				{
					$scope.newsale.Address = $scope.autoAddress.components.streetNumber + ' ' + $scope.autoAddress.components.street;
					$scope.newsale.District = $scope.autoAddress.components.district;
					$scope.newsale.City = $scope.autoAddress.components.city;
					$scope.newsale.Country = $scope.autoAddress.components.countryCode;
					$scope.newsale.Zipcode = $scope.autoAddress.components.postCode;
					$scope.newsale.GPlaceID = $scope.autoAddress.components.placeId;
					$scope.newsale.Latitue = $scope.autoAddress.components.location.lat;
					$scope.newsale.Longitude=$scope.autoAddress.components.location.long

				}
				else
				{
					$scope.newsale.Latitue = currentLocation.lat;
					$scope.newsale.Longitude = currentLocation.long;
				}
				$scope.newsale.SellerID = userId;
				$scope.newsale.SocialType = currentUser.SocialWeb;
				$ionicLoading.show();
				return Sale.addSale($scope.newsale)
				.then(function(res){
					$ionicLoading.hide();
					$scope.newsale= {};		
					$ionicPopup.alert({
					     title: '',
					     template: 'Đăng tin bán sản phẩm thành công!'
					});	
				});
				
			};
		};

		init();
	}
]);
