import React from "react";
import { Outlet,NavLink } from "react-router-dom";


const Layout = () => {

    return (
        <div>
            <header>
                <h1>layout 头部</h1>
                <NavLink to='/' style={({isActive}) => ({color:isActive?'red':'black'})}>首页</NavLink>
                <NavLink to='/page2' style={({isActive}) => ({color:isActive?'red':'black'})}>page2</NavLink>
                <NavLink to='/login' style={({isActive}) => ({color:isActive?'red':'black'})}>登录</NavLink>
            </header>


            <div style={{ background: '#e8e8e8' }}>
                这是子路由的渲染部分
                <Outlet />
            </div>

            <footer>
                <h1>layout底部</h1>
            </footer>
        </div>
    )
}

export default Layout