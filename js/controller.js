var app = angular.module('Autotek.controller', [])

app.controller('LoginCtrl', function ($scope, $rootScope, $window, $state, User, localStorageService, $location, NavigateState) {
    $scope.user = {};
    localStorageService.remove("access_token");

    if (localStorageService.get('pagereload') == null) {
        console.log("in page reload if")
        $window.location.reload();
        localStorageService.set('pagereload', '1');
    }

    var params = {
        'grant_type': 'password',
        'username': $scope.user.username,
        'password': $scope.user.password,
        'client_id': 'Android02',
        'client_secret': '21B5F798-BE55-42BC-8AA8-0025B903DC3B',
        'scope': 'app1'
    };
    $scope.Iserror = false;
    $scope.loginLoaderShow = false;
    $scope.login = function (data) {

        $scope.loginLoaderShow = true;
        var params = {
            'grant_type': 'password',
            'username': $scope.user.username,
            'password': $scope.user.password,
            'client_id': 'Android02',
            'client_secret': '21B5F798-BE55-42BC-8AA8-0025B903DC3B',
            'scope': 'app1'
        };
        console.log("in login", params)
        User.login(params).success(function (res) {

            if (localStorageService.isSupported) {
                localStorageService.set("access_token", res);

                User.getUser().success(function (res) {
                    $scope.loginLoaderShow = false;
                    var loggedInUser = {
                        user: res
                    }
                    localStorageService.set("loggedInUser", loggedInUser);
                    //NavigateState.navigate('dashboard');
                    if (localStorageService.get('pageLanguage') == 'en') {
                        NavigateState.navigate('dashboard');
                    } else {
                        window.location = "/arabic/index.html"
                    }
                })
                        .error(function (err) {
                            console.log(err);
                            $scope.Iserror = true;
                            $scope.loginLoaderShow = false;
                            User.getSaleAgent().success(function (res) {
                                loggedInUser = {user: res}
                                $rootScope.name = res.FirstName;
                                localStorageService.set("loggedInUser", loggedInUser);
                                console.log(res);
                                //  $ionicLoading.hide();
                                if (localStorageService.get('pageLanguage') == 'en') {
                                    NavigateState.navigate('dashboard');
                                } else {
                                    window.location = "/arabic/index.html"
                                }
                            })
                                    .error(function (err) {
                                        //$ionicLoading.hide();
                                    })
                        });
            }

        })
                .error(function (err) {
                    console.log('error', err);

                    $scope.Iserror = true;
                    $scope.loginLoaderShow = false;
                })
    }

    if (localStorageService.get('pageLanguage') == null) {
        $scope.lng = 'en';
        localStorageService.set('pageLanguage', $scope.lng);
    } else {
        $scope.lng = localStorageService.get('pageLanguage');
    }

    $scope.get_language = function (value1) {
        console.log($scope.lng)
        localStorageService.set('pageLanguage', $scope.lng);
    }

    $scope.go = function (language) {
        console.log(language)
        localStorageService.set('pageLanguage', language);
    }

})

app.controller('LogoutCtrl', function ($scope, $rootScope, NavigateState, localStorageService, $location, $state) {
    $scope.user = localStorageService.get("loggedInUser").user;
    $scope.userName = $scope.user.FirstName;
    $scope.logout = function () {
        if (localStorageService.get('access_token')) {
            localStorageService.remove("access_token");
            localStorageService.remove("loggedInUser");
            NavigateState.navigate('login')
            return true;

        } else {
            return false;
        }
    }

})

app.controller('DashboardApiCtrl', function ($scope, User, $http, $state) {
    console.log('dashboard called');

    User.getDashboardStats().success(function (res) {

        $scope.NoOfCustomersToday = res.NoOfCustomersToday;

        $scope.NoOfCustomersThisWeek = res.NoOfCustomersThisWeek;

        $scope.NoOfCustomersThisMonth = res.NoOfCustomersThisMonth;

        $scope.NoOfCustomersThisYear = res.NoOfCustomersThisYear;


        $scope.ConversionRate = res.ConversionRate;

        $scope.BounceRate = res.BounceRate;

        $scope.NoOfSalesAgents = res.NoOfSalesAgents;

        $scope.NoOfSalesOrders = res.NoOfSalesOrders;

    })
            .error(function (err) {
                console.log('The error', err);
            })
})



