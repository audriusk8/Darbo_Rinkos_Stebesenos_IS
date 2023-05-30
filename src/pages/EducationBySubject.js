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
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { Gender, Observation } from "../enums";
import { OSP } from "../osp";

const NAME = "S3R383_M3110706";

const reducer = (prev, curr) => {
  const { degreeType, degreeSubject, gender, year, value } = curr;
  const index = prev.findIndex(
    (record) =>
      record.degreeType.id === degreeType.id &&
      record.degreeSubject.id === degreeSubject.id &&
      record.year.id === year.id
  );

  if (index > -1) {
    return prev.map((record, i) =>
      i === index ? { ...record, [gender.id]: value } : record
    );
  }

  const record = {
    degreeType,
    degreeSubject,
    year,
    [gender.id]: value,
  };

  return [...prev, record];
};

export const EducationBySubject = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState("");
  const [degreeTypes, setDegreeTypes] = useState();
  const [years, setYears] = useState();
  const [selectedDegreeType, setSelectedDegreeType] = useState();
  const [selectedYear, setSelectedYear] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const {
        dataSets: [dataSet],
        structure,
      } = await OSP.getDocument(NAME);
      const { dimensions } = structure;
      const [degreeTypes, , , units, years] = dimensions.observation.map(
        (observation) => {
          switch (observation.id) {
            case Observation.Gender:
              return observation.values
                .filter((value) => value.id !== Gender.Both)
                .sort((a, b) => a.id.localeCompare(b.id));
            default:
              return observation.values.sort((a, b) =>
                a.id.localeCompare(b.id)
              );
          }
        }
      );

      setUnits(units[0].name);
      setDegreeTypes(degreeTypes);
      setYears(years);
      setSelectedDegreeType(degreeTypes[0].id);
      setSelectedYear(years[0].id);

      const mappedData = Object.entries(dataSet.observations).map(
        ([key, [value]]) => {
          const indices = key.split(":");
          const [degreeType, degreeSubject, gender, , year] = indices.map(
            (i, j) => dimensions.observation[j].values[i]
          );

          return {
            degreeType,
            degreeSubject,
            gender,
            year,
            value,
          };
        }
      );
      setData(mappedData);
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredData = data
    .reduce(reducer, [])
    .filter(
      (record) =>
        record.degreeType.id === selectedDegreeType &&
        record.year.id === selectedYear
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
              Išsilavinimas pagal dalyką
            </Typography>
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                width={500}
                height={300}
                data={filteredData}
                margin={{
                  top: 20,
                  right: 30,
                  left: 20,
                  bottom: 5,
                }}
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="degreeSubject.name" />
                <YAxis />
                <Tooltip formatter={(value) => `${value} ${units}`} />
                <Legend />
                <Bar
                  name="Vyrai"
                  dataKey={Gender.Male}
                  stackId="a"
                  fill="#8884d8"
                />
                <Bar
                  name="Moterys"
                  dataKey={Gender.Female}
                  stackId="a"
                  fill="#82ca9d"
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
            <FormControl sx={{ width: 300 }}>
              <InputLabel>Metai</InputLabel>
              <Select
                value={selectedYear}
                label="Metai"
                onChange={(e) => setSelectedYear(e.target.value)}
              >
                {years.map((year) => (
                  <MenuItem key={year.id} value={year.id}>
                    {year.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            <FormControl>
              <FormLabel>Studijų pakopa</FormLabel>
              <RadioGroup
                row
                value={selectedDegreeType}
                onChange={(e) => setSelectedDegreeType(e.target.value)}
              >
                {degreeTypes.map((residence) => (
                  <FormControlLabel
                    key={residence.id}
                    control={<Radio />}
                    label={residence.name}
                    value={residence.id}
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
