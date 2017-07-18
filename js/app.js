

//app.js

angular.module('Autotek', ['ui.router', 'Autotek.controller', 'CoreApi', 'LocalStorageModule', 'Autotek.directive', 'ui.calendar', 'ui.bootstrap'])
        .config(function ($stateProvider, $urlRouterProvider, localStorageServiceProvider) {

            $urlRouterProvider.otherwise('login');
            $stateProvider

                    .state('login', {
                        url: "/login",
                        templateUrl: "/EnglishTemplates/login.html",
                        controller: "LoginCtrl",
                    })
                    .state('logina', {
                        url: "/logina",
                        templateUrl: "/EnglishTemplates/login.html",
                        controller: "LoginCtrl",
                    })
                    .state('logout', {
                        url: "/logout",
                        templateUrl: "/EnglishTemplates/login.html",
                        controller: "LogoutCtrl"
                    })

                    .state('dashboard', {
                        url: "/dashboard",
                        templateUrl: "/EnglishTemplates/dashboard.html",
                        controller: "DashboardApiCtrl",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })
                    .state('salesagents', {
                        url: "/salesagents",
                        templateUrl: "/EnglishTemplates/agents/index.html",
                        controller: "salesAgentsCtrl",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })

                    .state('promotions', {
                        url: "/promotions",
                        templateUrl: "/EnglishTemplates/promotions/index.html",
                        controller: "PromotionCtrl",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })

                    .state('holidays', {
                        url: "/holidays",
                        templateUrl: "/EnglishTemplates/holidays.html",
                        controller: "annualHolidayConrtoller",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })

                    .state('branchsetup', {
                        url: "/branchsetup",
                        templateUrl: "/EnglishTemplates/branchsetup.html",
                        controller: "BranchSetupCtrl",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })

                    .state('appointcalender', {
                        url: "/appointcalender",
                        templateUrl: "/EnglishTemplates/appointcalender.html",
                        controller: "AppointCalenderCtrl",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })

                    .state('scheduleappoint', {
                        url: "/scheduleappoint/:id",
                        templateUrl: "/EnglishTemplates/scheduleappoint.html",
                        controller: "scheduleAppointment",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })
                    .state('servicesetup', {
                        url: "/servicesetup",
                        templateUrl: "/EnglishTemplates/servicesetup.html",
                        controller: "serviceQueryCtrl",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })

                    .state('notifications', {
                        url: "/notifications",
                        templateUrl: "/EnglishTemplates/notifications.html",
                        controller: "notificationCtrl",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })




                    .state('companies', {
                        url: "/companies",
                        templateUrl: "/EnglishTemplates/companies/index.html",
                        controller: "companiesCtrl",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })

                    .state('mobileappusers', {
                        url: "/mobileappusers",
                        templateUrl: "/EnglishTemplates/appusers/index.html",
                        controller: "mobile_app_users_page",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })
                    .state('addMobileUser', {
                        url: "/addMobileUser",
                        templateUrl: "/EnglishTemplates/appusers/manage.html",
                        controller: "addNewAppUser",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })
                    .state('addSalesAgent', {
                        url: "/addSalesAgent",
                        templateUrl: "/EnglishTemplates/agents/manage.html",
                        controller: "addNewSalesAgent",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })
                    .state('addPromotion', {
                        url: "/addPromotion",
                        templateUrl: "/EnglishTemplates/promotions/manage.html",
                        controller: "addNewPromotion",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })
                    .state('updateMobileUser', {
                        url: "/updateMobileUser/:id",
                        templateUrl: "/EnglishTemplates/appusers/update.html",
                        controller: "AppSingleuser"
                    })
                    .state('updateCompany', {
                        url: "/updateCompany/:id",
                        templateUrl: "/EnglishTemplates/companies/update.html",
                        controller: "SingleCompany"
                    })
                    .state('updateHoliday', {
                        url: "/updateHoliday/:id",
                        templateUrl: "/EnglishTemplates/updateHolidays.html",
                        controller: "annualHolidayConrtoller"
                    })
                    .state('updatePromotion', {
                        url: "/updatePromotion/:id",
                        templateUrl: "/EnglishTemplates/promotions/update.html",
                        controller: "SinglePromotion"
                    })
                    .state('updateSalesAgents', {
                        url: "/updateSalesAgents/:id",
                        templateUrl: "/EnglishTemplates/agents/update.html",
                        controller: "SingleSalesAgent"
                    })
                    .state('addCompany', {
                        url: "/addCompany",
                        templateUrl: "/EnglishTemplates/companies/manage.html",
                        controller: "companiesCtrl",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })

                    .state('appuserdetail', {
                        url: "/appuser/:id",
                        templateUrl: "/EnglishTemplates/appusers/detail.html",
                        controller: "AppSingleuser",
                    })
                    .state('saleAgentdetail', {
                        url: "/salesagent/:id",
                        templateUrl: "/EnglishTemplates/agents/detail.html",
                        controller: "SingleSalesAgent",
                    })
                    .state('companydetail', {
                        url: "/company/:id",
                        templateUrl: "/EnglishTemplates/companies/detail.html",
                        controller: "SingleCompany",
                    })
                    .state('Promotiondetail', {
                        url: "/promotion/:id",
                        templateUrl: "/EnglishTemplates/promotions/detail.html",
                        controller: "SinglePromotion",
                    })
                    .state('registration_page', {
                        url: "/registration_page",
                        templateUrl: "/EnglishTemplates/appusers/manage.html",
                        controller: "SignupCtrl"
                    })
                    .state('saleAgentsReports', {
                        url: "/saleAgentsReports",
                        templateUrl: "/EnglishTemplates/reports/salesagentsreport.html",
                        controller: "salesAgentsCtrl"
                    })
                    .state('companiesReports', {
                        url: "/companiesReports",
                        templateUrl: "/EnglishTemplates/reports/companiesreport.html",
                        controller: "companiesCtrl",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })
                    .state('profile_details_page', {
                        url: "/profile_details_page",
                        templateUrl: "/EnglishTemplates/appusers/detail.html",
                        controller: "profile_details_page"
                    })
                    .state('shiftyears', {
                        url: "/shiftyears",
                        templateUrl: "/EnglishTemplates/shiftyears.html",
                        controller: "BranchShitfCtrl",
                        resolve: {
                            loginRequired: function (User) {
                                return User.loginRequired();
                            }
                        }
                    })

                    //----- Arabic Routes -----//
                    .state('appusersa', {
                        url: "/appusersa",
                        templateUrl: "/ArabicPages/appusers/index.html",
                        controller: "mobile_app_users_page"
                    })
                    .state('companiesa', {
                        url: "/companiesa",
                        templateUrl: "/ArabicPages/companies/index.html",
                        controller: "companiesCtrl"
                    })
                    .state('agentsa', {
                        url: "/agentsa",
                        templateUrl: "/ArabicPages/agents/index.html",
                        controller: "salesAgentsCtrl"
                    })
                    .state('promotionsa', {
                        url: "/promotionsa",
                        templateUrl: "/ArabicPages/promotions/index.html",
                        controller: "PromotionCtrl"
                    })
                    .state('dashboarda', {
                        url: "/dashboarda",
                        templateUrl: "/ArabicPages/dashboard.html"
                    })

            //      $rootScope.navigate=function(state,params){
            //     var lang=localStorageService.get('pageLanguage');
            //     console.log(lang);
            //     if(lang=='en'){
            //         if(params){
            //                 $state.go(state,params)
            //         }
            //         else{
            //             $state.go(state)
            //         }
            //     }
            //     else{
            //         if(params){
            //             $state.go(state + 'a',params)
            //         }
            //         else{
            //             $state.go(state +'a')
            //         }
            //     }
            // }
            localStorageServiceProvider
                    .setPrefix('Autotek');
        })


        .run(function ($rootScope, $state, $location, Appointment, User, Branch) {
            $rootScope.allServices = [];
            $rootScope.branchtabs = [
                true, false, false, false
            ]
            $rootScope.tabclick = function (ind, obj, gridIndex) {
                if (obj != null) {
                    $rootScope.availableServiceGridIndex = gridIndex;
                    $rootScope.availableServiceObj = obj;
                    $rootScope.branchId = obj.Id;
                    $rootScope.branchName = obj.BranchName;
                }

                for (var i = 0; i < $rootScope.branchtabs.length; i++) {
                    if (i == ind) {
                        $rootScope.branchtabs[i] = true;
                    } else {
                        $rootScope.branchtabs[i] = false;
                    }
                }

                if (ind === 0) {
//                 i-e main info tab
                    console.log('in main info');
                    $rootScope.allServices = [];
                    $('ul > li').addClass("li_disabled");
                    $rootScope.showAddNewButton = true;
                }
                else if (ind === 1) {
//                 i-e available service tab
                    $('ul > li').removeClass("li_disabled");
                    $rootScope.showAddNewButton = false;
                    User.getServices().success(function (res) {
                        if (res !== "" || res !== "undefined") {

                            Branch.availableService($rootScope.branchId).success(function (avlServices) {
                                if (avlServices.length > 0) {
                                    console.log("asdf", avlServices);
                                    console.log("rootScope.allServices", $rootScope.allServices);
                                    for (var i = 0; i < res.length; i++) {
                                        $rootScope.allServices.push(res[i]);
                                        for (var j = 0; j < avlServices.length; j++) {
                                            if ($rootScope.allServices[i].Id === avlServices[j].Id) {
                                                console.log('matched');
                                                $rootScope.allServices[i].checked = true;
                                            } else {
//                                                $rootScope.allServices[i].checked = false;
                                                console.log('not_matched');
                                            }
                                        }
                                    }
//                            $scope.isDataLoading = false;
                                } else {
                                    console.log("No Available Service in Selected Branch is Exist");
                                    for (var i = 0; i < res.length; i++) {
                                        $rootScope.allServices.push(res[i]);
                                    }
                                }
                            })
                                    .error(function (err) {
                                        console.log("Error in available services", err);
//                                $scope.isDataLoading = false;
                                    });
                        } else {

                        }
//                        $scope.isDataLoading = false;
                    }).error(function (err) {
                        console.log(err);
//                                $scope.isDataLoading = false;
                    });
                }
                else if (ind === 3) {
                    $('ul > li').removeClass("li_disabled");
                    $rootScope.showAddNewButton = false;
//                  i-e workingday tab 
                    $rootScope.allServices = [];
                    $rootScope.days = [{
                            checked: false,
                            value: "Monday"
                        }, {
                            checked: false,
                            value: "Tuesday"
                        }, {
                            checked: false,
                            value: "Wednesday"
                        }, {
                            checked: false,
                            value: "Thursday"
                        }, {
                            checked: false,
                            value: "Friday"
                        }, {
                            checked: false,
                            value: "Saturday"
                        }, {
                            checked: false,
                            value: "Sunday"
                        }];
//                 i-e working day tab
                    Appointment.getBranchWorkingDays($rootScope.branchId)
                            .success(function (res) {
                                console.log('Available Working Days', res);
                                $rootScope.availableWorkingDays = res;
                                if (res !== "" || res !== "undefined") {
                                    console.log('Testing');
                                    for (var i = 0; i < $rootScope.days.length; i++) {
                                        for (var j = 0; j < res.length; j++) {
                                            if ($rootScope.days[i].value === res[j].WorkingDay) {
                                                console.log('matched');
                                                $rootScope.days[i].checked = true;
                                            } else {
                                                console.log('not-matched');
                                            }
                                        }

//                                        if (res[i].WorkingDay) {
//                                            console.log('exit');
//                                            if (res[i].WorkingDay === $rootScope.days[i].value) {
//                                                console.log('matched');
//                                            } else {
//                                                $rootScope.days.checked = true;
//                                                console.log('not matched');
//                                            }
//                                        } else {
//                                            console.log('not exit');
//                                        }
                                    }
                                }
                            });
                }
                else if (ind === 2) {
//                   i-e shift details tab
                    $('ul > li').removeClass("li_disabled");
                    $rootScope.showAddNewButton = false;
                    $rootScope.allServices = [];
//                   this is for shift detail page
                    Appointment.getBranchWorkingDays($rootScope.branchId)
                            .success(function (res) {
                                $rootScope.availableWorkingDays = res;
                            });
                }
            }

            $rootScope.actives = [true, false, false, false, false, false, false, false, false, false, false, false];
            $rootScope.navigateState = function (state) {
                $state.go(state)

                if (state == 'dashboard') {
                    $rootScope.actives = [true, false, false, false, false, false, false];
                }
                if (state == 'mobileappusers') {
                    $rootScope.actives = [false, true, false, false, false, false, false];
                }
                if (state == 'companies') {
                    $rootScope.actives = [false, false, true, false, false, false, false];
                }
                if (state == 'salesagents') {
                    $rootScope.actives = [false, false, false, true, false, false, false];
                }
                if (state == 'promotions') {
                    $rootScope.actives = [false, false, false, false, true, false, false];
                }
                if (state == 'saleAgentsReports') {
                    $rootScope.actives = [false, false, false, false, false, true, false];
                }
                if (state == 'companiesReports') {
                    $rootScope.actives = [false, false, false, false, false, false, true];
                }
            }
            var currentUrl = $location.url();
            if (currentUrl.includes("dashboard")) {
                $rootScope.actives = [true, false, false, false, false, false, false];
            }
            if (currentUrl.includes("mobileappusers")) {
                $rootScope.actives = [false, true, false, false, false, false, false];
            }
            if (currentUrl.includes("companies")) {
                $rootScope.actives = [false, false, true, false, false, false, false];
            }
            if (currentUrl.includes("salesagents")) {
                $rootScope.actives = [false, false, false, true, false, false, false];
            }
            if (currentUrl.includes("promotions")) {
                $rootScope.actives = [false, false, false, false, true, false, false];
            }
            if (currentUrl.includes("saleAgentsReports")) {
                $rootScope.actives = [false, false, false, false, false, true, false];
            }
            if (currentUrl.includes("companiesReports")) {
                $rootScope.actives = [false, false, false, false, false, false, true];
            }
        })