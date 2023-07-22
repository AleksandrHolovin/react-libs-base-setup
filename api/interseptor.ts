import axios from 'axios';
import { getSessionItems, setAuthHeaderToken } from '../utils';
import { store } from '../../redux';
import { loginSuccess, logoutSuccess } from '../../redux/reducers/auth.reducer';

export default function intercept(): void {
    axios.defaults.baseURL = 'http://localhost:5000';
    let isRefreshing = false;
    let subscribers: Array<(value: string) => void> = [];

    axios.interceptors.response.use(undefined, err => {
        const {
            config,
            response: { status },
        } = err;
        const originalRequest = config;
        if (status === 401) {
            if (!isRefreshing) {
                isRefreshing = true;
                axios
                    .post('/api/v1/auth/refresh-access-token', {
                        accessToken: getSessionItems().accessToken,
                        refreshToken: getSessionItems().refreshToken,
                    })
                    .then(res => {
                        isRefreshing = false;
                        onRefreshed(res.data.value.accessToken);
                        store.dispatch(loginSuccess(res.data.value));
                        setAuthHeaderToken(res.data.value.accessToken);
                        subscribers = [];
                    })
                    .catch(() => {
                        // Alerter.error("You need login again to continue");
                        store.dispatch(logoutSuccess());
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
