import { request } from "../request";


export const getIndex = function () {
    return request.get({ url: '/api/' }, {
        hooks: {
            requestInterceptors:(config) => {
                config.name = 'cz'
                console.log(98)
                return config
            },
            requestErrorInterceptors: (err) => {
                console.log(err, '==requestErrorInterceptors')
                return err
            },
            responseErrorInterceptors: [(err) => {
                console.log(err, '==responseErrorInterceptors')
                return err
            },(err) => {
                console.log(err, '==responseErrorInterceptors222')
                return err
            }]
        }
    })
}
export const getAudio = function () {
    // ?? 这里有问题 前端怎么接受 audio流文件
    // return request.get({url:'/api/audio',headers:{"Content-Type":"audio/mpeg"}})
    return request.get({ url: '/api/audio', headers: { "Content-Type": "audio/mpeg" } }, {
        hooks: {
            requestInterceptors: (config) => {
                console.log('针对本次请求的拦截器', config)
                return config
            }
        }
    })
}