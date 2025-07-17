import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  TextField,
  Checkbox,
  FormControlLabel,
  Select,
  MenuItem,
  InputLabel,
  FormControl,
  Autocomplete,
  Box,
} from "@mui/material";
import { CustomSearch, filterforgeneric } from "../apis/api";

const initialFormState = {
  slug: "",
  search_term: "",
  meta_info: {
    title: "",
    description: "",
    keywords: "",
  },
  filters: {
    is_premium: false,
    city: "",
    type: "RESIDENTIAL",
    developer: "",
    location: "",
  },
};

const AddGenericLinkForm = ({ open, onClose, onSave }) => {
  const [filterData, setFilterData] = useState(null);
  const [genericForm, setGenericForm] = useState(initialFormState);
  const filterOptions = filterData || {};
  const cityOptions = filterOptions.locations ? Object.keys(filterOptions.locations) : [];
  const typeOptions = filterOptions.types || [];
  const developerOptions = filterOptions.developers || [];
  const locationOptions = filterOptions.locations && genericForm.filters.city
    ? filterOptions.locations[genericForm.filters.city] || []
    : [];


  const handleCancel = () => {
    setGenericForm(initialFormState);
    onClose();
  };

  useEffect(() => {
    const fetchFilterData = async () => {
      try {
        const response = await filterforgeneric();
        setFilterData(response.data);
      } catch (error) {
        console.error("Error fetching filter data:", error);
      }
    };

    fetchFilterData();
  }, []);

  const handleGenericFormChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (["is_premium", "city", "type", "location"].includes(name)) {
      setGenericForm((prev) => ({
        ...prev,
        filters: {
          ...prev.filters,
          [name]: type === "checkbox" ? checked : value,
        },
      }));
    } else {
      setGenericForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSaveGenericLink = async () => {
    const payload = {
      title: genericForm.title,
      description: genericForm.description,
      meta_info: {
        title: genericForm.title,
        description: genericForm.description,
        keywords:genericForm.keywords,
      },
      slug: genericForm.slug,
      search_term: genericForm.search_term,
      filters: genericForm.filters,
    };

    try {
      const response = await CustomSearch({ payload });
      console.log("Saved successfully:", response);
      
      // Call the onSave callback to refresh footer links
      if (onSave) {
        onSave();
      }
    } catch (error) {
      console.error("Error saving generic link:", error);
    }
    onClose();
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>Add Generic Link</DialogTitle>
      <DialogContent dividers>
        {!filterData ? (
          <div>Loading filter options...</div>
        ) : (
          <Box display="flex" flexDirection="column" gap={2}>
            <Box display="flex" gap={2}>
              <TextField
                label="Title"
                name="title"
                value={genericForm.title}
                onChange={handleGenericFormChange}
                fullWidth
              />
              <TextField
                label="Slug"
                name="slug"
                value={genericForm.slug}
                onChange={handleGenericFormChange}
                fullWidth
              />
            </Box>

            <Box display="flex" gap={2}>
              <TextField
                label="Description"
                name="description"
                value={genericForm.description}
                onChange={handleGenericFormChange}
                fullWidth
                multiline
                rows={3}
                InputProps={{
                  sx: {
                    "& .MuiInputBase-input": {
                      padding: "16px 12px"
                    }
                  }
                }}
              />
            </Box>
            <Box display="flex" gap={2}>
              <TextField
                label="Search Term"
                name="search_term"
                value={genericForm.search_term}
                onChange={handleGenericFormChange}
                fullWidth
              />
               <TextField
                label="keywords"
                name="keywords"
                value={genericForm.keywords}
                onChange={handleGenericFormChange}
                fullWidth
              />
           </Box>

            {/* Filters Section Title */}
            <Box mt={2} mb={1}>
              <strong style={{ fontSize: '1.1rem' }}>Filters</strong>
            </Box>

            <Box display="flex" gap={2}>
              <Autocomplete
                options={developerOptions}
                getOptionLabel={(option) => option || ""}
                value={genericForm.filters.developer || null}
                onChange={(event, newValue) => {
                  setGenericForm((prev) => ({
                    ...prev,
                    filters: {
                      ...prev.filters,
                      developer: newValue || "",
                    },
                  }));
                }}
                renderInput={(params) => (
                  <TextField {...params} label="Developer" />
                )}
                fullWidth
              />
 <FormControl fullWidth>
                <InputLabel id="city-label">City</InputLabel>
                <Select
                  labelId="city-label"
                  name="city"
                  value={genericForm.filters.city}
                  onChange={handleGenericFormChange}
                  label="City"
                >
                  {cityOptions.map((city, idx) => (
                    <MenuItem key={idx} value={city}>
                      {city}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
             
            </Box>

            <Box display="flex" gap={2}>
             
            <FormControl fullWidth>
                <InputLabel id="location-label">Location</InputLabel>
                <Select
                  labelId="location-label"
                  name="location"
                  value={genericForm.filters.location || ""}
                  onChange={handleGenericFormChange}
                  label="Location"
                >
                  {locationOptions.map((loc, idx) => (
                    <MenuItem key={idx} value={loc}>
                      {loc}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
              <FormControl fullWidth>
                <InputLabel id="type-label">Type</InputLabel>
                <Select
                  labelId="type-label"
                  name="type"
                  value={genericForm.filters.type}
                  onChange={handleGenericFormChange}
                  label="Type"
                >
                  {typeOptions.map((type, idx) => (
                    <MenuItem key={idx} value={type.toUpperCase()}>
                      {type}
                    </MenuItem>
                  ))}
                </Select>
              </FormControl>
            </Box>
            <FormControlLabel
              control={
                <Checkbox
                  checked={genericForm.filters.is_premium}
                  onChange={handleGenericFormChange}
                  name="is_premium"
                />
              }
              label="Is Premium"
            />
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleCancel} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={handleSaveGenericLink}
          color="primary"
          variant="contained"
          disabled={!filterData}
        >
          Save
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default AddGenericLinkForm;
