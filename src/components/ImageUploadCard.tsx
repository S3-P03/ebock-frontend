import { ArrowDownward, ArrowUpward, Delete, Image } from "@mui/icons-material";
import { Box, IconButton, Paper, Stack, Tooltip, Typography } from "@mui/material";
import { ImageEntry } from "interfaces/ItemForm";

export default function ImageUploadCard({ image, index, total, onRemove, onReorder }: {image: ImageEntry, index: number, total: number, onRemove: (index: string) => void, onReorder: (from: number, to: number) => void}) {
  return (
    <Paper
      variant="outlined"
      sx={{
        display: "flex",
        alignItems: "center",
        gap: 1.5,
        p: 1.5,
        borderRadius: 2,
        bgcolor: "grey.50",
        "&:hover": { borderColor: "primary.main", bgcolor: "primary.50" },
        transition: "all 0.15s",
      }}
    > 
      <Box
        sx={{
          width: 56,
          height: 56,
          borderRadius: 1.5,
          overflow: "hidden",
          flexShrink: 0,
          bgcolor: "grey.200",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        {image.previewUrl ? (
          <img
            src={image.previewUrl}
            alt={`Image ${index + 1}`}
            style={{ width: "100%", height: "100%", objectFit: "cover" }}
          />
        ) : (
          <Image sx={{ color: "grey.400" }} />
        )}
      </Box>
 
      <Box sx={{ flex: 1, minWidth: 0 }}>
        <Typography variant="body2" fontWeight={600} noWrap>
          {image.file?.name ?? "image"}
        </Typography>
        <Typography variant="caption" color="text.secondary">
          Ordre: {image.displayOrder}
          {image.file && ` · ${(image.file.size / 1024).toFixed(0)} KB`}
        </Typography>
        {image.guid && (
          <Typography
            variant="caption"
            display="block"
            color="text.disabled"
            sx={{ fontFamily: "monospace", fontSize: "0.65rem" }}
            noWrap
          >
            {image.guid}
          </Typography>
        )}
      </Box>
 
      <Stack direction="row" gap={0.5} flexShrink={0}>
        <Tooltip title="Mettre avant">
          <span>
            <IconButton
              size="small"
              disabled={index === 0}
              onClick={() => onReorder(index, index - 1)}
            >
              <ArrowUpward/>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Mettre après">
          <span>
            <IconButton
              size="small"
              disabled={index === total - 1}
              onClick={() => onReorder(index, index + 1)}
            >
              <ArrowDownward/>
            </IconButton>
          </span>
        </Tooltip>
        <Tooltip title="Retirer">
          <IconButton size="small" color="error" onClick={() => onRemove(image.localId)}>
            <Delete/>
          </IconButton>
        </Tooltip>
      </Stack>
    </Paper>
  );
}