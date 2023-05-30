import { Box, Link, Paper } from "@mui/material";
import React from "react";

export const Sources = () => {
  return (
    <Box typography="body1" p={2}>
      <Paper sx={{ display: "flex", flexDirection: "column", p: 2, gap: 2 }}>
        <Link href="https://atvira.sodra.lt/lt-eur">
          Sodros statistinių duomenų portalas (sodra.lt)
        </Link>
        <Link href="https://uzt.lt/darbo-rinka/statistiniai-rodikliai/88">
          Užimtumo tarnybos statistiniai rodikliai (uzt.lt)
        </Link>
        <Link href="https://www.vmi.lt/evmi/administracin%C4%97-informacija">
          Valstybės mokesčių inspekcijos administracinė informacija (vmi.lt)
        </Link>
        <Link href="https://www.registrucentras.lt/atviri_duomenys">
          Registrų centro atviri duomenys (registrucentras.lt)
        </Link>
        <Link href="https://data.europa.eu/data/datasets?locale=lt">
          Europos Komisijos duomenų rinkiniai (europa.eu)
        </Link>
        <Link href="https://osp.stat.gov.lt/statistiniu-rodikliu-analize#/">
          Oficialios statistikos portalo statistiniai rodikliai (stat.gov.lt)
        </Link>
      </Paper>
    </Box>
  );
};
