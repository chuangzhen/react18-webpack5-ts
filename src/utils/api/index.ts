import { request } from "../request";


export const getIndex = function () {
    return request.get({url:'/api/'},{
        hooks:{
            requestErrorInterceptors:(err) => {
                console.log(err,'==requestErrorInterceptors')
            },
            responseErrorInterceptors:(err) => {
                console.log(err,'==responseErrorInterceptors')
            }
        }
    })
}
export const getAudio = function () {
    // ?? 这里有问题 前端怎么接受 audio流文件
    return request.get({url:'/api/audio',headers:{"Content-Type":"audio/mpeg"}})
    request.get({url:'/api/audio',headers:{"Content-Type":"audio/mpeg"}},{
        hooks:{
            requestInterceptors:(config) => {
                console.log('针对本次请求的拦截器',config)
                return config
            }
        }
    })
}