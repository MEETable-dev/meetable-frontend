import { Route, Routes } from 'react-router-dom';
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
import LayoutTest from 'components/Layout test';

function App() {
	const dev = true ? 'production' : 'development';
	if (dev === 'production') {
		console = window.console || {};
		console.log = function no_console() {}; // console log 막기
		console.warn = function no_console() {}; // console warning 막기
		console.error = function no_console() {}; // console error 막기
	}
	useAxiosInterceptor();
	return (
		<Routes>
			<Route element={<Layout head={''} />}>
				{/* <Route element={<LayoutTest head={false}/>}> */}
				{/* <Route index element={<PrivateRoute member={false} goto={"/newapmt"}><NewApmt /></PrivateRoute>} /> */}
				<Route
					path="/login"
					element={
						<PrivateRoute member={false} goto={'/:user'}>
							<Login />
						</PrivateRoute>
					}
				/>
				<Route
					path="/emailauth"
					element={
						<PrivateRoute member={false} goto={'/:user'}>
							<EmailAuth />
						</PrivateRoute>
					}
				/>
				<Route
					path="/enterinfo"
					element={
						<PrivateRoute member={false} goto={'/:user'}>
							<EnterInfo />
						</PrivateRoute>
					}
				/>
				<Route
					path="/policy"
					element={
						<PrivateRoute member={false} goto={'/:user'}>
							<Policy />
						</PrivateRoute>
					}
				/>
				<Route
					path="/findemail"
					element={
						<PrivateRoute member={false} goto={'/:user'}>
							<FindEmail />
						</PrivateRoute>
					}
				/>
				<Route
					path="/resetpass"
					element={
						<PrivateRoute member={false} goto={'/:user'}>
							<ResetPass />
						</PrivateRoute>
					}
				/>
			</Route>
			<Route element={<Layout head={'trans'} />}>
				<Route
					index
					element={
						<PrivateRoute member={false} goto={'/:user'}>
							<NewApmt />
						</PrivateRoute>
					}
				/>
				<Route
					path="/apmtdetail/:apmtId"
					element={
						<PrivateRoute member={false} goto={'/:user/apmtdetail/:apmtId'}>
							<ApmtDetail />
						</PrivateRoute>
					}
				/>
				<Route
					path="/newapmt"
					element={
						<PrivateRoute member={false} goto={'/:user'}>
							<NewApmt />
						</PrivateRoute>
					}
				/>
				<Route path="/:user">
					<Route
						path="apmtdetail/:apmtId"
						element={
							<PrivateRoute member={true} goto={'/apmtdetail/:apmtId'}>
								<ApmtDetail />
							</PrivateRoute>
						}
					/>
					<Route
						path="newapmt"
						element={
							<PrivateRoute member={true} goto={'/newapmt'}>
								<NewApmt />
							</PrivateRoute>
						}
					/>
				</Route>
			</Route>
			<Route element={<Layout head={'color'} />}>
				<Route
					index
					element={
						<PrivateRoute member={false} goto={'/:user'}>
							<NewApmt />
						</PrivateRoute>
					}
				/>
				<Route path="/:user">
					<Route
						index
						element={
							<PrivateRoute member={true} goto={'/newapmt'}>
								<Home />
							</PrivateRoute>
						}
					/>
					<Route
						path="allapmt"
						element={
							<PrivateRoute member={true} goto={'/newapmt'}>
								<AllApmt />
							</PrivateRoute>
						}
					/>
					<Route
						path="resetpass"
						element={
							<PrivateRoute member={true} goto={'/newapmt'}>
								<ResetPass />
							</PrivateRoute>
						}
					/>
				</Route>
			</Route>
		</Routes>
	);
}

export default App;
