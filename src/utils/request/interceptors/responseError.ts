import type { AxiosResponse } from 'axios'
import CancelRequest from "../CancelRequest";
import axios from "axios";
const cancelRequest = new CancelRequest()

export const cancelResponseErrorInterceptor = (error: any): any => {
    console.log('response-error==', error)
    cancelRequest.removePending(error?.config)

    if (axios.isCancel(error)) {
        // 取消错误，dosomething。。。
    }
    return error
}
