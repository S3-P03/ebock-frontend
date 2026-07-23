import { Box, Button, Card, CardContent, CardHeader, Divider, FormControl, FormHelperText, Grid, InputAdornment, InputLabel, MenuItem, Select, SelectChangeEvent, Stack, TextField, Typography } from "@mui/material";
import useAuthSession from "hooks/useAuthSession";
import { Category } from "interfaces/Category";
import { DeliveryOption } from "interfaces/DeliveryOption";
import { ItemFormErrors, ItemFormState, ImageEntry } from "interfaces/ItemForm";
import { ItemPayload } from "interfaces/Item";
import { PaymentOption } from "interfaces/PaymentOption";
import { Tag } from "interfaces/Tag";
import { Wear } from "interfaces/Wear";
import { ChangeEvent, FC, useRef, useState } from "react";
import { useNavigate } from "react-router-dom";
import { addItem } from "services/itemService";
import ChipGroup from "./ChipGroup";
import ImageDropzone from "./ImageDropzone";
import ImageUploadCard from "./ImageUploadCard";
import CenteredCircularProgress from "./CenteredCircularProgress";
import { Add } from "@mui/icons-material";
import { uploadImageFile } from "services/imageService";

const SectionLabel: FC<{ children: React.ReactNode }> = ({ children }) => (
    <Typography
      variant="overline"
      color="text.secondary"
      sx={{ letterSpacing: "0.1em", fontWeight: 700, display: "block", mb: 1.5 }}
    >
      {children}
    </Typography>
  );

