import {
  Box,
  CircularProgress,
  FormControl,
  InputLabel,
  MenuItem,
  Paper,
  Select,
  Typography,
} from "@mui/material";
import { useEffect, useState } from "react";
import {
  Area,
  AreaChart,
  CartesianGrid,
  Legend,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";
import { COLORS } from "../colors";
import { OSP } from "../osp";
import { compareYear } from "../utils/arrayUtils";
import { MONTHS } from "../months";

const IMPORT_NAME = "S6R007_M6050101";
const EXPORT_NAME = "S6R005_M6050101";

export const ImportAndExport = () => {
  const [data, setData] = useState([]);
  const [loading, setLoading] = useState(true);
  const [units, setUnits] = useState("");
  const [years, setYears] = useState();
  const [selectedYear, setSelectedYear] = useState();

  useEffect(() => {
    const fetchData = async () => {
      const [importData, exportData] = await Promise.all([
        OSP.getDocument(IMPORT_NAME),
        OSP.getDocument(EXPORT_NAME),
      ]);
      const {
        dataSets: [importDataSet],
        structure: { dimensions: importDimensions },
      } = importData;
      const {
        dataSets: [exportDataSet],
        structure: { dimensions: exportDimensions },
      } = exportData;
      const [units] = importDimensions.observation.map(
        (observation) => observation.values
      );
      setUnits(units[0].name);
      const exportEntries = Object.entries(exportDataSet.observations);
      const mappedData = Object.entries(importDataSet.observations).map(
        ([key, [importValue]]) => {
          const indices = key.split(":").slice(1);
          const [, year] = indices.map(
            (i, j) => importDimensions.observation[j].values[i]
          );
          const [, [exportValue]] = exportEntries.find(([key]) => {
            const indices = key.split(":").slice(1);
            const [, exportYear] = indices.map(
              (i, j) => exportDimensions.observation[j].values[i]
            );

            return year.id === exportYear.id;
          });

          return {
            year,
            importValue,
            exportValue,
          };
        }
      );

      const years = mappedData
        .reduce((accumulator, current) => {
          const [year] = current.year.id.split("M");

          if (!accumulator.includes(year)) {
            accumulator.push(year);
          }

          return accumulator;
        }, [])
        .sort();

      setYears(years);
      setSelectedYear(years.slice(-1));
      setData(mappedData.sort(compareYear));
      setLoading(false);
    };
    fetchData();
  }, []);

  const filteredData = data
    .filter((record) => record.year.id.startsWith(selectedYear))
    .map((record) => ({
      ...record,
      month: MONTHS[parseInt(record.year.name.split("M")[1]) - 1],
    }));

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
              height: "100%",
            }}
          >
            <Typography variant="h6" align="center" gutterBottom>
              Importas ir eksportas
            </Typography>
            <ResponsiveContainer>
              <AreaChart data={filteredData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="month" />
                <YAxis tickFormatter={(value) => `${value} ${units}`} />
                <Tooltip
                  formatter={(value) => `${value} ${units}`}
                  animationDuration={0}
                />
                <Area
                  name="Importas"
                  type="monotone"
                  dataKey="importValue"
                  stroke={COLORS[0]}
                  fill={COLORS[0]}
                />
                <Area
                  name="Eksportas"
                  type="monotone"
                  dataKey="exportValue"
                  stroke={COLORS[2]}
                  fill={COLORS[2]}
                />
                <Legend />
              </AreaChart>
            </ResponsiveContainer>
          </Paper>
          <Paper
            variant="outlined"
            sx={{
              p: 2,
              width: "100%",
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
                  <MenuItem key={year} value={year}>
                    {year}
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
