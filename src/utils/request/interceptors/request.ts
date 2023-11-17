

import type { InternalAxiosRequestConfig } from 'axios'

import CancelRequest from "../CancelRequest";
const cancelRequest = new CancelRequest()
 

/**
 * 取消重复请求-请求拦截器
 * @param config 
 * @returns config
 */
export const cancelRequestIc = (config: InternalAxiosRequestConfig<any>): InternalAxiosRequestConfig<any> => {
    console.log('cancel',config)
    cancelRequest.cancelReq(config,'取消重复请求，只保留最后一次请求,被取消的请求响应值返回undefined,注意兼容处理')
    cancelRequest.addPending(config)

    return config
}

/**
 *  处理文件上传-传参编码格式的拦截器
 * @param config 
 * @returns config
 */
export const  uploadFileRequestIc = (config: AxiosRequestConfig): AxiosRequestConfig => {
    console.log('upload',config)
    const headers = config.headers;
    const contentType = headers?.['Content-Type'] || headers?.['content-type'];
    // 如果content-type 不是 form-data或没有data或者是get请求，则无需编码
    if (
    // contentType !== ContentType.FORM_DATA ||
    !config.data ||
    config.method?.toUpperCase() === RequestMethod.GET
    ) {
        return config;
    }
    const formData = new FormData();
    const uploadFilename = config.data.filename || 'file';
    if (config.data.filename) {
        formData.append(uploadFilename, config.data.file, config.data.filename);
    } else {
        formData.append(uploadFilename, config.data.file);
    }
    if (config.params) {
        Object.keys(config.params).forEach((key) => {
        formData.append(key, config.params[key]);
        });
        config.params = undefined;
    }
    return {
        ...config,
        data: formData,
    };
};