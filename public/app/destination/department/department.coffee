angular.module "pos-terminal-ligistics.destination.department", [
  "ui.router"
  "connect"
]

.config [
  "$stateProvider"
  ($stateProvider) ->

    $stateProvider
      .state "menu.type.destination.switcher.department",
        url: "/department"
        abstract: on
        templateUrl: "app/destination/department/department.html"
        controller: "departmentController"
        resolve:
          cities: [
            "$stateParams", "connect", "$q"
            ($stateParams, connect, $q) ->
    
              defer = $q.defer()
      
              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/post-office/city"
                params:
                  limit: 1
              .then (data) ->
                setTimeout ->
                  defer.resolve [
                      data
                    ,
                      current_count: data.length
                  ]
                , 0

              defer.promise

          ]
          postoffices: [
            "$stateParams", "$filter", "connect", "$q"
            ($stateParams, $filter, connect, $q) ->
    
              defer = $q.defer()
      
              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/post-office/postoffices"
                params:
                  limit: 1
              .then (data) ->
                setTimeout ->
                  defer.resolve [
                      data
                    ,
                      current_count: data.length
                  ]
                , 0
      
              defer.promise
      
          ]
      .state "menu.type.destination.switcher.department.city",
        url: "/city"
        abstract: on
        templateUrl: "app/destination/department/department.cities.html"
      .state "menu.type.destination.switcher.department.city.list",
        url: "/:page?find?count?limit?pages"
        templateUrl: "app/destination/department/department.cities.list.html"
        controller: "departmentCitiesController"
        resolve:
          cities: [
            "$stateParams", "connect", "$q", "$filter"
            ($stateParams, connect, $q, $filter) ->
    
              defer = $q.defer()
      
              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/post-office/city"
                params:
                  limit: 1
              .then (data) ->
                filtered = $filter("filter")(data, $stateParams.find)
                setTimeout ->
                  defer.resolve [
                      filtered.slice ($stateParams.page-1) * $stateParams.limit, $stateParams.page * $stateParams.limit
                    ,
                      current_count: data.length
                  ]
                , 0
      
              defer.promise
      
          ]
      .state "menu.type.destination.switcher.department.postoffice",
        url: "/postoffice"
        abstract: on
        templateUrl: "app/destination/department/department.postoffice.html"
      .state "menu.type.destination.switcher.department.postoffice.list",
        url: "/:page?find?count?limit?pages"
        templateUrl: "app/destination/department/department.postoffice.list.html"
        controller: "departmentPostofficeController"
        resolve:
          postoffices: [
            "$stateParams", "$filter", "connect", "$q"
            ($stateParams, $filter, connect, $q) ->
    
              defer = $q.defer()
      
              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/post-office/postoffices"
              .then (data) ->
                filtered = $filter("filter")(data, $stateParams.find)
                setTimeout ->
                  defer.resolve [
                      filtered.slice ($stateParams.page-1) * $stateParams.limit, $stateParams.page * $stateParams.limit
                    ,
                      current_count: data.length
                  ]
                , 0
      
              defer.promise
          ]
      .state "menu.type.destination.switcher.department.incity",
        url: "/:city/postoffice"
        abstract: on
        views:
          "switcher@":
            template: ""
          "":
            templateUrl: "app/destination/department/department.postoffice.html"
      .state "menu.type.destination.switcher.department.incity.list",
        url: "/:page?find?pages?count?limit"
        templateUrl: "app/destination/department/department.postoffice.list.html"
        controller: "departmentInCityController"
        resolve:
          postoffices: [
            "$stateParams", "$filter", "connect", "$q"
            ($stateParams, $filter, connect, $q) ->
    
              defer = $q.defer()
      
              connect
                method: "GET"
                url: "http://api2.cosmonova.net.ua/post-office/postoffices"
              .then (data) ->
                filtered = $filter("filter")(data, $stateParams.city)
                if $stateParams.find
                  filtered = $filter("filter")(filtered, (postoffice) ->
                    on if postoffice.office_number.indexOf($stateParams.find) isnt -1
                  )
                setTimeout ->
                  defer.resolve [
                      filtered.slice ($stateParams.page-1) * $stateParams.limit, $stateParams.page * $stateParams.limit
                    ,
                      current_count: filtered.length
                  ]
                , 0
      
              defer.promise
          ]

]

.controller "departmentInCityController", [
  "$rootScope", "$scope", "$state", "flexible", "postoffices"
  ($rootScope, $scope, $state, flexible, postoffices) ->

    $scope.breadcrumbs.push
      state: $state.current
    $scope.breadcrumbs.search = on

    flexible [
        width: 1024
        height: 768
        limit: 9
      ,
        width: 1366
        height: 768
        limit: 12
      ,
        width: 1680
        height: 1050
        limit: 20
      ,
        width: 1920
        height: 1200
        limit: 30
    ]

    $scope.$watch ->
      $rootScope.limit
    , (limit) ->
      if limit and limit isnt ~~$rootScope.$stateParams.limit
        $scope.animation = ""
        $state.go $state.current,
            limit: limit
          ,
            notify: off

    $scope.$watch ->
      $state.$current.locals.globals.postoffices
    , (postoffices) ->
      if postoffices
        $scope.postoffices = postoffices[0]

]

