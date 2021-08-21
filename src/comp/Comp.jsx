import React, { memo, useState } from 'react';
import { useCounter, useUpdate, Reaction, autoObserve, globalState } from './utils'

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

const A = memo(() => {
    const count = useCounter();
    const updateFun = useUpdate();
    const [showReact]= useState(()=>new Reaction('aaa', updateFun));
    globalState.currentReaction = showReact
    try{
        return <div className='container'>
            <div>title:A</div>
            <button onClick={()=>model.a = count }> 按钮 </button>
            <div>value:{model.a}</div>
            <div> 更新的次数：{count} </div>
        </div>
    }finally{
        globalState.currentReaction = null
    }
})

const B = memo(() => {
    const count = useCounter();
    const updateFun = useUpdate();
    const [reactionB] = useState(()=>new Reaction('bbb', updateFun))
    globalState.currentReaction = reactionB
    try{
        return <div className='container'>
            <div>title:B</div>
            <button onClick={()=>model.b = count}> 按钮 </button>
            <div> value: {model.b} </div>
            <div> 更新的次数：{count} </div>
        </div>
    }finally{
        globalState.currentReaction = null
    }
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