import { Route, Routes } from 'react-router-dom'
import Home from './pages/Home';
import Login from './pages/Login';
import EmailAuth from './pages/EmailAuth';
import EnterInfo from './pages/EnterInfo';
import Policy from './pages/Policy';
import FindEmail from './pages/FindEmail';
import ResetPass from './pages/ResetPass';
import NewApmt from './pages/NewApmt';
import AllApmt from './pages/AllApmt';
import ApmtDetail from './pages/ApmtDetail';
import MyPage from './pages/MyPage';
import Layout from './components/Layout';
// import { useSelector } from 'react-redux';
import useAxiosInterceptor from 'hooks/useAxiosInterceptor';
import PrivateRoute from 'components/PrivateRoute';

function App() {
  // const isLoggedIn = useSelector((state) => !!state.accessToken);
  useAxiosInterceptor();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<NewApmt />} />
        <Route path="/login" element={<PrivateRoute pub={true}><Login /></PrivateRoute>} />
        <Route path="/emailauth" element={<PrivateRoute pub={true}><EmailAuth /></PrivateRoute>} />
        <Route path="/enterinfo" element={<PrivateRoute pub={true}><EnterInfo /></PrivateRoute>} />
        <Route path="/policy" element={<PrivateRoute pub={true}><Policy /></PrivateRoute>} />
        <Route path="/findemail" element={<PrivateRoute pub={true}><FindEmail /></PrivateRoute>} />
        <Route path="/resetpass" element={<PrivateRoute pub={true}><ResetPass /></PrivateRoute>} />
        <Route path="/apmtdetail/:apmtId" element={<PrivateRoute pub={true}><ApmtDetail /></PrivateRoute>} />
        <Route path="/:username">
          <Route index element={<PrivateRoute pub={false}><Home /></PrivateRoute>} />
          <Route path="newapmt" element={<PrivateRoute pub={false}><NewApmt /></PrivateRoute>} />
          <Route path="allapmt" element={<PrivateRoute pub={false}><AllApmt /></PrivateRoute>} />
          <Route path="apmtdetail/:apmtId" element={<PrivateRoute pub={false}><ApmtDetail /></PrivateRoute>} />
          <Route path="mypage" element={<PrivateRoute pub={false}><MyPage /></PrivateRoute>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
