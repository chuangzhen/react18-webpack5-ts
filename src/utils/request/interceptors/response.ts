import type { AxiosResponse } from 'axios'
import CancelRequest from "../CancelRequest";
const cancelRequest = new CancelRequest()

export const commonResponseInterceptor = (resp: AxiosResponse<any, any>): AxiosResponse<any, any> => {
    console.log('公共响应拦截器');

    return resp;
}