
import commonModule from '../common/common.js';

/**
 * @ngdoc controller
 * @name ReportCtrl
 *
 * @description
 * Manage the report view.
 */
class ReportCtrl {
    // @ngInject
    constructor($state, transactionService) {
        this.$state = $state;
        this.transactionService = transactionService;

        this.report = this.transactionService.getReport();
    }

    /**
     * @ngdoc method
     * @name back
     *
     * @description
     * Redirect to the import view.
     *
     * @returns {void}
     */
    back() {
        this.$state.go('app.import');
    }
}

export default angular.module('transactions-report-report', [
    commonModule.name
])
    .controller('reportCtrl', ReportCtrl);
