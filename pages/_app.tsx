import '../styles/globals.css';
import type { AppProps } from 'next/app';
import { Provider } from "react-redux";
import store from "../store";
import Head from "next/head";
import React from 'react';
import { AuthProvider } from "react-oidc-context"
import Router from "next/router";
import '../api/axios_interceptor';
import Layout from "../components/common/layout/layout";
import 'react-toastify/dist/ReactToastify.css';
import { ToastContainer } from "react-toastify";
import { SWRConfig } from 'swr';
import { fetcher } from "../api/fetcher";
import { WebStorageStateStore } from "oidc-client-ts";
import { IDP } from "../api/constants";
import ErrorBoundary from '../components/common/layout/error-boundry'
const authorityPath = IDP;
export const clientId = 'admin-gateway';
const clientURL = typeof window !== 'undefined' && window.location.origin;

const oidcConfig = {
    userStore: typeof window !== 'undefined' ? new WebStorageStateStore({ store: window.localStorage }) : undefined,
    authority: `${authorityPath}`,
    client_id: `${clientId}`,
    scope: 'openid IdentityServerApi customerinfo',
    response_type: 'code',
    redirect_uri: `${clientURL}/authentication/callback`,
    post_logout_redirect_uri: `${clientURL}`, // Auth0 uses returnTo
    silent_redirect_uri: `${clientURL}/authentication/silent_callback`,
    automaticSilentRenew: true,
    loadUserInfo: true,
    metadata: {
        issuer: `${authorityPath}/`,
        authorization_endpoint: `${authorityPath}/connect/authorize`,
        token_endpoint: `${authorityPath}/connect/token`,
        userinfo_endpoint: `${authorityPath}/connect/userinfo`,
        end_session_endpoint: `${authorityPath}/connect/endsession`
    }
}

function MyApp({ Component, pageProps }: AppProps) {
    const onSignIn = () => {
        Router.push('/dashboard')
    }

    const getFaviconPath = (isDarkMode = false) => {
        return `/brand-mark.svg`;
    };

    return (
        <AuthProvider {...oidcConfig} onSigninCallback={onSignIn}>
            <Provider store={store}>
                <Head>
                    <link rel='icon' href={getFaviconPath(true)} type="image/svg+xml" />
                    <title>Admin Panel</title>
                </Head>
                <ToastContainer
                    position="top-left"
                    autoClose={5000}
                    hideProgressBar={false}
                    newestOnTop={true}
                    closeOnClick
                    rtl={true}
                    pauseOnFocusLoss
                    toastStyle={{ fontFamily: "Vazirmatn, Tahoma, Arial, sans-serif", fontSize: '14px' }}
                />
                <SWRConfig
                    value={{
                        revalidateOnFocus: false,
                        fetcher: fetcher
                    }}
                >
                    <Layout>
                        <Component {...pageProps} />
                    </Layout>
                </SWRConfig>
            </Provider>
        </AuthProvider>
    )
}

export default MyApp
