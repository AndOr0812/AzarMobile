angular.module('starter.controllers', [])

.controller('AppCtrl', function($scope, $ionicModal, $ionicPopup, $state, $window) {
  // Form data for the login modal
  $scope.loginData = {};

  $scope.request = "";

  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/login.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeLogin = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.login = function() {
    $scope.modal.show();
    $scope.loginData.email = "";
    $scope.loginData.password = "";
  };

  //Log in failed
  $scope.showAlert = function() {
    var alertPopup = $ionicPopup.alert({
      title: 'Error',
      template: 'Email address or password is incorrect.'
    });
    alertPopup.then(function(res) {
      $scope.loginData.email = "";
      $scope.loginData.password = "";
    });
  };

  // Perform the login action when the user submits the login form
  $scope.doLogin = function() {
    console.log('Doing login', $scope.loginData);
    var ref = new Firebase("https://azarmobiledev.firebaseio.com");

    ref.authWithPassword({
      email: $scope.loginData.email,
      password: $scope.loginData.password
    }, function(error, authData) {
      if (error) {
        $scope.showAlert();
      } else {
        console.log("Authenticated successfully with payload:", authData);
        $scope.closeLogin();

        if($scope.request="Grades") {
          $scope.showGrades();
        }
      }
    });
  };

  $scope.showGrades = function() {
    var ref = new Firebase("https://azarmobiledev.firebaseio.com");
    var authData = ref.getAuth();

    if (authData) {
      $state.go('app.grades')

    } else {
      console.log("User is logged out");
      $scope.request = "Grades";
      $scope.login();
    }
  };
})

.service('saveNews', function() {
  var savedItem;
  this.setClickedItem = function(item) {
    this.savedItem = item;
  }

  this.getClickItem = function() {
    return this.savedItem;
  }
})

.factory("newsItems", ['$firebaseArray',
  function($firebaseArray) {
    var ref = new Firebase('https://azarmobiledev.firebaseio.com/news');
    return $firebaseArray(ref);
  }
])

.controller('NewsCtrl', ['$scope', 'newsItems', 'saveNews', function($scope, newsItems, saveNews) {
  $scope.items = newsItems;

  $scope.detail = function(item) {
    saveNews.setClickedItem(item);
  }

  $scope.iconClass = function(category) {
    switch (category) {
      case "Cafeteria":
        return "icon ion-fork"
        break;
      case "Graduate":
        return "icon ion-university"
        break;
      default:
        return "icon ion-clipboard"
        break;
    }
  }
}])

.controller('NewsDetailCtrl', ['$scope', 'saveNews', function($scope, saveNews) {
  var item = saveNews.getClickItem();

  $scope.category = item.category;
  $scope.title = item.title;
  $scope.sender = item.sender;
  $scope.date = item.date;
  $scope.message = item.message;
}])

.controller('CourseCtrl', function($scope, $ionicModal) {
  // Create the login modal that we will use later
  $ionicModal.fromTemplateUrl('templates/course.html', {
    scope: $scope
  }).then(function(modal) {
    $scope.modal = modal;
  });

  // Triggered in the login modal to close it
  $scope.closeInfo = function() {
    $scope.modal.hide();
  };

  // Open the login modal
  $scope.courseInfo = function() {
    $scope.modal.show();
  };
})


.controller('GradesCtrl', function($scope) {

})
