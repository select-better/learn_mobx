import React, { useState, useRef} from 'react';

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