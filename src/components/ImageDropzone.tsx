import { CloudUpload } from "@mui/icons-material";
import { Box, FormHelperText, Paper, Typography } from "@mui/material";
import { DragEvent, useCallback, useRef, useState } from "react";

export default function ImageDropzone({ onFiles, error, disabled } : {onFiles: (files: File[]) => void, error: string | undefined, disabled: boolean | undefined}) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [dragging, setDragging] = useState<boolean>(false);
 
  const handleFiles = (fileList: FileList | null): void => {
    if (!fileList) return;
    const accepted = Array.from(fileList).filter((f) =>
      f.type.startsWith("image/")
    );
    if (accepted.length) onFiles(accepted);
  };

  const onDrop = useCallback((e: DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setDragging(false);
    handleFiles(e.dataTransfer.files);
  }, []);
 
  return (
    <Box>
      <Paper
        variant="outlined"
        onClick={() => !disabled && inputRef.current?.click()}
        onDragOver={(e: DragEvent<HTMLDivElement>) => {
          e.preventDefault();
          if (!disabled) setDragging(true);
        }}
        onDragLeave={() => setDragging(false)}
        onDrop={onDrop}
        sx={{
          borderStyle: "dashed",
          borderColor: error ? "error.main" : dragging ? "primary.main" : "grey.300",
          bgcolor: dragging ? "primary.50" : error ? "error.50" : "grey.50",
          borderRadius: 2,
          p: 4,
          display: "flex",
          flexDirection: "column",
          alignItems: "center",
          gap: 1,
          cursor: disabled ? "not-allowed" : "pointer",
          transition: "all 0.15s",
          opacity: disabled ? 0.6 : 1,
          "&:hover": disabled
            ? {}
            : { borderColor: "primary.main", bgcolor: "primary.50" },
        }}
      >
        <CloudUpload
          sx={{ fontSize: 40, color: dragging ? "primary.main" : "grey.400" }}
        />
        <Typography variant="body2" fontWeight={600} color={dragging ? "primary.main" : "text.secondary"}>
          Glisser les images ici ou cliquer pour explorer les fichiers
        </Typography>
        <Typography variant="caption" color="text.disabled">
          Formats supportés · PNG, JPG 
        </Typography>
        <input
          ref={inputRef}
          type="file"
          accept="image/*"
          multiple
          style={{ display: "none" }}
          onChange={(e) => handleFiles(e.target.files)}
        />
      </Paper>
      {error && (
        <FormHelperText error sx={{ mt: 0.75, ml: 0.25 }}>{error}</FormHelperText>
      )}
    </Box>
  );
}