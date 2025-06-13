// src/theme.js
import { createTheme } from "@mui/material/styles";

const theme = createTheme({
  palette: {
    primary: {
      main: "#3f51b5",    // koyu mavi
      light: "#757de8",   // açık mavi
      contrastText: "#fff",
    },
    secondary: {
      main: "#ff9800",    // turuncu
      contrastText: "#000",
    },
    background: {
      default: "#f5f7fb", // ana sayfa arkaplanı
      paper: "#ffffff",   // kart arkaplanı
    },
  },
  typography: {
    fontFamily: `"Roboto", sans-serif`,
    h4: { fontWeight: 600 },
    h6: { fontWeight: 500 },
  },
});

export default theme;
