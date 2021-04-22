(function (module) {
    mifosX.controllers = _.extend(module, {
        BulkImportEmployeeController: function (scope, http, resourceFactory, location, API_VERSION, $rootScope, Upload) {

            scope.first = {};
            scope.first.templateUrl =  API_VERSION + '/staff/downloadtemplate' + '?tenantIdentifier=' + $rootScope.tenantIdentifier
                + '&locale=' + scope.optlang.code + '&dateFormat=' + scope.df;
            scope.formData = {};
            var today = new Date().toISOString().slice(0, 10);

            resourceFactory.officeResource.getAllOffices(function (data) {
                scope.offices=data;
                console.log("Office ID :"+scope.offices);
            });

            scope.first.queryParams = '&';
            scope.changeOffice = function () {
                if(scope.formData.officeId) {
                    if(scope.first.queryParams.indexOf("officeId")==-1) {
                        scope.first.queryParams += 'officeId=' + scope.formData.officeId;
                    }else {
                        scope.first.queryParams=scope.first.queryParams.replace(/&officeId=\d+/i,"&officeId="+ scope.formData.officeId);
                    }
                } else {
                    scope.first.queryParams ='&';
                }
            };

            scope.onFileSelect = function (files) {
                scope.formData.file = files[0];
            };

            scope.refreshImportTable=function () {
                resourceFactory.importResource.getImports({entityType: "staff"}, function (data) {

                    for (var l in data) {
                        var importdocs = {};
                        importdocs = API_VERSION + '/imports/downloadOutputTemplate?importDocumentId='+ data[l].importId +'&tenantIdentifier=' + $rootScope.tenantIdentifier;
                        data[l].docUrl = importdocs;
                    }
                    scope.imports = data;
                });
            };

            scope.download = function () {
                http({
                    url: $rootScope.hostUrl + scope.first.templateUrl + scope.first.queryParams,
                    method: 'GET',
                    responseType: 'arraybuffer'
                }).then(function(response) {
                    var linkElement = document.createElement('a');
                    const blob = new Blob([response.data]);
                    const url = window.URL.createObjectURL(blob);
                    linkElement.setAttribute('href', url);
                    linkElement.setAttribute('download', 'EMPLOYEES' + today + '.xls');
                    const clickEvent = new MouseEvent('click', {
                        'view': window,
                        'bubbles': true,
                        'cancelable': false
                    });
                    linkElement.dispatchEvent(clickEvent);
                });
            };


            scope.upload = function () {
                Upload.upload({
                    url: $rootScope.hostUrl + API_VERSION + '/staff/uploadtemplate',
                    data: {file: scope.formData.file,locale:scope.optlang.code,dateFormat:scope.df},
                }).then(function (data) {
                    // to fix IE not refreshing the model
                    if (!scope.$$phase) {
                        scope.$apply();
                    }
                });
            };
        }
    });
    mifosX.ng.application.controller('BulkImportEmployeeController', ['$scope', '$http', 'ResourceFactory', '$location', 'API_VERSION', '$rootScope', 'Upload', mifosX.controllers.BulkImportEmployeeController]).run(function ($log) {
        $log.info("BulkImportEmployeeController initialized");
    });
}(mifosX.controllers || {}));