declare module 'express-ws' {
  import { Express } from 'express';
  
  interface ExpressWs {
    app: Express;
    getWss(): any;
  }
  
  function expressWs(app: Express): ExpressWs;
  
  export = expressWs;
} 