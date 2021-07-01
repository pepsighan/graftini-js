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
    MuiTab: {
      styleOverrides: {
        root: {
          textTransform: 'none',
        },
      },
    },
    MuiMenu: {
      defaultProps: {
        elevation: 1,
        MenuListProps: {
          dense: true,
        },
      },
      styleOverrides: {
        list: {
          padding: 0,
        },
      },
    },
    MuiMenuItem: {
      defaultProps: {},
      styleOverrides: {
        root: {
          fontSize: '0.875rem',
          cursor: 'auto',
        },
      },
    },
  },
});
