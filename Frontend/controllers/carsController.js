// Frontend/controllers/carsController.js

app.controller('CarsController', function($scope, CarService, AuthService) {
  $scope.cars = [];
  $scope.error = '';
  $scope.isAuthenticated = false;

  function refreshAuth() {
    AuthService.me().then(function(user) {
      $scope.isAuthenticated = !!user;
    });
  }

  function loadCars() {
    $scope.error = '';
    CarService.getAll()
      .then(function(res) {
        $scope.cars = res.data;
      })
      .catch(function(err) {
        console.error(err);
        $scope.error = 'Failed to load cars.';
      });
  }

  $scope.deleteCar = function(id) {
    if (!confirm('Are you sure you want to delete this car?')) {
      return;
    }

    CarService.remove(id)
      .then(function() {
        loadCars();
      })
      .catch(function(err) {
        console.error(err);
        $scope.error = (err.data && err.data.message) || 'Failed to delete car.';
      });
  };

  // Initial loads
  refreshAuth();
  loadCars();
});
