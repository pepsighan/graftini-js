import { DraftStyleMap } from 'draft-js';
import theme from 'utils/theme';

export enum StyleOption {
  TextSelection = 'TEXT_SELECTION',
}

const styleMap: DraftStyleMap = {
  [StyleOption.TextSelection]: {
    backgroundColor: theme.palette.primary[200],
  },
};

export default styleMap;
