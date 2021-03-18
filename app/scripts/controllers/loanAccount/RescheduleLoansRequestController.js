(function (module) {
    mifosX.controllers = _.extend(module, {
        RescheduleLoansRequestController: function (scope, resourceFactory, routeParams, location, dateFilter) {
            scope.loanId = routeParams.loanId;
            scope.formData = {};
            scope.rejectData = {};
            scope.repaymentFrequencyTypeOption = {};
            scope.repaymentFrequencyTypeOptions = [];
            scope.formData.submittedOnDate = new Date();

            resourceFactory.loanRescheduleResource.template({scheduleId:'template'},function(data){
                if (data.length > 0) {
                    scope.formData.rescheduleReasonId = data.rescheduleReasons[0].id;
                }
                scope.codes = data.rescheduleReasons;
                scope.repaymentFrequencyTypeOptions = data.repaymentFrequencyTypeOptions;
                console.log(data);
            });
            scope.cancel = function () {
                location.path('/viewloanaccount/' + scope.loanId);
            };

            scope.changeFrequency = function(array,model,findattr,retAttr){
                findattr = findattr ? findattr : 'id';
                retAttr = retAttr ? retAttr : 'value';
                console.log(findattr,retAttr,model);
                return _.find(array, function (obj) {
                   return obj[findattr] === model;
                })[retAttr];
            };

            scope.submit = function () {
                this.formData.loanId = scope.loanId;
                this.formData.dateFormat = scope.df;
                this.formData.locale = scope.optlang.code;
                this.formData.rescheduleFromDate = dateFilter(this.formData.rescheduleFromDate, scope.df);
                this.formData.adjustedDueDate = dateFilter(this.formData.adjustedDueDate, scope.df);
                this.formData.submittedOnDate = dateFilter(this.formData.submittedOnDate, scope.df);
                this.formData.endDate = dateFilter(this.formData.endDate, scope.df);
                this.formData.rescheduleReasonComment = scope.comments;
                this.formData.semiMonthFirstDate = dateFilter(this.formData.semiMonthFirstDate, scope.df);
                this.formData.semiMonthSecondDate = dateFilter(this.formData.semiMonthSecondDate, scope.df);
                if (scope.repaymentFrequencyOption.value !== 'Semi Month') {
                    this.formData.semiMonthFirstDate = null;
                    this.formData.semiMonthSecondDate = null;
                }
                console.log(this.formData);
                resourceFactory.loanRescheduleResource.put(this.formData, function (data) {
                    scope.requestId = data.resourceId;
                    location.path('/loans/' + scope.loanId + '/viewreschedulerequest/'+ data.resourceId);
                });
            };

        }
    });
    mifosX.ng.application.controller('RescheduleLoansRequestController', ['$scope', 'ResourceFactory', '$routeParams', '$location', 'dateFilter', mifosX.controllers.RescheduleLoansRequestController]).run(function ($log) {
        $log.info("RescheduleLoansRequestController initialized");
    });
}(mifosX.controllers || {}));