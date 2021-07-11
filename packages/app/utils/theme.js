import { colors, createTheme } from '@material-ui/core';
import { grey } from '@material-ui/core/colors';
import typography from './typography';

export default createTheme({
  palette: {
    primary: colors.blue,
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
  },
});
