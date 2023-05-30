import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { compareYear } from "../utils/arrayUtils";
import { COLORS } from "../colors";
import { OSP } from "../osp";
import { Gender } from "../enums";

const NAME = "S3R0050_M3060862_3";

const reducer = (prev, curr) => {
  const { salaryType, sector, gender, year, value } = curr;
  const index = prev.findIndex(
    (record) =>
      record.salaryType.id === salaryType.id &&
      record.gender.id === gender.id &&
      record.year.id === year.id
  );

  if (index > -1) {
    return prev.map((record, i) =>
      i === index ? { ...record, [sector.id]: value } : record
    );
  }

  const record = {
    salaryType,
    gender,
    year,
    [sector.id]: value,
  };

  return [...prev, record];
};

export const Salary = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [salaryTypes, setSalaryTypes] = useState();
  const [sectors, setSectors] = useState();
  const [units, setUnits] = useState("");
  const [selectedSalaryType, setSelectedSalaryType] = useState();
  const [selectedSectors, setSelectedSectors] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const {
        dataSets: [dataSet],
        structure,
      } = await OSP.getDocument(NAME);
      const { dimensions } = structure;
      const [salaryTypes, sectors, , units] = dimensions.observation.map(
        (observation) =>
          observation.values.sort((a, b) => a.id.localeCompare(b.id))
      );
      setUnits(units[0].name);
      setSalaryTypes(salaryTypes);
      setSectors(sectors);
      setSelectedSalaryType(salaryTypes[0].id);
      setSelectedSectors(
        Object.fromEntries(sectors.map((sector) => [sector.id, true]))
      );

      const mappedData = Object.entries(dataSet.observations).map(
        ([key, [value]]) => {
          const indices = key.split(":");
          const [salaryType, sector, gender, , year] = indices.map(
            (i, j) => dimensions.observation[j].values[i]
          );

          return {
            salaryType,
            sector,
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

  const filteredData = data
    .reduce(reducer, [])
    .filter(
      (record) =>
        record.gender.id === Gender.Both &&
        record.salaryType.id === selectedSalaryType
    );

  const handleSectorChange = (event) => {
    setSelectedSectors((value) => ({
      ...value,
      [event.target.name]: event.target.checked,
    }));
  };

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
              Darbo užmokestis
            </Typography>
            <ResponsiveContainer>
              <LineChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="year.name" />
                <YAxis tickFormatter={(value) => `${value} ${units}`} />
                <Tooltip
                  animationDuration={0}
                  formatter={(value) => `${value} ${units}`}
                />
                {sectors
                  .filter((sector) => selectedSectors[sector.id])
                  .map((sector, index) => (
                    <Line
                      key={sector.id}
                      type="monotone"
                      name={sector.name}
                      dataKey={sector.id}
                      stroke={COLORS[index]}
                    />
                  ))}
                <Legend />
              </LineChart>
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
              <FormLabel>Tipas</FormLabel>
              <RadioGroup
                row
                value={selectedSalaryType}
                onChange={(e) => setSelectedSalaryType(e.target.value)}
              >
                {salaryTypes.map((salaryType) => (
                  <FormControlLabel
                    key={salaryType.id}
                    control={<Radio />}
                    label={salaryType.name}
                    value={salaryType.id}
                  />
                ))}
              </RadioGroup>
            </FormControl>
            <FormControl component="fieldset">
              <FormLabel component="legend">Sektorius</FormLabel>
              <FormGroup row>
                {sectors.map((sector) => (
                  <FormControlLabel
                    key={sector.id}
                    control={
                      <Checkbox
                        checked={selectedSectors[sector.id]}
                        name={sector.id}
                        onChange={handleSectorChange}
                      />
                    }
                    label={sector.name}
                  />
                ))}
              </FormGroup>
            </FormControl>
          </Paper>
        </>
      )}
    </Box>
  );
};
