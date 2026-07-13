import { Box } from "@mui/material";

import ItemListFiltered from "components/items/ItemListFiltered";
import useAuthSession from "hooks/useAuthSession";

export default function SearchPage() {
  const { isAuthenticated } = useAuthSession();
  
  return (
    <Box
      sx={{
        display: "flex",
        flexDirection: "column",
      }}
    >
      <ItemListFiltered isAuthenticated={isAuthenticated} />
    </Box>
  );
}
