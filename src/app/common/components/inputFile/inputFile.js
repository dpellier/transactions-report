
/**
 * @ngdoc component
 * @name inputFile
 * @module transactions-report-common
 *
 * @description
 * <input-file> generate a file input
 *
 * @param {expression} ng-model - Scope property to bind value to.
 * @param {expression} ng-change - Expression to evaluate upon change in input value.
 * @param {string} accept - List of accepted file format.
 * @param {string} placeholder - Displayed label on file input.
 *
 * @usage
 *
 * Basic usage:
 * <input-file ng-model="controller.model.file" ng-change="controller.onFileChange()"></input-file>
 */
class InputFileCtrl {
    // @ngInject
    constructor($element, $q, fileService) {
        this.$q = $q;
        this.fileService = fileService;

        $element.find('input').on('change', this.onUpload.bind(this));
    }

    onUpload(e) {
        const element = e.target;
        const file = element.files.length ? element.files[0] : null;

        if (file) {
            return this.fileService.readAsText(file)
                .then((content) => {
                    this.ngModel.$setViewValue({
                        content: content,
                        type: file.type
                    });
                });
        }
        return this.$q.reject();
    }
}

const inputFile = {
    require: {
        ngModel: '^ngModel'
    },
    bindings: {
        onChange: '&ngChange',
        accept: '@accept',
        placeholder: '@'
    },
    template: require('./inputFile.html'),
    controller: InputFileCtrl
};

export default inputFile;
