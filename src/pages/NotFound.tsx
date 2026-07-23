import { Box } from "@mui/material";

export default function NotFound() {
    return(
        <Box>
            <Box sx={{ display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center', height: '100vh' }}>
                <Box sx={{ fontSize: 24, fontWeight: 'bold', mb: 2 }}>404 - Page impossible à trouver</Box>
                <Box sx={{ fontSize: 16, color: 'text.secondary' }}>La page que vous recherchez n'existe pas.</Box>
                <Box sx={{ mt: 2 }}>
                    <a href="/" style={{ textDecoration: 'none', color: '#1976d2' }}>Aller à la page d'accueil</a>
                </Box>
            </Box>
        </Box>
    );
}