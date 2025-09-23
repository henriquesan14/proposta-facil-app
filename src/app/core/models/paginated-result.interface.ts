export interface PaginatedResult<T> {
    pageIndex: number;
    pageSize: number;
    data: T[];
    count: number;
}