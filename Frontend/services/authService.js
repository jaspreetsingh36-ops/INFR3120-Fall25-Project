// Frontend/services/authService.js

app.factory('AuthService', function($http) {
    // Local development backend URL.
    // Change to your Render API URL when deployed.
    var baseUrl = 'http://localhost:3000';
  
    var currentUser = null;
  
    // Fetch logged-in user from backend
    function fetchMe() {
      return $http.get(baseUrl + '/api/auth/me', { withCredentials: true })
        .then(function(res) {
          var data = res.data;
  
          // Treat as NOT logged in unless backend returns a real user with properties.
          // Adjust checks based on your backend's user response shape.
          if (!data || data.authenticated === false || (!data.email && !data.name && !data._id)) {
            currentUser = null;
          } else {
            currentUser = data;
          }
  
          return currentUser;
        })
        .catch(function() {
          currentUser = null;
          return null;
        });
    }
  
    return {
      register: function(payload) {
        return $http.post(baseUrl + '/api/auth/register', payload, { withCredentials: true });
      },
  
      login: function(credentials) {
        return $http.post(baseUrl + '/api/auth/login', credentials, { withCredentials: true })
          .then(function() {
            return fetchMe(); // refresh user state after successful login
          });
      },
  
      logout: function() {
        return $http.post(baseUrl + '/api/auth/logout', {}, { withCredentials: true })
          .then(function() {
            currentUser = null;
          });
      },
  
      me: fetchMe,
  
      getCurrentUser: function() {
        return currentUser;
      }
    };
  });
  