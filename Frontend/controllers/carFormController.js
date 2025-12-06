// Frontend/controllers/carFormController.js

app.controller('CarFormController', function($scope, $routeParams, $location, CarService) {
  $scope.car = {};
  $scope.isEdit = !!$routeParams.id;
  $scope.error = '';

  function loadCar() {
    if (!$scope.isEdit) return;

    CarService.getOne($routeParams.id)
      .then(function(res) {
        $scope.car = res.data;
      })
      .catch(function(err) {
        console.error(err);
        $scope.error = 'Failed to load car details.';
      });
  }

  $scope.saveCar = function() {
    $scope.error = '';

    if ($scope.isEdit) {
      // Update existing car
      CarService.update($routeParams.id, $scope.car)
        .then(function() {
          $location.path('/cars');
        })
        .catch(function(err) {
          console.error(err);
          $scope.error = (err.data && err.data.message) || 'Failed to update car.';
        });
    } else {
      // Create new car
      CarService.create($scope.car)
        .then(function() {
          $location.path('/cars');
        })
        .catch(function(err) {
          console.error(err);
          $scope.error = (err.data && err.data.message) || 'Failed to add car.';
        });
    }
  };

  // If editing, load car details on init
  loadCar();
});
