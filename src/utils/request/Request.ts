import axios, { formToJSON } from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, CreateAxiosDefaults } from 'axios'

type RequestFunction = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
type ResponseFunction = (config: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
type ErrorFunction = (err: any) => any
type CurHooks = {
    /** 请求拦截器函数或函数数组 */
    requestInterceptors?: RequestFunction | RequestFunction[],
    /**响应拦截器函数 或 函数数组 */
    responseInterceptors?: ResponseFunction | ResponseFunction[],
    /**请求错误拦截器函数 或 函数数组 */
    requestErrorInterceptors?: ErrorFunction | ErrorFunction[],
    /**响应错误拦截器函数 或 函数数组 */
    responseErrorInterceptors?: ErrorFunction | ErrorFunction[],
}
interface RequestOptions extends CreateAxiosDefaults {
    hooks?: CurHooks
}

export default class Request {
    // 保存axios实例
    private axiosInstance: AxiosInstance;
    // 保存请求公共配置，所有Request实例的请求都共用的这个配置
    private readonly options: RequestOptions;
    constructor(options: RequestOptions) {
        this.options = options;
        this.axiosInstance = axios.create(options);
        this.setInterceptors()
    }
    // 提供一个方法可以修改当前保存的axios实例,生成新的实例对象
    setAxios(options: RequestOptions): void {
        this.options = options;
        this.axiosInstance = axios.create(options);
        this.setInterceptors()
    }
    getAxios() {
        return this.axiosInstance;
    }
    // 真正的请求方法，其实还是调的axios的request
    // curRequestOptions是每个请求都可以有自己配置的options，用于覆盖公共的配置
    request<T = any>(config: AxiosRequestConfig, curHooks?: CurHooks): Promise<T> {
        console.log(999);

        if (curHooks) {
            // let hooks: CurHooks = this.options?.hooks || {};
            // hooks = this.formatToArray(hooks)
            // curHooks = this.formatToArray(curHooks)
            // if (curHooks) {
            //     hooks.requestInterceptors = hooks.requestInterceptors.concat(curHooks?.requestInterceptors).filter(Boolean)
            //     hooks.responseInterceptors = hooks.responseInterceptors.concat(curHooks?.responseInterceptors).filter(Boolean)
            //     hooks.requestErrorInterceptors = hooks.requestErrorInterceptors.concat(curHooks?.requestErrorInterceptors).filter(Boolean)
            //     hooks.responseErrorInterceptors = hooks.responseErrorInterceptors.concat(curHooks?.responseErrorInterceptors).filter(Boolean)
            // }

            // this.setAxios({ ...config, hooks: hooks })
            this.setInterceptors(curHooks)
        }
        console.log(config, '====1123=');

        return new Promise((resolve, reject) => {
            this.axiosInstance
                .request<T>(config)
                .then((res) => {
                    resolve(res?.data);
                })
                .catch((error) => {
                    reject(error);
                })
        });
    }
    get<T = any>(url: string, data: any): Promise<T>;
    get<T = any>(config: AxiosRequestConfig, curHooks?: { hooks?: CurHooks }): Promise<T>;
    get(config: string | AxiosRequestConfig, data: any = undefined) {
        console.log(222);

        let conf: AxiosRequestConfig = {};
        let curHooks = undefined;
        if (typeof config === 'string') {
            conf.url = config;
            conf.params = data;
        } else {
            conf = config;
            // 传递了自定义的拦截器hooks
            if (data?.hooks) {
                curHooks = data.hooks;
            }
        }
        console.log(111, curHooks)
        return this.request({ ...conf, method: 'GET' }, curHooks);
    }
    post<T = any>(url: string, data: any): Promise<T>;
    post<T = any>(config: AxiosRequestConfig, curHooks?: { hooks?: CurHooks }): Promise<T>;
    post(config: string | AxiosRequestConfig, data: any = undefined) {
        let conf: AxiosRequestConfig = {};
        let curHooks = undefined;
        if (typeof config === 'string') {
            conf.url = config;
            conf.params = data;
        } else {
            conf = config;
            if (data?.hooks) {
                curHooks = data.hooks;
            }
        }
        return this.request({ ...conf, method: 'POST' }, curHooks);
    }


    // curHooks 如果有传，就表示是当次请求有自定义的拦截器
    setInterceptors(curHooks?: CurHooks) {
        console.log(curHooks, 'curHooks')
        let hooks: CurHooks = { requestInterceptors: [], responseInterceptors: [], requestErrorInterceptors: [], responseErrorInterceptors: [], ...this.options?.hooks };
        hooks = this.formatToArray(hooks)
        curHooks = this.formatToArray(curHooks)
        if (curHooks) {
            // hooks = curHooks
            console.log('after==', hooks);
            hooks.requestInterceptors = hooks.requestInterceptors.concat(curHooks?.requestInterceptors).filter(Boolean)
            hooks.responseInterceptors = hooks.responseInterceptors.concat(curHooks?.responseInterceptors).filter(Boolean)
            hooks.requestErrorInterceptors = hooks.requestErrorInterceptors.concat(curHooks?.requestErrorInterceptors).filter(Boolean)
            hooks.responseErrorInterceptors = hooks.responseErrorInterceptors.concat(curHooks?.responseErrorInterceptors).filter(Boolean)
        }
        if (!hooks) {
            return;
        }

        const {
            requestInterceptors,
            responseInterceptors,
            requestErrorInterceptors,
            responseErrorInterceptors,
        } = hooks;


      

        // 请求拦截器，支持数组类型传多个, // 当传递数组时，请求拦截器时【从右到左】生效
        if (requestInterceptors) {
            (requestInterceptors as RequestFunction[]).forEach((interceptor: Function) => {
                this.axiosInstance.interceptors.request.use((config: InternalAxiosRequestConfig): InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig> => {
                    return interceptor(config);
                    // return interceptor(config, this.getCustomOptions(customOptions || {}));
                });
            });
        }

        if (requestErrorInterceptors) {
            (requestErrorInterceptors as ErrorFunction[]).forEach((interceptor: Function) => {
                this.axiosInstance.interceptors.request.use(undefined, (err: any): any => {
                    return interceptor(err);
                });
            });
        }

        // 响应拦截器   // 当传递数组时，请求拦截器时【从左到右】生效
        if (responseInterceptors) {
            (responseInterceptors as ResponseFunction[]).forEach((interceptor: Function) => {
                this.axiosInstance.interceptors.response.use((resp: AxiosResponse): AxiosResponse | Promise<AxiosResponse> => {
                    return interceptor(resp);
                });
            });
        }

        // 响应拦截-错误处理
        if (responseErrorInterceptors) {
            (responseErrorInterceptors as ErrorFunction[]).forEach((interceptor: Function) => {
                this.axiosInstance.interceptors.response.use(undefined, (err: any): any => {
                    return interceptor(err);
                });
            });
        }
    }

    formatToArray(obj) {
        if (!obj) {
            return undefined
        }
        let hooksObj = { ...obj }
        // 将所有拦截器都规范化为数组
        Object.keys(hooksObj).forEach((key) => {
            // @ts-ignore
            if (!Array.isArray(hooksObj[key])) {
                // @ts-ignore
                hooksObj[key] = [hooksObj[key]];
            }
        });

        return hooksObj
    }

}
