import {FC} from "react" ; 
import Loading from "./Loading";


export interface LoadingDialogProps{
    open:boolean,
    onClose:()=>any,
}

const LoadingDialog :FC<LoadingDialogProps> = ({open,})=>{
  if(open){
      return (
        <div className="w-screen h-screen fixed top-0 left-0 bg-opacity-50 bg-black flex justify-center items-center">
          <div className="bg-white rounded-3xl p-3 flex justify-center items-center">
              <Loading />
          </div>
        </div>
      )

  }else{
    return <></> ;
  }
} 
export default LoadingDialog ;
