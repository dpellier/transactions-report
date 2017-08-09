
describe('InputFile Component', () => {
    beforeEach(angular.mock.module('transactions-report-common'));

    const content = 'some content';
    const file = {
        type: 'text/csv'
    };

    let controller;
    let $rootScope;
    let $element;
    let element;
    let fileService;

    beforeEach(inject(($q, _$rootScope_, _$componentController_) => {
        $rootScope = _$rootScope_;

        element = jasmine.createSpyObj('element', ['on']);

        $element = jasmine.createSpyObj('$element', ['find']);
        $element.find.and.returnValue(element);

        fileService = jasmine.createSpyObj('fileService', ['readAsText']);
        fileService.readAsText.and.returnValue($q.resolve(content));

        controller = _$componentController_('inputFile', {
            $element: $element,
            fileService: fileService
        });
    }));

    it('should initialize the controller', () => {
        expect($element.find).toHaveBeenCalledWith('input');
        expect(element.on).toHaveBeenCalledWith('change', jasmine.any(Function));
    });

    describe('onUpload', () => {
        beforeEach(() => {
            controller.ngModel = {
                $setViewValue: jasmine.createSpy('$setViewValue')
            };
        });

        it('should reject if no file', (done) => {
            const event = {
                target: {
                    files: []
                }
            };

            controller.onUpload(event).catch(() => {
                expect(fileService.readAsText).not.toHaveBeenCalled();
                expect(controller.ngModel.$setViewValue).not.toHaveBeenCalled();
            }).then(done, done.fail);

            $rootScope.$digest();
        });

        it('should set model value to file', (done) => {
            const event = {
                target: {
                    files: [file]
                }
            };

            controller.onUpload(event).then(() => {
                expect(fileService.readAsText).toHaveBeenCalledWith(file);
                expect(controller.ngModel.$setViewValue).toHaveBeenCalledWith({
                    content: content,
                    type: file.type
                });
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });
});
