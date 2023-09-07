import React from "react";
import { createRoot } from 'react-dom/client'

import App from './pages/App'

const root = document.getElementById('root')
if (root) {
    // 开启批处理机制
    createRoot(root).render(<App />)
}