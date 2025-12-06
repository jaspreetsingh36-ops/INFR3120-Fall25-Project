// Frontend/controllers/navbarController.js

app.controller('NavbarController', function($scope, AuthService) {
  $scope.isAuthenticated = false;
  $scope.currentUser = {};

  function refreshUser() {
    AuthService.me().then(function(user) {
      if (user) {
        $scope.isAuthenticated = true;
        $scope.currentUser = user;
      } else {
        $scope.isAuthenticated = false;
        $scope.currentUser = {};
      }
    });
  }

  // Run on load
  refreshUser();

  $scope.logout = function() {
    AuthService.logout().then(function() {
      refreshUser();
      window.location.hash = '#!/login';
    });
  };
});
