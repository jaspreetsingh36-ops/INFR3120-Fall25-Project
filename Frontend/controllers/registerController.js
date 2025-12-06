// Frontend/controllers/registerController.js
app.controller('RegisterController', function($scope, $location, AuthService) {
  $scope.formData = {};
  $scope.error = '';
  $scope.success = '';

  $scope.register = function() {
    $scope.error = '';
    $scope.success = '';

    if ($scope.formData.password !== $scope.formData.confirmPassword) {
      $scope.error = 'Passwords do not match.';
      return;
    }

    var payload = {
      name: $scope.formData.name,
      email: $scope.formData.email,
      password: $scope.formData.password
    };

    AuthService.register(payload)
      .then(function() {
        $scope.success = 'Registration successful! You can now log in.';
        $location.path('/login');
      })
      .catch(function(err) {
        $scope.error = (err.data && err.data.message) || 'Registration failed.';
      });
  };
});
