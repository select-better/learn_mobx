import React, { memo, useState } from 'react';
import { useCounter, useUpdate, observer , autoObserve, runInAction } from './utils'

import './index.css'

class Model{
   a = 1;
   b =  2;
   constructor(){
     autoObserve(this)
   }   
}

// 点击后model的key——value发生变化后触发更新
const model = new Model();
window.model = model

const A = observer(() => {
    const count = useCounter();
    const updateFun = useUpdate();
    return <div className='container'>
            <div>title:A</div>
            <button onClick={updateFun }> 按钮 </button>
            <div>value:{model.a}</div>
            <div> 更新的次数：{count} </div>
    </div>
})

const B = observer(() => {
    const count = useCounter();
    const updateFun = useUpdate();
    return <div className='container'>
        <div>title:B</div>
        <button onClick={updateFun}> 按钮 </button>
        <div> value: {model.b} </div>
        <div> 更新的次数：{count} </div>
    </div>
})

const Sum = () => {
    const count = useCounter();

    return <div className='container'>
        <div>title:Sum</div>
        <button onClick={()=>{
            // 这里的异步的setState会失效 和setTimeout一样，所以更新会多次
            Promise.resolve().then(()=>{
                runInAction(()=>{
                    model.a += 10;
                    model.b += 10;
                })
            })
        }}> 按钮 </button>
        {/* 更新次数会两次两次的增加 */}
        <div> 更新的次数：{count} </div>
        <div>  a*b：{ model.a * model.b } </div>
        <A />
        <B />
    </div>
}

export default observer(Sum)