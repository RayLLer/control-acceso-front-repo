
// Define the paths for the routes
const ROOT = '/pages'
const AUTH_ROOT = '/auth';

export const AUTH = 'auth/local';

export const paths = {
  home: `${ROOT}/home`,
  questions: {
    root: `${ROOT}/questions`,
    create: `${ROOT}/questions/create`,
    edit: (id: number)=> `${ROOT}/questions/edit/${id}`,
  },
  tests: {
    root: `${ROOT}/tests`,
    create: `${ROOT}/tests/create`,
    edit: (id: number)=> `${ROOT}/tests/edit/${id}`,
  },
  error_reports: {
    root: `${ROOT}/error-reports`,
  },
  realized_tests: {
    root: `${ROOT}/realized-tests`,
    details: (userId: number, testId: number) => `${ROOT}/realized-tests/details/${userId}/${testId}`,
  },
  theme_subtheme_block: {
    root: `${ROOT}/theme-subtheme-block`,
    create: `${ROOT}/theme-subtheme-block/create`,
    edit: (id: number)=> `${ROOT}/theme-subtheme-block/edit/${id}`,
  },
  forgot_password: `${AUTH_ROOT}/forgot-password`,
  reset_password: `${AUTH_ROOT}/reset-password`,
  login: `${AUTH_ROOT}/login`,
}