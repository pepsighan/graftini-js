import { createTheme, colors } from '@material-ui/core';

const blue = {
  ...colors.indigo,
  50: '#b780ff',
  100: '#a966ff',
  200: '#9a4dff',
  300: '#8c33ff',
  400: '#7d1aff',
  500: '#6f00ff',
  600: '#6400e6',
  700: '#5900cc',
  800: '#4e00b3',
  900: '#430099',
};

export default createTheme({
  palette: {
    primary: blue,
  },
  typography: {
    fontFamily: '"Inter", "Roboto", "Helvetica", "Arial", sans-serif',
  },
});
