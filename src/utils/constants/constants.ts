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

export const TEST_TYPES = {
  OFICIAL: 'Oficial',
  PRACTICE: 'Práctico',
  CHALLENGE: 'Reto'
}

export const SUB_TEST_TYPES = {
  GENERAL: 'General',
  PRACTICE: 'Práctico'
}