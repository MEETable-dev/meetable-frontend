import { Navigate, Route, Redirect } from 'react-router-dom';
import { useSelector } from 'react-redux';

// import { history } from '_helpers';


const PrivateRoute = (props) => {
  const pub = props.pub;
  const accessToken = useSelector((state) => state.user.accessToken);
  // if (!pub && accessToken) {
  //   return children
  // }
  console.log(pub, accessToken)
  if (!pub && !accessToken) {
    // not logged in so redirect to login page with the return url
    return <Navigate to="/login" />
  }
  if (pub && accessToken) {
    return <Navigate to="/:" />
  }
  
  // authorized so return child components
  return (
    // <Route 
    //   path="/:username"
    //   // render={(props) =>
    //   //   children
    //   //   // accessToken 
    //   //   //   ? children 
    //   //   //   : <Navigate to="/login" />
    //   // }
    //   element={children}
    // />
    props.children
  );
}

export default PrivateRoute;