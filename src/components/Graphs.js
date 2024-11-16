import axios from "axios";
import React, { useContext, useEffect, useState } from "react";
import { AuthContext } from "../contexts/AuthContext";
import { Box, IconButton, TextField, Typography } from "@mui/material";
import dayjs from "dayjs";
import { BarChart } from "@mui/x-charts/BarChart";
import { LineChart } from "@mui/x-charts/LineChart";
import FilterAltIcon from "@mui/icons-material/FilterAlt";
import { useSearchParams } from "react-router-dom";
import customParseFormat from "dayjs/plugin/customParseFormat";
import FilterModal from "./FilterModal";
dayjs.extend(customParseFormat);

const Graphs = () => {
  const { token } = useContext(AuthContext);
  const [searchParams, setSearchParams] = useSearchParams();
  const [graphData, setGraphData] = useState([]);
  const [constructData, setConstructData] = useState([]);
  const [dataSet, setDataSet] = useState([]);
  const [selectedItem, setSelectedItem] = useState("");
  const [filterModalOpen, setFilterModalOpen] = useState(false);
  const [originalData, setOriginalData] = useState([]);

  const [startDate, setStartDate] = useState(
    searchParams.get("startDate") || ""
  );
  const [endDate, setEndDate] = useState(searchParams.get("endDate") || "");
  const [filterOption, setFilterOption] = useState({
    gender: searchParams.get("gender") || "",
    age: searchParams.get("age") || "",
  });

  const handleStartDateChange = (event) => {
    setStartDate(event.target.value);
    updateParam("startDate", event.target.value);
  };

  const handleEndDateChange = (event) => {
    setEndDate(event.target.value);
    updateParam("endDate", event.target.value);
  };

  const updateParam = (key, value) => {
    const newParams = new URLSearchParams(searchParams);
    newParams.set(key, value);
    setSearchParams(newParams);
  };

  const getGraphData = async () => {
    try {
      const result = await axios.get(
        `${process.env.REACT_APP_BASE_URL}/excel/read`,
        {
          headers: {
            authorization: `Bearer ${token}`,
          },
        }
      );

      setGraphData(result.data);
      setOriginalData(result.data);
    } catch (error) {
      console.log(error);
    }
  };

  const getCommulativeGraphData = () => {
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    const summation = {
      F: 0,
      E: 0,
      D: 0,
      C: 0,
      B: 0,
      A: 0,
    };

    graphData.forEach((item) => {
      const itemDate = dayjs(item.Day, "M/D/YYYY");
      if (itemDate >= start && itemDate <= end) {
        summation.A += parseInt(item.A);
        summation.B += parseInt(item.B);
        summation.C += parseInt(item.C);
        summation.D += parseInt(item.D);
        summation.E += parseInt(item.E);
        summation.F += parseInt(item.F);
      }
    });
    setConstructData(Object.values(summation));
  };

  useEffect(() => {
    if (startDate && endDate) {
      getCommulativeGraphData();
    }
  }, [startDate, endDate, graphData]);

  useEffect(() => {
    if (searchParams.get("gender") || searchParams.get("age")) {
      handleFilterApply({
        gender: searchParams.get("gender") || "",
        age: searchParams.get("age") || "",
      });
    }
  }, [originalData]);

  useEffect(() => {
    getGraphData();
  }, []);

  const handleBarClick = (event, data) => {
    const axisValue = data.axisValue;
    const start = dayjs(startDate);
    const end = dayjs(endDate);
    let summation = {};

    for (let i = 0; i < graphData.length; i++) {
      const item = graphData[i];
      const itemDate = dayjs(item.Day, "D/M/YYYY");
      if (
        (itemDate.isAfter(start) && itemDate.isBefore(end)) ||
        itemDate.isSame(start) ||
        itemDate.isSame(end)
      ) {
        summation[item.Day] =
          (summation[item.Day] || 0) + parseInt(item[axisValue]);
      }
    }

    const result = Object.entries(summation).map(([key, value]) => ({
      x: key,
      y: value,
    }));

    setDataSet(result);
    setSelectedItem(axisValue);
  };

  const handleFilterApply = (filters) => {
    const data = originalData;
    setConstructData([]);
    let filteredData = [];
    if (filters.age && filters.gender) {
      const newParams = new URLSearchParams(searchParams);
      newParams.set("age", filters.age);
      newParams.set("gender", filters.gender);
      setSearchParams(newParams);

      filteredData = data.filter(
        (item) =>
          item.Age === filters.age &&
          item.Gender.toLowerCase() === filters.gender
      );
      setGraphData(filteredData);
      setDataSet([]);
    } else if (filters.age) {
      updateParam("age", filters.age);
      filteredData = data.filter((item) => item.Age === filters.age);

      setGraphData(filteredData);
      setDataSet([]);
    } else if (filters.gender) {
      updateParam("gender", filters.gender);
      filteredData = data.filter(
        (item) => item.Gender.toLowerCase() === filters.gender
      );
      setGraphData(filteredData);
      setDataSet([]);
    }
  };

  const handleReset = () => {
    setConstructData([]);
    setGraphData(originalData);
    const newParams = new URLSearchParams(searchParams);
    newParams.delete("age");
    newParams.delete("gender");
    setSearchParams(newParams);
  };

  return (
    <>
      <Box
        display={"flex"}
        flexDirection={"row"}
        alignItems={"center"}
        justifyContent={"center"}
      >
        <Box>
          <Typography
            textAlign={"center"}
            sx={{
              borderRadius: 20,
              backgroundColor: "#263b5e",
              px: 2,
              py: 1,
              color: "white",
              mb: 4,
            }}
            xs={12}
          >
            Select Date Range
          </Typography>
          <Box
            xs={12}
            sx={{
              display: "flex",
              flexDirection: "row",
              gap: 2,
              width: "300px",
            }}
          >
            <TextField
              label="Start Date"
              type="date"
              value={startDate}
              size="small"
              onChange={handleStartDateChange}
              InputLabelProps={{
                shrink: true,
              }}
            />
            <TextField
              label="End Date"
              type="date"
              size="small"
              value={endDate}
              onChange={handleEndDateChange}
              InputLabelProps={{
                shrink: true,
              }}
              inputProps={{
                min: startDate,
              }}
            />
          </Box>
        </Box>
      </Box>
      {constructData.length > 0 ? (
        <Box display={"flex"}>
          <IconButton onClick={() => setFilterModalOpen(true)}>
            <FilterAltIcon
              sx={{
                color: "white",
                backgroundColor: "#263b5e",
                borderRadius: 5,
                padding: 1,
              }}
            />
          </IconButton>
        </Box>
      ) : null}
      <Box display={"flex"} mt={5} alignItems={"center"}>
        {constructData.length > 0 ? (
          <BarChart
            series={[{ data: constructData }]}
            onAxisClick={handleBarClick}
            yAxis={[
              {
                scaleType: "band",
                data: ["F", "E", "D", "C", "B", "A"],
                categoryGapRatio: 0.6,
                label: "Items",
              },
            ]}
            xAxis={[
              {
                label: "Total Sale",
              },
            ]}
            height={400}
            width={450}
            layout={"horizontal"}
            grid={{ vertical: true }}
          />
        ) : null}

        {dataSet.length > 0 ? (
          <LineChart
            dataset={dataSet}
            xAxis={[
              {
                id: "Dates",
                dataKey: "x",
                scaleType: "point",
                label: "Dates",
              },
            ]}
            series={[
              {
                dataKey: "y",
                curve: "linear",
              },
            ]}
            yAxis={[
              {
                label: `Item ${selectedItem} Sale`,
                sx: {
                  "& .MuiChartsYAxis-label": {
                    paddingLeft: 40, // Adjust padding to fix overlap
                    fontSize: 14,
                    fontWeight: "bold",
                    fill: "#555", // Change text color
                  },
                },
              },
            ]}
            grid={{ horizontal: true }}
            width={400}
            height={450}
          />
        ) : null}
      </Box>
      <FilterModal
        open={filterModalOpen}
        onClose={() => setFilterModalOpen(false)}
        onApply={handleFilterApply}
        onReset={handleReset}
        filterData={filterOption}
      />
    </>
  );
};

export default Graphs;
