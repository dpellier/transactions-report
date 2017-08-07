
import commonModule from '../common/common.js';

const STATES = {
    initial: 'INITIAL',
    uploaded: 'UPLOADED'
};

const ANIMATION_DELAY = 2500;

/**
 * @ngdoc controller
 * @name ImportCtrl
 *
 * @description
 * Manage the import view.
 */
class ImportCtrl {
    // @ngInject
    constructor($state, $timeout, fileService, transactionService) {
        this.$state = $state;
        this.$timeout = $timeout;
        this.fileService = fileService;
        this.transactionService = transactionService;

        this.state = STATES.initial;
        this.file = null;
    }

    /**
     * @ngdoc method
     * @name isOnInitialState
     *
     * @description
     * Check if the current state is INITIAL.
     *
     * @returns {boolean} True if the state is INITIAL.
     */
    isOnInitialState() {
        return this.state === STATES.initial;
    }

    /**
     * @ngdoc method
     * @name isOnUploadedState
     *
     * @description
     * Check if the current state is UPLOADED.
     *
     * @returns {boolean} True if the state is UPLOADED.
     */
    isOnUploadedState() {
        return this.state === STATES.uploaded || this.state === STATES.validating;
    }

    /**
     * @ngdoc method
     * @name onFileUpload
     *
     * @description
     * On file change, transform its content to an array Transactions.
     */
    onFileUpload() {
        this.state = STATES.uploaded;

        const csvLines = this.fileService.processCsv(this.file);
        const transactions = this.transactionService.csvLinesToTransaction(csvLines);

        this.validate(transactions);
    }

    /**
     * @ngdoc method
     * @name validate
     *
     * @description
     * Generate the transactions report and redirect to report page.
     */
    validate(transactions) {
        this.transactionService.validate(transactions);

        this.$timeout(() => {
            this.$state.go('app.report');
        }, ANIMATION_DELAY);
    }
}

export default angular.module('transactions-report-import', [
    commonModule.name
])
    .controller('importCtrl', ImportCtrl);