app.controller('AppSingleuser', function ($scope, User, $stateParams, $state) {
    $scope.isDataLoading = true;
    console.log('app single user called')
    $scope.deleteId = $stateParams.id;
    $scope.updateUser = {};
    $scope.NewPassword = "";
    console.log($scope.updateUser)
    console.log($scope.deleteId);
    User.getCustopmerOrder(14).success(function (res) {
        console.log('orders', res);
    })
            .error(function (err) {
                console.log(err);
            })
    User.getSingleAppUser($stateParams.id).success(function (res) {
        $scope.singleUser = res[0];
        // console.log($scope.singleUser)
        $scope.isDataLoading = false;
    })
            .error(function (err) {
                console.log(err);
                $scope.isDataLoading = false;
            })
    // Change Password Function Starts //
    $scope.ChangePassword = function (singleUser) {
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";
        $scope.passwordCustom = {
            "User_GUID": $scope.singleUser.User_GUID,
            "NewPassword": $scope.NewPassword
        }
        User.changePassword($scope.passwordCustom).success(function () {
            console.log(res);
            $scope.loaderr = false;
            $scope.showSuccessAlert = true;
        })
                .error(function (err) {
                    console.log(err);
                    $scope.loaderr = false
                    $scope.errorText = err.Message;
                    $scope.showErrorAlert = true;
                })
    }
    // Change Password Function Starts //
    $scope.deleteUser = function (deleteId) {
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";
        User.deleteSingleAppUser(deleteId).success(function (res) {
            console.log(res);
            console.log('delete method called success');
            $scope.loaderr = false;
            $scope.showSuccessAlert = true;
        })
                .error(function (err) {
                    console.log(err);
                    $scope.loaderr = false
                    $scope.errorText = err.Message;
                    $scope.showErrorAlert = true;
                })
    }
    $scope.navigateToUpdate = function (id) {
        $state.go('updateMobileUser', {id: id});
    }
    $scope.navigateToScheduleAppointment = function (id) {
        $state.go('scheduleappoint', {id: id});
    }
    // $scope.singleUser={
    //         "Id" : $scope.singleUser.Id, "FirstName" : "TestUpdated" , "LastName" : "001" , 
    //         "MobileNumber" : "0000333999", "EmailAddress" : "test@gmail.com",
    //         "ERPReference" : "ERP_0003"
    //     }

    $scope.updateAppUser = function (singleUser) {
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";
        $scope.singleUsercustom = {
            "Id": $scope.singleUser.Id,
            "FirstName": $scope.singleUser.FirstName,
            "LastName": $scope.singleUser.LastName,
            "MobileNumber": $scope.singleUser.MobileNumber,
            "EmailAddress": $scope.singleUser.EmailAddress,
            "ERPReference": $scope.singleUser.referenceNo
        }

        console.log('singleUserrrr', $scope.singleUsercustom);
        User.UpdateSingleAppUser($scope.singleUsercustom).success(function (res) {
            console.log(res);
            $scope.loaderr = false;
            $scope.showSuccessAlert = true;
            console.log('successfuly updated');
            $scope.isDataLoading = false;
        })
                .error(function function_name(err) {
                    console.log(err);
                    $scope.loaderr = false
                    $scope.errorText = err.Message;
                    $scope.showErrorAlert = true;
                    $scope.isDataLoading = false;
                })
    }
})
app.controller('SingleSalesAgent', function ($scope, User, $stateParams, $state) {
    $scope.isDataLoading = true;
    $scope.getStatus = function (value6) {
        if ($scope.SingleSalesAgent.Status == "Active") {
            $scope.SingleSalesAgent.status = false;
        } else {
            $scope.SingleSalesAgent.status = true;
        }
    }
    $scope.getComissionType = function (value3) {
        if ($scope.SingleSalesAgent.AgentCommission == "Percentage") {
            $scope.SingleSalesAgent.CommissionType = false;
        } else {
            $scope.SingleSalesAgent.CommissionType = true;
        }
    }
    $scope.onChangeCompany = function () {
        console.log($scope.SingleSalesAgent.AffiliateCompanyId.Id);
    }
    //---------Update Sales Agent Starts-------//
    $scope.updateSingleSalesAgent = function (SingleSalesAgent) {
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";
        $scope.singleSalesAgentCustom = {
            "Id": $scope.SingleSalesAgent.Id,
            "firstname": $scope.SingleSalesAgent.FirstName,
            "lastname": $scope.SingleSalesAgent.LastName,
            "ContactNumber": $scope.SingleSalesAgent.ContactNumber,
            "EmailAddress": $scope.SingleSalesAgent.EmailAddress,
            "AffiliateCompanyId": $scope.SingleSalesAgent.AffiliateCompanyId.Id,
            "Address": $scope.SingleSalesAgent.Address,
            "ERPReference": $scope.SingleSalesAgent.ERPReference,
            "isActive": $scope.SingleSalesAgent.status,
            "CommissionDetails": [{
                    "CommissionRate": $scope.SingleSalesAgent.CommissionStructure,
                    "IsPercentage": $scope.SingleSalesAgent.CommissionType,
                    "BankDetails": $scope.SingleSalesAgent.BankDetials
                }]
        }
        console.log('singleUserrrr', $scope.singleSalesAgentCustom);
        User.UpdateSalesAgents($scope.singleSalesAgentCustom).success(function (res) {
            console.log(res);
            $scope.loaderr = false;
            $scope.showSuccessAlert = true;
            console.log('Sale Agent successfuly updated');
            $scope.isDataLoading = false;
        })
                .error(function function_name(err) {
                    console.log(err);
                    $scope.loaderr = false
                    $scope.errorText = err.Message;
                    $scope.showErrorAlert = true;
                    $scope.isDataLoading = false;
                })
    }
    //---------Update Sales Agent Ends-------//

    $scope.deleteId = $stateParams.id;
    console.log($scope.deleteId);
    User.getSingleSalesAgent($stateParams.id).success(function (res) {
        $scope.SingleSalesAgent = res[0];
        console.log($scope.SingleSalesAgent)
        $scope.isDataLoading = false;
    })
            .error(function (err) {
                console.log(err);
                $scope.isDataLoading = false;
            })
    $scope.navigateToUpdate = function (id) {
        $state.go('updateSalesAgents', {id: id});
    }
    //---------- Delete Agent Starts ----------
    $scope.deleteAgent = function (deleteId) {
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";
        User.deleteAgent(deleteId).success(function (res) {
            console.log(res);
            console.log('delete method called success');
            $scope.loaderr = false;
            $scope.showSuccessAlert = true;
        })
                .error(function (err) {
                    console.log(err);
                    $scope.loaderr = false
                    $scope.errorText = err.Message;
                    $scope.showErrorAlert = true;
                })
    }
    //-----------Delete Agents Ends------

    User.getCompanies().success(function (res) {
        $scope.Companies = res;
    })
            .error(function (err) {
                console.log(err);
            })
    ///---------Update sales Agents Starts-----///
    $scope.updateSalesAgents = function (SingleSalesAgent) {
        $scope.singleSalesAgentCustom = {
            "Id": "6",
            "firstname": "John",
            "lastname": "Jimmy",
            "ContactNumber": "5554444",
            "EmailAddress": "email@gmail.com",
            "AffiliateCompanyId": 1,
            "Address": "9999999",
            "ERPReference": "ERP-Company-002",
            "isActive": "true",
            "CommissionDetails": [{
                    "CommissionRate": "4.0",
                    "IsPercentage": "true",
                    "BankDetails": "9999-c SAMBA Bank, Riyadh, Saudi Arabia"
                }]
        }
    }
    ///---------Update sales Agents Ends-----///
})
app.controller('SingleCompany', function ($scope, User, $stateParams, $state) {
    $scope.isDataLoading = true;
    $scope.deleteId = $stateParams.id;
    console.log($scope.deleteId);
    User.getSingleCompany($stateParams.id).success(function (res) {
        $scope.SingleCompany = res[0];
        console.log($scope.SingleCompany)
        $scope.isDataLoading = false;
    })
            .error(function (err) {
                console.log(err);
                $scope.isDataLoading = false;
            })
    $scope.navigateToUpdate = function (id) {
        $state.go('updateCompany', {id: id});
    }
    $scope.getStatus = function (value2) {
        if ($scope.SingleCompany.AccountStatus == "Active") {
            $scope.SingleCompany.AccountStatus = false;
        } else {
            $scope.SingleCompany.AccountStatus = true;
        }
    }
    $scope.getComissionType = function (value3) {
        if ($scope.SingleCompany.CompanyCommissionType == "Percentage") {
            $scope.SingleCompany.CompanyCommissionType = false;
        } else {
            $scope.SingleCompany.CompanyCommissionType = true;
        }
    }


    $scope.updateCompany = function (SingleCompany) {
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";
        $scope.singleCompanyCustom = {
            "Id": $scope.SingleCompany.Id,
            "CompanyName": $scope.SingleCompany.CompanyName,
            "CompanyNameInArabic": $scope.SingleCompany.CompanyName,
            "PhoneNumber": $scope.SingleCompany.ContactPhone,
            "EmailAddress": $scope.SingleCompany.ContactEmail,
            "Address": "Jeddah, KSA",
            "IsActive": $scope.SingleCompany.AccountStatus,
            "ERPReference": $scope.SingleCompany.CompanyErpRerence,
            "Contacts": [{
                    "PersonName": $scope.SingleCompany.ContactPerson,
                    "TelephoneNumber": $scope.SingleCompany.ContactPhone,
                    "EmailAddress": $scope.SingleCompany.ContactEmail,
                    "OtherContactDetails": $scope.SingleCompany.OtherContact
                }, {
                    "PersonName": $scope.SingleCompany.ContactPerson1,
                    "TelephoneNumber": $scope.SingleCompany.ContactPhone1,
                    "EmailAddress": $scope.SingleCompany.ContactEmail1,
                    "OtherContactDetails": $scope.SingleCompany.OtherContact
                }],
            "ComissionDetails": [{
                    "CommissionRate": $scope.SingleCompany.CompanyCommission,
                    "IsPercentage": $scope.SingleCompany.CompanyCommissionType,
                    "PaymentMethod": $scope.SingleCompany.OtherPaymentMethods,
                    "BankDetails": $scope.SingleCompany.BankAccountDetails
                }]
        }
        User.UpdateCompany($scope.singleCompanyCustom).success(function (res) {
            console.log(res);
            // console.log(SingleCompany)
            $scope.loaderr = false;
            $scope.showSuccessAlert = true;
            console.log('company successfuly updated');
            $scope.isDataLoading = false;
        })
                .error(function function_name(err) {
                    console.log(err);
                    $scope.loaderr = false
                    $scope.errorText = err.Message;
                    $scope.showErrorAlert = true;
                    $scope.isDataLoading = false;
                })
    }
    //--------- Delete Company ---------
    $scope.deleteCompany = function (deleteId) {
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";
        User.deleteCompany(deleteId).success(function (res) {
            console.log(res);
            console.log('delete method called success');
            $scope.loaderr = false;
            $scope.showSuccessAlert = true;
        })
                .error(function (err) {
                    console.log(err);
                    $scope.loaderr = false
                    $scope.errorText = err.Message;
                    $scope.showErrorAlert = true;
                })
    }
    //----------Delete Company End-------

})
app.controller('SinglePromotion', function ($scope, User, $stateParams, $state) {
    $scope.isDataLoading = true;
    $scope.navigateToUpdate = function (id) {
        $state.go('updatePromotion', {id: id});
    }
    $scope.deleteId = $stateParams.id;
    console.log($scope.deleteId);
    User.getSinglePromotion($stateParams.id).success(function (res) {
        $scope.Singlepromotion = res[0];
        console.log($scope.Singlepromotion)
        $scope.isDataLoading = false;
    })
            .error(function (err) {
                console.log(err);
                $scope.isDataLoading = false;
            })

    User.getTriggers().success(function (res) {
        $scope.allTriggers = res;
    })
            .error(function (err) {
                console.log(err);
            })
    $scope.getStatus = function (value5) {
        if ($scope.Singlepromotion.Status == "Active") {
            $scope.Singlepromotion.status = false;
        } else {
            $scope.Singlepromotion.status = true;
        }
    }
    $scope.updatePromotions = function (Singlepromotion) {

        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";
        console.log($scope.Singlepromotion.Trigger.Id);
        $scope.singlePromotionCustom = {
            "Id": $scope.Singlepromotion.Id,
            "DiscountCriteriaId": $scope.Singlepromotion.Trigger.Id,
            "CouponCode": $scope.Singlepromotion.templateCoupen,
            "Description_EN": $scope.Singlepromotion.Title_EN,
            "Description_AR": $scope.Singlepromotion.Title_AR,
            "IsActive": $scope.Singlepromotion.status,
            "EndDate": $scope.Singlepromotion.ExpiresOn
        }
        console.log("update object", $scope.singlePromotionCustom);
        User.UpdatePromotion($scope.singlePromotionCustom).success(function (res) {
            $scope.loaderr = false;
            $scope.showSuccessAlert = true;
            console.log(res);
            console.log('Promotion successfuly updated');
            $scope.isDataLoading = false;
        })
                .error(function function_name(err) {
                    console.log(err);
                    $scope.loaderr = false
                    $scope.errorText = err.Message;
                    $scope.showErrorAlert = true;
                    $scope.isDataLoading = false;
                })
    }
    //---------- Delete Promotion Starts ----------
    $scope.deletePromotions = function (deleteId) {
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";
        User.deletePromotion(deleteId).success(function (res) {
            console.log(res);
            console.log('delete method called success');
            $scope.loaderr = false;
            $scope.showSuccessAlert = true;
        })
                .error(function (err) {
                    console.log(err);
                    $scope.loaderr = false
                    $scope.errorText = err.Message;
                    $scope.showErrorAlert = true;
                })
    }
    //-----------Delete Promotion Ends------

})

