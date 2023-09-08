import React from "react";
import { createRoot } from 'react-dom/client'

import MyRouter from "./router";

const root = document.getElementById('root')
if (root) {
    // 开启批处理机制
    createRoot(root).render(<MyRouter />)
}