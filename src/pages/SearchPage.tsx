import { Box } from "@mui/material";

import ItemListFiltered from "components/items/ItemListFiltered";

export default function SearchPage() {
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ItemListFiltered />
    </Box>
  );
}