app.controller('annualHolidayConrtoller', function ($scope, User, $http, $state, $rootScope, $filter, $window) {
    $scope.startDate = "";
    $scope.endDate = "";
    $scope.title = "";
    $scope.isDataLoading = true;
    $scope.allHolidays = [];
    $scope.testDate = "";
    $scope.startdate = "";
    $scope.enddate = "";
    $scope.changeSrartDate = "";
    $scope.changeEndDate = "";
    $scope.ttl = "";
    $scope.id = "";
    $scope.newObject = {};
    $scope.showgrid = true;
    $scope.updateBtnShow = false;
    $scope.saveBtnShow = true;

    $scope.addAnnualHolday = function () {

        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showSuccessAlertDelete = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";


        if ($scope.startdate != "" && $scope.enddate != "" && $scope.ttl != "") {
            var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
            var formatedStartDate = $filter("date")($scope.startdate, 'yyyy-MM-dd');
            var formatedEndDate = $filter("date")($scope.enddate, 'yyyy-MM-dd');
            $scope.holdayObject = {
                "StartDate": formatedStartDate,
                "EndDate": formatedEndDate,
                "Title": $scope.ttl
            }
            console.log('formated startdate when update', formatedStartDate);
            console.log('formated enddate when update', formatedEndDate);
            // $scope.user.UserName = $scope.user.MobileNumber;
            var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
            $http.post(url, params, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (result) {
                $http.post('http://autotecapi.azurewebsites.net/api/annualholiday', $scope.holdayObject, {
                    headers: {
                        'Authorization': "Bearer" + " " + result.access_token
                    }
                }).success(function (res) {
                    console.log(res)
                    console.log('in add holiday scucess')
                    $scope.loaderr = false;
                    $scope.showSuccessAlert = true;
                    $scope.isDataLoading = false;
                    $window.location.reload();
                })
                        .error(function (err) {
                            $scope.loaderr = false
                            $scope.errorText = err.Message;
                            $scope.showErrorAlert = true;
                            console.log(err)
                            $scope.isDataLoading = false;
                        })

            })

        } else {
            alert("Please fill all the fields first");
            $scope.loaderr = false;
        }

    }

    User.getHolidays().success(function (res) {
        $scope.allHolidays = res;
        console.log(res, 'response')
        $scope.isDataLoading = false;
    })
            .error(function (err) {
                console.log(err)
                $scope.isDataLoading = false;
            })
    $scope.deleteHoliday = function (deleteIdd) {
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        User.deleteHoliday(deleteIdd).success(function (res) {
            console.log(res, 'res')
            $scope.loaderr = false;
            $scope.showSuccessAlertDelete = true;
            $window.location.reload();
        })
                .error(function (err) {
                    console.log(err)
                    $scope.loaderr = false
                    $scope.errorText = err.Message;
                    $scope.showErrorAlert = true;
                })
    }

    $scope.navigateToUpdateHoliday = function (object1) {
        console.log("SSSS", $scope.allHolidays)

        $scope.startdate = $filter("date")(object1.StartDate, 'yyyy-MM-dd');
        $scope.enddate = $filter("date")(object1.EndDate, 'yyyy-MM-dd');
        $scope.ttl = object1.Title;
        $scope.id = object1.Id;
        $scope.updateBtnShow = true;
        $scope.saveBtnShow = false;
        $scope.showgrid = false;
        console.log($scope.startdate, 'start date')
        console.log($scope.enddate, 'end date')
        // console.log($scope.ttl,'title')
        // console.log(object1.EndDate,'end date')
    }
    $scope.update1 = function () {

        if ($scope.startdate != null && $scope.enddate != null && $scope.ttl != "") {

            var formatedStartDate = $filter("date")($scope.startdate, 'yyyy-MM-dd');
            var formatedEndDate = $filter("date")($scope.enddate, 'yyyy-MM-dd');

            console.log('formated startdate when update', formatedStartDate);
            console.log('formated enddate when update', formatedEndDate);
            $scope.updateHolidayObject = {
                "Id": $scope.id,
                "StartDate": formatedStartDate,
                "EndDate": formatedEndDate,
                "Title": $scope.ttl
            }

            console.log($scope.updateHolidayObject, 'updated object')
            User.UpdateHoliday($scope.updateHolidayObject).success(function (res) {
                console.log(res);
                console.log('successfuly updated');
                $scope.showgrid = true;
                $window.location.reload();
                // $scope.isDataLoading = false;
            })
                    .error(function (err) {
                        console.log(err);
                    });
        } else {
            alert('Please fill all the fields first');
        }
    }


})
app.controller('serviceQueryCtrl', function ($scope, User, $http, $state, $rootScope, $window) {

    $scope.serviceTitleEn = "";
    $scope.serviceTitleAr = "";
    $scope.serviceDuration = "";
    $scope.serviceDescEn = "";
    $scope.serviceDescAR = "";
    $scope.id = "";
    $scope.showgrid = true;
    $scope.updateBtnShow = false;
    $scope.saveBtnShow = true;
    $scope.customService = {};
    $scope.allServices = [];
    $scope.isDataLoading = true;
    $scope.saveBtnShow = true;

    $scope.addService = function () {

        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showSuccessAlertDelete = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";

        if ($scope.serviceTitleEn != "" && $scope.serviceTitleAr != "" && $scope.serviceDuration != "" && $scope.serviceDescEn != "" && $scope.serviceDescAR != "") {
            var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
            $scope.customService = {
                "Title_Eng": $scope.serviceTitleEn,
                "Title_Ar": $scope.serviceTitleAr,
                "DurationInMin": $scope.serviceDuration,
                "Description_Eng": $scope.serviceDescEn,
                "Description_Ar": $scope.serviceDescAR
            }
            console.log('holiday object', $scope.holdayObject)
            // $scope.user.UserName = $scope.user.MobileNumber;
            var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
            $http.post(url, params, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (result) {
                $http.post('http://autotecapi.azurewebsites.net/api/service', $scope.customService, {
                    headers: {
                        'Authorization': "Bearer" + " " + result.access_token
                    }
                }).success(function (res) {
                    console.log(res)
                    console.log('in add holiday scucess')
                    $scope.loaderr = false;
                    $scope.showSuccessAlert = true;
                    $scope.isDataLoading = false;
                    $window.location.reload();
                })
                        .error(function (err) {
                            $scope.loaderr = false;
                            $scope.errorText = err.Message;
                            $scope.showErrorAlert = true;
                            console.log(err)
                            $scope.isDataLoading = false;
                        })

            })
        } else {
            alert("Please fill all the fields first");
            $scope.loaderr = false;
        }

    }

    User.getServices().success(function (res) {
        $scope.allServices = res;
        console.log(res, 'response service')
        $scope.isDataLoading = false;
    })
            .error(function (err) {
                console.log(err)
                $scope.isDataLoading = false;
            })

    $scope.DeleteService = function (deleteIdd) {
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        User.deleteService(deleteIdd).success(function (res) {
            console.log(res, 'res')
            $scope.loaderr = false;
            $scope.showSuccessAlertDelete = true;
            $window.location.reload();
        })
                .error(function (err) {
                    console.log(err)
                    $scope.loaderr = false
                    $scope.errorText = err.Message;
                    $scope.showErrorAlert = true;
                })
    }
    $scope.navigateToServiceUpdate = function (serviceObject) {
        $scope.id = serviceObject.Id;
        $scope.serviceTitleEn = serviceObject.Title_Eng;
        $scope.serviceTitleAr = serviceObject.Title_Ar;
        $scope.serviceDuration = serviceObject.DurationInMin;
        $scope.serviceDescEn = serviceObject.Description_Eng;
        $scope.serviceDescAR = serviceObject.Description_Ar;
        $scope.updateBtnShow = true;
        $scope.saveBtnShow = false;
        $scope.showgrid = false;
    }
    $scope.updateService = function () {

        if ($scope.serviceTitleEn != "" && $scope.serviceTitleAr != "" && $scope.serviceDuration != "" && $scope.serviceDescEn != "" && $scope.serviceDescAR != "") {
            $scope.customService = {
                "Id": $scope.id,
                "Title_Eng": $scope.serviceTitleEn,
                "Title_Ar": $scope.serviceTitleAr,
                "DurationInMin": $scope.serviceDuration,
                "Description_Eng": $scope.serviceDescEn,
                "Description_Ar": $scope.serviceDescAR
            }
            User.UpdateService($scope.customService).success(function (res) {
                console.log(res)
                $scope.showgrid = true;
                $window.location.reload();
            })
                    .error(function (err) {
                        console.log(err);
                    })
        } else {
            alert("Please fill all the fields first");
        }

    }

})
app.controller('appointCalenderCtrl', function ($scope, User, $http, $state, $rootScope, $window) {
    $scope.allBranches = [];
    $scope.allServices = [];
    $scope.branchObj = "";
    $scope.serviceObj = "";
    User.getBranches().success(function (res) {
        $scope.allBranches = res;
    })
            .error(function (err) {
                console.log(err)
            })

    User.getServices().success(function (res) {
        $scope.allServices = res;
    })
            .error(function (err) {
                console.log(err)
            })
})

app.controller('notificationCtrl', function ($scope, User, $http, $state, $rootScope, $window) {
    console.log("IN NOTIFICATION");


    $scope.all = 1;
    $scope.companyList = [];
    $scope.devices = ["All", "Android", "Ios"];
    $scope.selectedDevice = $scope.devices[0];


    $scope.To = ["All", "Selected Company"];
    $scope.selectedCompany = $scope.To[0];

    $scope.selectedCompanyChanged = function () {

        $scope.companyList.length = 0;
        $scope.all = 0;

        if ($scope.selectedCompany == "Selected Company") {
            User.getCompanies(0, 100).success(function (res) {
                for (var i = 0; i < res.length; i++) {
                    if (res[i].AccountStatus == "Active") {
                        $scope.companyList.push({companyId: res[i].Id, CompanyName: res[i].CompanyName});
                        $scope.selectedCompanyName = $scope.companyList[0].CompanyName;
                    }
                }

                console.log("COMPANY LIST ", $scope.companyList);
                console.log("RESPONSE LIST ", res);

            })

        } else if ($scope.selectedCompany == "All") {
            $scope.all = 1;
        }


    }

    $scope.send = function () {
        // $rootScope.shiftYearLoading = true;
        $scope.loaderr = true;

        var companyID = 0;

        if ($scope.selectedCompany == "All") {
            companyID = 0;
        }
        else {
            companyID = $scope.selectedCompanyName.companyId;
        }

        console.log("TITLE", $scope.title);
        console.log("MESSAGE", $scope.message);
        console.log("DEVICE", $scope.selectedDevice);
        console.log("se", $scope.selectedCompany);
        console.log("SELECTED COMPANY", $scope.companyId);

        if ($scope.selectedDevice != "" && $scope.selectedCompany != "" && $scope.title != null && $scope.message != null) {


            User.getNotification({title: $scope.title, message: $scope.message}, $scope.selectedDevice, companyID).success(function (res) {
                $scope.showSuccessAlert = true;
                $scope.loaderr = false;
                $window.location.reload();

            })
        } else {
            alert("Please fill all the fields first");
            $scope.loaderr = false;
        }



    }


    $scope.devices = ["All", "Android", "Ios"];
    $scope.selectedUser = $scope.devices[0];


    //  $scope.devices = {
    //     "ResponseObject":
    //         [{
    //             "Name": "Suresh",
    //             "userID": 1
    //         },
    //         {
    //             "Name": "Mahesh",
    //             "userID": 2
    //         }]
    // };

    //$scope.selectedUser = $scope.devices[0].deviceName;

    //$scope.devices = ["Emil", "Tobias", "Linus"];
    console.log("FINAL NAME", $scope.selectedName);
})

app.controller('addNewAppUser', function ($scope, User, $http) {
    $scope.regex = '^[a-zA-Z]+[a-zA-Z0-9._-]+@[a-z]+\.[a-z.]{2,5}$';
    $scope.addUser = {};
    $scope.register = function () {
        // console.log($scope.user)
        // console.log('errors occured');
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";

        var errors = [];
        if ($scope.addUser.FirstName == null || $scope.addUser.FirstName == "") {
            errors.push({message: 'First Name is required'})
        }

        if ($scope.addUser.LastName == null || $scope.addUser.LastName == "") {
            errors.push({message: 'Last Name is required'})
        }

        if ($scope.addUser.MobileNumber == null || $scope.addUser.MobileNumber == "") {
            errors.push({message: 'Mobile Number is required'})
        }

        if ($scope.addUser.EmailAddress == null || $scope.addUser.EmailAddress == "") {
            errors.push({message: 'Email is required'});
        }
        // else {
        //     var email = $scope.addUser.EmailAddress.match($scope.regex);
        //     if (email == null) {
        //         errors.push({message: 'Not a valid email'});
        //     }
        // }

        if ($scope.addUser.Password == null || $scope.addUser.Password == "") {
            errors.push({message: 'Password is required'})
        }
        if ($scope.addUser.referenceNo == null || $scope.addUser.referenceNo == "") {
            errors.push({message: 'Reference Number is required'})
        }




        if (errors.length != 0) {
            console.log('errors occured');
            $scope.errorText = "First Name, Last Name , Mobile Number , Email , Password Or ERP Reference is Empty";
            $scope.showErrorAlert = true;
            $scope.switchBool = function (value) {
                $scope[value] = !$scope[value];
                // $scope.loaderr = false;
            };
            $scope.loaderr = false;


        } else {
            var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
            // $scope.addUser.UserName = $scope.addUser.MobileNumber;
            // $scope.usercustom = {
            //     'User' : $scope.addUser,

            // }
            // console.log($scope.usercustom)

            $scope.usercustom = {
                "FirstName": $scope.addUser.FirstName,
                "LastName": $scope.addUser.LastName,
                "MobileNumber": $scope.addUser.MobileNumber,
                "EmailAddress": $scope.addUser.EmailAddress,
                "User": {
                    "UserName": $scope.addUser.MobileNumber,
                    "Password": $scope.addUser.Password
                }
            };
            console.log($scope.usercustom);
            //.User= $scope.user
            var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
            $http.post(url, params, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (result) {
                $http.post('http://autotecapi.azurewebsites.net/api/CustomerRegistration', $scope.usercustom, {
                    headers: {
                        'Authorization': "Bearer" + " " + result.access_token
                    }
                }).success(function (res) {
                    console.log(res);
                    $scope.loaderr = false;
                    $scope.showSuccessAlert = true;
                    // $ionicLoading.hide();
                    // var alertPopup = $ionicPopup.alert({
                    //     title: 'Success!',
                    //     template: 'A verication key is sent through SMS!'
                    // });
                    console.log('user addess success')
                    // alertPopup.then(function(res) {
                    //     $rootScope.navigate('home')
                    //         //console.log('Thank you for not eating my delicious ice cream cone');
                    // });
                })
                        .error(function (err) {
                            var error = [{message: err.Message}]
                            $scope.loaderr = false
                            $scope.errorText = err.Message;
                            $scope.showErrorAlert = true;
                            // $ionicLoading.hide();
                            // $scope.deactivate(error)
                        })
            })
                    .error(function (error) {

//                        $ionicLoading.hide();
                    })
            //$ionicSlideBoxDelegate.slide(index);

        }
    }
})

