
describe('Transaction', () => {
    beforeEach(angular.mock.module('transactions-report-common'));

    const data = ['reference', 'accountNumber', 'description', '0', '+10', '10'];

    let ERRORS;
    let model;

    beforeEach(inject((_Transaction_, _ERRORS_) => {
        ERRORS = _ERRORS_;
        model = new _Transaction_(data);
    }));

    it('should be initialized with given data', () => {
        expect(model.reference).toBe('reference');
        expect(model.accountNumber).toBe('accountNumber');
        expect(model.description).toBe('description');
        expect(model.startBalance).toBe('0');
        expect(model.mutation).toBe('+10');
        expect(model.endBalance).toBe('10');
        expect(model._error).toBe(null);
    });

    describe('validate', () => {
        it('should return true if balance is correct', () => {
            expect(model.validate()).toBe(true);
        });

        it('should return false if balance is incorrect', () => {
            model.endBalance = '100';
            expect(model.validate()).toBe(false);
        });
    });

    describe('setError', () => {
        it('should set error', () => {
            model.setError(ERRORS.duplicate);
            expect(model._error).toBe(ERRORS.duplicate);
        });
    });

    describe('getError', () => {
        it('should return empty if no error', () => {
            expect(model.getError()).toBe('');
        });

        it('should return duplicate error', () => {
            model._error = ERRORS.duplicate;
            expect(model.getError()).toBe('Transaction reference - description - is not unique.');
        });

        it('should return mutation error', () => {
            model._error = ERRORS.mutation;
            expect(model.getError()).toBe('Transaction reference - description - has wrong end balance 10.');
        });

        it('should return default if error type is unknown', () => {
            model._error = 'UNKNOWN';
            expect(model.getError()).toBe('Unknown error');
        });
    });
});
