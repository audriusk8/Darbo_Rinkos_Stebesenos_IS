import {
  Box,
  Checkbox,
  CircularProgress,
  FormControl,
  FormControlLabel,
  FormGroup,
  FormLabel,
  Paper,
  Typography,
} from "@mui/material";
import React, { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Cell,
  Legend,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { compareYear } from "../utils/arrayUtils";
import { COLORS } from "../colors";
import { OSP } from "../osp";

const NAME = "S3R0152_M3080605";

const reducer = (prev, curr) => {
  const { employment, year, value } = curr;
  const index = prev.findIndex((record) => record.year.id === year.id);

  if (index > -1) {
    return prev.map((record, i) =>
      i === index ? { ...record, [employment.id]: value } : record
    );
  }

  const record = {
    year,
    [employment.id]: value,
  };

  return [...prev, record];
};

export const Poverty = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [employments, setEmployments] = useState();
  const [units, setUnits] = useState("");
  const [selectedEmployments, setSelectedEmployments] = useState({});

  useEffect(() => {
    const fetchData = async () => {
      const {
        dataSets: [dataSet],
        structure,
      } = await OSP.getDocument(NAME);
      const { dimensions } = structure;
      const [employments, units] = dimensions.observation.map((observation) =>
        observation.values.sort((a, b) => a.id.localeCompare(b.id))
      );
      setUnits(units[0].name);
      setEmployments(employments);
      setSelectedEmployments(
        Object.fromEntries(
          employments.map((employment) => [employment.id, true])
        )
      );

      const mappedData = Object.entries(dataSet.observations).map(
        ([key, [value]]) => {
          const indices = key.split(":");
          const [employment, , year] = indices.map(
            (i, j) => dimensions.observation[j].values[i]
          );

          return {
            employment,
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

  const filteredData = data.reduce(reducer, []);
  const recentData = data.filter((record) => record.year.id === "2022");

  const handleEmploymentChange = (event) => {
    setSelectedEmployments((value) => ({
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
          <Box
            width="100%"
            flex="1 1 auto"
            display="flex"
            flexDirection="row"
            gap={2}
          >
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 2,
                width: "50%",
              }}
            >
              <Typography variant="h6" align="center" gutterBottom>
                Skurdo lygis
              </Typography>
              <ResponsiveContainer>
                <AreaChart data={filteredData}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="year.name" />
                  <YAxis tickFormatter={(value) => `${value} ${units}`} />
                  <Tooltip
                    animationDuration={0}
                    formatter={(value) => `${value} ${units}`}
                  />
                  {employments
                    .filter((employment) => selectedEmployments[employment.id])
                    .map((employment, index) => (
                      <Area
                        key={employment.id}
                        type="monotone"
                        name={employment.name}
                        dataKey={employment.id}
                        stroke={COLORS[index]}
                        fill={COLORS[index]}
                      />
                    ))}
                  <Legend />
                </AreaChart>
              </ResponsiveContainer>
            </Paper>
            <Paper
              variant="outlined"
              sx={{
                display: "flex",
                flexDirection: "column",
                p: 2,
                flex: "1 1 auto",
              }}
            >
              <Typography variant="h6" align="center" gutterBottom>
                Skurdo lygis 2022 metais
              </Typography>
              <ResponsiveContainer>
                <PieChart>
                  <Pie
                    nameKey="employment.name"
                    dataKey="value"
                    isAnimationActive={false}
                    data={recentData}
                    cx="50%"
                    cy="50%"
                    outerRadius={150}
                    fill="#8884d8"
                    label
                  >
                    {recentData.map((_, index) => (
                      <Cell
                        key={`cell-${index}`}
                        fill={COLORS[index % COLORS.length]}
                      />
                    ))}
                  </Pie>
                  <Tooltip />
                  <Legend />
                </PieChart>
              </ResponsiveContainer>
            </Paper>
          </Box>
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
            <FormControl component="fieldset">
              <FormLabel component="legend">Užimtumo statusas</FormLabel>
              <FormGroup row>
                {employments.map((employment) => (
                  <FormControlLabel
                    key={employment.id}
                    control={
                      <Checkbox
                        checked={selectedEmployments[employment.id]}
                        name={employment.id}
                        onChange={handleEmploymentChange}
                      />
                    }
                    label={employment.name}
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
