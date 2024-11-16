import React, { useState } from "react";
import {
  Button,
  Modal,
  Box,
  Typography,
  FormControl,
  FormLabel,
  RadioGroup,
  Radio,
  FormControlLabel,
  Divider,
} from "@mui/material";

const FilterModal = ({ open, onClose, onApply, onReset, filterData }) => {
  const [gender, setGender] = useState(filterData.gender || "");
  const [age, setAge] = useState(filterData.age || "");

  // Handle Gender Change
  const handleGenderChange = (event) => {
    setGender(event.target.value);
  };

  // Handle Age Change
  const handleAgeChange = (event) => {
    setAge(event.target.value);
  };

  // Reset Filters
  const handleReset = () => {
    setGender("");
    setAge("");
    onReset();
  };

  // Apply Filters
  const handleApply = () => {
    const selectedFilters = {
      gender,
      age,
    };
    onApply(selectedFilters);
    onClose();
  };

  return (
    <Modal open={open} onClose={onClose}>
      <Box
        sx={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
          bgcolor: "background.paper",
          borderRadius: 2,
          boxShadow: 24,
          p: 4,
          width: 300,
        }}
      >
        <Typography variant="h6" mb={2}>
          Filter Options
        </Typography>

        {/* Gender Filter */}
        <FormControl component="fieldset" sx={{ mb: 2 }}>
          <FormLabel component="legend">Gender</FormLabel>
          <RadioGroup value={gender} onChange={handleGenderChange}>
            <FormControlLabel value="male" control={<Radio />} label="Male" />
            <FormControlLabel value="female" control={<Radio />} label="Female" />
          </RadioGroup>
        </FormControl>
        <Divider />

        {/* Age Filter */}
        <FormControl component="fieldset" sx={{ my: 2 }}>
          <FormLabel component="legend">Age</FormLabel>
          <RadioGroup value={age} onChange={handleAgeChange}>
            <FormControlLabel value="15-25" control={<Radio />} label="15-25" />
            <FormControlLabel value=">25" control={<Radio />} label=">25" />
          </RadioGroup>
        </FormControl>

        {/* Action Buttons */}
        <Box sx={{ display: "flex", justifyContent: "flex-end", gap: 1 }}>
          <Button onClick={handleReset} variant="outlined">
            Reset
          </Button>
          <Button onClick={handleApply} variant="contained">
            Apply
          </Button>
        </Box>
      </Box>
    </Modal>
  );
};

export default FilterModal;
