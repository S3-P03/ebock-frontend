import type { PageProps } from "keycloakify/login/pages/PageProps";
import type { KcContext } from "../KcContext";
import type { I18n } from "../i18n";
import "../login.css";

export default function Register(props: PageProps<Extract<KcContext, { pageId: "register.ftl" }>, I18n>) {
    const { kcContext, i18n, doUseDefaultCss, Template, classes } = props;
    const { url, messagesPerField } = kcContext;

    return (
        <Template kcContext={kcContext} i18n={i18n} doUseDefaultCss={false} classes={classes} headerNode={<></>}>
            <div style={{ minHeight: "100vh", background: "#fff", display: "flex", flexDirection: "column", fontFamily: "Arial, sans-serif" }}>

                {/* Body */}
                <div style={{ flex: 1, display: "flex", alignItems: "center", justifyContent: "center", padding: "40px 32px", gap: "60px" }}>

                    {/* Panneau gauche */}
                    <div style={{ flex: 1, maxWidth: "340px" }}>
                        <p style={{ fontSize: "26px", fontWeight: 700, color: "#222", margin: "0 0 10px", lineHeight: 1.3 }}>Rejoignez le marketplace des étudiants</p>
                        <p style={{ fontSize: "14px", color: "#666", lineHeight: 1.7, margin: "0 0 24px" }}>Créez votre compte gratuitement et commencez à acheter ou vendre en quelques secondes.</p>
                        {[
                            "Accès gratuit pour tous les étudiants de l'UdeS",
                            "Vendez vos articles inutilisés facilement",
                            "Trouvez du bon matériel près de chez vous"
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
                    <div style={{ width: "320px", flexShrink: 0 }}>
                        {/* Logo */}
                        <div style={{ display: "flex", alignItems: "center", justifyContent: "center", gap: "8px", marginBottom: "16px" }}>
                            <div style={{ width: "32px", height: "32px", background: "#1D9E75", borderRadius: "8px", display: "flex", alignItems: "center", justifyContent: "center", fontSize: "18px" }}>🍺</div>
                            <span style={{ fontSize: "17px", fontWeight: 600, color: "#222" }}>EBock</span>
                        </div>

                        <div style={{ background: "#fff", border: "0.5px solid #ddd", borderRadius: "12px", padding: "24px" }}>
                            <p style={{ fontSize: "17px", fontWeight: 700, color: "#222", margin: "0 0 4px" }}>Créer un compte</p>
                            <p style={{ fontSize: "13px", color: "#888", margin: "0 0 20px" }}>Remplissez les informations ci-dessous</p>

                            <form action={url.registrationAction} method="post">
                                {/* Prénom + Nom */}
                                <div style={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: "12px", marginBottom: "14px" }}>
                                    <div>
                                        <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>Prénom</label>
                                        <input
                                            name="firstName"
                                            type="text"
                                            placeholder="Jean-Félix"
                                            style={{ width: "100%", padding: "8px 10px", fontSize: "13px", border: "0.5px solid #ccc", borderRadius: "8px", boxSizing: "border-box" }}
                                        />
                                    </div>
                                    <div>
                                        <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>Nom</label>
                                        <input
                                            name="lastName"
                                            type="text"
                                            placeholder="Larouche"
                                            style={{ width: "100%", padding: "8px 10px", fontSize: "13px", border: "0.5px solid #ccc", borderRadius: "8px", boxSizing: "border-box" }}
                                        />
                                    </div>
                                </div>

                                {/* CIP */}
                                <div style={{ marginBottom: "14px" }}>
                                    <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>Identifiant (CIP)</label>
                                    <input
                                        name="username"
                                        type="text"
                                        placeholder="ex. larj4236"
                                        style={{ width: "100%", padding: "8px 10px", fontSize: "13px", border: "0.5px solid #ccc", borderRadius: "8px", boxSizing: "border-box" }}
                                    />
                                </div>

                                {/* Courriel */}
                                <div style={{ marginBottom: "14px" }}>
                                    <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>Courriel UdeS</label>
                                    <input
                                        name="email"
                                        type="email"
                                        placeholder="larj4236@usherbrooke.ca"
                                        style={{ width: "100%", padding: "8px 10px", fontSize: "13px", border: "0.5px solid #ccc", borderRadius: "8px", boxSizing: "border-box" }}
                                    />
                                </div>

                                {/* Mot de passe */}
                                <div style={{ marginBottom: "14px" }}>
                                    <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>Mot de passe</label>
                                    <input
                                        name="password"
                                        type="password"
                                        placeholder="••••••••"
                                        style={{ width: "100%", padding: "8px 10px", fontSize: "13px", border: "0.5px solid #ccc", borderRadius: "8px", boxSizing: "border-box" }}
                                    />
                                </div>

                                {/* Confirmer mot de passe */}
                                <div style={{ marginBottom: "14px" }}>
                                    <label style={{ fontSize: "13px", color: "#666", display: "block", marginBottom: "4px" }}>Confirmer le mot de passe</label>
                                    <input
                                        name="password-confirm"
                                        type="password"
                                        placeholder="••••••••"
                                        style={{ width: "100%", padding: "8px 10px", fontSize: "13px", border: "0.5px solid #ccc", borderRadius: "8px", boxSizing: "border-box" }}
                                    />
                                </div>

                                <button
                                    type="submit"
                                    style={{ width: "100%", padding: "10px", fontSize: "14px", fontWeight: 600, background: "#222", color: "#fff", border: "none", borderRadius: "8px", cursor: "pointer" }}
                                >
                                    Créer mon compte
                                </button>
                            </form>

                            <div style={{ textAlign: "center", marginTop: "14px", fontSize: "13px", color: "#888" }}>
                                Déjà un compte ?{" "}
                                <a href={url.loginUrl} style={{ color: "#1a7fcc", textDecoration: "none" }}>Se connecter</a>
                            </div>
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