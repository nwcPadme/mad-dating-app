angular.module("mad_dating_app", ["ngCordova","ionic","ionMdInput","ionic-material","ion-datetime-picker","ionic.rating","utf8-base64","angular-md5","chart.js","pascalprecht.translate","tmh.dynamicLocale","ionicLazyLoad","mad_dating_app.controllers", "mad_dating_app.services"])
	.run(function($ionicPlatform,$window,$interval,$timeout,$ionicHistory,$ionicPopup,$state,$rootScope){

		$rootScope.appName = "Mad Dating App" ;
		$rootScope.appLogo = "data/images/header/logo.png" ;
		$rootScope.appVersion = "1.0" ;
		$rootScope.headerShrink = false ;

		$rootScope.liveStatus = "pause" ;
		$ionicPlatform.ready(function(){
			$rootScope.liveStatus = "run" ;
		});
		$ionicPlatform.on("pause",function(){
			$rootScope.liveStatus = "pause" ;
		});
		$ionicPlatform.on("resume",function(){
			$rootScope.liveStatus = "run" ;
		});


		$rootScope.hide_menu_bal = false ;
		$rootScope.hide_menu_prem = false ;
		$rootScope.hide_menu_search = false ;
		$rootScope.hide_menu_match = false ;
		$rootScope.hide_menu_poset = false ;
		$rootScope.hide_menu_likes = false ;
		$rootScope.hide_menu_liked = false ;
		$rootScope.hide_menu_disliked = false ;
		$rootScope.hide_menu_settings = false ;


		$ionicPlatform.ready(function() {

			localforage.config({
				driver : [localforage.WEBSQL,localforage.INDEXEDDB,localforage.LOCALSTORAGE],
				name : "mad_dating_app",
				storeName : "mad_dating_app",
				description : "The offline datastore for Mad Dating App app"
			});

			if(window.cordova){
				$rootScope.exist_cordova = true ;
			}else{
				$rootScope.exist_cordova = false ;
			}
			//required: cordova plugin add ionic-plugin-keyboard --save
			if(window.cordova && window.cordova.plugins.Keyboard) {
				cordova.plugins.Keyboard.hideKeyboardAccessoryBar(true);
				cordova.plugins.Keyboard.disableScroll(true);
			}

			//required: cordova plugin add cordova-plugin-statusbar --save
			if(window.StatusBar) {
				StatusBar.styleDefault();
			}

			//required: cordova plugin add cordova-plugin-network-information --save
			$interval(function(){
				if ( typeof navigator == "object" && typeof navigator.connection != "undefined"){
					var networkState = navigator.connection.type;
					$rootScope.is_online = true ;
					if (networkState == "none") {
						$rootScope.is_online = false ;
						$window.location = "retry.html";
					}
				}
			}, 5000);

		});
		$ionicPlatform.registerBackButtonAction(function (e){
			if($ionicHistory.backView()){
				$ionicHistory.goBack();
			}else{
				$state.go("mad_dating_app.mad_date");
			}
			e.preventDefault();
			return false;
		},101);
	})


	.filter("to_trusted", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])

	.filter("trustUrl", function($sce) {
		return function(url) {
			return $sce.trustAsResourceUrl(url);
		};
	})

	.filter("trustJs", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsJs(text);
		};
	}])

	.filter("strExplode", function() {
		return function($string,$delimiter) {
			if(!$string.length ) return;
			var $_delimiter = $delimiter || "|";
			return $string.split($_delimiter);
		};
	})

	.filter("strDate", function(){
		return function (input) {
			return new Date(input);
		}
	})
	.filter("phpTime", function(){
		return function (input) {
			var timeStamp = parseInt(input) * 1000;
			return timeStamp ;
		}
	})
	.filter("strHTML", ["$sce", function($sce){
		return function(text) {
			return $sce.trustAsHtml(text);
		};
	}])
	.filter("strEscape",function(){
		return window.encodeURIComponent;
	})
	.filter("strUnscape", ["$sce", function($sce) {
		var div = document.createElement("div");
		return function(text) {
			div.innerHTML = text;
			return $sce.trustAsHtml(div.textContent);
		};
	}])

	.filter("stripTags", ["$sce", function($sce){
		return function(text) {
			return text.replace(/(<([^>]+)>)/ig,"");
		};
	}])

	.filter("chartData", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if ((indeks !== 0) && (indeks !== 1)){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})

	.filter("chartLabels", function(){
		return function (obj){
			var new_item = [];
			angular.forEach(obj, function(child) {
			var indeks = 0;
			new_item = [];
			angular.forEach(child, function(v,l) {
				if ((indeks !== 0) && (indeks !== 1)) {
					new_item.push(l);
				}
				indeks++;
			});
			});
			return new_item;
		}
	})
	.filter("chartSeries", function(){
		return function (obj) {
			var new_items = [];
			angular.forEach(obj, function(child) {
				var new_item = [];
				var indeks = 0;
				angular.forEach(child, function(v){
						if (indeks === 1){
							new_item.push(v);
						}
						indeks++;
					});
					new_items.push(new_item);
				});
			return new_items;
		}
	})