app.controller('addNewPromotion', function ($state, $scope, User, $http) {
    // $scope.show = true;
    $scope.show = false;
    $scope.errorText = '';

    // $scope.addPromotion.cTypes='';
    // console.log('scope.addPromotion.cTypes',$scope.addPromotion.cTypes)
    // if($scope.addPromotion.cTypes == "All" || $scope.addPromotion.cTypes == "External"){
    //     $scope.addPromotion.AffiliateCompanyId = 0;
    // }else{

    // }

    // if($scope.addPromotion.OnTrigger == false){
    //     $scope.addPromotion.DiscountCriteriaId = 0;
    // }else{

    // }


    User.getTriggers().success(function (res) {
        $scope.allTriggers = res;
    })
            .error(function (err) {
                console.log(err);
            })

    $scope.regex = '^[a-zA-Z]+[a-zA-Z0-9._-]+@[a-z]+\.[a-z.]{2,5}$';
    $scope.addPromotion = {};
    //  console.log($scope.addPromotion.Trigger);
    // $scope.getId=function(value4){
    //     return $scope.addPromotion.Trigger;
    // }
    if ($scope.addPromotion.Status == "Active") {
        $scope.addPromotion.status = "false";
    } else {
        $scope.addPromotion.status = "true";
    }

    User.getCompanies(0, 10).success(function (res) {
        $scope.allCompanies = res;
    })
            .error(function (err) {
                console.log(err);
            })
    $scope.addPromotion.OnTrigger = false;
    $scope.OnTriggerChange = function () {
        // console.log("check : ",$scope.addPromotion.OnTrigger);
        // console.log("check : ",$scope.addPromotion.companySelected.Id);

        if ($scope.addPromotion.OnTrigger == true) {
            $scope.show = true;
        } else {
            $scope.show = false;
        }
    }

    $scope.AddPromotion = function () {
        // console.log($scope.addPromotion.Trigger.Id);
        // console.log($scope.user)
        // console.log('errors occured');
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";

        var errors = [];

        if ($scope.addPromotion.cTypes == null || $scope.addPromotion.cTypes == "") {
            errors.push({message: 'Type is required'})
        } else {
            if ($scope.addPromotion.cTypes != "All" && $scope.addPromotion.cTypes != "External") {
                if ($scope.addPromotion.companySelected == null || $scope.addPromotion.companySelected == "") {
                    errors.push({message: 'Company is required'});
                    $scope.errorText += "Company, "
                }
            }
        }

        if ($scope.addPromotion.titelEn == null || $scope.addPromotion.titelEn == "") {
            errors.push({message: 'Title English is required'})
        }

        if ($scope.addPromotion.titelAr == null || $scope.addPromotion.titelAr == "") {
            errors.push({message: 'Title عربي is required'})
        }

        if ($scope.addPromotion.ExpiresOn == null || $scope.addPromotion.ExpiresOn == "") {
            errors.push({message: 'Expire on is required'})
        }

        // if ($scope.addPromotion.titelEn == null || $scope.addPromotion.titelEn == "") {
        //     errors.push({ message: 'Email is required' });
        // } else {
        //     var email = $scope.addUser.EmailAddress.match($scope.regex);
        //     if (email == null) {
        //         errors.push({ message: 'Not a valid email' });
        //     }
        // }

        if ($scope.addPromotion.Status == null || $scope.addPromotion.Status == "") {
            errors.push({message: 'Status is required'})
        }
        if ($scope.addPromotion.OnTrigger == true) {
            if ($scope.addPromotion.Trigger == null || $scope.addPromotion.Trigger == "") {
                errors.push({message: 'Trigger is required'});
                $scope.errorText += "Trigger, "
            }
            // if ($scope.addPromotion.templateCoupen == null || $scope.addPromotion.templateCoupen == "") {
            //     errors.push({message: 'Template Coupen is required'})
            // }
        }


        if (errors.length != 0) {
            console.log('errors occured');
            $scope.errorText += "Type, Title English, Title عربي, Status Or Expire On is Empty";
            $scope.showErrorAlert = true;
            $scope.switchBool = function (value) {
                $scope[value] = !$scope[value];
            };
            $scope.loaderr = false;


        } else {
            var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
            // $scope.addUser.UserName = $scope.addUser.MobileNumber;
            // $scope.usercustom = {
            //     'User' : $scope.addUser,

            // }
            // console.log($scope.usercustom)
            console.log('triger ', $scope.addPromotion.Trigger)
            var tri_id = 0;

            if ($scope.addPromotion.OnTrigger == false) {
                console.log('triger if', $scope.addPromotion.Trigger)
                tri_id = 0;
            } else {
                console.log('triger else', $scope.addPromotion.Trigger)
                if ($scope.addPromotion.Trigger != undefined) {
                    tri_id = $scope.addPromotion.Trigger.Id;
                }
            }

            $scope.promotionCustom = {
                // "DiscountCriteriaId": ($scope.addPromotion.OnTrigger == false? 0 : ),
                "DiscountCriteriaId": tri_id,
                "AffiliateCompanyId": ($scope.addPromotion.cTypes == "All" || $scope.addPromotion.cTypes == "External" ? 0 : $scope.addPromotion.companySelected.Id),
                "CouponCode": $scope.addPromotion.templateCoupen,
                "IsForAll": ($scope.addPromotion.cTypes == "All" ? "true" : "false"),
                "Description_EN": $scope.addPromotion.titelEn,
                "Description_AR": $scope.addPromotion.titelAr,
                "IsActive": $scope.addPromotion.status,
                "EndDate": $scope.addPromotion.ExpiresOn
            };
            console.log($scope.promotionCustom);
            //.User= $scope.user
            var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
            $http.post(url, params, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (result) {
                $http.post('http://autotecapi.azurewebsites.net/api/discountoffers', $scope.promotionCustom, {
                    headers: {
                        'Authorization': "Bearer" + " " + result.access_token
                    }
                }).success(function (res) {
                    console.log(res);
                    $scope.loaderr = false;
                    $scope.showSuccessAlert = true;
                    // $ionicLoading.hide();
                    // var alertPopup = $ionicPopup.alert({
                    //     title: 'Success!',
                    //     template: 'A verication key is sent through SMS!'
                    // });
                    console.log('user addess success')
                    // alertPopup.then(function(res) {
                    //     $rootScope.navigate('home')
                    //         //console.log('Thank you for not eating my delicious ice cream cone');
                    // });
                })
                        .error(function (err) {
                            console.log('err', err);
                            var error = [{message: err.Message}]
                            $scope.loaderr = false
                            $scope.errorText = err;
                            $scope.showErrorAlert = true;
                        })
            })
                    .error(function (error) {

//                        $ionicLoading.hide();
                    })


        }
    }
})
app.controller('addNewSalesAgent', function ($state, $scope, User, $http) {

    $scope.navigateToUpdate = function (id) {
        $state.go('updateCompany', {id: id});
    }
    $scope.getStatus = function (value6) {
        if ($scope.addSalesAgent.Status == "Active") {
            $scope.addSalesAgent.status = false;
        } else {
            $scope.addSalesAgent.status = true;
        }
    }
    $scope.getComissionType = function (value3) {
        if ($scope.addSalesAgent.AgentCommission == "Percentage") {
            $scope.addSalesAgent.CommissionType = false;
        } else {
            $scope.addSalesAgent.CommissionType = true;
        }
    }

    User.getCompanies(0, 10).success(function (res) {
        $scope.allCompanies = res;
    })
            .error(function (err) {
                console.log(err);
            })
    $scope.onChangeCompany = function () {
        console.log($scope.addSalesAgent.companeSelected.Id);
    }
    $scope.regex = '^[a-zA-Z]+[a-zA-Z0-9._-]+@[a-z]+\.[a-z.]{2,5}$';
    $scope.addSalesAgent = {};
    $scope.registerSalesAgent = function () {
        // console.log($scope.user)
        // console.log('errors occured');
        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;
        $scope.showSuccessAlert = false;
        $scope.showErrorAlert = false;
        $scope.errorText = "";

        var errors = [];
        if ($scope.addSalesAgent.firstName == null || $scope.addSalesAgent.firstName == "") {
            errors.push({message: 'First Name is required'})
        }

        if ($scope.addSalesAgent.lastName == null || $scope.addSalesAgent.lastName == "") {
            errors.push({message: 'Last Name is required'})
        }

        if ($scope.addSalesAgent.Contact == null || $scope.addSalesAgent.Contact == "") {
            errors.push({message: 'Contact is required'})
        }

        if ($scope.addSalesAgent.Address == null || $scope.addSalesAgent.Address == "") {
            errors.push({message: 'Address is required'})
        }

        if ($scope.addSalesAgent.Email == null || $scope.addSalesAgent.Email == "") {
            errors.push({message: 'Email is required'});
        }
        // else {
        //     var email = $scope.addSalesAgent.EmailAddress.match($scope.regex);
        //     if (email == null) {
        //         errors.push({message: 'Not a valid email'});
        //     }
        // }

        if ($scope.addSalesAgent.companeSelected == null || $scope.addSalesAgent.companeSelected == "") {
            errors.push({message: 'Company is required'})
        }

        if ($scope.addSalesAgent.BankDetails == null || $scope.addSalesAgent.BankDetails == "") {
            errors.push({message: 'Bank Detail is required'})
        }

        if ($scope.addSalesAgent.commRate == null || $scope.addSalesAgent.commRate == "") {
            errors.push({message: 'Commission is required'})
        }

        if ($scope.addSalesAgent.Status == null || $scope.addSalesAgent.Status == "") {
            errors.push({message: 'Status is required'})
        }

        if ($scope.addSalesAgent.AgentErpReference == null || $scope.addSalesAgent.AgentErpReference == "") {
            errors.push({message: 'ERP Reference number is required'})
        }




        if (errors.length != 0) {
            console.log('errors occured');
            $scope.errorText = "First Name, Last Name, Contact  Number , Address , Email , Company , Bank Detail , Commission , Status Or ERP Reference Number is Empty";
            $scope.showErrorAlert = true;
            $scope.switchBool = function (value) {
                $scope[value] = !$scope[value];

            };
            $scope.loaderr = false;


        } else {
            var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
            // $scope.addUser.UserName = $scope.addUser.MobileNumber;
            // $scope.usercustom = {
            //     'User' : $scope.addUser,

            // }
            // console.log($scope.usercustom)

            $scope.singleAgentCustom = {
                "firstname": $scope.addSalesAgent.firstName,
                "lastname": $scope.addSalesAgent.lastName,
                "ContactNumber": $scope.addSalesAgent.Contact,
                "EmailAddress": $scope.addSalesAgent.Email,
                "AffiliateCompanyId": $scope.addSalesAgent.companeSelected.Id,
                "Address": $scope.addSalesAgent.Address,
                "ERPReference": $scope.addSalesAgent.AgentErpReference,
                "isActive": $scope.addSalesAgent.status,
                "CommissionDetails": [{
                        "CommissionRate": $scope.addSalesAgent.commRate,
                        "IsPercentage": $scope.addSalesAgent.CommissionType,
                        "BankDetails": $scope.addSalesAgent.BankDetails
                    }]
            };
            console.log($scope.singleAgentCustom);
            //.User= $scope.user
            var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
            $http.post(url, params, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (result) {
                $http.post('http://autotecapi.azurewebsites.net/api/salesagents', $scope.singleAgentCustom, {
                    headers: {
                        'Authorization': "Bearer" + " " + result.access_token
                    }
                }).success(function (res) {
                    console.log(res);
                    $scope.loaderr = false;
                    $scope.showSuccessAlert = true;
                    // $ionicLoading.hide();
                    // var alertPopup = $ionicPopup.alert({
                    //     title: 'Success!',
                    //     template: 'A verication key is sent through SMS!'
                    // });
                    console.log('user addess success')
                    // alertPopup.then(function(res) {
                    //     $rootScope.navigate('home')
                    //         //console.log('Thank you for not eating my delicious ice cream cone');
                    // });
                })
                        .error(function (err) {
                            var error = [{message: err.Message}]
                            $scope.loaderr = false
                            $scope.errorText = err;
                            $scope.showErrorAlert = true;
                            // $ionicLoading.hide();
                            // $scope.deactivate(error)
                        })
            })
                    .error(function (error) {

//                        $ionicLoading.hide();
                    })
            //$ionicSlideBoxDelegate.slide(index);

        }
    }
})

