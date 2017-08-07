
describe('Transaction Service', () => {
    beforeEach(angular.mock.module('transactions-report-common'));

    let ERRORS;
    let Transaction;
    let service;

    beforeEach(inject((_transactionService_, _ERRORS_, _Transaction_) => {
        service = _transactionService_;
        ERRORS = _ERRORS_;
        Transaction = _Transaction_;
    }));

    describe('getReport', () => {
        it('should return report', () => {
            expect(service.getReport()).toEqual({
                total: 0,
                ok: [],
                ko: []
            });
        });
    });

    describe('validate', () => {
        let transaction1;
        let transaction2;

        beforeEach(() => {
            transaction1 = jasmine.createSpyObj('transaction', ['validate', 'setError']);
            transaction1.reference = 'reference1';

            transaction2 = jasmine.createSpyObj('transaction', ['validate', 'setError']);
            transaction2.reference = 'reference2';
        });

        it('should return report with duplicate error', () => {
            transaction1.reference = 'reference';
            transaction2.reference = 'reference';

            service.validate([transaction1, transaction2]);

            expect(transaction1.setError).toHaveBeenCalledWith(ERRORS.duplicate);
            expect(transaction2.setError).toHaveBeenCalledWith(ERRORS.duplicate);
            expect(service.report).toEqual({
                total: 2,
                ok: [],
                ko: [transaction1, transaction2]
            });
        });

        it('should return report with mutation error', () => {
            transaction1.validate.and.returnValue(false);
            transaction2.validate.and.returnValue(false);

            service.validate([transaction1, transaction2]);

            expect(transaction1.validate).toHaveBeenCalled();
            expect(transaction1.setError).toHaveBeenCalledWith(ERRORS.mutation);
            expect(transaction2.validate).toHaveBeenCalled();
            expect(transaction2.setError).toHaveBeenCalledWith(ERRORS.mutation);
            expect(service.report).toEqual({
                total: 2,
                ok: [],
                ko: [transaction1, transaction2]
            });
        });

        it('should return report with success', () => {
            transaction1.validate.and.returnValue(true);
            transaction2.validate.and.returnValue(true);

            service.validate([transaction1, transaction2]);

            expect(transaction1.validate).toHaveBeenCalled();
            expect(transaction1.setError).not.toHaveBeenCalled();
            expect(transaction2.validate).toHaveBeenCalled();
            expect(transaction1.setError).not.toHaveBeenCalled();
            expect(service.report).toEqual({
                total: 2,
                ok: [transaction1, transaction2],
                ko: []
            });
        });
    });

    describe('csvLinesToTransaction', () => {
        it('should return list of Transaction', () => {
            const lines = [['reference', 'accountNumber', 'description', '0', '+10', '10']];

            service.csvLinesToTransaction(lines).forEach((t) => {
                expect(t instanceof Transaction).toBe(true);
            });
        });
    });

    describe('_reset', () => {
        it('should reset report', () => {
            service.report = {some: 'report'};
            service._reset();

            expect(service.report).toEqual({
                total: 0,
                ok: [],
                ko: []
            });
        });
    });

    describe('_addDuplicateError', () => {
        it('should add error to report', () => {
            const transaction = jasmine.createSpyObj('transaction', ['setError']);
            service._addDuplicateError(transaction);

            expect(transaction.setError).toHaveBeenCalledWith(ERRORS.duplicate);
            expect(service.report).toEqual({
                total: 1,
                ok: [],
                ko: [transaction]
            });
        });
    });

    describe('_addMutationError', () => {
        it('should add error to report', () => {
            const transaction = jasmine.createSpyObj('transaction', ['setError']);
            service._addMutationError(transaction);

            expect(transaction.setError).toHaveBeenCalledWith(ERRORS.mutation);
            expect(service.report).toEqual({
                total: 1,
                ok: [],
                ko: [transaction]
            });
        });
    });

    describe('_addSuccess', () => {
        it('should add success to report', () => {
            const transaction = jasmine.createSpyObj('transaction', ['setError']);
            service._addSuccess(transaction);

            expect(transaction.setError).not.toHaveBeenCalled();
            expect(service.report).toEqual({
                total: 1,
                ok: [transaction],
                ko: []
            });
        });
    });
});
