import React, { useState, lazy, Suspense } from "react";
import { useRouteLoaderData } from "react-router-dom";

// import Class from "@/components/Class";
// import './App.css'
import './App.less'

import { getIndex,getAudio } from "@/utils/api";

const LazyClass = lazy(() => import('@/components/Class'))

// prefetch preload 兼容性问题较大，还是不建议使用
// prefetch 
const PrefetchDemo = lazy(() => import(
    /* webpackChunkName: "Prefetch" */ // 资源打包后的文件chunkname
    /* webpackPrefetch: true */ // 开启prefetch预获取 
    '@/components/Prefetch'
))
// preload 
const PreloadDemo = lazy(() => import(
    /* webpackChunkName: "PreloadDemo" */ // 资源打包后的文件chunkname
    /* webpackPreload: true */ // 开启preload预加载
    '@/components/Preload'
))




const App = () => {
    const [count, addCount] = useState<number>(0)
    const [show, setShow] = useState<boolean>(false)

    console.log('useRouteLoaderData===', useRouteLoaderData('root'))
    const handleClick = async () => {
        import('./App.css')
        setShow(true)
        // const res = await getIndex()
        // console.log(res,'==res==');
        
        const a = await getAudio()
        console.log(a,'==audio==')

    }

    

    return <div>
        <h2 className="h2">webpack5-react-ts</h2>
        <h3 className="h3">count {count}</h3>
        <button onClick={() => addCount(count => count + 1)}>add count</button>
        <h3>NODE_ENV={process.env.NODE_ENV}</h3>
        <h3>BASE_ENV={process.env.BASE_ENV}</h3>

        {/* 正常加载组件 */}
        {/* <Class /> */}

        <div>
            <div className="smallImg">小</div>
            <div className="bigImg">大11</div>
        </div>

        <button onClick={handleClick}>点击动态加载css文件，展示懒加载组件</button>

        {show && <Suspense fallback={() => <>懒加载组件loading中</>}>
            <div>
                <h4>以下是懒加载组件</h4>
                <LazyClass />

                <h2>以下是预加载预请求组件</h2>
                <PrefetchDemo />
                <PreloadDemo />
            </div>
        </Suspense>}

    </div>
}

export default App