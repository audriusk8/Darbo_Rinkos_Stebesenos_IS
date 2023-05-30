import {
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  InputLabel,
  MenuItem,
  Paper,
  Radio,
  RadioGroup,
  Select,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Observation, Units } from "../enums";
import { compareYear } from "../utils/arrayUtils";
import { OSP } from "../osp";

const AGE_IDS = ["0", "1", "2", "3"];
const NAME = "S3R347_M3030901_1";

export const Unemployment = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [ageGroups, setAgeGroups] = useState();
  const [residences, setResidences] = useState();
  const [genders, setGenders] = useState();
  const [units, setUnits] = useState();
  const [selectedAgeGroup, setSelectedAgeGroup] = useState();
  const [selectedResidence, setSelectedResidence] = useState();
  const [selectedGender, setSelectedGender] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const {
        dataSets: [dataSet],
        structure,
      } = await OSP.getDocument(NAME);
      const { dimensions } = structure;
      const [ageGroups, residences, genders, units] =
        dimensions.observation.map((observation) => {
          switch (observation.id) {
            case Observation.Age:
              return observation.values
                .filter((value) => AGE_IDS.includes(value.id))
                .sort((a, b) => a.id.localeCompare(b.id));
            default:
              return observation.values.sort((a, b) =>
                a.id.localeCompare(b.id)
              );
          }
        });
      setAgeGroups(ageGroups);
      setResidences(residences);
      setGenders(genders);
      setUnits(units[0].id === Units.Percent && "%");
      setSelectedAgeGroup(ageGroups[0].id);
      setSelectedResidence(residences[0].id);
      setSelectedGender(genders[0].id);

      const mappedData = Object.entries(dataSet.observations).map(
        ([key, [value]]) => {
          const indices = key.split(":");
          const [age, residence, gender, , year] = indices.map(
            (i, j) => dimensions.observation[j].values[i]
          );

          return {
            age,
            residence,
            gender,
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

  const filteredData = data.filter(
    (record) =>
      record.age.id === selectedAgeGroup &&
      record.residence.id === selectedResidence &&
      record.gender.id === selectedGender
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
              Nedarbo lygis
            </Typography>
            <ResponsiveContainer>
              <AreaChart data={filteredData}>
                <defs>
                  <linearGradient id="color" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#82ca9d" stopOpacity={0.8} />
                    <stop offset="95%" stopColor="#82ca9d" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year.name" />
                <YAxis
                  dataKey="value"
                  tickFormatter={(value) => `${value}${units}`}
                />
                <Tooltip
                  formatter={(value) => `${value}${units}`}
                  animationDuration={0}
                />
                <Area
                  name="Nedarbo lygis"
                  type="monotone"
                  dataKey="value"
                  stroke="#82ca9d"
                  fillOpacity={1}
                  fill="url(#color)"
                />
              </AreaChart>
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
            <FormControl>
              <FormLabel>Gyvenamoji vieta</FormLabel>
              <RadioGroup
                row
                value={selectedResidence}
                onChange={(e) => setSelectedResidence(e.target.value)}
              >
                {residences.map((residence) => (
                  <FormControlLabel
                    key={residence.id}
                    control={<Radio />}
                    label={residence.name}
                    value={residence.id}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <FormControl>
              <FormLabel>Lytis</FormLabel>
              <RadioGroup
                row
                value={selectedGender}
                onChange={(event) => setSelectedGender(event.target.value)}
              >
                {genders.map((gender) => (
                  <FormControlLabel
                    key={gender.id}
                    control={<Radio />}
                    label={gender.name}
                    value={gender.id}
                  />
                ))}
              </RadioGroup>
            </FormControl>
          </Paper>
        </>
      )}
    </Box>
  );
};
