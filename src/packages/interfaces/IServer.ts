import { IRoute } from './IRoute';
export interface IServer {
  name: string;
  port: number;
  routes: IRoute[];
}
