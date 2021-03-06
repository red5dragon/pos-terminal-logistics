(function() {
  angular.module("pos-terminal-ligistics.destination.department", ["ui.router", "connect"]).config([
    "$stateProvider", function($stateProvider) {
      return $stateProvider.state("menu.type.destination.switcher.department", {
        url: "/department",
        abstract: true,
        templateUrl: "app/destination/department/destination.department.html",
        controller: "departmentController",
        resolve: {
          cities: [
            "$stateParams", "connect", "$q", function($stateParams, connect, $q) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/post-office/city",
                params: {
                  limit: 1
                }
              }).then(function(data) {
                return setTimeout(function() {
                  return defer.resolve([
                    data, {
                      current_count: data.length
                    }
                  ]);
                }, 0);
              });
              return defer.promise;
            }
          ],
          postoffices: [
            "$stateParams", "$filter", "connect", "$q", function($stateParams, $filter, connect, $q) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/post-office/postoffices",
                params: {
                  limit: 1
                }
              }).then(function(data) {
                return setTimeout(function() {
                  return defer.resolve([
                    data, {
                      current_count: data.length
                    }
                  ]);
                }, 0);
              });
              return defer.promise;
            }
          ]
        }
      }).state("menu.type.destination.switcher.department.city", {
        url: "/city",
        abstract: true,
        templateUrl: "app/destination/department/destination.department.cities.html"
      }).state("menu.type.destination.switcher.department.city.list", {
        url: "/:page?find?count?limit?pages",
        templateUrl: "app/destination/department/destination.department.cities.list.html",
        controller: "departmentCitiesController",
        resolve: {
          cities: [
            "$stateParams", "connect", "$q", "$filter", function($stateParams, connect, $q, $filter) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/post-office/city",
                params: {
                  limit: 1
                }
              }).then(function(data) {
                var filtered;
                filtered = $filter("filter")(data, $stateParams.find);
                return setTimeout(function() {
                  return defer.resolve([
                    filtered.slice(($stateParams.page - 1) * $stateParams.limit, $stateParams.page * $stateParams.limit), {
                      current_count: data.length
                    }
                  ]);
                }, 0);
              });
              return defer.promise;
            }
          ]
        }
      }).state("menu.type.destination.switcher.department.postoffice", {
        url: "/postoffice",
        abstract: true,
        templateUrl: "app/destination/department/destination.department.postoffice.html"
      }).state("menu.type.destination.switcher.department.postoffice.list", {
        url: "/:page?find?count?limit?pages",
        templateUrl: "app/destination/department/destination.department.postoffice.list.html",
        controller: "departmentPostofficeController",
        resolve: {
          postoffices: [
            "$stateParams", "$filter", "connect", "$q", function($stateParams, $filter, connect, $q) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/post-office/postoffices"
              }).then(function(data) {
                var filtered;
                filtered = $filter("filter")(data, $stateParams.find);
                return setTimeout(function() {
                  return defer.resolve([
                    filtered.slice(($stateParams.page - 1) * $stateParams.limit, $stateParams.page * $stateParams.limit), {
                      current_count: data.length
                    }
                  ]);
                }, 0);
              });
              return defer.promise;
            }
          ]
        }
      }).state("menu.type.destination.switcher.department.incity", {
        url: "/:city/postoffice",
        abstract: true,
        views: {
          "switcher@": {
            template: ""
          },
          "": {
            templateUrl: "app/destination/department/destination.department.postoffice.html"
          }
        }
      }).state("menu.type.destination.switcher.department.incity.list", {
        url: "/:page?find?pages?count?limit",
        templateUrl: "app/destination/department/destination.department.postoffice.list.html",
        controller: "departmentInCityController",
        resolve: {
          postoffices: [
            "$stateParams", "$filter", "connect", "$q", function($stateParams, $filter, connect, $q) {
              var defer;
              defer = $q.defer();
              connect({
                method: "GET",
                url: "http://api2.cosmonova.net.ua/post-office/postoffices"
              }).then(function(data) {
                var filtered;
                filtered = $filter("filter")(data, $stateParams.city);
                if ($stateParams.find) {
                  filtered = $filter("filter")(filtered, function(postoffice) {
                    if (postoffice.office_number.indexOf($stateParams.find) !== -1) {
                      return true;
                    }
                  });
                }
                return setTimeout(function() {
                  return defer.resolve([
                    filtered.slice(($stateParams.page - 1) * $stateParams.limit, $stateParams.page * $stateParams.limit), {
                      current_count: filtered.length
                    }
                  ]);
                }, 0);
              });
              return defer.promise;
            }
          ]
        }
      });
    }
  ]).controller("departmentInCityController", [
    "$rootScope", "$scope", "$state", "postoffices", function($rootScope, $scope, $state, postoffices) {
      $scope.breadcrumbs.push({
        state: $state.current
      });
      $scope.breadcrumbs.search = true;
      $scope.$watch(function() {
        return $state.$current.locals.globals.postoffices;
      }, function(postoffices) {
        if (postoffices) {
          $scope.postoffices = postoffices[0];
          return $state.go($state.current, {
            count: postoffices[1].current_count
          });
        }
      });
      return $scope.$watch("postofficesLimit", function(postofficesLimit, lastpostofficesLimit) {
        if (postofficesLimit && postofficesLimit !== lastpostofficesLimit) {
          $scope.animation = "";
          return $state.go($state.current, {
            limit: postofficesLimit,
            pages: Math.ceil(postoffices[1].current_count / postofficesLimit)
          });
        }
      });
    }
  ]).controller("departmentCitiesController", [
    "$rootScope", "$scope", "$state", "cities", function($rootScope, $scope, $state, cities) {
      $scope.breadcrumbs.length = 0;
      $scope.breadcrumbs.search = true;
      $scope.$watch(function() {
        return $state.$current.locals.globals.cities;
      }, function(cities) {
        if (cities) {
          $scope.cities = cities[0];
          return $state.go("menu.type.destination.switcher.department.city.list", {
            count: cities[1].current_count
          });
        }
      });
      return $scope.$watch("citiesLimit", function(citiesLimit, lastCitiesLimit) {
        if (citiesLimit && citiesLimit !== lastCitiesLimit) {
          $scope.animation = "";
          return $state.go("menu.type.destination.switcher.department.city.list", {
            limit: citiesLimit
          });
        }
      });
    }
  ]).controller("departmentPostofficeController", [
    "$rootScope", "$scope", "$state", "postoffices", function($rootScope, $scope, $state, postoffices) {
      $scope.breadcrumbs.length = 0;
      $scope.breadcrumbs.search = true;
      $scope.$watch(function() {
        return $state.$current.locals.globals.postoffices;
      }, function(postoffices) {
        if (postoffices) {
          return $scope.postoffices = postoffices[0];
        }
      });
      return $scope.$watch("postofficesLimit", function(postofficesLimit, lastpostofficesLimit) {
        if (postofficesLimit && postofficesLimit !== lastpostofficesLimit) {
          $scope.animation = "";
          return $state.go($state.current, {
            limit: postofficesLimit
          });
        }
      });
    }
  ]).controller("departmentController", [
    "$rootScope", "$scope", "$state", "$filter", "cities", "postoffices", function($rootScope, $scope, $state, $filter, cities, postoffices) {
      $scope.breadcrumbs = new Array;
      $scope.root = function() {
        if ($scope.breadcrumbs.search) {
          return $scope.breadcrumbs.search = false;
        } else {
          return $state.go("menu.type.destination.switcher.department.city.list", {
            page: 1
          });
        }
      };
      $scope.searchActivator = function() {
        if ($scope.breadcrumbs.length && !$scope.breadcrumbs.search) {
          return $scope.breadcrumbs.search = true;
        }
      };
      $scope.go = function(next) {
        var page;
        if (next) {
          $scope.animation = "right";
          if ($rootScope.$stateParams.page < $rootScope.$stateParams.pages) {
            page = ~~$rootScope.$stateParams.page + 1;
          } else {
            page = 1;
          }
        } else {
          $scope.animation = "left";
          if ($rootScope.$stateParams.page > 1) {
            page = ~~$rootScope.$stateParams.page - 1;
          } else {
            page = $rootScope.$stateParams.pages;
          }
        }
        return $state.go($state.current, {
          page: page
        });
      };
      return $scope.$watch("searchString", function(searchString) {
        var actualPostOffices, cityName, matchedCities, matchingPostOffices, postOfficeName;
        if (!/^\s+$/.test(searchString)) {
          if (searchString) {
            if (/^\D+$/.test(searchString)) {
              console.log("city");
              $scope.matchedPostOffices = null;
              matchedCities = $filter("filter")(cities[0], searchString.replace(/\s+$/, ""));
              if (matchedCities.length === 1 && /\s+$/.test(searchString)) {
                $scope.searchString = matchedCities[0].name + " ";
                $scope.matchedCities = null;
                return $state.go("menu.type.destination.switcher.department.incity.list", {
                  page: 1,
                  pages: 1,
                  find: null,
                  city: searchString.replace(/\s+$/, "")
                });
              } else {
                $scope.matchedCities = matchedCities;
                $scope.searchString = searchString;
                return $state.go("menu.type.destination.switcher.department.city.list", {
                  page: 1,
                  pages: 1,
                  find: searchString.replace(/\s+$/, "")
                });
              }
            } else if (/^\d+$/.test(searchString) || /^\d+\s+$/.test(searchString)) {
              console.log("postOffice");
              matchingPostOffices = $filter("filter")(postoffices[0], searchString.replace(/\s+$/, ""));
              if (matchingPostOffices.length === 1 && /\s+$/.test(searchString)) {
                $scope.searchString = matchingPostOffices[0].office_number;
                return $scope.matchedPostOffices = null;
              } else {
                $scope.matchedPostOffices = matchingPostOffices;
                return $state.go("menu.type.destination.switcher.department.postoffice.list", {
                  page: 1,
                  pages: 1,
                  find: searchString
                });
              }
            } else if (/^\D+\s[0-9]{0,}$/.test(searchString) || /^\D+\s[0-9]{0,}\s+$/.test(searchString)) {
              console.log("city and postOffice");
              cityName = /\D+/.exec(searchString);
              postOfficeName = /\d+/.exec(searchString);
              actualPostOffices = $filter("filter")(postoffices[0], cityName[0].replace(/\s+$/, ""));
              matchingPostOffices = $filter("filter")(actualPostOffices, function(postoffice) {
                if (postoffice.office_number.indexOf(postOfficeName[0].replace(/\s+$/, "")) !== -1) {
                  return true;
                }
              });
              if (matchingPostOffices.length === 1 && /\s+$/.test(searchString)) {
                $scope.searchString = cityName + matchingPostOffices[0].office_number;
                $scope.matchedPostOffices = null;
              } else {
                $scope.matchedPostOffices = matchingPostOffices;
              }
              return $state.go("menu.type.destination.switcher.department.incity.list", {
                city: cityName[0].replace(/\s+$/, ""),
                page: 1,
                pages: 1,
                find: postOfficeName[0].replace(/\s+$/, "")
              });
            } else {
              $scope.matchedCities = null;
              $scope.matchedPostOffices = null;
              return $state.go("menu.type.destination.switcher.department.city.list", {
                page: 1,
                pages: 1,
                find: null
              });
            }
          } else {
            $scope.matchedCities = null;
            $scope.matchedPostOffices = null;
            return $state.go("menu.type.destination.switcher.department.city.list", {
              page: 1,
              pages: 1,
              find: null
            });
          }
        } else {
          return $state.go("menu.type.destination.switcher.department.city.list", {
            page: 1,
            pages: 1,
            find: null
          });
        }
      });
    }
  ]);

}).call(this);
