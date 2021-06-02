import {
  mdiAlignHorizontalCenter,
  mdiAlignHorizontalLeft,
  mdiAlignHorizontalRight,
  mdiArrowSplitVertical,
  mdiSpaceInvaders,
} from '@mdi/js';
import Icon from 'components/Icon';
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
          label: <Icon icon={mdiAlignHorizontalLeft} fontSize="lg" />,
          tooltip: 'Flex Start',
        },
        {
          value: 'center',
          label: <Icon icon={mdiAlignHorizontalCenter} fontSize="lg" />,
          tooltip: 'Center',
        },
        {
          value: 'flex-end',
          label: <Icon icon={mdiAlignHorizontalRight} fontSize="lg" />,
          tooltip: 'Flex End',
        },
        {
          value: 'space-between',
          label: <Icon icon={mdiArrowSplitVertical} fontSize="lg" />,
          tooltip: 'Space Between',
        },
        {
          value: 'space-evenly',
          label: <Icon icon={mdiSpaceInvaders} fontSize="lg" />,
          tooltip: 'Space Evenly',
        },
      ]}
    />
  );
}
