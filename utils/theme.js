import { theme, extendTheme } from '@chakra-ui/react';

export default extendTheme({
  colors: {
    primary: theme.colors.blue,
    // The colors used in the previews of the components when dragging.
    preview: {
      light: theme.colors.blue[200],
      dark: theme.colors.blue[300],
    },
  },
});
