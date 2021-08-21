import { useState, useRef, memo } from 'react';

const $mobx = Symbol('mobx admin');

// 会强制更新
export const useUpdate = () => {
    const [num,setNum] = useState(0);
    return () => setNum(c=>c+1)
}

export const useCounter = () => {
    const count = useRef(0);
    count.current++;
    return count.current
}

// 增加一个全局变量，记录需要加入的更新方式
export const globalState = {
    currentReaction: null
}

// 原子，用于区分定义
export class Reaction{
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

// 这个只是浅层的，没有深度遍历的
export const autoObserve= ( target ) => {
   if(!target[$mobx]){
     target[$mobx] = {
         values: new Map(),
         atoms: new Map()
     }
   }
   const adm = target[$mobx];
   Object.entries(target).forEach(([key,value])=> {
      adm.values.set(key, value);
      adm.atoms.set(key, new Atom());
      Object.defineProperty(target, key, {
          get(){
              adm.atoms.get(key).addReaction()
              return adm.values.get(key)
          },
          set(val){
            adm.values.set(key,val)
            adm.atoms.get(key).actionReaction()
          }
      })
   })
}


export const observer = ( fn ) => {
    return memo(( props )=>{
        const update = useUpdate();
        const [reaction ] = useState(()=>new Reaction(`mobx_${fn.name}`, update))
        try{
            globalState.currentReaction = reaction
            return fn(props)
        }finally{
            globalState.currentReaction = null
        }
    })
}