import { useState, useCallback } from "react";
import { Box, Card, Grid, CircularProgress, Alert } from "@mui/material";
import { SellerItem } from "interfaces/Item";
import { FilterParams, getFilteredItems } from "services/itemService";
import { useInfiniteScrollItems } from "hooks/useInfiniteScroll";
import ItemCard from "./ItemCard";
import ItemFilterBar from "./ItemFilterBar";

export default function ItemListFiltered() {
  const [filters, setFilters] = useState<FilterParams>({});

  const { items, loading, error, hasMore, sentinelRef } = useInfiniteScrollItems<SellerItem>(
    getFilteredItems,
    filters
  );

  const handleFiltersChange = useCallback((newFilters: FilterParams) => {
    setFilters(newFilters);
  }, []);

  return (
    <Box sx={{ p: 2, display: "flex", gap: 2, flexDirection: { xs: "column", md: "row" } }}>
      {/* Left Sidebar - Filters */}
      <Box
        sx={{
          width: { xs: "100%", md: "280px" },
          flexShrink: 0,
        }}
      >
        <Card sx={{ p: 2, position: { md: "sticky" }, top: { md: 16 } }}>
          <ItemFilterBar onFiltersChange={handleFiltersChange} />
        </Card>
      </Box>

      {/* Right Content - Items */}
      <Box sx={{ flex: 1, minWidth: 0 }}>
        {error && (
          <Alert severity="error" sx={{ mb: 2 }}>
            Erreur lors du chargement des items: {error.message}
          </Alert>
        )}

        {items.length > 0 ? (
          <>
            <Grid container spacing={2}>
              {items.map((item) => (
                <Grid item xs={12} sm={6} md={4} lg={3} key={item.itemId}>
                  <ItemCard itemList={item} />
                </Grid>
              ))}
            </Grid>

            {hasMore && (
              <Box ref={sentinelRef} sx={{ py: 4, display: "flex", justifyContent: "center" }}>
                {loading && <CircularProgress />}
              </Box>
            )}

            {!hasMore && items.length > 0 && (
              <Box sx={{ py: 2, textAlign: "center", color: "text.secondary" }}>
                Aucun autres items à charger
              </Box>
            )}
          </>
        ) : (
          <Card sx={{ p: 4, textAlign: "center" }}>
            {loading ? <CircularProgress /> : <p>Aucun items trouvés. Essayez d'ajuster vos filtres.</p>}
          </Card>
        )}
      </Box>
    </Box>
  );
}
