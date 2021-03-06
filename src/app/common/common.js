
import inputFile from './components/inputFile/inputFile.js';
import ERRORS from './constants/ERRORS.js';
import FILE_TYPES from './constants/FILE_TYPES.js';
import Transaction from './models/Transaction.js';
import FileService from './services/FileService.js';
import TransactionService from './services/TransactionService.js';

export default angular.module('transactions-report-common', [])
    .component('inputFile', inputFile)
    .constant('ERRORS', ERRORS)
    .constant('FILE_TYPES', FILE_TYPES)
    .factory('Transaction', Transaction)
    .service('fileService', FileService)
    .service('transactionService', TransactionService);
