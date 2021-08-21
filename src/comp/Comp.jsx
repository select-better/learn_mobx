import React, { memo, useState } from 'react';
import { useCounter, useUpdate } from './utils'

import './index.css'

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
   // 触发我们的更新
   actionReaction(){
       this.reactions.forEach(item=>item.innerEffect && item.innerEffect())
   }
}

class Model{
    state_a = 222;
    atom_a = new Atom();
    // 当作数据来执行 比如get 和 set
    get_a(reaction){
        if(reaction){
            this.atom_a.reactions.add(reaction)
        }
        return this.state_a
    }
    set_a(val){
        // 这里顺序反了会慢一步更新
       this.state_a = val
       this.atom_a.actionReaction()
    }

    state_b = 'bbb';
    atom_b = new Atom();
 
    get_b(reaction){
        if(reaction){
            this.atom_b.reactions.add(reaction)
        }
        return this.state_b
    }
    set_b(val){
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
    return <div className='container'>
        <div>title:A</div>
        <button onClick={()=>model.set_a(count)}> 按钮 </button>
        <div>value:{model.get_a(showReact)}</div>
        <div> 更新的次数：{count} </div>
    </div>
})

const B = memo(() => {
    const count = useCounter();
    const updateFun = useUpdate();
    const [reactionB] = useState(()=>new Reaction('bbb', updateFun))

    return <div className='container'>
        <div>title:B</div>
        <button onClick={()=>model.set_b(count)}> 按钮 </button>
        <div> value: {model.get_b(reactionB)} </div>
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