import axios, { Method } from 'axios';
import { store } from '../../redux';
// import { logout } from '../redux/actions/auth.actions';
import AlerterService from '../services/AlertService';
import { PayloadMessage, PayloadError } from '../types';

interface IApiResponse {
    success: boolean;
    errors: PayloadError[];
    messages: PayloadMessage[];
    value?: any;
}

export const baseUrl = 'https://localhost:3000';

axios.defaults.baseURL = baseUrl;

const returnAuthorizationHeader = (headers: any) => {
    const token = store.getState().token.accessToken;

    return !token
        ? { ...headers }
        : {
            ...headers,
            Authorization: `Bearer ${token}`,
        };
};

const logoutIfNoAccess = (response: any) => {
    const { dispatch } = store;
    if (response.data.status === 403) {
        AlerterService.error(response.data.title);
        //   dispatch(logout());
    }
    if (response.status === 403) {
        AlerterService.error(response.title);
        // dispatch(logout());
    }
};

class Api {
    async get(url: string, headers: any = {}) {
        const response = await axios
            .get(url, { headers: returnAuthorizationHeader(headers) })
            .catch((err) => ({ data: err.response.data }));
        logoutIfNoAccess(response);

        return response.data;
    }

    async post(
        url: string,
        body: any = null,
        headers: any = {},
    ): Promise<IApiResponse> {
        const response = await axios
            .post(url, body, { headers: returnAuthorizationHeader(headers) })
            .catch((err) => ({ data: err.response.data }));
        logoutIfNoAccess(response);

        return response.data;
    }

    async put(url: string, body: any = null, headers: any = {}) {
        const response = await axios
            .put(url, body, { headers: returnAuthorizationHeader(headers) })
            .catch((err) => ({
                data: err.response.data,
            }));
        logoutIfNoAccess(response);
        return response.data;
    }

    async patch(url: string, body: any = null, headers: any = {}) {
        const response = await axios
            .patch(url, body, { headers: returnAuthorizationHeader(headers) })
            .catch((err) => ({
                data: err.response.data,
            }));
        logoutIfNoAccess(response);

        return response.data;
    }

    async delete(url: string, body: any = null, headers: any = {}) {
        const response = await axios
            .delete(url, { headers: returnAuthorizationHeader(headers) })
            .catch((err) => ({
                data: err.response.data,
            }));
        logoutIfNoAccess(response);

        return response.data;
    }
}

export default new Api();