app.controller('profile_details_page', function ($state, $scope, User) {
    console.log("This is profile_details_page controller");

    // == Setting Customers Profile Information == //

    // $scop.customer_name = localStorageService.get('userName');
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();
    // $scop.customer_name = localStorageService.get();


    User.getOrderHistory()
            .success(function (res) {
                // console.log('Sales History', res);
                if (res != null || res != "") {
                    $scope.salesHistory = res;
                }
            })
            .error(function (err) {
                console.log('error', err);
            })

    User.getCustomerPromotionOffers()
            .success(function (res) {
                console.log('All Customer Promotion Offers', res);
                if (res != null || res != "") {
                    // $scope.consumedPromotions = res;
                }
            })
            .error(function (err) {
                console.log('error', err);
            })


    User.getConsumedPromotionOffers()
            .success(function (res) {
                console.log('All Consumed Promotion Offers', res);
                if (res != null || res != "") {
                    $scope.consumedOffers = res;
                }
            })
            .error(function (err) {
                console.log('error', err);
            })

    User.getAvailablePromotionOffers()
            .success(function (res) {
                console.log('All Available Promotion Offers', res);
                if (res != null || res != "") {
                    // $scope.consumedPromotions = res;
                }
            })
            .error(function (err) {
                console.log('error', err);
            })


})

app.controller('BranchMainInfo', function ($scope, User, Branch, $rootScope) {
    console.log("BranchMainInfo ctrl")
    $scope.saveBtnShow = true;
    $scope.isDataLoading = true;
    $scope.deleteloaderr = [];
    // $scope.showSuccessAlert = false;
    $scope.showErrorAlert = false;
    $scope.errorText = "";

    $scope.showBranchAvailableTab = function () {
        console.log('showBranchAvailableTab');
        $("#branchAvailableServicesTab").show();
    };

    Branch.getAll().success(function (res) {
        console.log("res", res)
        $scope.allBranches = res;
        $rootScope.allBranches = res;
        $scope.isDataLoading = false;
        for (var i = 0; i < res.length; i++) {
            $scope.deleteloaderr.push(false);
        }
    })
            .error(function (err) {
                $scope.isDataLoading = false;
            })
    User.getCities().
            success(function (res) {
                $scope.allCities = res;
                console.log('cities', res)
            })
            .error(function (err) {
                console.log(err)
            })
    $scope.final_obj = {};
    $scope.loaderr = false;

    $scope.addBranch = function () {
        console.log('obj', $scope.final_obj)
        for (var i = 0; i < $scope.allCities.length; i++) {
            if ($scope.final_obj.CityId == $scope.allCities[i].CityId) {
                $scope.final_obj.CityName = $scope.allCities[i].CityName;
            }
        }

        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;




        var errors = [];

        if ($scope.final_obj.BranchName == null || $scope.final_obj.BranchName == "") {
            errors.push({message: 'Name (English) is required'})
        }

        if ($scope.final_obj.BranchNameInArabic == null || $scope.final_obj.BranchNameInArabic == "") {
            errors.push({message: 'Name (Arabic) is required'})
        }

        if ($scope.final_obj.Address == null || $scope.final_obj.Address == "") {
            errors.push({message: 'Address is required'})
        }

        if ($scope.final_obj.Longitude == null || $scope.final_obj.Longitude == "") {
            errors.push({message: 'Longitude is required'})
        }

        if ($scope.final_obj.Latitude == null || $scope.final_obj.Latitude == "") {
            errors.push({message: 'Latitude is required'})
        }

        if ($scope.final_obj.CityId == null || $scope.final_obj.CityId == "") {
            errors.push({message: 'City is required'})
        }




        if (errors.length != 0) {
            console.log('errors occured');
            // $scope.errorText = "Name (English), Name (Arabic), Address , GPS (Longitude) , GPS (Latitude) Or City is Empty";
            $scope.errorText = "";
            for (var i = 0; i < errors.length; i++) {
                console.log('errors occured', errors[i].message);
                if (errors.length - 2 > i) {
                    $scope.errorText += errors[i].message + ", ";
                } else if (errors.length - 2 == i) {
                    $scope.errorText += errors[i].message + " and ";
                }
                else if (errors.length - 1 == i) {
                    $scope.errorText += errors[i].message + "";
                }


            }
            $scope.showErrorAlert = true;
            $scope.switchBool = function (value) {
                $scope[value] = !$scope[value];

            };
            $scope.loaderr = false;


        } else {


            // if ($scope.final_obj.BranchName != null && $scope.final_obj.BranchNameInArabic != null && $scope.final_obj.Address != null && $scope.final_obj.Longitude != null && $scope.final_obj.Latitude != null) {
            Branch.add($scope.final_obj).success(function (res) {

                //$scope.deleteloaderr.push(false);
                $scope.final_obj = {};
                Branch.getAll().success(function (res) {
                    console.log("res", res)
                    $scope.deleteloaderr = [];
                    $scope.allBranches = [];
                    $scope.allBranches = res;
                    $rootScope.allBranches = res;
                    $scope.isDataLoading = false;
                    $scope.loaderr = false;
                    $scope.showErrorAlert = false;
                    for (var i = 0; i < res.length; i++) {
                        $scope.deleteloaderr.push(false);
                    }
                })
                        .error(function (err) {
                            $scope.isDataLoading = false;
                            $scope.loaderr = false;
                        })

            })
                    .error(function (err) {
                        $scope.loaderr = false;
                    })
            // } else {
            //     alert("Please fill all the fields first");
            //     $scope.loaderr = false;
            // }
        }
    }
    $scope.showgrid = true;
    $scope.updataBranch = function (obj, index) {
        $scope.gridindex = index;
        $scope.final_obj = obj;
        $scope.showgrid = false;
        $scope.saveBtnShow = false;
        $scope.updateBtnShow = true;
        $scope.showBranchMainInfoForm = true;
        $scope.showErrorAlert = false;
        $scope.errorText = "";
    }

    $scope.update = function () {
        $scope.loaderr = true;


        $scope.switchBool = function (value) {
            $scope[value] = !$scope[value];
        };
        $scope.loaderr = true;




        var errors = [];

        if ($scope.final_obj.BranchName == null || $scope.final_obj.BranchName == "") {
            errors.push({message: 'Name (English) is required'})
        }

        if ($scope.final_obj.BranchNameInArabic == null || $scope.final_obj.BranchNameInArabic == "") {
            errors.push({message: 'Name (Arabic) is required'})
        }

        if ($scope.final_obj.Address == null || $scope.final_obj.Address == "") {
            errors.push({message: 'Address is required'})
        }

        if ($scope.final_obj.Longitude == null || $scope.final_obj.Longitude == "") {
            errors.push({message: 'Longitude is required'})
        }

        if ($scope.final_obj.Latitude == null || $scope.final_obj.Latitude == "") {
            errors.push({message: 'Latitude is required'})
        }

        if ($scope.final_obj.CityId == null || $scope.final_obj.CityId == "") {
            errors.push({message: 'City is required'})
        }




        if (errors.length != 0) {
            console.log('errors occured');
            // $scope.errorText = "Name (English), Name (Arabic), Address , GPS (Longitude) , GPS (Latitude) Or City is Empty";
            $scope.errorText = "";
            for (var i = 0; i < errors.length; i++) {
                console.log('errors occured', errors[i].message);
                if (errors.length - 2 > i) {
                    $scope.errorText += errors[i].message + ", ";
                } else if (errors.length - 2 == i) {
                    $scope.errorText += errors[i].message + " and ";
                }
                else if (errors.length - 1 == i) {
                    $scope.errorText += errors[i].message + "";
                }


            }
            $scope.showErrorAlert = true;
            $scope.switchBool = function (value) {
                $scope[value] = !$scope[value];

            };
            $scope.loaderr = false;


        } else {




            Branch.update($scope.final_obj).success(function (res) {
                // $scope.allBranches.push($scope.final_obj);
                $scope.allBranches[$scope.gridindex] = $scope.final_obj;
                $scope.final_obj = {};
                $scope.showgrid = true;
                $scope.saveBtnShow = true;
                $scope.updateBtnShow = false;
                $scope.loaderr = false;
                $scope.showErrorAlert = false;
            })
                    .error(function (err) {
                        $scope.loaderr = false;
                    })
        }
    }

    $scope.deleteBranch = function (obj, index) {
        $scope.deleteloaderr[index] = true;
        Branch.delete(obj.Id).success(function (res) {
            $scope.deleteloaderr[index] = false;
            $scope.allBranches.splice(index, 1);
        })
                .error(function (err) {
                    $scope.deleteloaderr[index] = false;
                })
    }
})

app.controller('BranchAvailableSeviceCtrl', function ($http, $scope, $rootScope, Branch, User, $window) {
    $scope.final_obj = {};
    $scope.final_obj.Id = $rootScope.branchId;
    $scope.loaderr = false;
    $scope.updateAvailableServices = function () {
        console.log("Saving Available Service");
        var final_Services = [];

        for (var i = 0; i < $rootScope.allServices.length; i++) {
            if ($rootScope.allServices[i].checked) {
                final_Services.push($rootScope.allServices[i]);
            }
        }
        $scope.loaderr = true;

//        updating form
        var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
        var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
        $http.post(url, params, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (result) {
            $http.post('http://autotecapi.azurewebsites.net/api/branch/' + $rootScope.branchId + '/services ', final_Services, {
                headers: {
                    'Authorization': "Bearer" + " " + result.access_token
                }
            }).success(function (res) {
                console.log('scucessfully saved');
                $scope.loaderr = false;
                $window.location.reload();
            })
                    .error(function (err) {
                        console.log('error in saving');
                        $scope.loaderr = false;
                    });
        });
    }
});

