import React from "react";
import CsImg from '@/assets/images/cs.jpg'
import JhImg from '@/assets/images/jh.jpg'
import html2canvas from 'html2canvas'

const Page2 = () => {

    const handleClick  = () => {
        html2canvas(document.querySelector("#img")).then(canvas => {
            document.body.appendChild(canvas)
        });
    }


    return <>
        <h2></h2>
        <div id="img" style={{ width: '1000px' }}>
            <img src={CsImg} alt="" srcset="" style={{ width: '1000px' }} />
            <img src={JhImg} alt="" srcset="" style={{ width: '1000px' }} />
        </div>


        <button onClick={handleClick}>下载</button>
    </>
}

export default Page2