export default interface IBaseRest<T> {
  data: T[];
  meta: IMeta;
}

export interface IMeta {
  pagination?: {
    page: number;
    pageSize: number;
    pageCount: number;
    total: number;
  };
}
