import {FC, useEffect, useState} from "react" ; 


export interface LoadingProps{
}

const Loading :FC<LoadingProps> = ({children})=>{
  const [cnt,setCnt] = useState(0) ;
  useEffect(()=>{
    console.log("useEffect")
    setInterval(()=>{
      setCnt(prev=>(prev+1)%4);
    },0.3*1000);
  },[setCnt]);
  return (
    <div>
      Loading {Array(cnt).fill(".")}
    </div>
  )
} 
export default Loading ;

