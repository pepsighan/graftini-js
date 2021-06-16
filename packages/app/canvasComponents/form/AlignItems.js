import {
  AlignBaselineIcon,
  AlignBottomIcon,
  AlignCenterHorizontallyIcon,
  AlignTopIcon,
  StretchVerticallyIcon,
} from '@modulz/radix-icons';
import SegmentedInput from './SegmentedInput';

// TODO: Need better icons to signify the action.
export default function AlignItems() {
  return (
    <SegmentedInput
      name="alignItems"
      size="md"
      isFullWidth
      options={[
        {
          value: 'flex-start',
          label: <AlignTopIcon />,
          tooltip: 'Flex Start',
        },
        {
          value: 'center',
          label: <AlignCenterHorizontallyIcon />,
          tooltip: 'Center',
        },
        {
          value: 'flex-end',
          label: <AlignBottomIcon />,
          tooltip: 'Flex End',
        },
        {
          value: 'stretch',
          label: <StretchVerticallyIcon />,
          tooltip: 'Stretch',
        },
        {
          value: 'baseline',
          label: <AlignBaselineIcon />,
          tooltip: 'Baseline',
        },
      ]}
    />
  );
}
