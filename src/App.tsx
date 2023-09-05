import React, { useState } from "react";
import './App.css'
import './App.less'

import Class from "./components/Class";

import BigImg from '@/assets/images/zhitiao.jpg'
// import smallImg from './assets/images/hs.jpg'
import smallImg from "./assets/images/hs.jpg";


const App = () => {
    const [count, AddCount] = useState<number>(0)

    return <div>
        <h2 className="h2">webpack5-react-ts</h2>
        <h3 className="h3">count--+{count}</h3>
        <button onClick={() => AddCount(count => count + 1)}>add count</button>
        <h3>NODE_ENV={process.env.NODE_ENV}</h3>
        <h3>BASE_ENV={process.env.BASE_ENV}</h3>

        <Class />

        <img style={{ width: 100, height: 100 }} src={BigImg} alt="" srcSet="" />
        <img style={{ width: 50, height: 80 }} src={smallImg} alt="" srcSet="" />

        <div>
            <div className="smallImg">小</div>
            <div className="bigImg">大11</div>
        </div>
    </div>
}

export default App