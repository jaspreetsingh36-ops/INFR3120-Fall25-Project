// Frontend/services/carService.js

app.factory('CarService', function($http) {
    // For local dev; change to your Render URL when deployed
    var baseUrl = 'http://localhost:3000';
  
    return {
      getAll: function() {
        return $http.get(baseUrl + '/api/cars');
      },
      getOne: function(id) {
        return $http.get(baseUrl + '/api/cars/' + id);
      },
      create: function(car) {
        return $http.post(baseUrl + '/api/cars', car, { withCredentials: true });
      },
      update: function(id, car) {
        return $http.put(baseUrl + '/api/cars/' + id, car, { withCredentials: true });
      },
      remove: function(id) {
        return $http.delete(baseUrl + '/api/cars/' + id, { withCredentials: true });
      }
    };
  });
  