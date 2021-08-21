import React, { memo, useState } from 'react';
import { useCounter, useUpdate } from './utils'

import './index.css'

// 增加一个全局变量，记录需要加入的更新方式
const globalState = {
    currentReaction: null
}

// 原子，用于区分定义
class Reaction{
    constructor(name, innerEffect){
       this.name = name;
       this.innerEffect = innerEffect;
    }
}

// 原子上的电子，用来触发事件
class Atom{
   reactions = new Set()
   // 增加我们的原子
   addReaction(){
       if(globalState.currentReaction){
           this.reactions.add(globalState.currentReaction)
       }
   }
   // 触发我们的更新
   actionReaction(){
       this.reactions.forEach(item=>item.innerEffect && item.innerEffect())
   }
}

class Model{
    state_a = 222;
    atom_a = new Atom();
    // 当作数据来执行 比如get 和 set
    get a(){
        this.atom_a.addReaction();
        return this.state_a
    }

    set a(val){
        this.state_a = val;
        this.atom_a.actionReaction();
    }

    state_b = 'bbb';
    atom_b = new Atom();
 
    get b(){
        this.atom_b.addReaction()
        return this.state_b
    }
    set b(val){
        this.state_b = val
        this.atom_b.actionReaction()
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