
/**
 * @ngdoc service
 * @name TransactionService
 *
 * @description
 * Manage the report creation from transactions.
 */
class TransactionService {
    // @ngInject
    constructor(Transaction, ERRORS) {
        this.Transaction = Transaction;
        this.ERRORS = ERRORS;
        this._reset();
    }

    /**
     * @ngdoc method
     * @name getReport
     *
     * @description
     * Get the current report.
     *
     * @returns {object} The current report.
     */
    getReport() {
        return this.report;
    }

    /**
     * @ngdoc method
     * @name validate
     *
     * @description
     * Build a report from the given transactions.
     *
     * @param {[Transaction]} transactions - The transactions to validate.
     *
     * @returns {void}
     */
    validate(transactions) {
        this._reset();

        transactions.forEach((transaction, index, self) => {
            const duplicateIndex = self.findIndex((t, idx) => {
                return t.reference === transaction.reference && idx !== index;
            });

            if (duplicateIndex > -1) {
                this._addDuplicateError(transaction);
            } else {
                if (!transaction.validate()) {
                    this._addMutationError(transaction);
                } else {
                    this._addSuccess(transaction);
                }
            }
        });
    }

    /**
     * @ngdoc method
     * @name xmlDocumentToTransactions
     *
     * @description
     * Transform a xml document to an array of Transaction.
     *
     * @param {Document} document - The XML parsed document.
     *
     * @returns {array} The array of Transactions.
     */
    xmlDocumentToTransactions(document) {
        const records = document.getElementsByTagName('record');

        return Array.prototype.map.call(records, (record) => {
            return new this.Transaction([
                record.getAttribute('reference'),
                record.getElementsByTagName('accountNumber')[0].textContent,
                record.getElementsByTagName('description')[0].textContent,
                record.getElementsByTagName('startBalance')[0].textContent,
                record.getElementsByTagName('mutation')[0].textContent,
                record.getElementsByTagName('endBalance')[0].textContent
            ]);
        });
    }

    /**
     * @ngdoc method
     * @name csvLinesToTransaction
     *
     * @description
     * Transform an array of object to an array of Transaction.
     *
     * @param {array} lines - The csv line objects.
     *
     * @returns {array} The array of Transactions.
     */
    csvLinesToTransaction(lines) {
        return lines.map((line) => {
            return new this.Transaction(line);
        });
    }

    /**
     * @private
     *
     * @description
     * Reset the report.
     *
     * @returns {void}
     */
    _reset() {
        this.report = {
            total: 0,
            ok: [],
            ko: []
        };
    }

    /**
     * @private
     *
     * @description
     * Add a duplicate error to the report.
     *
     * @param {Transaction} transaction - The transaction to add to the report errors.
     *
     * @returns {void}
     */
    _addDuplicateError(transaction) {
        transaction.setError(this.ERRORS.duplicate);
        this.report.ko.push(transaction);
        this.report.total++;
    }

    /**
     * @private
     *
     * @description
     * Add a mutation error to the report.
     *
     * @param {Transaction} transaction - The transaction to add to the report errors.
     *
     * @returns {void}
     */
    _addMutationError(transaction) {
        transaction.setError(this.ERRORS.mutation);
        this.report.ko.push(transaction);
        this.report.total++;
    }

    /**
     * @private
     *
     * @description
     * Add a success to the report.
     *
     * @param {Transaction} transaction - The transaction to add to the report successes.
     *
     * @returns {void}
     */
    _addSuccess(transaction) {
        this.report.ok.push(transaction);
        this.report.total++;
    }
}

export default TransactionService;
