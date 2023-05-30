import {
  Autocomplete,
  Box,
  CircularProgress,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../colors";
import { OSP } from "../osp";
import { compareYear } from "../utils/arrayUtils";

const BIRTH_RATE_NAME = "S3R692_M3010501_2";
const DEATH_RATE_NAME = "S3R696_M3010701_2";

export const BirthRate = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState();
  const [territories, setTerritories] = useState();
  const [selectedTerritory, setSelectedTerritory] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const [birthData, deathData] = await Promise.all([
        OSP.getDocument(BIRTH_RATE_NAME),
        OSP.getDocument(DEATH_RATE_NAME),
      ]);
      const {
        dataSets: [birthDataSet],
        structure: { dimensions: birthDimensions },
      } = birthData;
      const {
        dataSets: [deathDataSet],
        structure: { dimensions: deathDimensions },
      } = deathData;
      const [territories, units] = birthDimensions.observation.map(
        (observation) =>
          observation.values.sort((a, b) => a.id.localeCompare(b.id))
      );
      setUnits(units[0].name);
      setTerritories(territories);
      setSelectedTerritory(territories[0]);

      const deathEntries = Object.entries(deathDataSet.observations);
      const mappedData = Object.entries(birthDataSet.observations).map(
        ([key1, [birthValue]]) => {
          const [territory, , year] = key1
            .split(":")
            .map((i, j) => birthDimensions.observation[j].values[i]);
          const item = deathEntries.find(([key2]) => {
            const [deathTerritory, , deathYear] = key2
              .split(":")
              .map((i, j) => deathDimensions.observation[j].values[i]);

            return (
              territory.id === deathTerritory.id && year.id === deathYear.id
            );
          });

          return {
            territory,
            year,
            birthValue,
            deathValue: item ? item[1][0] : null,
          };
        }
      );

      setData(mappedData.sort(compareYear));
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredData = data.filter(
    (record) => record.territory.id === selectedTerritory.id
  );

  return (
    <Box
      p={2}
      gap={2}
      height="100%"
      display="flex"
      flexDirection="column"
      alignItems="center"
      justifyContent="center"
    >
      {loading ? (
        <CircularProgress />
      ) : (
        <>
          <Paper
            variant="outlined"
            sx={{
              display: "flex",
              flexDirection: "column",
              p: 2,
              width: "100%",
              flex: "1 1 auto",
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              Kūdikių gimstamumas ir mirtingumas
            </Typography>
            <ResponsiveContainer>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year.name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${value} per ${units}`}
                  animationDuration={0}
                />
                <Bar name="Gimstamumas" dataKey="birthValue" fill={COLORS[1]} />
                <Bar
                  name="Kūdikių mirtingumas"
                  dataKey="deathValue"
                  fill={COLORS[4]}
                />
              </BarChart>
            </ResponsiveContainer>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              width: "100%",
              display: "flex",
              flexDirection: "column",
              alignItems: "flex-start",
              gap: 2,
            }}
          >
            <Autocomplete
              disableClearable
              options={territories}
              value={selectedTerritory}
              getOptionLabel={(option) => option.name}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, value) => setSelectedTerritory(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Administracinė teritorija"
                  sx={{ width: 320 }}
                />
              )}
            />
          </Paper>
        </>
      )}
    </Box>
  );
};
