export const RELOAD_DEFAULT_TIME = 100;

export const BASE_FILTER = {
  $or: [
    {
      deleted: {
        $not: {
          $eq: true,
        },
      },
    },
    {
      deleted: {
        $null: true,
      },
    },
  ],
};

export const dateFormat = 'DD/MM/YYYY';

export const ERROR_REPORT_STATES = {
  SUBMITTED: 'SUBMITTED',
  PENDING: 'No Respondido',
  RESOLVED: 'Resuelto',
}