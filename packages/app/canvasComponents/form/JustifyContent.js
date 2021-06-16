import {
  AlignCenterVerticallyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  SpaceBetweenHorizontallyIcon,
  SpaceEvenlyHorizontallyIcon,
} from '@modulz/radix-icons';
import SegmentedInput from './SegmentedInput';

// TODO: Need better icons to signify the action.
export default function JustifyContent() {
  return (
    <SegmentedInput
      name="justifyContent"
      size="md"
      isFullWidth
      options={[
        {
          value: 'flex-start',
          label: <AlignLeftIcon />,
          tooltip: 'Flex Start',
        },
        {
          value: 'center',
          label: <AlignCenterVerticallyIcon />,
          tooltip: 'Center',
        },
        {
          value: 'flex-end',
          label: <AlignRightIcon />,
          tooltip: 'Flex End',
        },
        {
          value: 'space-between',
          label: <SpaceBetweenHorizontallyIcon />,
          tooltip: 'Space Between',
        },
        {
          value: 'space-evenly',
          label: <SpaceEvenlyHorizontallyIcon />,
          tooltip: 'Space Evenly',
        },
      ]}
    />
  );
}
