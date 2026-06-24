import { useState, useCallback, useEffect } from "react";
import { useSearchParams } from "react-router-dom";
import { Box, Card, Grid, CircularProgress, Alert } from "@mui/material";
import { SellerItem } from "interfaces/Item";
import { FilterParams, getFilteredItems } from "services/itemService";
import { useInfiniteScrollItems } from "hooks/useInfiniteScroll";
import ItemCard from "./ItemCard";
import ItemFilterBar from "./ItemFilterBar";

export default function ItemListFiltered() {
  const [searchParams, setSearchParams] = useSearchParams();
  const [filters, setFilters] = useState<FilterParams>({});

  // Parse URL query params to filters on mount and when URL changes
  useEffect(() => {
    const newFilters: FilterParams = {};
    
    const minP = searchParams.get("minP");
    const maxP = searchParams.get("maxP");
    const maxD = searchParams.get("maxD");
    const fav = searchParams.get("fav");
    const categories = searchParams.get("categories");
    const tags = searchParams.get("tags");
    const wears = searchParams.get("wears");
    const deliveries = searchParams.get("deliveries");
    const payments = searchParams.get("payments");

    if (minP) newFilters.minP = Number(minP);
    if (maxP) newFilters.maxP = Number(maxP);
    if (maxD) newFilters.maxD = Number(maxD);
    if (fav === "true") newFilters.fav = true;
    if (categories) newFilters.categories = categories.split(",").map(Number);
    if (tags) newFilters.tags = tags.split(",").map(Number);
    if (wears) newFilters.wears = wears.split(",").map(Number);
    if (deliveries) newFilters.deliveries = deliveries.split(",").map(Number);
    if (payments) newFilters.payments = payments.split(",").map(Number);

    setFilters(newFilters);
  }, [searchParams]);

  const { items, loading, error, hasMore, sentinelRef } = useInfiniteScrollItems<SellerItem>(
    getFilteredItems,
    filters
  );

  const handleFiltersChange = useCallback((newFilters: FilterParams) => {
    setFilters(newFilters);
    
    // Update URL query params
    const params = new URLSearchParams();
    if (newFilters.minP !== undefined) params.set("minP", String(newFilters.minP));
    if (newFilters.maxP !== undefined) params.set("maxP", String(newFilters.maxP));
    if (newFilters.maxD !== undefined) params.set("maxD", String(newFilters.maxD));
    if (newFilters.fav) params.set("fav", "true");
    if (newFilters.categories?.length) params.set("categories", newFilters.categories.join(","));
    if (newFilters.tags?.length) params.set("tags", newFilters.tags.join(","));
    if (newFilters.wears?.length) params.set("wears", newFilters.wears.join(","));
    if (newFilters.deliveries?.length) params.set("deliveries", newFilters.deliveries.join(","));
    if (newFilters.payments?.length) params.set("payments", newFilters.payments.join(","));

    setSearchParams(params);
  }, [setSearchParams]);

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
