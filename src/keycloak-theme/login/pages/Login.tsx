import { getKcClsx } from "keycloakify/login/lib/kcClsx";
import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { kcClsx } = getKcClsx({ doUseDefaultCss, classes });
    const { realm, url } = kcContext;
    const { msg } = i18n;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={doUseDefaultCss} classes={classes} headerNode={<></>}>
            <div style={{ display: "flex", minHeight: "100vh", alignItems: "center", justifyContent: "center", background: "#f5f5f0" }}>
                <div style={{ width: "340px" }}>
                    {/* Logo */}
                    <div style={{ textAlign: "center", marginBottom: "24px" }}>
                        <div style={{ width: "48px", height: "48px", background: "#1D9E75", borderRadius: "12px", display: "inline-flex", alignItems: "center", justifyContent: "center", marginBottom: "12px" }}>
                            <span style={{ fontSize: "24px" }}>🍺</span>
                        </div>
                        <div style={{ fontSize: "22px", fontWeight: 600, color: "#222" }}>EBock</div>
                        <div style={{ fontSize: "13px", color: "#888", marginTop: "4px" }}>Le marketplace des étudiants de l'UdeS</div>
                    </div>

                    {/* Card */}
                    <div style={{ background: "#fff", border: "0.5px solid #ddd", borderRadius: "12px", padding: "24px" }}>
                        <div style={{ fontSize: "17px", fontWeight: 600, color: "#222", marginBottom: "4px" }}>Connexion</div>
                        <div style={{ fontSize: "13px", color: "#888", marginBottom: "20px" }}>Accédez à votre compte EBock</div>

                        <form action={url.loginAction} method="post">
                            {/* CIP */}
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>
                                    Identifiant (CIP)
                                </label>
                                <input
                                    name="username"
                                    type="text"
                                    placeholder="ex. boum7113"
                                    autoComplete="username"
                                    style={{ width: "100%", padding: "8px 10px", fontSize: "14px", border: "0.5px solid #ccc", borderRadius: "8px", boxSizing: "border-box" }}
                                />
                            </div>

                            {/* Mot de passe */}
                            <div style={{ marginBottom: "14px" }}>
                                <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>
                                    Mot de passe
                                </label>
                                <input
                                    name="password"
                                    type="password"
                                    placeholder="••••••••"
                                    autoComplete="current-password"
                                    style={{ width: "100%", padding: "8px 10px", fontSize: "14px", border: "0.5px solid #ccc", borderRadius: "8px", boxSizing: "border-box" }}
                                />
                            </div>

                            {/* Mot de passe oublié */}
                            {realm.resetPasswordAllowed && (
                                <div style={{ textAlign: "right", marginBottom: "14px" }}>
                                    <a href={url.loginResetCredentialsUrl} style={{ fontSize: "13px", color: "#1a7fcc", textDecoration: "none" }}>
                                        Mot de passe oublié ?
                                    </a>
                                </div>
                            )}

                            {/* Bouton */}
                            <button
                                type="submit"
                                style={{ width: "100%", padding: "10px", fontSize: "14px", fontWeight: 600, background: "#222", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
                            >
                                Se connecter
                            </button>
                        </form>

                        {/* Lien inscription */}
                        {realm.registrationAllowed && (
                            <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#888" }}>
                                Pas encore de compte ?{" "}
                                <a href={url.registrationUrl} style={{ color: "#1a7fcc", textDecoration: "none" }}>
                                    Créer un compte
                                </a>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </Template>
    );
}