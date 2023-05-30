import {
  AppBar,
  Box,
  Button,
  CssBaseline,
  Toolbar,
  Typography,
} from "@mui/material";
import { Link, Route, BrowserRouter as Router, Routes } from "react-router-dom";
import { SideBar } from "./components/SideBar";
import { EducationByLevel } from "./pages/EducationByLevel";
import { Home } from "./pages/Home";
import { Unemployment } from "./pages/Unemployment";
import { Salary } from "./pages/Salary";
import { Poverty } from "./pages/Poverty";
import { Sources } from "./pages/Sources";
import { EducationBySubject } from "./pages/EducationBySubject";
import { ImportAndExport } from "./pages/ImportAndExport";
import { ActiveCompanies } from "./pages/ActiveCompanies";
import { Emigration } from "./pages/Emigration";
import { BirthRate } from "./pages/BirthRate";

export const App = () => {
  return (
    <Box display="flex" flexDirection="column" height="100%">
      <CssBaseline />
      <Router>
        <AppBar
          position="static"
          color="inherit"
          variant="outlined"
          elevation={0}
        >
          <Toolbar>
            <Typography
              variant="h6"
              component="div"
              sx={{ flexGrow: 1 }}
            ></Typography>
            <Button color="inherit" LinkComponent={Link} to="/login">
              Prisijungti
            </Button>
          </Toolbar>
        </AppBar>
        <Box flex="1 1 auto" display="flex" flexDirection="row">
          <SideBar />
          <Box flex="1 1 auto" height="100%">
            <Routes>
              <Route path="/" element={<Home />} />
              <Route path="/salary" element={<Salary />} />
              <Route path="/unemployment" element={<Unemployment />} />
              <Route
                path="/education-by-level"
                element={<EducationByLevel />}
              />
              <Route
                path="/education-by-subject"
                element={<EducationBySubject />}
              />
              <Route path="/poverty" element={<Poverty />} />
              <Route path="/sources" element={<Sources />} />
              <Route path="/import-and-export" element={<ImportAndExport />} />
              <Route path="/active-companies" element={<ActiveCompanies />} />
              <Route path="/emigration" element={<Emigration />} />
              <Route path="/birth-rate" element={<BirthRate />} />
            </Routes>
          </Box>
        </Box>
      </Router>
    </Box>
  );
};
