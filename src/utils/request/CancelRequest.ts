import { Canceler } from "axios";
import type { AxiosRequestConfig } from 'axios'
import axios from "axios";

import qs from 'qs'

/**
 *  取消重复请求工具类
 *  多个相同的重复请求，取消前者，发送最后一个请求给服务器
 */


const cancelMap = new Map<string, Canceler>()

const getFullUrlStr = (config: AxiosRequestConfig): string => {
    const str = qs.stringify(config)
    return str
}

export default class CancelRequest {
    addPending(config: AxiosRequestConfig): void {
        // 先判断是否有上一次请求，有则先取消上次请求，再添加本次请求记录
        this.removePending(config)

        const url = getFullUrlStr(config)
        config.cancelToken = config.cancelToken || new axios.CancelToken((cancel) => {
            // 保险判断多一层
            if (!cancelMap.has(url)) {
                // 将取消方法存放到map中对应的url key 上，需要取消时取出执行该方法即可
                cancelMap.set(url, cancel)
            }
        })
    }

    cancelReq(config: AxiosRequestConfig, message?: string): void {
        const url = getFullUrlStr(config)
        if (cancelMap.has(url)) {
            // 取出上次请求的cancel 方法，调用该方法，即可取消该请求
            const cancel = cancelMap.get(url)
            !!cancel && cancel(message || '我取消了本次axios请求', config,);
        }
    }

    removePending(config: AxiosRequestConfig): void {
        const url = getFullUrlStr(config)
        if (cancelMap.has(url)) {
            // 删除本次取消的请求的记录
            cancelMap.delete(url)
        }
    }
}