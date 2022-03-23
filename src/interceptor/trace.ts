/* eslint-disable @typescript-eslint/no-unused-vars */
/* eslint-disable @typescript-eslint/no-explicit-any */
import {Interceptor} from '@loopback/core';

const traceIt: Interceptor = async (invocationCtx, next) => {

  const tracing = <ITracing>invocationCtx.target;
  const span = tracing.startSpan(invocationCtx.methodName);


  // Wait until the interceptor/method chain returns
  invocationCtx.args[0] = span;
  const result = await next();


  span.finish();
  return result;
}

export interface ITracing {

  startSpan(name: string): any;

}