app.controller('BranchShitfCtrl', function ($scope, Branch, $rootScope, $filter, $window) {
    $scope.final_obj = {};
    $scope.dateObj = {};
    $scope.saveBtnShow = true;
    $scope.updateBtnShow = false;
    $scope.loaderr = false;
    $scope.showgrid = true;

    Branch.getShiftYears().success(function (res) {
        console.log("shift years", res);
        $rootScope.ShiftYears = [];
        $rootScope.ShiftYears = res;
        $rootScope.deleteShiftYearloader = [];
        $rootScope.shiftYearLoading = false;
        for (var i = 0; i < res.length; i++) {
            $rootScope.deleteShiftYearloader.push(false);
        }
        $scope.loaderr = false;
    })
            .error(function (err) {
                $rootScope.shiftYearLoading = false;
                $scope.loaderr = false;
            });

//for adding shift year in shift year setup form
    $scope.addShftYear = function () {
        try {

            $scope.final_obj.YearStartDate = $filter("date")($scope.dateObj.YearStartDate, 'yyyy-MM-dd');
            $scope.final_obj.YearEndDate = $filter("date")($scope.dateObj.YearEndDate, 'yyyy-MM-dd');
            $scope.loaderr = true;
            Branch.addShiftYears($scope.final_obj).success(function (res) {
                console.log("res", res);
                $window.location.reload();
            })
                    .error(function (err) {
                        $scope.loaderr = false;
                    })
        } catch (err) {

        }

    }

//for deleting shift year in shift year setup form
    $scope.deleteShift = function (obj, index) {
        $rootScope.deleteShiftYearloader[index] = true;
        Branch.deleteShiftYears(obj.Id).success(function (res) {
            $rootScope.deleteShiftYearloader[index] = false;
            $rootScope.ShiftYears.splice(index, 1);
        })
                .error(function (err) {
                    $rootScope.deleteShiftYearloader[index] = false;
                })
    }

//for updating shift year in shift year setup form
    $scope.update = function () {
        try {
            $scope.final_obj.YearStartDate = $filter("date")($scope.dateObj.YearStartDate, 'yyyy-MM-dd');
            $scope.final_obj.YearEndDate = $filter("date")($scope.dateObj.YearEndDate, 'yyyy-MM-dd');

            console.log($scope.final_obj)
            $scope.loaderr = true;
            Branch.updateShiftYears($scope.final_obj).success(function (res) {
                console.log("res", res);
                $rootScope.ShiftYears[$scope.gridindex] = $scope.final_obj;
                $scope.loaderr = false;
                $scope.final_obj = {};
                $scope.saveBtnShow = true;
                $scope.updateBtnShow = false;
                $scope.showgrid = true;
            })
                    .error(function (err) {
                        $scope.loaderr = false;
                    })
        } catch (err) {

        }
    }

//used when click on update button from grid
    $scope.updateShiftYear = function (obj, $index) {
        $scope.gridindex = $index;
        $scope.final_obj = obj;
        $scope.dateObj = {
            YearStartDate: new Date(obj.YearStartDate),
            YearEndDate: new Date(obj.YearEndDate)
        }
        $scope.saveBtnShow = false;
        $scope.updateBtnShow = true;
        $scope.showgrid = false;
    }
    ////////////////////////////////Branch shifts portions///////////////////////////////////////
    $scope.brShiftObj = {};
    $scope.isBranchShiftLoading = false;
    $scope.timeObj = {};
    $scope.deleteBranchShiftLoader = [];

    $scope.saveShiftButton = true;
    $scope.updateShiftButton = false;
    $scope.showShiftGrid = false;
    $scope.getBranchShifts = function () {
        $scope.isBranchShiftLoading = true;
        $scope.deleteBranchShiftLoader = [];

        Branch.getBranchShifts($rootScope.branchId, $scope.addShiftObj.ShiftYearId).success(function (res) {
            $scope.isBranchShiftLoading = false;
            if (res.length > 0) {
                $scope.allBranchShifts = res;
                $scope.addShiftObj.BranchWorkingDayId = res[0].Id;
                $scope.addShiftObj.ShiftTitle_En = res[0].ShiftTitle_En;
                $scope.addShiftObj.ShiftTitle_Ar = res[0].ShiftTitle_Ar;
                $scope.timeObj.ShiftStartTime = new Date(res[0].ShiftStartTime);
                $scope.timeObj.ShiftEndTime = new Date(res[0].ShiftEndTime);
                $scope.saveShiftButton = false;
                $scope.updateShiftButton = true;
            } else {
                $scope.addShiftObj.BranchWorkingDayId = "";
                $scope.addShiftObj.ShiftTitle_En = "";
                $scope.addShiftObj.ShiftTitle_Ar = "";
                $scope.timeObj.ShiftStartTime = "";
                $scope.timeObj.ShiftEndTime = "";
                $scope.saveShiftButton = true;
                $scope.updateShiftButton = false;
                console.log('Shift not exist for this Branch', res);
            }
        }).error(function (err) {
            console.log('err', err);
            $scope.isBranchShiftLoading = false;

        })
    }

    $scope.deleteBranchShift = function (obj, index) {
        $scope.deleteBranchShiftLoader[index] = true;
        Branch.deleteBranchShift(obj.Id).success(function (res) {
            $scope.deleteBranchShiftLoader[index] = false;
            $scope.allBranchShifts.splice(index, 1);
        })
                .error(function (err) {
                    $scope.deleteBranchShiftLoader[index] = false;
                })
    }

    $scope.addShiftObj = {};
    $scope.SaveShiftloader = false;

    $scope.addBranchShift = function () {

        $scope.addShiftObj.BranchId = $rootScope.branchId;
        $scope.addShiftObj.ShiftEndTime = $filter("date")($scope.timeObj.ShiftEndTime, 'h:mm a');
        $scope.addShiftObj.ShiftStartTime = $filter("date")($scope.timeObj.ShiftStartTime, 'h:mm a');

        $scope.SaveShiftloader = true;
        Branch.addBranchShifts($scope.addShiftObj).success(function (res) {
            console.log("Form is saved successfully");
            $scope.SaveShiftloader = false;
            $scope.addShiftObj = {};
            $scope.timeObj = {};
            $window.location.reload();

        }).error(function (err) {
            console.log("Error in saving Form");
            $scope.SaveShiftloader = false;
        })
    };

    $scope.updateBranchShift = function (obj, $index) {

        $scope.gridShiftindex = $index;
        $scope.addShiftObj = obj;
        console.log("obj", $scope.addShiftObj, $scope.addShiftObj.ShiftYearId);
        $scope.timeObj = {
            ShiftStartTime: new Date(obj.ShiftStartTime),
            ShiftEndTime: new Date(obj.ShiftEndTime)
        };

        $scope.saveShiftButton = false;
        $scope.updateShiftButton = true;
        $scope.showShiftGrid = false;
    }

    $scope.updateShift = function () {
        try {
            $scope.addShiftObj.ShiftStartTime = $filter("date")($scope.timeObj.ShiftStartTime, 'h:mm a');
            $scope.addShiftObj.ShiftEndTime = $filter("date")($scope.timeObj.ShiftEndTime, 'h:mm a');
            $scope.addShiftObj.Id = $scope.addShiftObj.BranchWorkingDayId;
            $scope.addShiftObj.BranchId = $rootScope.branchId;

            console.log('Shift Year ID', $scope.addShiftObj);

            $scope.SaveShiftloader = true;

            Branch.updateBranchShift($scope.addShiftObj).success(function (res) {
                $scope.SaveShiftloader = false;
                $scope.addShiftObj = {};
                $scope.timeObj = {};
                $window.location.reload();
            })
                    .error(function (err) {
                        $scope.SaveShiftloader = false;
                        $scope.addShiftObj = {};
                        $scope.timeObj = {};
                        $scope.saveShiftButton = true;
                        $scope.updateShiftButton = false;
                    });
        } catch (err) {

        }
    }
})

app.controller('BranchWorkingCtrl', function ($scope, $rootScope, $window, Branch) {
    $scope.final_obj = {};
    $scope.loaderr1 = false;
    $scope.updateWorkingDay = function () {
        var final_Days = [];
        for (var i = 0; i < $rootScope.days.length; i++) {
            if ($rootScope.days[i].checked) {
                final_Days.push($rootScope.days[i].value);
            }
        }
        $scope.loaderr1 = true;
        Branch.updateWorkingDay(final_Days, $rootScope.branchId).success(function (res) {
            $scope.loaderr1 = false;
            $window.location.reload();
        }).error(function (err) {
            console.log("Failed to update working days");
            $scope.loaderr1 = false;
        });
    }
});


app.controller('BranchSetupCtrl', function ($scope, Branch, $rootScope) {

    $rootScope.btnCaption = "Add New";
    $rootScope.shiftYearLoading = true;
    $rootScope.deleteShiftYearloader = [];
    $rootScope.showAddNewButton = true;
    $scope.showBranchMainInfoForm = false;
    // $scope.showErrorAlert = false;


    $scope.showMainBranchInfoForm = function () {
        if ($scope.showBranchMainInfoForm) {
            $scope.showBranchMainInfoForm = false;
        } else {
            $scope.showBranchMainInfoForm = true;
        }
    };

    Branch.getShiftYears().success(function (res) {
        $rootScope.ShiftYears = res;
        $rootScope.shiftYearLoading = false;
        for (var i = 0; i < res.length; i++) {
            $rootScope.deleteShiftYearloader.push(false);
        }
    })
            .error(function (err) {
                $rootScope.shiftYearLoading = false;
            });
});

app.controller('SignupCtrl', ['$scope', '$rootScope', '$http', '$state', '$location', function ($scope, $rootScope, $http, $state, $location, $window) {

        $scope.user = {};
        $scope.user.MobileNumber = "";
        var User = {
            UserName: "",
            Password: ""
        };
        $scope.regex = '^[a-zA-Z]+[a-zA-Z0-9._-]+@[a-z]+\.[a-z.]{2,5}$';

        $scope.register = function (user) {
            var errors = [];
            if ($scope.user.FirstName == null || $scope.user.FirstName == "") {
                errors.push({message: 'First Name is required'})
            }

            if ($scope.user.MobileNumber == null || $scope.user.MobileNumber == "") {
                errors.push({message: 'Mobile Number is required'})
            }

            if ($scope.user.Password == null || $scope.user.Password == "") {
                errors.push({message: 'Password is required'})
            }

            if ($scope.user.EmailAddress == null || $scope.user.EmailAddress == "") {
                errors.push({message: 'Email is required'});
            }
            // else {
            //     var email = $scope.user.EmailAddress.match($scope.regex);
            //     if (email == null) {
            //         console.log("Error-4a");
            //         errors.push({message: 'Not a valid email'});
            //     }
            // }

            // if ($scope.user.LastName == null || $scope.user.LastName == "") {
            //     errors.push({ message: 'Last Name is required' })
            // }


            //  if ($scope.user.ReferredById == null || $scope.user.ReferredById == "Select Reference") {
            //     errors.push({ message: 'Reference is required' })
            // }


            //  if ($scope.user.PromoKey == null || $scope.user.PromoKey == "") {
            //     errors.push({ message: 'Promo Key is required' })
            // }

            if (errors.length != 0) {
                $scope.register_error_message = "Failed to Add Customer";
                for (var i = 0; i < errors.length; i++) {
                    if (errors[i].message == "First Name is required") {
                        $scope.register_error_message_firstname = errors[i].message;
                        ;
                    }

                    if (errors[i].message == "Mobile Number is required") {
                        $scope.register_error_message_mobileno = errors[i].message;
                        ;
                    }

                    if (errors[i].message == "Password is required") {
                        $scope.register_error_message_password = errors[i].message;
                        ;
                    }

                    if (errors[i].message == "Not a valid email" || errors[i].message == "Email is required") {
                        $scope.register_error_message_email = errors[i].message;
                    }
                }
                ;

            } else {
                var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
                User['UserName'] = $scope.user.MobileNumber;
                User['Password'] = $scope.user.Password;
                $scope.user.User = User;
                $scope.user.Id = null;
                var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
                $http.post(url, params, {
                    headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                })
                        .success(function (result) {
                            $http.post('http://autotecapi.azurewebsites.net/api/CustomerRegistration', $scope.user, {
                                headers: {
                                    'Authorization': "Bearer" + " " + result.access_token
                                }
                            }).success(function (res) {
                                if (res == "Customer has been registerd succesfully") {
                                    console.log("Customer Registered Successfully");
                                    $scope.register_error_message = "Customer Registered Successfully";
                                    $location.path('/mobileappusers');
                                } else {
                                    console.log("Failed to Register Customer");
                                    $scope.register_error_message = "Failed to Register Customer";
                                }
                            })
                                    .error(function (err) {
                                        if (err.Message == "" || err.Message != null) {
                                            if (err.Message == "User name not available") {
                                                console.log("Failed to Add Customer");
                                            } else {

                                            }
                                        } else {

                                        }
                                    })
                        })
                        .error(function (error) {
                            console.log("API calling Error", error);
                            $scope.register_error_message = "Failed to Add Customer";
                        })

            }
        }

    }])

