import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import logoImage from "../../../assets/logo.png";
import "../login.css";

export default function Login(props: PageProps<Extract<KcContext, { pageId: "login.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { realm, url } = kcContext;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} classes={classes} headerNode={<></>}>
            <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif" }}>

                {/* Body */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", gap: "60px" }}>

                    {/* Panneau gauche */}
                    <div style={{ flex: 1, maxWidth: "340px" }}>
                        <p style={{ fontSize: "26px", fontWeight: 700, color: "#222", margin: "0 0 10px", lineHeight: 1.3 }}>Le marketplace des étudiants de l'UdeS</p>
                        <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, margin: "0 0 24px" }}>Achetez et vendez des articles entre étudiants. Simple, rapide et écologique.</p>
                        {[
                            "Donnez une deuxième vie à vos objets",
                            "Discutez directement avec le vendeur",
                            "Naviguez par catégorie facilement"
                        ].map((text, i) => (
                            <div key={i} style={{ display: "flex", alignItems: "center", gap: "10px", marginBottom: "12px", fontSize: "13px", color: "#666" }}>
                                <div style={{ width: "8px", height: "8px", borderRadius: "50%", background: "#1D9E75", flexShrink: 0 }}></div>
                                {text}
                            </div>
                        ))}
                    </div>

                    {/* Divider */}
                    <div style={{ width: "0.5px", background: "#e0ddd6", alignSelf: "stretch" }}></div>

                    {/* Formulaire */}
                    <div style={{ width: "300px", flexShrink: 0 }}>
                        {/* Logo au-dessus de la card */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
                            <img src={logoImage} alt="Logo EBock" style={{ width: "52px", height: "52px", objectFit: "contain", display: "block" }} />
                            <span style={{ fontSize: "17px", fontWeight: 600, color: "#222" }}>EBock</span>
                        </div>

                        <div style={{ background: "#fff", border: "0.5px solid #ddd", borderRadius: "12px", padding: "28px" }}>
                            <p style={{ fontSize: "17px", fontWeight: 700, color: "#222", margin: "0 0 4px" }}>Connexion</p>
                            <p style={{ fontSize: "13px", color: "#888", margin: "0 0 20px" }}>Accédez à votre compte EBock</p>

                            <form action={url.loginAction} method="post">
                                <div style={{ marginBottom: "14px" }}>
                                    <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>Identifiant (CIP)</label>
                                    <input
                                        name="username"
                                        type="text"
                                        placeholder="ex. abcd1234"
                                        autoComplete="username"
                                        style={{ width: "100%", padding: "8px 10px", fontSize: "14px", border: "0.5px solid #ccc", borderRadius: "8px", boxSizing: "border-box" }}
                                    />
                                </div>

                                <div style={{ marginBottom: "14px" }}>
                                    <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>Mot de passe</label>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                        style={{ width: "100%", padding: "8px 10px", fontSize: "14px", border: "0.5px solid #ccc", borderRadius: "8px", boxSizing: "border-box" }}
                                    />
                                </div>

                                {realm.resetPasswordAllowed && (
                                    <div style={{ textAlign: "right", marginBottom: "14px" }}>
                                        <a href={url.loginResetCredentialsUrl} style={{ fontSize: "13px", color: "#1a7fcc", textDecoration: "none" }}>Mot de passe oublié ?</a>
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    style={{ width: "100%", padding: "10px", fontSize: "14px", fontWeight: 600, background: "#222", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
                                >
                                    Se connecter
                                </button>
                            </form>

                            {realm.registrationAllowed && (
                                <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#888" }}>
                                    Pas encore de compte ?{" "}
                                    <a href={url.registrationUrl} style={{ color: "#1a7fcc", textDecoration: "none" }}>Créer un compte</a>
                                </div>
                            )}
                        </div>
                    </div>
                </div>

                {/* Footer */}
                <div style={{ borderTop: "0.5px solid #e0ddd6", padding: "12px 32px", fontSize: "12px", color: "#aaa", textAlign: "center" }}>
                    © 2026 EBock — Université de Sherbrooke
                </div>
            </div>
        </Template>
    );
}