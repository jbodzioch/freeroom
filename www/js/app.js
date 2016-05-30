// Ionic Starter App

// angular.module is a global place for creating, registering and retrieving Angular modules
// 'starter' is the name of this angular module example (also set in a <body> attribute in index.html)
// the 2nd parameter is an array of 'requires'
angular.module('startrer', ['ionic', 'ngCordovaBeacon'])

.run(function ($ionicPlatform) {
 
  $ionicPlatform.ready(function () {
 
    if (window.cordova && window.cordova.plugins.Keyboard) {
      // Hide the accessory bar by default (remove this to show the accessory bar above the keyboard
      // for form inputs)
      cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);

      // Don't remove this line unless you know what you are doing. It stops the viewport
      // from snapping when text inputs are focused. Ionic handles this internally for
      // a much nicer keyboard experience.
      cordova.plugins.Keyboard.disableScroll(true);
    }
    if (window.StatusBar) {
      StatusBar.styleDefault();
    }
  });
})


.controller("MainCtrl", function ($scope, $rootScope, $ionicPlatform, $cordovaBeacon, $http) {
            
            var rangingBeacons = [];
            var buildingBeacons = [];
    $scope.showRefresh = false;
    $scope.refreshButtonContent = "Refresh";
    $scope.messageText = "Something";
            $scope.rooms = [
               {name: "First"},
               {name: "Second"},
               {name: "Third"}
            ];
    
    $scope.reserve = function (room) {
        alert('Reserved Room: ' + room.name);
    };
    
    $scope.refreshClickFunction = function () {
        alert('Refreshed');
        $scope.requestBuildingBeacons();
    };

            //TODO: get beacons from LAZM server
            //simple mockup for http communication
            $scope.requestBuildingBeacons = function () {
            $http({
             method: 'GET',
             url: 'http://jsonplaceholder.typicode.com/posts'
//            url: 'http://www.dsadasdasdasd.pl/'
             }).then(function successCallback(response) {
             // this callback will be called asynchronously
             // when the response is available
                     console.log("HTTP GET SUCCESS");
                     /*for(var i = 0; i < response.data.length; i++) {
                        console.log("titile "+i+": "+response.data[i].title);
                     }*/
                     //here we set statically buildingBeacons - that data should come from server - format yet unknown
                     
                     buildingBeacons = [];
                     buildingBeacons.push({"uuid": "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0", "level": "6", "room": "6.14"});
                     buildingBeacons.push({"uuid": "5A4BCFCE-174E-4BAC-A814-092E77F6B7E5", "level": "6", "room": "6.34"});
                     buildingBeacons.push({"uuid": "74278BDA-B644-4520-8F0C-720EAF059935", "level": "5", "room": "5.4"});
                     
                     //TODO: save to file or update the file when it exists
                     
                     
             }, function errorCallback(response) {
                $scope.messageText = "HTTP error";
                $scope.showRefresh = true;
             // called asynchronously if an error occurs
             // or server returns response with an error status.
             //TODO: handle this error properly
             console.log("HTTP GET ERR");
             });
            };
            $scope.requestBuildingBeacons();
            
            //TODO: get nearest avaliable rooms based on beacons
            $scope.getFreeRooms = function () {
                $scope.rooms = [];
                //console.log("getFreeRooms buildingBeacons "+buildingBeacons.length);
                //console.log("getFreeRooms rangingBeacons "+rangingBeacons.length);
                //assign test results only if any beacons around and when we know the building beacons
                if (rangingBeacons.length > 0 && buildingBeacons.length > 0) {
                    $scope.rooms.push({ name: "CPort", video: true});
                    $scope.rooms.push({ name: "Cherry", video: true});
                    $scope.rooms.push({ name: "Plum", video: false});
                }
            };
            
            
            
           
            $ionicPlatform.ready(function() {
                                 $cordovaBeacon.requestWhenInUseAuthorization();
                                 
                                 //called for every ranged region (can be many regions, each with many beacons)
                                 $rootScope.$on("$cordovaBeacon:didRangeBeaconsInRegion", function(event, pluginResult) {
 
                                                //Filter out beacons from this region (based on uuid), so they dont double in the rangingBeacons array
                                                var filteredBeacons = [];
                                                for(var i = 0; i < rangingBeacons.length; i++) {
                                                        if(rangingBeacons[i].uuid != pluginResult.region.uuid){
                                                        filteredBeacons.push(rangingBeacons[i]);
                                                    }
                                                }
                                                 rangingBeacons = filteredBeacons;
                                                
                                                //add beacons from the scanned region
                                                for(var i = 0; i < pluginResult.beacons.length; i++) {
                                                    rangingBeacons.push(pluginResult.beacons[i]);
                                                }
                                                
                                                console.log("didRangeBeaconsInRegion current number of ranging beacons  "+rangingBeacons.length);
                                                //console.log("didRangeBeaconsInRegion buildingBeacons "+buildingBeacons.length);
                                                $scope.getFreeRooms();
                                                $scope.$apply();
                                                
                                                
                                                });
                                 
                                 $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("region1", "E2C56DB5-DFFB-48D2-B060-D0F5A71096E0"));
                                 $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("region2", "5A4BCFCE-174E-4BAC-A814-092E77F6B7E5"));
                                 $cordovaBeacon.startRangingBeaconsInRegion($cordovaBeacon.createBeaconRegion("region3", "74278BDA-B644-4520-8F0C-720EAF059935"));
                                 
                                 });
            });