app.service('NavigateState', function ($state, localStorageService) {
    this.navigate = function (state, params) {
        //      $rootScope.navigate=function(state,params){
        var lang = localStorageService.get('pageLanguage');
        //     console.log(lang);
        if (lang == 'en') {
            if (params) {
                $state.go(state, params)
            } else {
                $state.go(state)
            }
        } else {
            if (params) {
                $state.go(state + 'a', params)
            } else {
                $state.go(state + 'a')
            }
        }

    }
})

app.controller('scheduleAppointment', function ($stateParams, $scope, User, Appointment, $http, $state, $rootScope, $filter, $window) {
    $scope.finalObj = {};
    $scope.finalObj.AppointmentSlot = {};

//    get the customer for whom we are scheduling appointment
    User.getSingleAppUser($stateParams.id).success(function (res) {
        if (res !== "" || res !== 'undefined') {
            $scope.finalObj.CustomerId = $stateParams.id;
            $scope.CustomerName = res[0].FirstName;
        } else {
            $scope.finalObj.CustomerName = 'Unknown';
            $scope.finalObj.CustomerId = '0';
        }
    }).error(function (err) {
        $scope.finalObj.CustomerName = 'Unknown';
        $scope.finalObj.CustomerId = '0';
    });

    //  for cities
    User.getCities().success(function (res) {
        //$scope.allCities = res;

        $scope.cities = {
            selectedOption: {CityId: res[0].CityId, CityName: res[0].CityName},
            availableOptions: res
        };


    });

    Appointment.getBranches($scope.selectedCity).success(function (res) {
        $scope.branches = {
            selectedOption: {Id: res[0].Id, BranchName: res[0].BranchName},
            availableOptions: res
        };
    })

    Appointment.getServices(3).success(function (res) {

        $scope.services = {
            selectedOption: {Id: res[0].Id, Title_Eng: res[0].Title_Eng},
            availableOptions: res
        };
    })

    $scope.branches = {};
//    prepare all disable dates (array)
    $scope.disableDates = new Array();

    Appointment.getAnnualHolidayDays().success(function (res) {
        console.log(res);
        for (var i = 0; i < res.length; i++) {
            var currentDate = new Date(res[i].StartDate);
            var endDate = new Date(res[i].EndDate);
            var j = 0;
            if (currentDate == endDate) {
                j = j + 1;
                $scope.disableDates.push($filter("date")(currentDate, 'dd-MM-yyyy'));
            } else {
                while (currentDate < endDate) {
                    j = j + 1;
                    currentDate = new Date(currentDate.setDate(currentDate.getDate() + 1));
                    $scope.disableDates.push($filter("date")(currentDate, 'dd-MM-yyyy'));
//                    console.log((j) + (i) + '->' + $filter("date")(currentDate, 'dd-MM-yyyy'));
                }
            }
        }
//        console.log($scope.disableDates);
    });

//    api/AvailableAppointmentSlot s/{branchId}/{serviceId}/{year }/{month}/{day}

    // Appointment.getBranches($scope.cities.selectedOption.CityId).success(function (res) {
    //     console.log(res);
    //     $ionicLoading.hide();
    //     $scope.branches = {
    //         selectedOption: {Id: res[0].Id, BranchName: res[0].BranchName},
    //         availableOptions: res
    //     };
    // })



// for city
    $scope.cityChanged = function () {
        console.log('city id', $scope.selectedCity);

        Appointment.getBranches($scope.selectedCity).success(function (res) {
            $scope.branches = {
                selectedOption: {Id: res[0].Id, BranchName: res[0].BranchName},
                availableOptions: res
            };
        })
                .error(function (err) {
                    console.log(err);
                })

        Appointment.getBranchWorkingDays($scope.branches.selectedOption.Id).success(function (res) {
            console.log("WORKING DAYS", res);
        })

    }


//  for branch
    $scope.branchChanged = function () {
        console.log($scope.cities.selectedOption)
        Appointment.getServices($scope.branches.selectedOption.Id).success(function (res) {
            if (res[0] != null) {
                $scope.services = {
                    selectedOption: {Id: res[0].Id, Title_Eng: res[0].Title_Eng},
                    availableOptions: res
                }
            } else {
                $scope.services = {};
            }
        });

        User.getBranchWorkingDays($scope.branches.selectedOption.Id).success(function (res) {
            console.log('Working Days', res);
            $scope.app
        });

    }

    $rootScope.$on('AppointmentDataChanged', function (evt, args) {
        console.log("data is", args.data);
        $scope.appointments = args.data.availableOptions;
    });


    $scope.mixtime = function () {
        console.log($scope.finalObj);
    }

    $scope.dateObj = {};
    $scope.getAvailableDate = function () {
        console.log('the date', $scope.dateObj.selectdDate);
        return;
        $http.post(url, params, {
            headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        }).success(function (result) {
            $http.post('http://autotecapi.azurewebsites.net/api/customer/appointment/schedule', $scope.scheduleAppointmentObject, {
                headers: {
                    'Authorization': "Bearer" + " " + result.access_token
                }
            }).success(function (res) {
                console.log('scucessfully saved');

                $scope.loaderr = false;
//                    $scope.showSuccessAlert = true;
//                    $scope.isDataLoading = false;
//                    $window.location.reload();
            })
                    .error(function (err) {
                        console.log('error in saving');
                        $scope.loaderr = false;
//                            $scope.errorText = err.Message;
//                            $scope.showErrorAlert = true;
//                            console.log(err)
//                            $scope.isDataLoading = false;
                    });

        });
    }


//    saving form
    $scope.scheduleAppointment = function () {
//        console.log("searchedCustomer", $scope.searchedCustomer);
//        console.log("searchedCustomer", $scope.selectedBranch);
//        console.log("searchedCustomer", $scope.selectedServices);
//        console.log("searchedCustomer", $scope.selectdDate);
//        console.log("searchedCustomer", $scope.selectStartTime);
//        console.log("searchedCustomer", $scope.selectEndTime);

//        $scope.switchBool = function (value) {
//            $scope[value] = !$scope[value];
//        };

        $scope.loaderr = true;
//        $scope.showSuccessAlert = false;
//        $scope.showSuccessAlertDelete = false;
//        $scope.showErrorAlert = false;
//        $scope.errorText = "";

        if ($scope.searchedCustomer != "" && $scope.selectedBranch != "" && $scope.selectedServices != "" && $scope.selectdDate != "" && $scope.selectStartTime != "" && $scope.selectEndTime != "") {
            var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
            var formatedDate = $filter("date")($rootScope.appointDate, 'yyyy-MM-dd');
            var startTime = formatedDate + ' ' + $filter("date")($scope.selectStartTime, 'hh:mm a');
            var endTime = formatedDate + ' ' + $filter("date")($scope.selectEndTime, 'hh:mm a');
            $scope.scheduleAppointmentObject = {
                CustomerId: $scope.searchedCustomer,
                TypeOfService: $scope.selectedServices,
                AppointmentSlot: {BranchId: $scope.selectedBranch, AppointmentDate: formatedDate, StartTime: startTime, EndTime: endTime}
            };

            $scope.finalObj.AppointmentSlot.AppointmentDate = formatedDate;
            $scope.finalObj.AppointmentSlot.StartTime = formatedDate + ' ' + $scope.finalObj.mixtime.split("-")[0]
            $scope.finalObj.AppointmentSlot.EndTime = formatedDate + ' ' + $scope.finalObj.mixtime.split("-")[1]
            console.log('ready object now', $scope.scheduleAppointmentObject);
            var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
            $http.post(url, params, {
                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
            }).success(function (result) {
                $http.post('http://autotecapi.azurewebsites.net/api/customer/appointment/schedule', $scope.finalObj, {
                    headers: {
                        'Authorization': "Bearer" + " " + result.access_token
                    }
                }).success(function (res) {
                    console.log('scucessfully saved');

                    $scope.loaderr = false;
//                    $scope.showSuccessAlert = true;
//                    $scope.isDataLoading = false;
//                    $window.location.reload();
                })
                        .error(function (err) {
                            console.log('error in saving');
                            $scope.loaderr = false;
//                            $scope.errorText = err.Message;
//                            $scope.showErrorAlert = true;
//                            console.log(err)
//                            $scope.isDataLoading = false;
                        });

            });
        } else {
            alert("Please fill all the fields first");
            $scope.loaderr = false;
        }

    }

    $scope.searchCustomerByNameNMobile = function () {
        if ($scope.searchedCustomer != "") {
            User.searchSingleAppUser($scope.searchedCustomer, "0ns", "0ns", 0, 10).success(function (res) {
                console.log('searched customer', res);
            })
                    .error(function (err) {
                        console.log('error in customer search')
                    })


        }
    }



})

