import { useEffect, useRef, useState, ChangeEvent } from "react";
import {
  Button,
  Card,
  Typography,
  Box,
} from "@mui/material";

interface ProfilePicChangerProps {
  currentProfilePictureUrl: string | null;
  initials: string;
  onSave: (file: File | null, remove?: boolean) => void;
}

export default function ProfilePicChanger({ currentProfilePictureUrl, initials, onSave }: ProfilePicChangerProps) {
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [removeRequested, setRemoveRequested] = useState(false);
  const fileInputRef = useRef<HTMLInputElement | null>(null);

  useEffect(() => {
    if (!selectedFile) {
      setPreviewUrl(null);
      return;
    }

    const objectUrl = URL.createObjectURL(selectedFile);
    setPreviewUrl(objectUrl);

    return () => {
      URL.revokeObjectURL(objectUrl);
    };
  }, [selectedFile]);

  const handleChooseImage = () => {
    setRemoveRequested(false);
    fileInputRef.current?.click();
  };

  const handleFileChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0] ?? null;
    setSelectedFile(file);
    setRemoveRequested(false);
  };

  const handleRemove = () => {
    setSelectedFile(null);
    setRemoveRequested(true);
  };

  const handleSave = () => {
    onSave(selectedFile, removeRequested);
  };

  const imageSrc = removeRequested ? null : previewUrl || currentProfilePictureUrl;
  const hasImage = Boolean(imageSrc);

  return (
    <Card sx={{ p: 2.5, borderRadius: 2, width: "100%" }}>
      <Typography sx={{ fontWeight: 700, fontSize: 16, mb: 2 }}>
        Changer la photo de profil
      </Typography>
      <input
        ref={fileInputRef}
        type="file"
        accept="image/png,image/jpeg"
        onChange={handleFileChange}
        style={{ display: "none" }}
      />
      <Box
        sx={{
          width: 200,
          height: 200,
          borderRadius: "50%",
          overflow: "hidden",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          mb: 2,
          bgcolor: hasImage ? "transparent" : "primary.main",
          color: hasImage ? "inherit" : "common.white",
        }}
      >
        {hasImage ? (
          <Box
            component="img"
            src={imageSrc as string}
            alt="Photo de profil"
            sx={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Typography sx={{ fontSize: 48, fontWeight: 700 }}>
            {initials}
          </Typography>
        )}
      </Box>
      <Box sx={{ display: "flex", gap: 1 }}>
        <Button
          variant="contained"
          size="small"
          sx={{ borderRadius: 2, textTransform: "none" }}
          onClick={handleChooseImage}
        >
          Choisir une image
        </Button>
        {currentProfilePictureUrl ? (
          <Button
            variant="outlined"
            size="small"
            sx={{
              borderRadius: 2,
              textTransform: "none",
              borderColor: "error.main",
              color: "error.main",
            }}
            onClick={handleRemove}
          >
            Supprimer la photo de profil
          </Button>
        ) : null}
        <Button
          variant="contained"
          size="small"
          sx={{ borderRadius: 2, textTransform: "none" }}
          onClick={handleSave}
          disabled={!selectedFile && !removeRequested}
        >
          Enregistrer
        </Button>
      </Box>
    </Card>
  );
}