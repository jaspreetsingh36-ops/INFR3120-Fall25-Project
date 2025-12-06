// Frontend/controllers/homeController.js

app.controller('HomeController', function($scope, AuthService) {
  $scope.title = 'Welcome to AutoRent';
  $scope.subtitle = 'Use the navigation bar to browse cars, login, or register.';

  $scope.isAuthenticated = false;

  // Optional: adjust home view depending on auth
  AuthService.me().then(function(user) {
    $scope.isAuthenticated = !!user;
  });
});
