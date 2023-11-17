import type { RouteObject } from 'react-router-dom'
import React from "react";
import { createBrowserRouter, RouterProvider, Outlet } from "react-router-dom";

import Layout from '@/layout/Layout'
import App from '@/pages/App'
import Page2 from "./pages/page2";
import Login from './pages/login';

// 路由配置数组，可用于生成路由菜单列表
export const routerConfig: Array<RouteObject> = [
    {

        id: 'root',
        path: "/",
        loader: async () => {
            await new Promise((res) => setTimeout(() => {
                res(12)
            }, 1000))

            return {
                // 权限可以通过 api获取，
                // 页面可以通过useRouterLoaderData(id)获取 路由loader数据
                // 也可以在具体页面通过useLoaderData()获取自己的loader数据
                permissions: ['权限1', '权限2']
            }
        },
        Component: Layout,
        children: [
            {
                // 默认路由 / 渲染该节点
                index: true,

                element: <App />
            },
            {
                path: 'page2',
                element: <Page2 />
            }
        ]
    }, {
        path: '/login',
        action: async ({ request }) => {
            console.log(request, 'request')
            // 通过在页面触发 Form组件的 submit,会触发action的函数
            let formData = await request.formData();
            let username = formData.get('username') as string | null;

            console.log('输入了：username==', username)

            // 浏览器会保留不同的状态，回退时，也会需要回退多次，不会直接回退到上一个路由
            // 在页面通过 useActionData() 获取 action返回的数据
            return {
                code:200,
                status:'ok',
                messga: '登录成功',
                data:{username}
            }
        },
        element: <Login />
    },
    {
        path: '/img',
        element: <Page2 />
    }
]

const router = createBrowserRouter(routerConfig)


export default function MyRouter() {
    return (<RouterProvider router={router} fallbackElement={<div>loading...</div>} />)
}

