
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
    constructor($state, $timeout, fileService, transactionService, FILE_TYPES) {
        this.$state = $state;
        this.$timeout = $timeout;
        this.fileService = fileService;
        this.transactionService = transactionService;
        this.FILE_TYPES = FILE_TYPES;

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
        return this.state === STATES.uploaded;
    }

    /**
     * @ngdoc method
     * @name onFileUpload
     *
     * @description
     * On file change, transform its content to an array of Transactions.
     *
     * @returns {void}
     */
    onFileUpload() {
        this.state = STATES.uploaded;
        let transactions = [];

        switch (this.file.type) {
            case this.FILE_TYPES.xml:
                transactions = this.transactionService.xmlDocumentToTransactions(
                    this.fileService.processXml(this.file.content)
                );
                break;
            case this.FILE_TYPES.csv:
                transactions = this.transactionService.csvLinesToTransaction(
                    this.fileService.processCsv(this.file.content)
                );
                break;
            default:
                break;
        }

        this.validate(transactions);
    }

    /**
     * @ngdoc method
     * @name validate
     *
     * @description
     * Generate the transactions report and redirect to report page.
     *
     * @param {[Transaction]} transactions - The transactions to validate.
     *
     * @returns {void}
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
