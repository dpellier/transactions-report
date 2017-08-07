
/**
 * @ngdoc service
 * @name FileService
 *
 * @description
 * Manage all file manipulation.
 */
class FileService {
    // @ngInject
    constructor($q) {
        this.$q = $q;
    }

    /**
     * @ngdoc method
     * @name readAsText
     *
     * @description
     * Read the file using HTML5 FileReader.
     *
     * @returns {Promise} The file content.
     */
    readAsText(file) {
        const deferred = this.$q.defer();
        const reader = new FileReader();

        reader.onload = (e) => {
            deferred.resolve(e.target.result);
        };

        reader.onerror = (e) => {
            deferred.reject(e);
        };

        reader.readAsText(file, 'ISO-8859-1');      // We fix the encoding to work with the given file
        return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name processCsv
     *
     * @description
     * Transform a csv string to an array with each line.
     *
     * @returns {array} Each line separated.
     */
    processCsv(content, separator = ',') {
        const textLines = content.split(/\r\n|\n/);

        return textLines.map((textLine) => {
            return textLine.split(separator);
        }).slice(1, -1);       // We assume that the header is always here.
    }
}

export default FileService;