.config(["$translateProvider", function ($translateProvider){
	$translateProvider.preferredLanguage("en-us");
	$translateProvider.useStaticFilesLoader({
		prefix: "translations/",
		suffix: ".json"
	});
	$translateProvider.useSanitizeValueStrategy("escapeParameters");
}])


.config(function(tmhDynamicLocaleProvider){
	tmhDynamicLocaleProvider.localeLocationPattern("lib/ionic/js/i18n/angular-locale_{{locale}}.js");
	tmhDynamicLocaleProvider.defaultLocale("en-us");
})


.config(function($stateProvider, $urlRouterProvider,$sceDelegateProvider,$httpProvider,$ionicConfigProvider){
	try{
		// Domain Whitelist
		$sceDelegateProvider.resourceUrlWhitelist([
			"self",
			new RegExp('^(http[s]?):\/\/(w{3}.)?youtube\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?w3schools\.com/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?mad\-date\.mad\-agency\.xyz/.+$'),
			new RegExp('^(http[s]?):\/\/(w{3}.)?mad\-agency\.xyz/.+$'),
		]);
	}catch(err){
		console.log("%cerror: %cdomain whitelist","color:blue;font-size:16px;","color:red;font-size:16px;");
	}
	$stateProvider
	.state("mad_dating_app",{
		url: "/mad_dating_app",
			abstract: true,
			templateUrl: "templates/mad_dating_app-side_menus.html",
			controller: "side_menusCtrl",
	})

	.state("mad_dating_app.about_us", {
		url: "/about_us",
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-about_us.html",
						controller: "about_usCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_dating_app.bal", {
		url: "/bal",
		cache:false,
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-bal.html",
						controller: "balCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_dating_app.dashboard", {
		url: "/dashboard",
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-dashboard.html",
						controller: "dashboardCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_dating_app.disliked", {
		url: "/disliked",
		cache:false,
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-disliked.html",
						controller: "dislikedCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_dating_app.liked", {
		url: "/liked",
		cache:false,
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-liked.html",
						controller: "likedCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_dating_app.likes", {
		url: "/likes",
		cache:false,
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-likes.html",
						controller: "likesCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_dating_app.mad_date", {
		url: "/mad_date",
		cache:false,
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-mad_date.html",
						controller: "mad_dateCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_dating_app.match", {
		url: "/match",
		cache:false,
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-match.html",
						controller: "matchCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_dating_app.poset", {
		url: "/poset",
		cache:false,
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-poset.html",
						controller: "posetCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_dating_app.prem", {
		url: "/prem",
		cache:false,
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-prem.html",
						controller: "premCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_dating_app.search", {
		url: "/search",
		cache:false,
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-search.html",
						controller: "searchCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	.state("mad_dating_app.settings", {
		url: "/settings",
		cache:false,
		views: {
			"mad_dating_app-side_menus" : {
						templateUrl:"templates/mad_dating_app-settings.html",
						controller: "settingsCtrl"
					},
			"fabButtonUp" : {
						template: '',
					},
		}
	})

	$urlRouterProvider.otherwise("/mad_dating_app/mad_date");
});
