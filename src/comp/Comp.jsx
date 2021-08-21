import React, { memo, useState } from 'react';
import { useCounter, useUpdate, observer , autoObserve } from './utils'

import './index.css'

class Model{
   a = 'a';
   b =  'bb';
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
    const updateFun = useUpdate();
    return <div className='container'>
        <div>title:Sum</div>
        <button onClick={updateFun}> 按钮 </button>
        <div> 更新的次数：{count} </div>
        <A />
        <B />
    </div>
}

export default memo(Sum)