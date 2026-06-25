import { useEffect, useState } from "react";
import {
  Box,
  TextField,
  Button,
  FormControlLabel,
  Checkbox,
  Stack,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  CircularProgress,
  Typography,
} from "@mui/material";
import { FilterParams } from "services/itemService";
import { Category } from "interfaces/Category";
import { Tag } from "interfaces/Tag";
import { Wear } from "interfaces/Wear";
import { DeliveryOption } from "interfaces/DeliveryOption";
import { PaymentOption } from "interfaces/PaymentOption";
import { getCategoryList } from "services/categoryService";
import { getTagList } from "services/tagService";
import { getWearList } from "services/wearService";
import { getDeliveryList } from "services/deliveryOptionService";
import { getPaymentList } from "services/paymentOptionService";

interface ItemFilterBarProps {
  onFiltersChange: (filters: FilterParams) => void;
}

export default function ItemFilterBar({ onFiltersChange }: ItemFilterBarProps) {
  const [minPrice, setMinPrice] = useState<number | "">("");
  const [maxPrice, setMaxPrice] = useState<number | "">("");
  const [maxDistance, setMaxDistance] = useState<number | "">("");
  const [favorites, setFavorites] = useState(false);
  const [selectedCategories, setSelectedCategories] = useState<number[]>([]);
  const [selectedTags, setSelectedTags] = useState<number[]>([]);
  const [selectedWears, setSelectedWears] = useState<number[]>([]);
  const [selectedDeliveries, setSelectedDeliveries] = useState<number[]>([]);
  const [selectedPayments, setSelectedPayments] = useState<number[]>([]);

  const [categoriesList, setCategoriesList] = useState<Category[]>([]);
  const [tagsList, setTagsList] = useState<Tag[]>([]);
  const [wearsList, setWearsList] = useState<Wear[]>([]);
  const [deliveriesList, setDeliveriesList] = useState<DeliveryOption[]>([]);
  const [paymentsList, setPaymentsList] = useState<PaymentOption[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchFilterOptions = async () => {
      setLoading(true);
      try {
        const [cats, tags, wears, deliveries, payments] = await Promise.all([
          getCategoryList(),
          getTagList(),
          getWearList(),
          getDeliveryList(),
          getPaymentList(),
        ]);
        setCategoriesList(cats);
        setTagsList(tags);
        setWearsList(wears);
        setDeliveriesList(deliveries);
        setPaymentsList(payments);
      } catch (error) {
      } finally {
        setLoading(false);
      }
    };

    fetchFilterOptions();
  }, []);

  const handleApplyFilters = () => {
    const filters: FilterParams = {};

    if (minPrice !== "") filters.minP = Number(minPrice);
    if (maxPrice !== "") filters.maxP = Number(maxPrice);
    if (maxDistance !== "") filters.maxD = Number(maxDistance);
    if (favorites) filters.fav = true;
    if (selectedCategories.length > 0) filters.categories = selectedCategories;
    if (selectedTags.length > 0) filters.tags = selectedTags;
    if (selectedWears.length > 0) filters.wears = selectedWears;
    if (selectedDeliveries.length > 0) filters.deliveries = selectedDeliveries;
    if (selectedPayments.length > 0) filters.payments = selectedPayments;

    onFiltersChange(filters);
  };

  const handleReset = () => {
    setMinPrice("");
    setMaxPrice("");
    setMaxDistance("");
    setFavorites(false);
    setSelectedCategories([]);
    setSelectedTags([]);
    setSelectedWears([]);
    setSelectedDeliveries([]);
    setSelectedPayments([]);
    onFiltersChange({});
  };

  if (loading) {
    return (
      <Box sx={{ display: "flex", justifyContent: "center", p: 2 }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <Box>
      <Typography variant="h6" sx={{ mb: 2, fontWeight: 600 }}>
        Filtres
      </Typography>

      <Stack spacing={2}>
        <TextField
          label="Prix minimum ($)"
          type="number"
          value={minPrice}
          onChange={(e) => setMinPrice(e.target.value ? Number(e.target.value) : "")}
          onKeyDown={(e) => {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          size="small"
          fullWidth
        />
        <TextField
          label="Prix maximum ($)"
          type="number"
          value={maxPrice}
          onChange={(e) => setMaxPrice(e.target.value ? Number(e.target.value) : "")}
          onKeyDown={(e) => {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
              e.preventDefault();
            }
          }}
          size="small"
          fullWidth
        />
        <TextField
          label="Distance maximale (km)"
          type="number"
          value={maxDistance}
          onChange={(e) => setMaxDistance(e.target.value ? Number(e.target.value) : "")}
          onKeyDown={(e) => {
            if (!/[0-9]/.test(e.key) && !['Backspace', 'Delete', 'ArrowLeft', 'ArrowRight', 'Tab'].includes(e.key)) {
              e.preventDefault();
            }
            if (e.key === '0' && maxDistance === '') {
              e.preventDefault();
            }
            if (e.key === 'Enter') {
              handleApplyFilters();
            }
          }}
          size="small"
          fullWidth
        />
        <FormControlLabel
          control={<Checkbox checked={favorites} onChange={(e) => setFavorites(e.target.checked)} />}
          label="Favoris seulement"
        />

        <FormControl fullWidth size="small">
          <InputLabel id="categories-label">Catégories</InputLabel>
          <Select
            labelId="categories-label"
            id="categories-select"
            multiple
            value={selectedCategories}
            onChange={(e) => setSelectedCategories(typeof e.target.value === 'string' ? [] : e.target.value)}
            label="Catégories"
          >
            {categoriesList.map((cat) => (
              <MenuItem key={cat.categoryId} value={cat.categoryId}>
                {cat.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel id="tags-label">Tags</InputLabel>
          <Select
            labelId="tags-label"
            id="tags-select"
            multiple
            value={selectedTags}
            onChange={(e) => setSelectedTags(typeof e.target.value === 'string' ? [] : e.target.value)}
            label="Tags"
          >
            {tagsList.map((tag) => (
              <MenuItem key={tag.tagId} value={tag.tagId}>
                {tag.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel id="wears-label">États</InputLabel>
          <Select
            labelId="wears-label"
            id="wears-select"
            multiple
            value={selectedWears}
            onChange={(e) => setSelectedWears(typeof e.target.value === 'string' ? [] : e.target.value)}
            label="États"
          >
            {wearsList.map((wear) => (
              <MenuItem key={wear.wearId} value={wear.wearId}>
                {wear.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel id="deliveries-label">Options de livraison</InputLabel>
          <Select
            labelId="deliveries-label"
            id="deliveries-select"
            multiple
            value={selectedDeliveries}
            onChange={(e) => setSelectedDeliveries(typeof e.target.value === 'string' ? [] : e.target.value)}
            label="Options de livraison"
          >
            {deliveriesList.map((delivery) => (
              <MenuItem key={delivery.deliveryOptnId} value={delivery.deliveryOptnId}>
                {delivery.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <FormControl fullWidth size="small">
          <InputLabel id="payments-label">Modes de paiement</InputLabel>
          <Select
            labelId="payments-label"
            id="payments-select"
            multiple
            value={selectedPayments}
            onChange={(e) => setSelectedPayments(typeof e.target.value === 'string' ? [] : e.target.value)}
            label="Modes de paiement"
          >
            {paymentsList.map((payment) => (
              <MenuItem key={payment.paymentOptnId} value={payment.paymentOptnId}>
                {payment.name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        <Box sx={{ display: "flex", gap: 1, flexDirection: "column" }}>
          <Button variant="contained" onClick={handleApplyFilters} fullWidth>
            Appliquer les filtres
          </Button>
          <Button variant="outlined" onClick={handleReset} fullWidth>
            Réinitialiser
          </Button>
        </Box>
      </Stack>
    </Box>
  );
}
