import { useContext } from 'react';
import { AuthContext } from '../Context Providers/AuthProvider';
import { Navigate, useLocation } from 'react-router-dom';

const PrivateRouts = ({children}) => {
    const {user,loading}=useContext(AuthContext);
    const location=useLocation();
    if(loading)return <div className="radial-progress" style={{"--value":70}} role="progressbar">70%</div>
    if(user){
        return children;
    }
    return <Navigate to={'/login'} state={{from:location}} replace></Navigate>
};

export default PrivateRouts;