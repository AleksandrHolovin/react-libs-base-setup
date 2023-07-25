import axios from 'axios';
import { store } from '../../store';
import { clearSession, setToken } from '../../store/reducers/session.reducer';
import { CONFIG } from '../constants';
import { clearAuthState } from '../../store/reducers/auth.reducer';
import Config from 'react-native-config';

export default function intercept(): void {
	axios.defaults.baseURL = Config.BASE_URL;
	let isRefreshing = false;
	let subscribers: Array<(value: string) => void> = [];
	//commit account check

	axios.interceptors.request.use(async req => {
		const {
			accessToken,
		} = store.getState().session.token;
		const {
			accessToken: tempAccessToken,
		} = store.getState().auth.tempSession.token;

		if (accessToken || tempAccessToken) {
			if (req.headers) {
				req.headers.Authorization = `Bearer ${accessToken || tempAccessToken}`;
			} else {
				delete req.headers['Authorization'];
			}
		}
		return req;
	});

	axios.interceptors.response.use(undefined, err => {
		const {
			accessToken,
			refreshToken,
		} = store.getState().session.token;
		const {
			accessToken: tempAccessToken,
			refreshToken: tempRefreshToken,
		} = store.getState().auth.tempSession.token;

		const {
			config,
			response: { status },
		} = err;
		const originalRequest = config;
		if (status === 401) {
			if (!isRefreshing) {
				isRefreshing = true;
				axios
					.post('/api/auth/refresh-token', {
						accessToken: accessToken || tempAccessToken,
						refreshToken: refreshToken || tempRefreshToken,
					})
					.then(res => {
						isRefreshing = false;
						onRefreshed(res.data.value.accessToken);
						store.dispatch(setToken(res.data.value));
						subscribers = [];
					})
					.catch(() => {
						store.dispatch(clearSession());
						store.dispatch(clearAuthState());
					});
			}
			return new Promise(resolve => {
				subscribeTokenRefresh((token: string) => {
					originalRequest.headers.Authorization = `Bearer ${token}`;
					resolve(axios(originalRequest));
				});
			});
		}

		return Promise.reject(err);
	});

	function subscribeTokenRefresh(cb: (value: string) => void) {
		subscribers.push(cb);
	}

	function onRefreshed(token: string) {
		subscribers.map(cb => cb(token));
	}
}
