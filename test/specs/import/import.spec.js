
describe('Import Controller', () => {
    beforeEach(angular.mock.module('transactions-report-import'));

    let controller;
    let fileService;
    let transactionService;
    let FILE_TYPES;
    let $state;
    let $timeout;

    beforeEach(inject((_$controller_, _$timeout_, _FILE_TYPES_) => {
        $timeout = _$timeout_;
        FILE_TYPES = _FILE_TYPES_;

        fileService = jasmine.createSpyObj('fileService', ['processCsv', 'processXml']);

        transactionService = jasmine.createSpyObj('transactionService', ['csvLinesToTransaction', 'validate', 'xmlDocumentToTransactions']);

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
        const csvLines = 'some,csv,lines';
        const document = '<some><document></document></some>';
        const transactions = ['some', 'transactions'];

        let file;

        beforeEach(() => {
            file = {
                content: 'some file',
                type: null
            };

            fileService.processCsv.and.returnValue(csvLines);
            fileService.processXml.and.returnValue(document);

            transactionService.csvLinesToTransaction.and.returnValues(transactions);
            transactionService.xmlDocumentToTransactions.and.returnValues(transactions);

            controller.validate = jasmine.createSpy('validate');
            controller.file = file;
        });

        it('should process csv file before starting validation', () => {
            file.type = FILE_TYPES.csv;
            controller.onFileUpload();

            expect(controller.state).toBe('UPLOADED');
            expect(fileService.processCsv).toHaveBeenCalledWith(file.content);
            expect(transactionService.csvLinesToTransaction).toHaveBeenCalledWith(csvLines);
            expect(controller.validate).toHaveBeenCalledWith(transactions);
        });

        it('should process xml file before starting validation', () => {
            file.type = FILE_TYPES.xml;
            controller.onFileUpload();

            expect(controller.state).toBe('UPLOADED');
            expect(fileService.processXml).toHaveBeenCalledWith(file.content);
            expect(transactionService.xmlDocumentToTransactions).toHaveBeenCalledWith(document);
            expect(controller.validate).toHaveBeenCalledWith(transactions);
        });

        it('should not process file if unknown type', () => {
            controller.onFileUpload();

            expect(controller.state).toBe('UPLOADED');
            expect(fileService.processCsv).not.toHaveBeenCalled();
            expect(fileService.processXml).not.toHaveBeenCalled();
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
