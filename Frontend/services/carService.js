// Frontend/services/carService.js

app.factory('CarService', function($http, AuthService) {
  // Backend API base URL
  var API_BASE = (function() {
    if (window.location.hostname === 'localhost') {
      // Local dev: backend serves frontend on same origin
      // so '/api/cars' hits http://localhost:3000/api/cars
      return '';
    }
    // Deployed frontend on Vercel -> call deployed backend on Vercel
    return 'https://backend-gamma-eight-27.vercel.app';
  })();

  function authHeaders() {
    const token = AuthService.getToken();
    return token ? { Authorization: 'Bearer ' + token } : {};
  }

  return {
    getAll: function() {
      return $http.get(API_BASE + '/api/cars');
    },

    getOne: function(id) {
      return $http.get(API_BASE + '/api/cars/' + id);
    },

    create: function(car) {
      return $http.post(API_BASE + '/api/cars', car, {
        headers: authHeaders()
      });
    },

    update: function(id, car) {
      return $http.put(API_BASE + '/api/cars/' + id, car, {
        headers: authHeaders()
      });
    },

    remove: function(id) {
      return $http.delete(API_BASE + '/api/cars/' + id, {
        headers: authHeaders()
      });
    }
  };
});
