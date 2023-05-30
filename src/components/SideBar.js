import {
  Addchart as AddChartIcon,
  BarChart as BarChartIcon,
  Business as BusinessIcon,
  ChildFriendly as ChildFriendlyIcon,
  Euro as EuroIcon,
  ExpandLess as ExpandLessIcon,
  ExpandMore as ExpandMoreIcon,
  FlightTakeoff as FlightTakeoffIcon,
  Home as HomeIcon,
  ImportExport as ImportExportIcon,
  NoFood as NoFoodIcon,
  School as SchoolIcon,
  WorkOff as WorkOffIcon,
} from "@mui/icons-material";
import {
  Box,
  Collapse,
  Drawer,
  List,
  ListItemButton,
  ListItemIcon,
  ListItemText,
} from "@mui/material";
import React, { useState } from "react";
import { Link } from "react-router-dom";

const DRAWER_WIDTH = 300;

export const SideBar = () => {
  const [open, setOpen] = useState(true);
  const [educationOpen, setEducationOpen] = useState(false);

  const handleClick = () => {
    setOpen((value) => !value);
  };

  const handleEducationClick = () => {
    setEducationOpen((value) => !value);
  };

  return (
    <Drawer
      variant="permanent"
      sx={{
        width: DRAWER_WIDTH,
        flexShrink: 0,
        [`& .MuiDrawer-paper`]: {
          position: "static",
          width: DRAWER_WIDTH,
        },
      }}
    >
      <Box sx={{ overflow: "auto" }}>
        <img src="logo.png" alt="logo" style={{ width: "100%", padding: 8 }} />
        <List>
          <ListItemButton LinkComponent={Link} to="/">
            <ListItemIcon>
              <HomeIcon />
            </ListItemIcon>
            <ListItemText primary="Pagrindinis" />
          </ListItemButton>
          <ListItemButton onClick={handleClick}>
            <ListItemIcon>
              <BarChartIcon />
            </ListItemIcon>
            <ListItemText primary="Statistika" />
            {open ? <ExpandLessIcon /> : <ExpandMoreIcon />}
          </ListItemButton>
          <Collapse in={open} sx={{ pl: 2 }}>
            <ListItemButton LinkComponent={Link} to="/salary">
              <ListItemIcon>
                <EuroIcon />
              </ListItemIcon>
              <ListItemText primary="Darbo užmokestis" />
            </ListItemButton>
            <ListItemButton LinkComponent={Link} to="/unemployment">
              <ListItemIcon>
                <WorkOffIcon />
              </ListItemIcon>
              <ListItemText primary="Nedarbo lygis" />
            </ListItemButton>
            <ListItemButton onClick={handleEducationClick}>
              <ListItemIcon>
                <SchoolIcon />
              </ListItemIcon>
              <ListItemText primary="Išsilavinimas" />
              {educationOpen ? <ExpandLessIcon /> : <ExpandMoreIcon />}
            </ListItemButton>
            <Collapse in={educationOpen} sx={{ pl: 2 }}>
              <ListItemButton LinkComponent={Link} to="/education-by-level">
                <ListItemText primary="Pagal lygį" />
              </ListItemButton>
              <ListItemButton LinkComponent={Link} to="/education-by-subject">
                <ListItemText primary="Pagal dalyką" />
              </ListItemButton>
            </Collapse>
            <ListItemButton LinkComponent={Link} to="/poverty">
              <ListItemIcon>
                <NoFoodIcon />
              </ListItemIcon>
              <ListItemText primary="Skurdo lygis" />
            </ListItemButton>
            <ListItemButton LinkComponent={Link} to="/import-and-export">
              <ListItemIcon>
                <ImportExportIcon />
              </ListItemIcon>
              <ListItemText primary="Importas ir eksportas" />
            </ListItemButton>
            <ListItemButton LinkComponent={Link} to="/active-companies">
              <ListItemIcon>
                <BusinessIcon />
              </ListItemIcon>
              <ListItemText primary="Veikiančių įmonių skaičius" />
            </ListItemButton>
            <ListItemButton LinkComponent={Link} to="/emigration">
              <ListItemIcon>
                <FlightTakeoffIcon />
              </ListItemIcon>
              <ListItemText primary="Emigracija" />
            </ListItemButton>
            <ListItemButton LinkComponent={Link} to="/birth-rate">
              <ListItemIcon>
                <ChildFriendlyIcon />
              </ListItemIcon>
              <ListItemText primary="Gimstamumas" />
            </ListItemButton>
          </Collapse>
          <ListItemButton LinkComponent={Link} to="/sources">
            <ListItemIcon>
              <AddChartIcon />
            </ListItemIcon>
            <ListItemText primary="Duomenu šaltiniai" />
          </ListItemButton>
        </List>
      </Box>
    </Drawer>
  );
};
