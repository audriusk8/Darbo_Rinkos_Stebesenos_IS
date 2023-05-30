import { useEffect, useState } from "react";
import { OSP } from "../osp";
import {
  Autocomplete,
  Box,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormLabel,
  Paper,
  Radio,
  RadioGroup,
  TextField,
  Typography,
} from "@mui/material";
import { compareYear } from "../utils/arrayUtils";
import {
  Area,
  AreaChart,
  CartesianGrid,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const NAME = "S8R732_M4031705_2";

export const ActiveCompanies = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState();
  const [activities, setActivities] = useState();
  const [sizes, setSizes] = useState();
  const [selectedActivity, setSelectedActivity] = useState();
  const [selectedSize, setSelectedSize] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const {
        dataSets: [dataSet],
        structure,
      } = await OSP.getDocument(NAME);
      const { dimensions } = structure;
      const [activities, sizes, units] = dimensions.observation.map(
        (observation) =>
          observation.values.sort((a, b) => a.id.localeCompare(b.id))
      );
      setUnits(units[0].name);
      setActivities(activities);
      setSizes(sizes);
      setSelectedActivity(activities[0]);
      setSelectedSize(sizes[0].id);

      const mappedData = Object.entries(dataSet.observations).map(
        ([key, [value]]) => {
          const indices = key.split(":");
          const [activity, size, , year] = indices.map(
            (i, j) => dimensions.observation[j].values[i]
          );

          return {
            activity,
            size,
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
      record.activity.id === selectedActivity.id &&
      record.size.id === selectedSize
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
              Veikiančių įmonių skaičius
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
                <YAxis tickFormatter={(value) => `${value} ${units}`} />
                <Tooltip
                  formatter={(value) => `${value} ${units}`}
                  animationDuration={0}
                />
                <Area
                  name="Įmonių skaičius"
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
            <Autocomplete
              disableClearable
              options={activities}
              value={selectedActivity}
              getOptionLabel={(option) => `${option.id} ${option.name}`}
              isOptionEqualToValue={(option, value) => option.id === value.id}
              onChange={(_, value) => setSelectedActivity(value)}
              renderInput={(params) => (
                <TextField
                  {...params}
                  label="Ekonominės veiklos rūšis"
                  sx={{ width: 600 }}
                />
              )}
            />
            <FormControl>
              <FormLabel>Įmonės dydis</FormLabel>
              <RadioGroup
                row
                value={selectedSize}
                onChange={(e) => setSelectedSize(e.target.value)}
              >
                {sizes.map((residence) => (
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
