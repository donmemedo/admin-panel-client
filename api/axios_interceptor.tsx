import axios from "axios";
import Router from "next/router";
import { IDP } from "./constants";

axios.interceptors.request.use((config) => {
    const clientId = 'admin-gateway';
    const authorityPath = IDP;

    if (typeof window !== 'undefined') {
        const oidcStorage = localStorage.getItem(`oidc.user:${authorityPath}:${clientId}`);
        const token = oidcStorage ? JSON.parse(oidcStorage)?.access_token : undefined;

        config.headers.set('Accept', '*/*');
        if (token) {
            config.headers.set('Authorization', `Bearer ${token}`);
        }
        config.headers.set('Cache-Control', 'no-store, no-cache, must-revalidate, max-age=0, post-check=0, pre-check=0');
        config.headers.set('Pragma', 'no-cache');
        config.headers.set('X-Content-Type-Options', 'nosniff');
    }

    return config;
});

axios.interceptors.response.use(
    (response) => response,
    async (error) => {
        const clientId = 'admin-gateway';
        const authorityPath = IDP;

        if (error.response?.status === 401 && typeof window !== 'undefined') {
            localStorage.removeItem(`oidc.user:${authorityPath}:${clientId}`);
            Router.push('/');
        }

        return Promise.reject(error);
    }
);
