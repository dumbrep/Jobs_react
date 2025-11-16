
import { useEffect , useRef , useState } from "react";
import "./video.css"


const Video = ()=>{
  const videoRef = useRef(null)
  const canvasRef = useRef(null)
  const ws = useRef(null);

  const stream = useRef(null)

  const [emotion, setEmotion] = useState("waiting to connect with Face analysis backend")
  const [eyeContact,setEyeContact] = useState("")
 

 

  useEffect(()=>{
    const startCamera = async ()=>{
      try{
        stream.current = await navigator.mediaDevices.getUserMedia({video : true})
        if(videoRef.current){
          videoRef.current.srcObject = stream.current
        }
      }catch(error){
        console.log("Error while accessing the camera")
      }
    } 

    startCamera()

    return ()=>{
      if (stream.current) {
        stream.current.getTracks().forEach(track => track.stop()); // Stop video on unmount
      }
    }
  },[]);




  return (
    
    <div >
      
      <video ref={videoRef} autoPlay width="700px" height="500px" style={{ border: "1px solid black" }}></video>
      <canvas ref={canvasRef} width="700" height="500" style={{ display: "none" }}></canvas>
      
    </div>
    
  )

}

export default Video;