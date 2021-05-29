import { extendTheme, theme } from '@chakra-ui/react';

export default extendTheme({
  colors: {
    primary: theme.colors.blue,
    // The colors used in the previews of the components when dragging.
    preview: {
      light: theme.colors.blue[200],
      dark: theme.colors.blue[300],
    },
    gray: {
      50: '#FCFCFC',
      100: '#F5F5F5',
      200: '#EFEFEF',
      300: '#E8E8E8',
      400: '#D5D5D5',
      500: '#AEAEAE',
      600: '#808080',
      700: '#555555',
      800: '#373737',
      900: '#202020',
    },
  },
  shadows: {
    xs: '0 0 0 1px rgba(0, 0, 0, 0.05)',
    sm: '0 1px 2px 0 rgba(0, 0, 0, 0.05)',
    base: '0 1px 3px 0 rgba(0, 0, 0, 0.1), 0 1px 2px 0 rgba(0, 0, 0, 0.06)',
    md: '0 4px 6px -1px rgba(0, 0, 0, 0.1), 0 2px 4px -1px rgba(0, 0, 0, 0.06)',
    lg: '0 10px 15px -3px rgba(0, 0, 0, 0.1), 0 4px 6px -2px rgba(0, 0, 0, 0.05)',
    xl: '0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
    '2xl': '0 25px 50px -12px rgba(0, 0, 0, 0.25)',
    outline: 'none',
    inner: 'inset 0 2px 4px 0 rgba(0,0,0,0.06)',
    none: 'none',
    'dark-lg':
      'rgba(0, 0, 0, 0.1) 0px 0px 0px 1px, rgba(0, 0, 0, 0.2) 0px 5px 10px, rgba(0, 0, 0, 0.4) 0px 15px 40px',
  },
  fonts: {
    heading: `"Inter", ${theme.fonts.heading}`,
    body: `"Inter", ${theme.fonts.body}`,
  },
  fontWeights: {
    light: 300,
    normal: 400,
    semibold: 600,
    bold: 700,
    // Only the above font weights are needed. Rest are not present
    // in the font resource.
    medium: '',
    hairline: '',
    thin: '',
    extrabold: '',
    black: '',
  },
  radii: {
    none: '0',
    sm: '2px',
    base: '4px',
    md: '4px',
    lg: '6px',
    xl: '8px',
    '2xl': '10px',
    '3xl': '12px',
    full: '100%',
  },
  styles: {
    global: {
      'html, body': {
        // The default font size is 14px.
        fontSize: 14,
      },
    },
  },
  components: {
    Button: {
      baseStyle: {
        fontWeight: 'semibold',
        borderRadius: 'base',
      },
    },
  },
});
