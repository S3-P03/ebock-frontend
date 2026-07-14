import { CircularProgress, CircularProgressProps } from "@mui/material";

export default function CenteredCircularProgress(props: CircularProgressProps) {
    return (
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center', height: '100vh' }}>
            <CircularProgress {...props} />
        </div>
    );
}