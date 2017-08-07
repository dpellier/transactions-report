
// We assume a float precision of 2
const PRECISION = 2;

// @ngInject
function TransactionFactory(ERRORS) {
    /**
     * @ngdoc model
     * @name Transaction
     *
     * @description
     * Transaction resource represent a line in the report file uploaded
     */
    class Transaction {
        constructor(args) {
            // We assume that all arguments are always what we're expected
            this.reference = args[0];
            this.accountNumber = args[1];
            this.description = args[2];
            this.startBalance = args[3];
            this.mutation = args[4];
            this.endBalance = args[5];
            this._error = null;
        }

        /**
         * @ngdoc method
         * @name validate
         *
         * @description
         * Check that the mutation is valid regarding start and end balance.
         *
         * @returns {boolean} The validation result.
         */
        validate() {
            const start = parseFloat(this.startBalance);
            const operation = parseFloat(this.mutation);
            const expected = parseFloat(this.endBalance).toFixed(PRECISION);
            const result = (start + operation).toFixed(PRECISION);

            return result === expected;
        }

        /**
         * @ngdoc method
         * @name setError
         *
         * @description
         * Set the error type on the Transaction.
         */
        setError(errorType) {
            this._error = errorType;
        }

        /**
         * @ngdoc method
         * @name getError
         *
         * @description
         * Format an error message regarding the Transaction error type.
         *
         * @returns {string} The error message.
         */
        getError() {
            if (!this._error) {
                return '';
            }

            switch (this._error) {
                case ERRORS.duplicate:
                    return `Transaction ${this.reference} - ${this.description} - is not unique.`;
                case ERRORS.mutation:
                    return `Transaction ${this.reference} - ${this.description} - has wrong end balance ${this.endBalance}.`;
                default:
                    return 'Unknown error';
            }
        }
    }

    return Transaction;
}

export default TransactionFactory;
