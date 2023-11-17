import Request from "./request";



import { cancelRequestIc,uploadFileRequestIc } from "./interceptors/request";
import { commonResponseInterceptor } from "./interceptors/response";
import { cancelResponseErrorInterceptor } from "./interceptors/responseError";

import CancelRequest from "./CancelRequest";
import axios from "axios";
const cancelRequest = new CancelRequest()


export const request = new Request({
    // 请求路径前缀
    // baseURL: 'http://localhost:8000',
    // 超时限制
    timeout: 3000,
    // 允许携带cookie
    withCredentials: true,
    // 公共请求头
    headers: { "Content-Type": "'application/json'" },
    hooks: {
        requestInterceptors: [
            cancelRequestIc,
            uploadFileRequestIc
        ],
        responseInterceptors: [
            commonResponseInterceptor
        ],
        responseErrorInterceptors: [
            cancelResponseErrorInterceptor
        ]
    },
});
