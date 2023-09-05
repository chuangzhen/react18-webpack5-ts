import React, { PureComponent } from "react";


// 类装饰器  接受参数-类本身
function addAge(Target: Function) {
    // 为类Class 添加属性age和对应的值
    Target.prototype.age = 18
}

// 使用类装饰器
@addAge
class Class extends PureComponent {
    age?: number

    render() {

        return <div>
            <h4>这是类组件--age=={ this.age }</h4>
        </div>
    }
}

export default Class