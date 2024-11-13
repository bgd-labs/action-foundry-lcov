type CallBack = (err: Error, data: any) => void;
declare module "lcov-parse" {
  export = function (path: string, callback: CallBack) {};
}
