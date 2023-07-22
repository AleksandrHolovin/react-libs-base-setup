import axios from 'axios';
import intercept from './interceptor';
import { ApiResponse } from '../types';
import { handleResponseError as handleError } from '../utils';

type KeyValue<U> = {
	[key: string]: U;
};

intercept();

export const API = {
	get: async (url: string, params: any, headers: KeyValue<string> = {}) => {
		const response = await axios
			.get(url, {
				params,
				headers: {
					...headers,
				},
			})
			.catch(err => handleError(err));
		return response.data;
	},
	post: async (
		url: string,
		body: Record<string, any>,
		headers: KeyValue<string> = {},
	): Promise<ApiResponse<any>> => {
		const response = await axios
			.post(url, body, {
				headers: {
					...headers,
				},
			})
			.catch(err => handleError(err));
		return response.data;
	},
	put: async (
		url: string,
		body: Record<string, any>,
		headers: KeyValue<string> = {},
	) => {
		const response = await axios
			.put(url, body, {
				headers: {
					...headers,
				},
			})
			.catch(err => handleError(err));
		return response.data;
	},
	patch: async (
		url: string,
		body: Record<string, any>,
		headers: KeyValue<string> = {},
	) => {
		const response = await axios
			.patch(url, body, {
				headers: {
					...headers,
				},
			})
			.catch(err => handleError(err));
		return response.data;
	},
	delete: async (
		url: string,
		body?: Record<string, any>,
		headers: KeyValue<string> = {},
	) => {
		const response = await axios
			.delete(url, {
				data: body,
				headers,
			})
			.catch(err => handleError(err));
		return response.data;
	},
};