.controller "departmentCitiesController", [
  "$rootScope", "$scope", "$state", "cities", "flexible"
  ($rootScope, $scope, $state, cities, flexible) ->

    flexible [
        width: 1024
        height: 768
        limit: 18
      ,
        width: 1366
        height: 768
        limit: 24
      ,
        width: 1680
        height: 1050
        limit: 35
      ,
        width: 1920
        height: 1200
        limit: 48
    ]

    $scope.$watch ->
      $rootScope.limit
    , (limit) ->
      if limit and limit isnt ~~$rootScope.$stateParams.limit
        $scope.animation = ""
        $state.go $state.current,
            limit: limit
          ,
            notify: off

    $scope.breadcrumbs.length = 0
    $scope.breadcrumbs.search = on

    $scope.$watch ->
      $state.$current.locals.globals.cities
    , (cities) ->
      if cities
        $scope.cities = cities[0]
        $rootScope.count = cities[1].current_count

]

.controller "departmentPostofficeController", [
  "$rootScope", "$scope", "$state", "flexible", "postoffices"
  ($rootScope, $scope, $state, flexible, postoffices) ->

    $scope.breadcrumbs.length = 0
    $scope.breadcrumbs.search = on

    flexible [
        width: 1024
        height: 768
        limit: 9
      ,
        width: 1366
        height: 768
        limit: 12
      ,
        width: 1680
        height: 1050
        limit: 20
      ,
        width: 1920
        height: 1200
        limit: 30
    ]

    $scope.$watch ->
      $rootScope.limit
    , (limit) ->
      if limit and limit isnt ~~$rootScope.$stateParams.limit
        $scope.animation = ""
        $state.go $state.current,
            limit: limit
          ,
            notify: off

    $scope.$watch ->
      $state.$current.locals.globals.postoffices
    , (postoffices) ->
      if postoffices
        $scope.postoffices = postoffices[0]

]

.controller "departmentController", [
  "$rootScope", "$scope", "$state", "$filter", "cities", "postoffices"
  ($rootScope, $scope, $state, $filter, cities, postoffices) ->

    $scope.breadcrumbs = new Array

    $scope.root = ->
      if $scope.breadcrumbs.search
        $scope.breadcrumbs.search = off
      else
        $state.go "menu.type.destination.switcher.department.city.list", page: 1

    $scope.searchActivator = ->
      if $scope.breadcrumbs.length and not $scope.breadcrumbs.search
        $scope.breadcrumbs.search = on

    $scope.go = (next) ->
      pages = Math.ceil $rootScope.count / $rootScope.limit
      if next
        $scope.animation = "right"
        if $rootScope.$stateParams.page < pages
          page = ~~$rootScope.$stateParams.page+1
        else
          page = 1
      else
        $scope.animation = "left"
        if $rootScope.$stateParams.page > 1
          page = ~~$rootScope.$stateParams.page-1
        else
          page = pages
      $state.go $state.current, page: page


    $scope.$watch "searchString", (searchString) ->

      unless /^\s+$/.test searchString
    
        if searchString
          if /^\D+$/.test(searchString)
            console.log "city"
            $scope.matchedPostOffices = null
            matchedCities = $filter("filter")(cities[0], searchString.replace /\s+$/, "")
            if matchedCities.length is 1 and /\s+$/.test searchString
              $scope.searchString = matchedCities[0].name + " "
              $scope.matchedCities = null
              $state.go "menu.type.destination.switcher.department.incity.list", page: 1, find: null, city: searchString.replace /\s+$/, ""
            else
              $scope.matchedCities = matchedCities
              $scope.searchString = searchString
              $state.go "menu.type.destination.switcher.department.city.list", page: 1, find: searchString.replace /\s+$/, ""
          else if /^\d+$/.test(searchString) or /^\d+\s+$/.test(searchString)
            console.log "postOffice"
            matchingPostOffices = $filter("filter")(postoffices[0], searchString.replace /\s+$/, "")
            if matchingPostOffices.length is 1 and /\s+$/.test(searchString)
              $scope.searchString = matchingPostOffices[0].office_number
              $scope.matchedPostOffices = null
            else
              $scope.matchedPostOffices = matchingPostOffices
              $state.go "menu.type.destination.switcher.department.postoffice.list", page: 1, find: searchString
          else if /^\D+\s[0-9]{0,}$/.test(searchString) or /^\D+\s[0-9]{0,}\s+$/.test searchString
            console.log "city and postOffice"
            cityName = /\D+/.exec searchString
            postOfficeName = /\d+/.exec searchString
            actualPostOffices = $filter("filter")(postoffices[0], cityName[0].replace /\s+$/, "")
            matchingPostOffices = $filter("filter")(actualPostOffices, (postoffice) ->
              on if postoffice.office_number.indexOf(postOfficeName[0].replace(/\s+$/, "")) isnt -1
            )
            if matchingPostOffices.length is 1 and /\s+$/.test(searchString)
              $scope.searchString = cityName + matchingPostOffices[0].office_number
              $scope.matchedPostOffices = null
            else
              $scope.matchedPostOffices = matchingPostOffices
            $state.go "menu.type.destination.switcher.department.incity.list", city: cityName[0].replace(/\s+$/, ""), page: 1, find: postOfficeName[0].replace(/\s+$/, "")
          else
            $scope.matchedCities = null
            $scope.matchedPostOffices = null
            $state.go "menu.type.destination.switcher.department.city.list", page: 1, find: null
        else
          $scope.matchedCities = null
          $scope.matchedPostOffices = null
          $state.go "menu.type.destination.switcher.department.city.list", page: 1, find: null

      else
        $state.go "menu.type.destination.switcher.department.city.list", page: 1, find: null

]