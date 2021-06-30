import { colors, createTheme } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export default createTheme({
  palette: {
    primary: colors.blue,
    drawButton: {
      main: grey[500],
    },
  },
  typography: {
    fontSize: 14,
    fontFamily: 'Inter, Roboto, Helvetica, Arial, sans-serif',
    fontWeightMedium: 500,
  },
  components: {
    MuiButton: {
      defaultProps: {
        disableElevation: true,
      },
      styleOverrides: {
        root: {
          textTransform: 'initial',
          fontWeight: 'medium',
        },
      },
    },
    MuiButtonBase: {
      defaultProps: {
        disableRipple: true,
      },
    },
    MuiLink: {
      defaultProps: {
        underline: 'none',
      },
    },
  },
});
