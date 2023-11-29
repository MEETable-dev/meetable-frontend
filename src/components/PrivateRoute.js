import { Navigate } from 'react-router-dom';
import { useSelector } from 'react-redux';

const PrivateRoute = (props) => {
  const member = props.member;
  const goto = props.goto;
  const accessToken = useSelector((state) => state.user.accessToken);
  const localStorage = window.localStorage;

  if ((member && !accessToken) || (!member && accessToken)) {
    if (localStorage.getItem('originURL')) {
      const url = localStorage.getItem('originURL').split('3000')[1]
      localStorage.removeItem('originURL')
      window.location.href = url;
      return;
    }
    if (goto.includes('login')) {
      localStorage.setItem('originURL', window.location);
    }
    window.location.href = goto;
    return;
  }
  return props.children;
}

export default PrivateRoute;