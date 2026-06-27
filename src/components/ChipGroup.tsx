import { CheckCircle } from "@mui/icons-material";
import { Box, Chip, FormHelperText, Stack } from "@mui/material";

interface ChipGroupOption {
  id: number;
  label: string;
}

export default function ChipGroup ({ options, selected, onChange, error } : {options: ChipGroupOption[], selected: number[], onChange: (next: number[]) => void, error : string | undefined}) {
  const toggle = (id: number) => {
    onChange(
      selected.includes(id) ? selected.filter((x) => x !== id) : [...selected, id]
    );
  };
  return (
    <Box>
      <Stack direction="row" flexWrap="wrap" gap={1}>
        {options.map((opt) => {
          const active = selected.includes(opt.id);
          return (
            <Chip
              key={opt.id}
              label={opt.label}
              onClick={() => toggle(opt.id)}
              variant={active ? "filled" : "outlined"}
              color={active ? "primary" : "default"}
              icon={active ? <CheckCircle /> : undefined}
              sx={{ fontWeight: active ? 600 : 400, cursor: "pointer" }}
            />
          );
        })}
      </Stack>
      {error && (
        <FormHelperText error sx={{ mt: 0.75, ml: 0.25 }}>{error}</FormHelperText>
      )}
    </Box>
  );
}