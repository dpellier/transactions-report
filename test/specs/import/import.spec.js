
describe('Import Controller', () => {
    beforeEach(angular.mock.module('transactions-report-import'));

    let controller;
    let fileService;
    let transactionService;
    let $state;
    let $timeout;

    beforeEach(inject((_$controller_, _$timeout_) => {
        $timeout = _$timeout_;

        fileService = jasmine.createSpyObj('fileService', ['processCsv']);

        transactionService = jasmine.createSpyObj('transactionService', ['csvLinesToTransaction', 'validate']);

        $state = jasmine.createSpyObj('$state', ['go']);

        controller = _$controller_('importCtrl', {
            fileService: fileService,
            transactionService: transactionService,
            $state: $state
        });
    }));

    it('should initialize the controller', () => {
        expect(controller.state).toBe('INITIAL');
        expect(controller.file).toBe(null);
    });

    describe('isOnInitialState', () => {
        it('should return true if state is initial', () => {
            controller.state = 'INITIAL';
            expect(controller.isOnInitialState()).toBe(true);
        });

        it('should return false if state is not initial', () => {
            controller.state = 'UPLOADED';
            expect(controller.isOnInitialState()).toBe(false);
        });
    });

    describe('isOnUploadedState', () => {
        it('should return true if state is uploaded', () => {
            controller.state = 'UPLOADED';
            expect(controller.isOnUploadedState()).toBe(true);
        });

        it('should return false if state is not uploaded', () => {
            controller.state = 'INITIAL';
            expect(controller.isOnUploadedState()).toBe(false);
        });
    });

    describe('onFileUpload', () => {
        const file = 'some file';
        const csvLines = 'some,csv,lines';
        const transactions = ['some', 'transactions'];

        beforeEach(() => {
            fileService.processCsv.and.returnValue(csvLines);

            transactionService.csvLinesToTransaction.and.returnValues(transactions);

            controller.validate = jasmine.createSpy('validate');
            controller.file = file;
        });

        it('should process file before starting validation', () => {
            controller.onFileUpload();

            expect(controller.state).toBe('UPLOADED');
            expect(fileService.processCsv).toHaveBeenCalledWith(file);
            expect(transactionService.csvLinesToTransaction).toHaveBeenCalledWith(csvLines);
            expect(controller.validate).toHaveBeenCalledWith(transactions);
        });
    });

    describe('validate', () => {
        const transactions = ['some', 'transactions'];

        it('should validate and redirect after a delay', () => {
            controller.validate(transactions);

            expect(transactionService.validate).toHaveBeenCalledWith(transactions);

            $timeout.flush();

            expect($state.go).toHaveBeenCalledWith('app.report');
        });
    });
});
