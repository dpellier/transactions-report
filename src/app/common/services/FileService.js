
/**
 * @ngdoc service
 * @name FileService
 *
 * @description
 * Manage all file manipulation.
 */
class FileService {
    // @ngInject
    constructor($q, FILE_TYPES) {
        this.$q = $q;
        this.FILE_TYPES = FILE_TYPES;
    }

    /**
     * @ngdoc method
     * @name readAsText
     *
     * @description
     * Read the file using HTML5 FileReader.
     *
     * @param {File} file - The file to read.
     *
     * @returns {Promise} The file content.
     */
    readAsText(file) {
        const deferred = this.$q.defer();
        const reader = new FileReader();
        const encoding = file.type === this.FILE_TYPES.csv ? 'ISO-8859-1': 'utf-8';

        reader.onload = (e) => {
            deferred.resolve(e.target.result);
        };

        reader.onerror = (e) => {
            deferred.reject(e);
        };

        reader.readAsText(file, encoding);
        return deferred.promise;
    }

    /**
     * @ngdoc method
     * @name processXml
     *
     * @description
     * Parse a xml content to a Document
     *
     * @param {string} content - The xml file string.
     *
     * @returns {Document} Parsed Document.
     */
    processXml(content) {
        const parser = new DOMParser();
        return parser.parseFromString(content, 'text/xml');
    }

    /**
     * @ngdoc method
     * @name processCsv
     *
     * @description
     * Transform a csv string to an array with each line.
     *
     * @param {string} content - The csv file string.
     * @param {string} separator - The attribute separator for each line.
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
