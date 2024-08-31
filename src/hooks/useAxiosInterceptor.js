import store from '../store';
import { setToken } from '../store/modules/user';
import { useAppDispatch } from '../store';
import axios from 'axios';

const useAxiosInterceptor = () => {
	const dispatch = useAppDispatch();
	const localStorage = window.localStorage;

	axios.interceptors.request.use(
		(config) => {
			const accessToken = store.getState().user.accessToken;
			if (accessToken !== '' && config.headers['Authorization'] === undefined) {
				config.headers['Authorization'] = `Bearer ${accessToken}`;
			}
			return config;
		},
		(error) => {
			// console.log(error.data);
			return Promise.reject(error);
		},
	);

	axios.interceptors.response.use(
		(res) => {
			return res;
		},
		async (error) => {
			const tokenOrigin = store.getState().user.accessToken;
			if (error.response?.data.statusCode === 1000) {
				try {
					console.log('access denied');
					const refreshToken = localStorage.getItem('refreshToken');
					if (!refreshToken) {
						dispatch(setToken(''));
						return false;
					}
					const resp = await axios.post(
						`${process.env.REACT_APP_API_URL}/auth/token`,
						{
							accessToken: tokenOrigin,
							refreshToken: refreshToken,
						},
					);
					dispatch(setToken(resp.data.accessToken));
					localStorage.setItem('refreshToken', resp.data.refreshToken);
					console.log('Token 재발급');

					error.config.headers = {
						Authorization: `Bearer ${resp.data.accessToken}`,
					};

					const response = await axios.request(error.config);
					return response;
				} catch (error2) {
					const douleErrorResponseStatusCode = error2.response?.data.statusCode;
					if (
						douleErrorResponseStatusCode === 1070 ||
						douleErrorResponseStatusCode === 1080 ||
						douleErrorResponseStatusCode === 1060
					) {
						localStorage.removeItem('refreshToken');
						dispatch(setToken(''));
						return false;
					}
					return Promise.reject(error2);
				}
			}
			console.clear();
			return Promise.reject(error);
		},
	);
	return null;
};
export default useAxiosInterceptor;
