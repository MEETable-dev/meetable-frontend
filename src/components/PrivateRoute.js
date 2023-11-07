import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = (props) => {
  const pub = props.pub;
  const accessToken = useSelector((state) => state.user.accessToken);
  console.log(pub, accessToken)
  if (!pub && !accessToken) {
    return <Navigate to="/login" />
  }
  if (pub && accessToken) {
    return <Navigate to="/:" />
  }
  
  return props.children;
}

export default PrivateRoute;