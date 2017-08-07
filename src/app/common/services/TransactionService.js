
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
     * @name csvLinesToTransaction
     *
     * @description
     * Transform an array of object to an array of Transaction.
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
     */
    _addSuccess(transaction) {
        this.report.ok.push(transaction);
        this.report.total++;
    }
}

export default TransactionService;
