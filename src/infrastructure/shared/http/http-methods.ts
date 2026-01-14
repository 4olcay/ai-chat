export enum HttpMethod {
  GET = 'get',
  POST = 'post',
  PUT = 'put',
  DELETE = 'delete',
  PATCH = 'patch',
}

export interface RouteDefinition {
  path: string;
  method: HttpMethod;
  methodName: string | symbol;
}
