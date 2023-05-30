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
import { useEffect, useState } from "react";
import {
  Bar,
  CartesianGrid,
  ComposedChart,
  Legend,
  Line,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../colors";
import { OSP } from "../osp";

const NAME = "S3R143_M3110116";

const reducer = (prev, curr) => {
  const { gender, residence, education, year, value } = curr;
  const index = prev.findIndex(
    (record) =>
      record.residence.id === residence.id &&
      record.education.id === education.id &&
      record.year.id === year.id
  );

  if (index > -1) {
    return prev.map((record, i) =>
      i === index ? { ...record, [gender.id]: value } : record
    );
  }

  const record = {
    residence,
    education,
    year,
    [gender.id]: value,
  };

  return [...prev, record];
};

export const EducationByLevel = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState("");
  const [genders, setGenders] = useState();
  const [years, setYears] = useState();
  const [residences, setResidences] = useState();
  const [selectedYear, setSelectedYear] = useState();
  const [selectedResidence, setSelectedResidence] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const {
        dataSets: [dataSet],
        structure,
      } = await OSP.getDocument(NAME);
      const { dimensions } = structure;
      const [genders, residences, , , units, years] =
        dimensions.observation.map((observation) =>
          observation.values.sort((a, b) => a.id.localeCompare(b.id))
        );
      setUnits(units[0].name);
      setGenders(genders);
      setResidences(residences);
      setYears(years);
      setSelectedYear(years[0].id);
      setSelectedResidence(residences[0].id);

      const mappedData = Object.entries(dataSet.observations).map(
        ([key, [value]]) => {
          const indices = key.split(":");
          const [gender, residence, education, , , year] = indices.map(
            (i, j) => dimensions.observation[j].values[i]
          );

          return {
            gender,
            residence,
            education,
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
        record.residence.id === selectedResidence &&
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
              Išsilavinimas pagal lygį
            </Typography>
            <ResponsiveContainer>
              <ComposedChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="education.name" />
                <YAxis tickFormatter={(value) => `${value} ${units}`} />
                <Tooltip
                  animationDuration={0}
                  formatter={(value) => `${value} ${units}`}
                />
                {genders.map((gender, index) =>
                  index === 0 ? (
                    <Line
                      key={gender.id}
                      type="monotone"
                      name={gender.name}
                      dataKey={gender.id}
                      stroke={COLORS[index]}
                    />
                  ) : (
                    <Bar
                      key={gender.id}
                      name={gender.name}
                      dataKey={gender.id}
                      fill={COLORS[index]}
                    />
                  )
                )}
                <Legend />
              </ComposedChart>
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
          </Paper>
        </>
      )}
    </Box>
  );
};