export default function AddItemForm({
  paymentOptions,
  deliveryOptions,
  tags,
  categories,
  wears,
}: {
  paymentOptions: PaymentOption[];
  deliveryOptions: DeliveryOption[];
  tags: Tag[];
  categories: Category[];
  wears: Wear[];
}) {
  
  const INITIAL_STATE: ItemFormState = {
  name: "",
  description: "",
  price: "0",
  quantity: 1,
  categoryId: "",
  wearId: "",
  paymentOptionList: [],
  deliveryOptionList: [],
  tagList: [],
  imageList: [],
  };
  
  const [form, setForm] = useState<ItemFormState>(INITIAL_STATE);
  const [errors, setErrors] = useState<ItemFormErrors>({});
  const { token } = useAuthSession();
  const navigate = useNavigate();
  const localIdCounter = useRef(0);

  const set = <K extends keyof ItemFormState>(key: K, value: ItemFormState[K]): void => {
    setForm((f) => ({ ...f, [key]: value }));
    setErrors((e) => ({ ...e, [key]: undefined }));
  };

  const patchImage = (localId: string, patch: Partial<ImageEntry>): void => {
    setForm((f) => ({
      ...f,
      imageList: f.imageList.map((img) =>
        img.localId === localId ? { ...img, ...patch } : img
      ),
    }));
  };
 
  // Afficher un preview des images sans faire le call d'API direct
  const addImages = async (files: File[]): Promise<void> => {
    const placeholders: ImageEntry[] = files.map((file, i) => ({
      localId: `local-${++localIdCounter.current}`,
      file,
      guid: "",
      previewUrl: URL.createObjectURL(file),
      displayOrder: form.imageList.length + i + 1,
      status: "Uploaded",
    }));

    setForm((f) => ({
      ...f,
      imageList: [...f.imageList, ...placeholders],
    }));
    setErrors((e) => ({ ...e, imageList: undefined }));
  };

  const removeImage = (localId: string): void => {
    setForm((f) => {
      const next = f.imageList
        .filter((img) => img.localId !== localId)
        .map((img, i) => ({ ...img, displayOrder: i + 1 }));
      const removed = f.imageList.find((img) => img.localId === localId);
      if (removed) URL.revokeObjectURL(removed.previewUrl);
      return { ...f, imageList: next };
    });
  };
 
  const reorderImage = (from: number, to: number): void => {
    setForm((f) => {
      const next = [...f.imageList];
      const [moved] = next.splice(from, 1);
      next.splice(to, 0, moved);
      return {
        ...f,
        imageList: next.map((img, i) => ({ ...img, displayOrder: i + 1 })),
      };
    });
  };

  const isUploading = form.imageList.some((img) => img.status === "Uploading");

  const validate = (imageEntries: ImageEntry[] = form.imageList): ItemFormErrors => {
    const errs: ItemFormErrors = {};
    if (!form.name.trim()) errs.name = "Veuillez indiquer le nom du produit.";
    if (!form.description.trim()) errs.description = "Veuillez fournir une description.";
    const price = parseFloat(form.price);
    if (!form.price || isNaN(price) || price < 0)
      errs.price = "Veuillez entrer un prix valide.";
    if (!form.quantity || form.quantity < 1)
      errs.quantity = "Veuillez spécifier la quantité (minimum : 1).";
    if (form.categoryId === "") errs.categoryId = "Veuillez sélectionner une catégorie.";
    if (form.wearId === "") errs.wearId = "Veuillez sélectionner la condition de l'item.";
    if (price > 0 && form.paymentOptionList.length === 0)
      errs.paymentOptionList = "Veuillez sélectionner au moins une option de paiement.";
    if (form.deliveryOptionList.length === 0)
      errs.deliveryOptionList = "Veuillez sélectionner au moins une option de ramassage ou livraison.";
    if (imageEntries.length === 0)
      errs.imageList = "Veuillez ajouter au moins une image du produit.";
    else if (imageEntries.some((img) => img.status === "Uploading"))
      errs.imageList = "Veuillez attendre le chargement des images.";
    else if (imageEntries.some((img) => img.status === "Error"))
      errs.imageList = "Veuillez retirer les images en erreur.";
    return errs;
  };

  const handleSubmit = async () => {
    const uploadedImages: ImageEntry[] = await Promise.all(
      form.imageList.map(async (placeholder) => {
        try {
          const response = await uploadImageFile(placeholder.file, token);
          const nextImage: ImageEntry = {
            ...placeholder,
            guid: response!.guid,
            status: "Uploaded",
          };
          patchImage(placeholder.localId, nextImage);
          return nextImage;
        } catch (err) {
          const message =
            err instanceof Error ? err.message : "Unknown error";
          const nextImage: ImageEntry = {
            ...placeholder,
            status: "Error",
            uploadError: message,
          };
          patchImage(placeholder.localId, nextImage);
          return nextImage;
        }
      })
    );

    setForm((f) => ({
      ...f,
      imageList: uploadedImages,
    }));
    
    const errs = validate(uploadedImages);
    if (Object.keys(errs).length) {
      setErrors(errs);
      return;
    }
    const payload: ItemPayload = {
      name: form.name,
      description: form.description,
      price: parseFloat(parseFloat(form.price).toFixed(2)),
      quantity: form.quantity,
      categoryId: form.categoryId as number,
      wearId: form.wearId as number,
      paymentOptionList: form.paymentOptionList,
      deliveryOptionList: form.deliveryOptionList,
      tagList: form.tagList,
      imageList: uploadedImages.map(({ guid, displayOrder }) => ({
        guid,
        displayorder: displayOrder,
      })),
    };

    try {
      await addItem(payload, token).then((data) => {
        if(data) navigate(`/item/${data.itemId}`);
      });
    } catch (err) {
      console.log(err);
    }
  };
 
  const handleReset = (): void => {
    form.imageList.forEach((img) => URL.revokeObjectURL(img.previewUrl));
    setForm(INITIAL_STATE);
    setErrors({});
  };

  return(
    <Box
      sx={{
        minHeight: "100vh",
        bgcolor: "action.hover",
        p: { xs: 2, sm: 4 },
        display: "flex",
        justifyContent: "center",
      }}
    >
      <Card
        sx={{ maxWidth: 700, width: "100%", height: "fit-content", borderRadius: 3 }}
      >
        <CardHeader
          title={
            <Box>
              <Typography
                variant="overline"
                color="primary"
                fontWeight={700}
                letterSpacing="0.1em"
              >
                Produits en vente
              </Typography>
              <Typography
                variant="h5"
                fontWeight={700}
                color="text.primary"
                lineHeight={1.2}
              >
                Ajouter un produit
              </Typography>
            </Box>
          }
          sx={{ pb: 0 }}
        />
        <Divider sx={{ mt: 2 }} />
 
        <CardContent sx={{ p: 3 }}>
          <Stack spacing={3.5}>
 
            <Box>
              <SectionLabel>Informations </SectionLabel>
              <Stack spacing={2}>
                <TextField
                  label="Nom"
                  required
                  fullWidth
                  placeholder="Nom du produit"
                  value={form.name}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    set("name", e.target.value)
                  }
                  error={!!errors.name}
                  helperText={errors.name}
                />
                <TextField
                  label="Description"
                  required
                  fullWidth
                  multiline
                  rows={3}
                  placeholder="Rédigez une courte description de votre item..."
                  value={form.description}
                  onChange={(e: ChangeEvent<HTMLInputElement>) =>
                    set("description", e.target.value)
                  }
                  error={!!errors.description}
                  helperText={errors.description}
                />
              </Stack>
            </Box>
 
            <Box>
              <SectionLabel>Prix et quantité</SectionLabel>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Prix"
                    required
                    fullWidth
                    type="number"
                    inputProps={{ step: "0.01", min: "0" }}
                    placeholder="0.00"
                    value={form.price}
                    onChange={(e: ChangeEvent<HTMLInputElement>) => {
                      set("price", e.target.value);
                      if(parseFloat(e.target.value) <= 0) {
                        set("paymentOptionList", []);
                      };
                    }
                    }
                    error={!!errors.price}
                    helperText={errors.price}
                    InputProps={{
                      startAdornment: (
                        <InputAdornment position="start">$</InputAdornment>
                      ),
                    }}
                  />
                </Grid>
                <Grid item xs={12} sm={6}>
                  <TextField
                    label="Quantité"
                    required
                    fullWidth
                    type="number"
                    inputProps={{ min: 1 }}
                    value={form.quantity}
                    onChange={(e: ChangeEvent<HTMLInputElement>) =>
                      set("quantity", parseInt(e.target.value, 10) || 1)
                    }
                    error={!!errors.quantity}
                    helperText={errors.quantity}
                  />
                </Grid>
              </Grid>
            </Box>
 
            <Box>
              <SectionLabel>Spécifications</SectionLabel>
              <Grid container spacing={2}>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.categoryId}>
                    <InputLabel>Catégorie</InputLabel>
                    <Select<number | "">
                      value={form.categoryId}
                      label="Catégorie"
                      onChange={(e: SelectChangeEvent<number | "">) =>
                        set("categoryId", e.target.value as number | "")
                      }
                    >
                      {categories.map((c) => (
                        <MenuItem key={c.categoryId} value={c.categoryId}>
                          {c.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.categoryId && (
                      <FormHelperText>{errors.categoryId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
                <Grid item xs={12} sm={6}>
                  <FormControl fullWidth required error={!!errors.wearId}>
                    <InputLabel>Condition</InputLabel>
                    <Select<number | "">
                      value={form.wearId}
                      label="Condition"
                      onChange={(e: SelectChangeEvent<number | "">) =>
                        set("wearId", e.target.value as number | "")
                      }
                    >
                      {wears.map((w) => (
                        <MenuItem key={w.wearId} value={w.wearId}>
                          {w.name}
                        </MenuItem>
                      ))}
                    </Select>
                    {errors.wearId && (
                      <FormHelperText>{errors.wearId}</FormHelperText>
                    )}
                  </FormControl>
                </Grid>
              </Grid>
            </Box>
 
            {parseFloat(form.price) > 0 && <Box>
              <SectionLabel>Options de paiement *</SectionLabel>
              <ChipGroup
                options={paymentOptions.map((option) => {return({id: option.paymentOptnId, label: option.name})})}
                selected={form.paymentOptionList}
                onChange={(v) => set("paymentOptionList", v)}
                error={errors.paymentOptionList}
              />
            </Box>}
 
            <Box>
              <SectionLabel>Options de livraison/ramassage *</SectionLabel>
              <ChipGroup
                options={deliveryOptions.map((option) => {return({id: option.deliveryOptnId, label: option.name})})}
                selected={form.deliveryOptionList}
                onChange={(v) => set("deliveryOptionList", v)}
                error={errors.deliveryOptionList}
              />
            </Box>
 
            <Box>
              <SectionLabel>Tags</SectionLabel>
              <ChipGroup
                options={tags.map((option) => {return({id: option.tagId, label: option.name})})}
                selected={form.tagList}
                onChange={(v) => set("tagList", v)}
                error={errors.tagList}
              />
            </Box>
 
            {/* ── Images ── */}
            <Box>
              <SectionLabel>Images *</SectionLabel>
              <Stack spacing={1.5}>
                <ImageDropzone
                  onFiles={addImages}
                  error={errors.imageList}
                  disabled={isUploading}
                />
                {form.imageList.length > 0 && (
                  <Stack spacing={1}>
                    {form.imageList.map((img, i) => (
                      <ImageUploadCard
                        key={img.localId}
                        image={img}
                        index={i}
                        total={form.imageList.length}
                        onRemove={removeImage}
                        onReorder={reorderImage}
                      />
                    ))}
                  </Stack>
                )}
                {form.imageList.length > 0 && (
                  <Typography
                    variant="caption"
                    color="text.disabled"
                    sx={{ pl: 0.5 }}
                  >
                    {form.imageList.length} image
                    {form.imageList.length > 1 ? "s" : ""}
                    {isUploading ? " · Chargement..." : " · Utilisez les flèches pour réarranger les images"}
                  </Typography>
                )}
              </Stack>
            </Box>
 
          </Stack>
        </CardContent>
 
        <Divider />
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1.5, p: 2.5 }}>
          <Button variant="outlined" color="inherit" onClick={handleReset}>
            Réinitialiser
          </Button>
          <Button
            variant="contained"
            onClick={handleSubmit}
            disabled={isUploading}
            startIcon={
              isUploading ? <CenteredCircularProgress size={16} color="inherit" /> : <Add />
            }
          >
            {isUploading ? "Uploading…" : "Ajouter le produit"}
          </Button>
        </Box>
      </Card>
    </Box>
  );
}
