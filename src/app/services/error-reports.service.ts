import { BaseApi } from '@/utils/baseApi';
import { IErrorReport, IErrorReportResponse } from '../interfaces/error-reports';

class ErrorReportsService extends BaseApi<IErrorReportResponse, IErrorReport> {
    constructor() {
        super('/error-reports');
    }
}

export const errorReportsService = new ErrorReportsService();
