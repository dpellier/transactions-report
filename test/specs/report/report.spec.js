
describe('Report Controller', () => {
    beforeEach(angular.mock.module('transactions-report-report'));

    const report = {some: 'report'};

    let controller;
    let transactionService;
    let $state;

    beforeEach(inject((_$controller_) => {
        transactionService = jasmine.createSpyObj('transactionService', ['getReport']);
        transactionService.getReport.and.returnValue(report);

        $state = jasmine.createSpyObj('$state', ['go']);

        controller = _$controller_('reportCtrl', {
            transactionService: transactionService,
            $state: $state
        });
    }));

    it('should initialize the controller', () => {
        expect(transactionService.getReport).toHaveBeenCalled();
        expect(controller.report).toEqual(report);
    });

    describe('back', () => {
        it('should redirect to import', () => {
            controller.back();
            expect(controller.$state.go).toHaveBeenCalledWith('app.import');
        });
    });
});
