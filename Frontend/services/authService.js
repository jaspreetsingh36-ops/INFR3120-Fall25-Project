// Frontend/services/authService.js

app.factory('AuthService', function($http, $q) {
  // Backend API base URL
  var API_BASE = (function() {
    if (window.location.hostname === 'localhost') {
      // Local dev: backend serves frontend on same origin
      // e.g. http://localhost:3000/
      return '';
    }
    // Deployed frontend on Vercel -> call deployed backend on Vercel
    return 'https://backend-gamma-eight-27.vercel.app';
  })();

  var TOKEN_KEY = 'autorent_token';
  var USER_KEY = 'autorent_user';

  var currentUser = loadUserFromStorage();

  function loadUserFromStorage() {
    try {
      var stored = localStorage.getItem(USER_KEY);
      return stored ? JSON.parse(stored) : null;
    } catch (e) {
      return null;
    }
  }

  function saveAuth(token, user) {
    localStorage.setItem(TOKEN_KEY, token);
    localStorage.setItem(USER_KEY, JSON.stringify(user));
    currentUser = user;
  }

  function clearAuth() {
    localStorage.removeItem(TOKEN_KEY);
    localStorage.removeItem(USER_KEY);
    currentUser = null;
  }

  return {
    // Register user and store token
    register: function(payload) {
      return $http.post(API_BASE + '/api/auth/register', payload)
        .then(function(res) {
          var data = res.data;
          if (data && data.token && data.user) {
            saveAuth(data.token, data.user);
          }
          return data;
        });
    },

    // Login user and store token
    login: function(credentials) {
      return $http.post(API_BASE + '/api/auth/login', credentials)
        .then(function(res) {
          var data = res.data;
          if (data && data.token && data.user) {
            saveAuth(data.token, data.user);
          }
          return data.user;
        });
    },

    // Logout is just clearing local storage for JWT-based auth
    logout: function() {
      clearAuth();
      return $q.resolve();
    },

    // For Navbar and others: returns current user from memory
    me: function() {
      return $q.resolve(currentUser);
    },

    getCurrentUser: function() {
      return currentUser;
    },

    getToken: function() {
      return localStorage.getItem(TOKEN_KEY);
    }
  };
});
