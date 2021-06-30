import { colors, createTheme } from '@material-ui/core';

export default createTheme({
  palette: {
    primary: colors.blue,
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
