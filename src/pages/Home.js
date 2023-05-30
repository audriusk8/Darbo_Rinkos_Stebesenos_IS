import React from "react";
import { Box, Container, Typography } from "@mui/material";

export const Home = () => {
  return (
    <Box
      sx={{
        color: "white",
        p: 4,
        pt: "5%",
        ":before": {
          content: "''",
          position: "absolute",
          top: 0,
          left: 0,
          width: "100%",
          height: "100%",
          backgroundImage: "url(home.png)",
          filter: "brightness(0.2)",
          zIndex: -1,
        },
      }}
    >
      <Container maxWidth="lg">
        <Typography variant="h2" gutterBottom>
          Darbo Rinkos Stebėsenos Informacinė Sistema
        </Typography>
        <Typography variant="h6" gutterBottom>
          Ši sistema yra skirta stebėti darbo
          rinkos tendencijas, kaip darbo vietų skaičius, darbo užmokestis,
          nedarbo lygis, darbo jėgos pasiūla ir paklausa ir kt. Šios sistemos
          taip pat gali sekti sezonines tendencijas ir kitus rodiklius, kurie
          gali turėti įtakos darbo rinkai.
        </Typography>
        <Typography variant="h6">
          Ši sistema stebi darbo rinką naudojant įvairius duomenų šaltinius,
          įskaitant oficialius statistikos departamentus, įmonių ir organizacijų
          ataskaitas, anketas ir tyrimus, o taip pat ir socialinius tinklus, kad
          gautų informaciją apie aktualią darbo rinkos situaciją. Taip pat ši
          sistema gali analizuoti duomenis, kad nustatytų darbo rinkos
          tendencijas ir prognozuotų galimas ateities scenarijus. Tai yra
          naudinga valstybinėms institucijoms, ekonomikos analitikams, verslo
          lyderiams ir kitiems asmenims, kuriems rūpi stebėti ir suprasti darbo
          rinkos situaciją.
        </Typography>
      </Container>
    </Box>
  );
};
