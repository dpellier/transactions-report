
describe('File Service', () => {
    beforeEach(angular.mock.module('transactions-report-common'));

    let $rootScope;
    let service;

    beforeEach(inject((_$rootScope_, _fileService_) => {
        $rootScope = _$rootScope_;
        service = _fileService_;
    }));

    describe('readAsText', () => {
        const file = 'file';
        const event = {
            target: {
                result: 'result'
            }
        };
        const defaultEncoding = 'ISO-8859-1';

        let readerStub;
        let readAsTextSpy;

        beforeEach(() => {
            readAsTextSpy = jasmine.createSpy('readAsText');

            readerStub = {
                readAsText: readAsTextSpy
            };

            FileReader = jasmine.createSpy('FileReader').and.callFake(() => {       // eslint-disable-line no-native-reassign
                return readerStub;
            });
        });

        it('should return result', (done) => {
            readAsTextSpy.and.callFake(() => {
                return readerStub.onload(event);
            });

            service.readAsText(file).then((result) => {
                expect(readAsTextSpy).toHaveBeenCalledWith(file, defaultEncoding);
                expect(result).toBe(event.target.result);
            }).then(done, done.fail);

            $rootScope.$digest();
        });

        it('should return an error', (done) => {
            readAsTextSpy.and.callFake(() => {
                return readerStub.onerror(event);
            });

            service.readAsText(file).catch(() => {
                expect(readAsTextSpy).toHaveBeenCalledWith(file, defaultEncoding);
            }).then(done, done.fail);

            $rootScope.$digest();
        });
    });

    describe('processCsv', () => {
        it('should return array from lines', () => {
            const content = 'header\nline,1\nline,2\nline,3\n';
            expect(service.processCsv(content)).toEqual([
                ['line', '1'], ['line', '2'], ['line', '3']
            ]);
        });

        it('should return array from lines with custom separator', () => {
            const content = 'header\nline;1\nline;2\nline;3\n';
            expect(service.processCsv(content, ';')).toEqual([
                ['line', '1'], ['line', '2'], ['line', '3']
            ]);
        });
    });
});
