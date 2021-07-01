import { colors, createTheme } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';

export default createTheme({
  palette: {
    primary: colors.blue,
    secondary: colors.grey,
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
        disableRipple: true,
        size: 'small',
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
    MuiButtonGroup: {
      defaultProps: {
        disableRipple: true,
        size: 'small',
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
    MuiTextField: {
      defaultProps: {
        size: 'small',
        variant: 'outlined',
        autoComplete: 'off',
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
          fontSize: '0.875rem',
        },
        input: {
          paddingTop: 6,
          paddingBottom: 6,
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: '0.875rem',
        },
        outlined: {
          paddingTop: 6,
          paddingBottom: 6,
        },
      },
    },
    MuiDialogTitle: {
      styleOverrides: {
        root: {
          fontSize: '1rem',
          padding: '8px 16px',
        },
      },
    },
    MuiDialogContent: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
        },
      },
    },
    MuiDialogActions: {
      styleOverrides: {
        root: {
          padding: '8px 16px',
        },
      },
    },
  },
});
