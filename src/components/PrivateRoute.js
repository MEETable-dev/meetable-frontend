import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = (props) => {
  const pub = props.pub;
  const accessToken = useSelector((state) => state.user.accessToken);
  const localStorage = window.localStorage;

  if (!pub && !accessToken) {
    localStorage.setItem('originURL', window.location);
    return <Navigate to="/login" />
  }
  if (pub && accessToken) {
    if (localStorage.getItem('originURL')) {
      const url = localStorage.getItem('originURL').split('3000')[1]
      localStorage.removeItem('originURL')
      console.log(url)
      return <Navigate to={url} />
    }
    else return <Navigate to="/:" />
  }
  
  return props.children;
}

export default PrivateRoute;