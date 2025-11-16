import { Navigate, useLocation } from "react-router-dom";
import { jwtDecode } from "jwt-decode";

const isTokenValid = ()=>{
  const token = localStorage.getItem("token")
  if(!token) return false;

  try{
    const decoded = jwtDecode(token)
    const currentTime = Date.now()/1000
    localStorage.setItem("JobReadyProUserEmail" , decoded.email)
    return decoded.exp && decoded.exp > currentTime;
  }catch(err){
    return false;
  }
}

const PrivateRoute = ({children , redirectTo}) => {
    
    const location = useLocation()

    if (!isTokenValid()) {
        localStorage.setItem('intendedRoute', location.pathname);
        return <Navigate to={redirectTo} replace />;
    }
  
  return children;
};


export default PrivateRoute
