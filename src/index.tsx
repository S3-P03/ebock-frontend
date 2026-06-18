import React from 'react';
import ReactDOM from 'react-dom/client';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';
import { AuthProvider } from 'react-oidc-context';
import { authProviderConfig } from './authConfig';
import { createRoot } from "react-dom/client";
import { KcPage, type KcContext } from "./keycloak-theme/kc.gen";

const kcContext = (window as any).kcContext as KcContext | undefined;

const root = ReactDOM.createRoot(
  document.getElementById('root') as HTMLElement
);

if (kcContext !== undefined) {
    createRoot(document.getElementById("root")!).render(
        <KcPage kcContext={kcContext} />
    );
} else {
    root.render(
        <React.StrictMode>
            <AuthProvider {...authProviderConfig}>
                <App/>
            </AuthProvider>
        </React.StrictMode>
    );
}

reportWebVitals();