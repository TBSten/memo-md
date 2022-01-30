import {FC} from "react" ; 


export interface LoadingProps{
}

const Loading :FC<LoadingProps> = ({children})=>{
  return (
    <div>
      Loading ...
    </div>
  )
} 
export default Loading ;