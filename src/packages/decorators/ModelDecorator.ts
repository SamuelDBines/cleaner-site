import sql from '@/api/utils/db';
import { Router } from '@/api/models/Router';
export class TableProps {
  name: string = '';
  schema: string = 'public';

  constructor(props: TableProps) {
    this.name = props.name;
    this.schema = props.schema;
  }
}

export function Table() {
  console.log("first(): factory evaluated");
  return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
    console.log(target, propertyKey, descriptor);
    try {
      const name = target.name.toLowerCase();
      const properties = new target();
      target.prototype.router = new Router(`/${name}`);
      target.prototype.router.use('query', '', async (req, io) => {
        const data = await sql`SELECT * FROM public.${sql(target.name)}`;
        return data;
      });

      target.prototype.find = async function () {
        const data = await sql`SELECT * FROM public.${sql(target.name)}`;
        console.log(data);
      };

      console.log(Object.keys(properties));
    } catch (err) {
      console.log(err);
    }
  };
}

// export function Router() {
//   console.log("first(): factory evaluated");
//   return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
//     console.log(target, propertyKey, descriptor);
//     try {
//       const properties = new target();
//       target.prototype.prefix = target.name.toLowerCase();
//       console.log(Object.keys(properties));
//     } catch (err) {
//       console.log(err);
//     }
//   };
// }


export function second() {
  console.log("second(): factory evaluated");
  return function (target: any, propertyKey?: string, descriptor?: PropertyDescriptor) {
    console.log("second(): called");
  };
}