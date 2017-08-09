
describe('File Service', () => {
    beforeEach(angular.mock.module('transactions-report-common'));

    let $rootScope;
    let FILE_TYPES;
    let service;

    beforeEach(inject((_$rootScope_, _FILE_TYPES_, _fileService_) => {
        $rootScope = _$rootScope_;
        FILE_TYPES = _FILE_TYPES_;
        service = _fileService_;
    }));

    describe('readAsText', () => {
        const event = {
            target: {
                result: 'result'
            }
        };
        const defaultEncoding = 'utf-8';

        let readerStub;
        let readAsTextSpy;
        let file;

        beforeEach(() => {
            file = {
                type: FILE_TYPES.xml
            };

            readAsTextSpy = jasmine.createSpy('readAsText');

            readerStub = {
                readAsText: readAsTextSpy
            };

            spyOn(window, 'FileReader').and.callFake(() => {
                return readerStub;
            });

            readAsTextSpy.and.callFake(() => {
                return readerStub.onload(event);
            });
        });

        it('should return result', (done) => {
            service.readAsText(file).then((result) => {
                expect(readAsTextSpy).toHaveBeenCalledWith(file, defaultEncoding);
                expect(result).toBe(event.target.result);
            }).then(done, done.fail);

            $rootScope.$digest();
        });

        it('should read csv with different encoding', (done) => {
            file.type = FILE_TYPES.csv;

            service.readAsText(file).then((result) => {
                expect(readAsTextSpy).toHaveBeenCalledWith(file, 'ISO-8859-1');
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

    describe('processXml', () => {
        const parsed = 'parsed result';

        let parserSpy;

        beforeEach(() => {
            parserSpy = jasmine.createSpyObj('parser', ['parseFromString']);
            parserSpy.parseFromString.and.returnValue(parsed);

            spyOn(window, 'DOMParser').and.callFake(() => {
                return parserSpy;
            });
        });

        it('should return parsed content', () => {
            const content = '<some><document></document></some>';
            const result = service.processXml(content);
            expect(parserSpy.parseFromString).toHaveBeenCalledWith(content, 'text/xml');
            expect(result).toBe(parsed);
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
