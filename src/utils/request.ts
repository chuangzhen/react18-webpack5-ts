import axios from 'axios'
import type { AxiosInstance, AxiosRequestConfig, AxiosResponse, InternalAxiosRequestConfig, CreateAxiosDefaults } from 'axios'

type RequestFunction = (config: InternalAxiosRequestConfig) => InternalAxiosRequestConfig | Promise<InternalAxiosRequestConfig>
type ResponseFunction = (config: AxiosResponse) => AxiosResponse | Promise<AxiosResponse>
type ErrorFunction = (err: any) => any
type CurHooks = {
    /** 请求拦截器函数或函数数组 */
    requestInterceptors: RequestFunction | RequestFunction[],
    /**响应拦截器函数 或 函数数组 */
    responseInterceptors: ResponseFunction | ResponseFunction[],
    /**请求错误拦截器函数 或 函数数组 */
    requestErrorInterceptors: ErrorFunction | ErrorFunction[],
    /**响应错误拦截器函数 或 函数数组 */
    responseErrorInterceptors: ErrorFunction | ErrorFunction[],
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
        if (curHooks) {
            this.setInterceptors(curHooks)
        }

        return new Promise((resolve, reject) => {
            this.axiosInstance
                .request<T>(config)
                .then((res) => {
                    resolve(res.data);
                })
                .catch((error) => {
                    reject(error);
                });
        });
    }
    get<T = any>(url: string, data: any): Promise<T>;
    get<T = any>(config: AxiosRequestConfig, curHooks?: CurHooks): Promise<T>;
    get(config: string | AxiosRequestConfig, data: any = undefined) {
        let conf: AxiosRequestConfig = {};
        let curHooks = undefined;
        if (typeof config === 'string') {
            conf.url = config;
            conf.params = data;
        } else {
            conf = config;
            if (data) {
                curHooks = data;
            }
        }
        return this.request({ ...conf, method: 'GET' }, curHooks);
    }
    post<T = any>(url: string, data: any): Promise<T>;
    post<T = any>(config: AxiosRequestConfig, curHooks?: CurHooks): Promise<T>;
    post(config: string | AxiosRequestConfig, data: any = undefined) {
        let conf: AxiosRequestConfig = {};
        let curHooks = undefined;
        if (typeof config === 'string') {
            conf.url = config;
            conf.params = data;
        } else {
            conf = config;
            if (data) {
                curHooks = data;
            }
        }
        return this.request({ ...conf, method: 'POST' }, curHooks);
    }



    // curHooks 如果有传，就表示是当次请求自定义的拦截器
    setInterceptors(curHooks?: RequestHooks) { // , customOptions?: CustomOptions
        let hooks: CurHooks = this.options?.hooks || {};
        if (curHooks) {
            hooks = curHooks;
        }
        if (!hooks) {
            return;
        }

        // 将所有拦截器都规范化为数组
        Object.keys(hooks).forEach((key) => {
            // @ts-ignore
            if (!Array.isArray(hooks[key])) {
                // @ts-ignore
                hooks[key] = [hooks[key]];
            }
        });

        const {
            requestInterceptors,
            responseInterceptors,
            requestErrorInterceptors,
            responseErrorInterceptors,
        } = hooks;

        // 请求拦截器，支持传多个
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

        // 响应拦截器
        if (responseInterceptors) {
            (responseInterceptors as ResponseFunction[]).forEach((interceptor: Function) => {
                this.axiosInstance.interceptors.response.use((resp: AxiosResponse): AxiosResponse | Promise<AxiosResponse> => {
                    return interceptor(resp);
                });
            });
        }

        if (responseErrorInterceptors) {
            (responseErrorInterceptors as ErrorFunction[]).forEach((interceptor: Function) => {
                this.axiosInstance.interceptors.response.use(undefined, (err: any): any => {
                    return interceptor(err);
                });
            });
        }
    }

}
export const request = new Request({
    // 请求路径前缀
    // baseURL: 'https://react-nodejs-chatgpt-tutorial.vercel.app',
    baseURL: 'http://localhost:8000',
    // 超时限制
    timeout: 3000,
    // 允许携带cookie
    withCredentials: true,
    // 公共请求头
    headers: { "Content-Type": "'application/json'" },
    hooks: {
        requestInterceptors: [
            (config) => {
                console.log('请求拦截器111',config);
                return config;
            },
            (config) => {
                console.log('请求拦截器222',config);
                return config;
            },
        ],
        responseInterceptors: (resp) => {
            console.log('响应拦截器', resp);
            return resp;
        },
    },
});
