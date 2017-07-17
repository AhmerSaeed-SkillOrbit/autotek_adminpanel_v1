angular.module('Autotek.directive', [])

        .directive('headerBarSupremeEnglish', function () {
            return {
                restrict: 'AE',
                templateUrl: 'EnglishTemplates/partials/header.html',
                controller: "LogoutCtrl"
            }
        })

        .directive('leftSideBarEnglish', function () {
            return {
                restrict: 'AE',
                templateUrl: 'EnglishTemplates/partials/leftsidebar.html',
                controller: "LogoutCtrl"
            }
        })

        .directive('footerBarEnglish', function () {
            return {
                restrict: 'AE',
                templateUrl: 'EnglishTemplates/partials/footer.html'
            }
        })
        // Arabic Directives//
        .directive('headerBarSupremeArabic', function () {
            return {
                restrict: 'AE',
                templateUrl: 'ArabicPages/partials/header.html',
                controller: "LogoutCtrl"
            }
        })
        .directive('leftSideBarArabic', function () {
            return {
                restrict: 'AE',
                templateUrl: 'ArabicPages/partials/leftsidebar.html',
                controller: "LogoutCtrl"
            }
        })

        .directive('footerBarArabic', function () {
            return {
                restrict: 'AE',
                templateUrl: 'ArabicPages/partials/footer.html'
            }
        })

        .directive('setTimeDirective', function ($rootScope) {
            return {
                restrict: 'AE',
                scope: {
                    time: '=time',
                    endtime: '=endtime',
                    branchstarttime: '=branchstarttime',
                    branchendtime: '=branchendtime'
                },
                link: function (scope, elem, attr) {
                    elem.bind('click', function () {
                        console.log("in directive", scope.time)
                        $("#startTime").val(scope.time.split('T')[1]);
                        $("#endTime").val(scope.endtime.split('T')[1]);
                        console.log("in directive befor", scope.branchstarttime)
                        $rootScope.branchstarttime = $("#startTime").val();
                        console.log("in directive", $rootScope.branchstarttime)
                        $rootScope.branchendtime = $("#endTime").val();
                    })
                }
            }
        })

        .directive("openModal", function () {
            return {
                restrict: 'AE',
                link: function (scope, elem, attr) {
                    elem.bind('click', function () {
                        console.log("hello ooo")
                        $('#myModal').modal('show');
                    })
                }
            }
        })

        .directive("closeModal", function () {
            return {
                restrict: 'AE',
                link: function (scope, elem, attr) {
                    elem.bind('click', function () {
                        console.log("hello ooo")
                        $('#myModal').modal('hide');
                    })
                }
            }
        })

        .directive('timeMask', function () {
            return {
                restrict: 'AE',
                link: function (scope, elem, attr) {
                    $('#endTime').mask('00:00 AM', {
                        'translation': {
                            A: {pattern: /[A,P]/},
                        },
                        'placeholder': "__:__ __"
                    });
                }
            }
        })

        .directive('gpsMasklatitude', function () {
            return {
                restrict: 'AE',
                link: function (scope, elem, attr) {
                    $('#latitude').mask('99.9999', {'placeholder': "__.____"})
                }
            }
        })
        .directive('gpsMasklongitude', function () {
            return {
                restrict: 'AE',
                link: function (scope, elem, attr) {
                    $('#longitude').mask('99.9999', {'placeholder': "__.____"})
                }
            }
        })

        .directive('disabledates', function (User, $http, $rootScope) {
            return {
                restrict: 'AE',
                scope: {
                    dates: '=dates',
                    branchid: '=branchid',
                    serviceid: '=serviceid'
                },
                link: function (scope, elem, attr) {
                    /** Days to be disabled as an array */
                    console.log('in directives', scope.dates);
                    function DisableSpecificDates(date) {
                        var string = jQuery.datepicker.formatDate('dd-mm-yy', date);
                        return [scope.dates.indexOf(string) == -1];
                    }
                    $("#datenow").datepicker({
                        beforeShowDay: DisableSpecificDates,
                        onSelect: function (dateText, inst) {
                            console.log('selected dated', dateText);
                            $rootScope.appointDate =dateText;
                            var selectedDate = new Date(dateText);

                            var selectedYear = selectedDate.getFullYear();
                            var selectedMonth = selectedDate.getMonth() + 1;
                            var selectedDay = selectedDate.getDate();

                            console.log('selectedDate', selectedDate);
                            console.log('selectedYear', selectedYear);
                            console.log('selectedMonth', selectedMonth);
                            console.log('selectedDay', selectedDay);
                            console.log('branchid', scope.branchid);
                            console.log('serviceid', scope.serviceid);
                            var params = "grant_type=client_credentials&client_id=Android01&client_secret=21B5F798-BE55-42BC-8AA8-0025B903DC3B&scope=app1";
//                            User['UserName'] = $scope.user.MobileNumber;
//                            User['Password'] = $scope.user.Password;
//                            $scope.user.User = User;
//                            $scope.user.Id = null;
                            var url = "http://autotecauth.azurewebsites.net/identity/connect/token";
                            $http.post(url, params, {
                                headers: {'Content-Type': 'application/x-www-form-urlencoded; charset=UTF-8'}
                            }).success(function (result) {
                                $http.get('http://autotecapi.azurewebsites.net/api/availableappointmentslots/' + scope.branchid.Id + '/' + scope.serviceid.Id + '/' + selectedYear + '/' + selectedMonth + '/' + selectedDay, {
                                    headers: {
                                        'Authorization': "Bearer" + " " + result.access_token
                                    }
                                }).success(function (res) {
                                    console.log('scucessfully saved', res);
                                    scope.appointments = {
                                        selectedOption: { starttime: 0, endtime: 0},
                                        availableOptions: res
                                    };
                                    for (var i = 0; i <= res.length; i++) {
                                        if(typeof res[i] != "undefined") {
                                            scope.appointments.selectedOption.starttime =  res[i].StartTimeStr;
                                            scope.appointments.selectedOption.endtime = res[i].EndTimeStr;
                                        }
                                       
                                    }
                                    
                                    console.log('test', scope.appointments);
                                    $rootScope.$broadcast('AppointmentDataChanged', {data: scope.appointments})


//                    $scope.loaderr = false;
//                    $scope.showSuccessAlert = true;
//                    $scope.isDataLoading = false;
//                    $window.location.reload();
                                })
                                        .error(function (err) {
                                            console.log('error in saving');
//                            $scope.loaderr = false    
//                            $scope.errorText = err.Message;
//                            $scope.showErrorAlert = true;
//                            console.log(err)
//                            $scope.isDataLoading = false;
                                        });

                            });
                        }
                    });


//                    $("#datenow").change(function () {
//                    });
//
//                    elem.bind('change', function () {
//                        console.log("asdasdasdas")
//                    })

                }
            }
        });