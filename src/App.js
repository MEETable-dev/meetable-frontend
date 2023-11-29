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
import Layout from './components/Layout';
import useAxiosInterceptor from 'hooks/useAxiosInterceptor';
import PrivateRoute from 'components/PrivateRoute';
// import LayoutTest from 'components/Layout test';

function App() {
  useAxiosInterceptor();
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<PrivateRoute member={false} goto={"/:username"}><NewApmt /></PrivateRoute>} />
        <Route path="/login" element={<PrivateRoute member={false} goto={"/:username"}><Login /></PrivateRoute>} />
        <Route path="/emailauth" element={<PrivateRoute member={false} goto={"/:username"}><EmailAuth /></PrivateRoute>} />
        <Route path="/enterinfo" element={<PrivateRoute member={false} goto={"/:username"}><EnterInfo /></PrivateRoute>} />
        <Route path="/policy" element={<PrivateRoute member={false} goto={"/:username"}><Policy /></PrivateRoute>} />
        <Route path="/findemail" element={<PrivateRoute member={false} goto={"/:username"}><FindEmail /></PrivateRoute>} />
        <Route path="/resetpass" element={<PrivateRoute member={false} goto={"/:username"}><ResetPass /></PrivateRoute>} />
        <Route path="/apmtdetail/:apmtId" element={<PrivateRoute member={false} goto={"/:username/apmtdetail/:apmtId"}><ApmtDetail /></PrivateRoute>} />
        <Route path="/newapmt" element={<PrivateRoute member={false} goto={"/:username/newapmt"}><NewApmt /></PrivateRoute>} />
        <Route path="/:username">
          <Route index element={<PrivateRoute member={true} goto={"/newapmt"}><Home /></PrivateRoute>} />
          <Route path="newapmt" element={<PrivateRoute member={true} goto={"/login"}><NewApmt /></PrivateRoute>} />
          <Route path="allapmt" element={<PrivateRoute member={true} goto={"/newapmt"}><AllApmt /></PrivateRoute>} />
          <Route path="apmtdetail/:apmtId" element={<PrivateRoute member={true} goto={"/login"}><ApmtDetail /></PrivateRoute>} />
          <Route path="resetpass" element={<PrivateRoute member={true} goto={"/newapmt"}><ResetPass /></PrivateRoute>} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
