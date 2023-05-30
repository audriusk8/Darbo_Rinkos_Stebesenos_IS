import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Bar,
  BarChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Gender } from "../enums";
import { OSP } from "../osp";
import { compareYear } from "../utils/arrayUtils";

const NAME = "S3R0166_M3020124";

const reducer = (prev, curr) => {
  const { territory, gender, ageGroup, year, value } = curr;
  const index = prev.findIndex(
    (record) =>
      record.territory.id === territory.id &&
      record.ageGroup.id === ageGroup.id &&
      record.year.id === year.id
  );

  if (index > -1) {
    return prev.map((record, i) =>
      i === index ? { ...record, [gender.id]: value } : record
    );
  }

  const record = {
    territory,
    ageGroup,
    year,
    [gender.id]: value,
  };

  return [...prev, record];
};

export const Emigration = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState();
  const [territories, setTerritories] = useState();
  const [ageGroups, setAgeGroups] = useState();
  const [selectedTerritory, setSelectedTerritory] = useState();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const {
        dataSets: [dataSet],
        structure,
      } = await OSP.getDocument(NAME);
      const { dimensions } = structure;
      const [territories, , ageGroups, units] = dimensions.observation.map(
        (observation) =>
          observation.values.sort((a, b) => a.id.localeCompare(b.id))
      );
      setUnits(units[0].name);
      setTerritories(territories);
      setAgeGroups(ageGroups);
      setSelectedTerritory(territories[0]);
      setSelectedAgeGroup(ageGroups[0].id);

      const mappedData = Object.entries(dataSet.observations).map(
        ([key, [value]]) => {
          const indices = key.split(":");
          const [territory, gender, ageGroup, , year] = indices.map(
            (i, j) => dimensions.observation[j].values[i]
          );

          return {
            territory,
            gender,
            ageGroup,
            year,
            value,
          };
        }
      );
      setData(mappedData.sort(compareYear));
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredData = data
    .reduce(reducer, [])
    .filter(
      (record) =>
        record.territory.id === selectedTerritory.id &&
        record.ageGroup.id === selectedAgeGroup
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
              Emigracija
            </Typography>
            <ResponsiveContainer>
              <BarChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year.name" />
                <YAxis />
                <Tooltip
                  formatter={(value) => `${value.toFixed(2)} ${units}`}
                  animationDuration={0}
                />
                <Bar name="Vyrai" dataKey={Gender.Male} fill="#8884d8" />
                <Bar name="Moterys" dataKey={Gender.Female} fill="#82ca9d" />
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
            <FormControl sx={{ width: 300 }}>
              <InputLabel>Amžiaus grupė</InputLabel>
              <Select
                value={selectedAgeGroup}
                label="Amžiaus grupė"
                onChange={(e) => setSelectedAgeGroup(e.target.value)}
              >
                {ageGroups.map((age) => (
                  <MenuItem key={age.id} value={age.id}>
                    {age.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
          </Paper>
        </>
      )}
    </Box>
  );
};
