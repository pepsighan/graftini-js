import { colors, createTheme } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import { navBarHeight } from './constants';
import typography from './typography';

const primaryColor = {
  50: '#e8e9ed',
  100: '#c6c8d2',
  200: '#a0a3b4',
  300: '#7a7e95',
  400: '#5e637f',
  500: '#414768',
  600: '#3b4060',
  700: '#323755',
  800: '#2a2f4b',
  900: '#1c203a',
  A100: '#7e8dff',
  A200: '#4b60ff',
  A400: '#1832ff',
  A700: '#001dfd',
};

export default createTheme({
  palette: {
    primary: primaryColor,
    secondary: colors.grey,
    drawButton: {
      main: grey[500],
    },
  },
  typography,
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
        sizeSmall: {
          fontSize: typography.subtitle2.fontSize,
        },
        sizeMedium: {
          fontSize: typography.subtitle1.fontSize,
        },
      },
    },
    MuiToggleButton: {
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
          fontSize: typography.subtitle2.fontSize,
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
    MuiInputBase: {
      styleOverrides: {
        sizeSmall: {
          fontSize: typography.subtitle2.fontSize,
        },
      },
    },
    MuiOutlinedInput: {
      styleOverrides: {
        root: {
          backgroundColor: 'white',
        },
        input: {
          paddingTop: 8,
          paddingBottom: 8,
        },
        inputSizeSmall: {
          paddingTop: 6,
          paddingBottom: 6,
        },
        multiline: {
          paddingTop: 6,
          paddingBottom: 6,

          '& .MuiOutlinedInput-input': {
            paddingTop: 0,
            paddingBottom: 0,
          },
        },
      },
    },
    MuiSelect: {
      styleOverrides: {
        select: {
          fontSize: typography.subtitle2.fontSize,
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
          fontSize: typography.subtitle1.fontSize,
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
    MuiCircularProgress: {
      defaultProps: {
        disableShrink: true,
      },
    },
    MuiTabs: {
      styleOverrides: {
        root: {
          '& .MuiTab-root': {
            color: 'inherit',
            paddingTop: 4,
            paddingBottom: 4,
            borderRadius: 4,
            '&.Mui-selected': {
              color: 'inherit',
              backgroundColor: colors.grey[200],
            },
          },
        },
        indicator: {
          // Do not show the underline unique to Material Design.
          display: 'none',
        },
      },
    },
    MuiPaper: {
      defaultProps: {
        variant: 'outlined',
      },
    },
    MuiAppBar: {
      defaultProps: {
        elevation: 0,
        color: 'inherit',
        position: 'sticky',
      },
      styleOverrides: {
        colorInherit: {
          border: 0,
          borderBottom: '1px solid',
          borderColor: grey[400],
          height: navBarHeight,
        },
      },
    },
  },
});
