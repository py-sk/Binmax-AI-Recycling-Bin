import { createMuiTheme } from "@material-ui/core/styles";
import "typeface-comfortaa";

const theme = createMuiTheme({
  palette: {
    primary: {
      main: "#00695c",
    },
    secondary: {
      main: "#26c6da",
    },
  },
  typography: {
    fontFamily: [
      "Oswald",
      "Comfortaa",
      "Nunito Sans",
      "Montserrat",
      "typeface-comfortaa",
      "-apple-system",
      "BlinkMacSystemFont",
      '"Segoe UI"',
      "Roboto",
      '"Helvetica Neue"',
      "Arial",
      "sans-serif",
      '"Apple Color Emoji"',
      '"Segoe UI Emoji"',
      '"Segoe UI Symbol"',
    ].join(","),
  },
});

export default theme;
