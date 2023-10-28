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

function App() {
  return (
    <Routes>
      <Route element={<Layout />}>
        <Route index element={<NewApmt />} />
        <Route path="/login" element={<Login />} />
        <Route path="/emailauth" element={<EmailAuth />} />
        <Route path="/enterinfo" element={<EnterInfo />} />
        <Route path="/policy" element={<Policy />} />
        <Route path="/findemail" element={<FindEmail />} />
        <Route path="/resetpass" element={<ResetPass />} />

        <Route path="/:username">
          <Route index element={<Home />} />
          <Route path="newapmt" element={<NewApmt />} />
          <Route path="allapmt" element={<AllApmt />} />
          <Route path="apmtdetail/:apmtId" element={<ApmtDetail />} />
          <Route path="mypage" element={<MyPage />} />
        </Route>
      </Route>
    </Routes>
  );
}

export default App;
