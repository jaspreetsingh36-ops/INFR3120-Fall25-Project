// Frontend/controllers/loginController.js

app.controller('LoginController', function($scope, $location, AuthService) {
  $scope.formData = {};
  $scope.error = '';

  $scope.login = function() {
    $scope.error = '';

    AuthService.login($scope.formData)
      .then(function() {
        // Redirect to cars page after successful login
        $location.path('/cars');
      })
      .catch(function(err) {
        $scope.error = (err.data && err.data.message) || 'Login failed. Please check your email and password.';
      });
  };
});
