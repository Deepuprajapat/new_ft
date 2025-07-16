import React from "react";
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
  OutlinedInput,
  Chip,
  Box,
  Autocomplete,
} from "@mui/material";

const AddGenericLinkForm = ({
  open,
  onClose,
  onSave,
  filterData,
  genericForm,
  setGenericForm,
  handleGenericFormChange,
}) => {
  const filterOptions = filterData || {};
  const cityOptions = filterOptions.cities || [];
  const typeOptions = filterOptions.types || [];
  const configurationOptions = ["1BHK", "2BHK", "3BHK", "4BHK", "5BHK"];
  const developerOptions = filterOptions.developers || [];
  const locationOptions = filterOptions.locations || [];

  const handleDeveloperChange = (event, newValue) => {
    setGenericForm((prev) => ({
      ...prev,
      filters: {
        ...prev.filters,
        developer: newValue ? newValue.id : "",
      },
    }));
  };


  const handleSaveGenericLink = async () => {
    // Construct the payload from the form state
    const payload = {
      title: genericForm.title,
      description: genericForm.description,
      slug: genericForm.slug,
      search_term: genericForm.search_term,
      filters: {
        is_premium: genericForm.filters.is_premium,
        city: genericForm.filters.city,
        type: genericForm.filters.type,
        configurations: genericForm.filters.configurations,
      },
    };

    try {
      // Await the API call if CustomSearch is async
      const response = await CustomSearch({ payload });
      // Optionally handle the response here (e.g., show a message)
      console.log(response,"uyftyf")
    } catch (error) {
      // Optionally handle errors here
      console.error("Error saving generic link:", error);
    }
    handleCloseAddGenericModal();
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
              />
              <TextField
                label="Search Term"
                name="search_term"
                value={genericForm.search_term}
                onChange={handleGenericFormChange}
                fullWidth
              />
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

            <Box display="flex" gap={2}>
              <Autocomplete
                options={developerOptions}
                getOptionLabel={(option) => option.name || ""}
                value={
                  developerOptions.find(
                    (dev) => dev.id === genericForm.filters.developer
                  ) || null
                }
                onChange={handleDeveloperChange}
                renderInput={(params) => (
                  <TextField {...params} label="Developer" />
                )}
                fullWidth
              />

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
            </Box>

            <Box display="flex" gap={2}>
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

            <FormControl fullWidth>
              <InputLabel id="configurations-label">Configurations</InputLabel>
              <Select
                labelId="configurations-label"
                multiple
                name="configurations"
                value={genericForm.filters.configurations}
                onChange={handleGenericFormChange}
                input={<OutlinedInput label="Configurations" />}
                renderValue={(selected) => (
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                    {selected.map((value) => (
                      <Chip key={value} label={value} />
                    ))}
                  </Box>
                )}
              >
                {configurationOptions.map((option) => (
                  <MenuItem key={option} value={option}>
                    {option}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Box>
        )}
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} color="secondary">
          Cancel
        </Button>
        <Button
          onClick={onSave}
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