app.controller('AppointCalenderCtrl', function ($scope, Appointment, $filter, $http, localStorageService, $rootScope) {
    var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
    $scope.selectedBranch = "";
    $scope.selectedServices = "";
    $scope.selectedView = "";
    $scope.selectedStartDate = "";

    Appointment.getBranches().success(function (res) {
        $scope.branches = {
            selectedOption: {Id: res[0].Id, BranchName: res[0].BranchName},
            availableOptions: res
        };
    })

    Appointment.getServices(3).success(function (res) {

        $scope.services = {
            selectedOption: {Id: res[0].Id, Title_Eng: res[0].Title_Eng},
            availableOptions: res
        };
    })

    // default values of View Combo Box



    $scope.branches = {};
//  for branch
    $scope.branchChanged = function () {
        // console.log($scope.cities.selectedOption)
        Appointment.getServices($scope.branches.selectedOption.Id).success(function (res) {
            if (res[0] != null) {
                $scope.services = {
                    selectedOption: {Id: res[0].Id, Title_Eng: res[0].Title_Eng},
                    availableOptions: res
                }
            } else {
                $scope.services = {};
            }
        })

    }

    $scope.changeDateAndView = function () {

        $scope.mydate = new Date($scope.startDate);

        // var numberOfDaysToAdd = $scope.selectedView;
        // $scope.newdate = $scope.mydate.setDate($scope.mydate.getDate() + numberOfDaysToAdd);


        Date.prototype.addDays = function (days) {
            var dat = new Date(this.valueOf());
            dat.setDate(dat.getDate() + days);
            return dat;
        }

        $scope.newdate = $scope.mydate.addDays(parseInt($scope.selectedView))

        console.log('Selected date', $scope.startDate);
        console.log('Selected view', $scope.selectedView);
        console.log('Added date', $scope.newdate);


        var startDate = $filter("date")($scope.startDate, 'yyyy-MM-dd');
        var endDate = $filter("date")($scope.newdate, 'yyyy-MM-dd');

        localStorageService.set("DateObj", {startDate: startDate, endDate: endDate, selectedView: $scope.selectedView})

        $rootScope.$broadcast('DateChangeEvent', {startDate: startDate, endDate: endDate, selectedView: $scope.selectedView})
        // var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
        // $http.post(url, params, {
        //     headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
        // }).success(function (result) {
        //     $http.get('http://autotecapi.azurewebsites.net/api/appointments/'+startDate+'/'+endDate, {
        //         headers: {
        //             'Authorization': "Bearer" + " " + result.access_token
        //         }
        //     }).success(function (res) {

        //         console.log('scucessfully get',res);
        //     })
        //     .error(function (err) {
        //         console.log('error in api');
        //     });
        // });


        // console.log('test1',$scope.selectedView+' '+$filter("date")($scope.newdate, 'yyyy-MM-dd'));

    }





})

app.controller('CalendarCtrl', function ($scope, $compile, uiCalendarConfig, $filter, localStorageService, $rootScope, Appointment) {
    var date = new Date();
    var d = date.getDate();
    var m = date.getMonth();
    var y = date.getFullYear();

    $scope.changeTo = 'Hungarian';
    /* event source that pulls from google.com */
    $scope.eventSource = {
        url: "http://www.google.com/calendar/feeds/usa__en%40holiday.calendar.google.com/public/basic",
        className: 'gcal-event', // an option!
        currentTimezone: 'America/Chicago' // an option!
    };
    /* event source that contains custom events on the scope */
    $scope.events = [
    ];
    /* event source that calls a function on every view switch */
    $scope.eventsF = function (start, end, timezone, callback) {
        var s = new Date(start).getTime() / 1000;
        var e = new Date(end).getTime() / 1000;
        var m = new Date(start).getMonth();
        var events = [{title: 'Feed Me ' + m, start: s + (50000), end: s + (100000), allDay: false, className: ['customFeed']}];
        callback(events);
    };

    var dateObj = localStorageService.get("DateObj");

    $scope.calEventsExt = {
        color: '#f00',
        textColor: 'yellow',
        events: [
            {type: 'party', title: 'Lunch', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false},
            {type: 'party', title: 'Lunch 2', start: new Date(y, m, d, 12, 0), end: new Date(y, m, d, 14, 0), allDay: false},
            {type: 'party', title: 'Click for Google', start: new Date(y, m, 28), end: new Date(y, m, 29), url: 'http://google.com/'}
        ]
    };
    /* alert on eventClick */
    $scope.alertOnEventClick = function (date, jsEvent, view) {
        $scope.alertMessage = (date.title + ' was clicked ');
    };
    /* alert on Drop */
    $scope.alertOnDrop = function (event, delta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = ('Event Droped to make dayDelta ' + delta);
    };
    /* alert on Resize */
    $scope.alertOnResize = function (event, delta, revertFunc, jsEvent, ui, view) {
        $scope.alertMessage = ('Event Resized to make dayDelta ' + delta);
    };
    /* add and removes an event source of choice */
    $scope.addRemoveEventSource = function (sources, source) {
        var canAdd = 0;
        angular.forEach(sources, function (value, key) {
            if (sources[key] === source) {
                sources.splice(key, 1);
                canAdd = 1;
            }
        });
        if (canAdd === 0) {
            sources.push(source);
        }
    };
    /* add custom event*/
    $scope.addEvent = function () {
        $scope.events.push({
            title: 'Open Sesame',
            start: new Date(y, m, 28),
            end: new Date(y, m, 29),
            className: ['openSesame']
        });
    };
    /* remove event */
    $scope.remove = function (index) {
        $scope.events.splice(index, 1);
    };
    /* Change View */
    $scope.changeView = function (view, calendar) {
        uiCalendarConfig.calendars[calendar].fullCalendar('changeView', view);
    };
    /* Change View */
    $scope.renderCalender = function (calendar) {
        if (uiCalendarConfig.calendars[calendar]) {
            uiCalendarConfig.calendars[calendar].fullCalendar('render');
        }
    };
    /* Render Tooltip */
    $scope.eventRender = function (event, element, view) {
        element.attr({'tooltip': event.title,
            'tooltip-append-to-body': true});
        $compile(element)($scope);
    };

    $rootScope.$on('DateChangeEvent', function (ev, args) {
        console.log("Args", args);
        /* config object */
        $scope.uiConfig = {
            calendar: {
                height: 450,
                editable: true,
                header: {
                    left: '',
                    center: 'title',
                    right: 'today prev,next'
                },
                defaultView: (args.selectedView == "1" ? 'basicDay' : (args.selectedView == "7" ? 'basicWeek' : 'month')) || 'month',
                defaultDate: typeof args.startDate == "undefined" ? new Date() : new Date(args.startDate),
                gotoDate: new Date(args.startDate),
                eventClick: $scope.alertOnEventClick,
                eventDrop: $scope.alertOnDrop,
                eventResize: $scope.alertOnResize,
                eventRender: $scope.eventRender
            }
        };
        $rootScope.$broadcast('InitializeCalender', {});

        /* event source that contains custom events on the scope */

        var startDate = $filter("date")(new Date(args.startDate), 'yyyy-MM-dd');
        var endDate = $filter("date")((new Date(args.endDate)), 'yyyy-MM-dd');
        Appointment.getAppointmentStartDate(startDate, endDate).success(function (res) {
            console.log("succeesss1", res)
            //$scope.events = [];
            var tempLength = $scope.events.length;
            // console.log("temp length", tempLength)
            if ($scope.events.length > 0) {
                // console.log("in if");
                // $scope.events = []; 
                for (var j = 0; j < tempLength; j++) {
                    $scope.events.splice(0, 1);
                }

            }
            // console.log("argss", $scope.events)
            var eventObj = [];
            var Dates;

            for (var i = 0; i < res.length; i++) {
                Dates = $filter("date")(res[i].AppointmentDate, 'yyyy-MM-dd');
                if (eventObj.hasOwnProperty(Dates)) {
                    eventObj[Dates]++;
                } else {
                    eventObj[Dates] = 1;
                }
            }
            // console.log("eventObj", eventObj)
            // console.log("eventObj lenght", eventObj.length)
            if (args.selectedView == "7" || args.selectedView == "30") {
                for (key in eventObj) {
                    // console.log("key "+ key + ", value "+eventObj[key])
                    $scope.events.push({title: 'Appointment : ' + eventObj[key], start: new Date(key)})
                }
            } else {


                for (var i = 0; i < res.length; i++) {
                    $scope.events.push({
                        title: res[i].CustomerName + ' ' + $filter("date")(res[i].AppointmentStartTime, 'h:m:a') + ' ' + $filter("date")(res[i].AppointmentEndTime, 'h:m:a'),
                        start: new Date(res[i].AppointmentStartTime),
                        end: new Date(res[i].AppointmentEndTime)})
                }

            }

            // console.log("argss", $scope.events)
            /* event sources array*/
            $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
            $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
        })
                .error(function (err) {
                    console.log("Err", err)
                })
    })




    $scope.uiConfig = {
        calendar: {
            height: 450,
            editable: true,
            header: {
                left: '',
                center: 'title',
                right: 'today prev,next'
            },
            defaultView: 'month',
            defaultDate: new Date(),
            eventClick: $scope.alertOnEventClick,
            eventDrop: $scope.alertOnDrop,
            eventResize: $scope.alertOnResize,
            eventRender: $scope.eventRender
        }
    };

// console.log("$scope.uiConfig", $scope.uiConfig)
    //$scope.uiConfig.gotoDate(new Date("08-01-2017"))

    Date.prototype.addDays = function (days) {
        var dat = new Date(this.valueOf());
        dat.setDate(dat.getDate() + days);
        return dat;
    }

    //var enddate= new Date()

    var startDate = $filter("date")(new Date(), 'yyyy-MM-dd');
    var endDate = $filter("date")((new Date()).addDays(30), 'yyyy-MM-dd');
    Appointment.getAppointmentStartDate(startDate, endDate).success(function (res) {
        console.log("succeesss2", res)

        var eventObj = [];
        var Dates;

        for (var i = 0; i < res.length; i++) {
            Dates = $filter("date")(res[i].AppointmentDate, 'yyyy-MM-dd');
            if (eventObj.hasOwnProperty(Dates)) {
                eventObj[Dates]++;
            } else {
                eventObj[Dates] = 1;
            }
        }
        // console.log("eventObj", eventObj)
        // console.log("eventObj lenght", eventObj.length)
        // if (args.selectedView == "7" || args.selectedView == "30") {
        for (key in eventObj) {
            // console.log("key "+ key + ", value "+eventObj[key])
            $scope.events.push({title: 'Appointments : ' + eventObj[key], start: new Date(key)})
        }
        // }else{
        //     for (var i = 0; i < res.length; i++) {
        //         $scope.events.push({title: res[i].CustomerName, start: new Date(res[i].AppointmentStartTime), end: new Date(res[i].AppointmentEndTime)})
        //     }
        // }
    })
            .error(function (err) {
                console.log("Err", err)
            })

    $scope.changeLang = function () {
        if ($scope.changeTo === 'Hungarian') {
            $scope.uiConfig.calendar.dayNames = ["Vasárnap", "Hétfo", "Kedd", "Szerda", "Csütörtök", "Péntek", "Szombat"];
            $scope.uiConfig.calendar.dayNamesShort = ["Vas", "Hét", "Kedd", "Sze", "Csüt", "Pén", "Szo"];
            $scope.changeTo = 'English';
        } else {
            $scope.uiConfig.calendar.dayNames = ["Sunday", "Monday", "Tuesday", "Wednesday", "Thursday", "Friday", "Saturday"];
            $scope.uiConfig.calendar.dayNamesShort = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
            $scope.changeTo = 'Hungarian';
        }
    };
    /* event sources array*/
    $scope.eventSources = [$scope.events, $scope.eventSource, $scope.eventsF];
    $scope.eventSources2 = [$scope.calEventsExt, $scope.eventsF, $scope.events];
});
/* EOF */