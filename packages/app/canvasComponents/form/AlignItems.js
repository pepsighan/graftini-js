import {
  mdiAlignVerticalBottom,
  mdiAlignVerticalCenter,
  mdiAlignVerticalTop,
  mdiFormatAlignBottom,
  mdiStretchToPageOutline,
} from '@mdi/js';
import Icon from 'components/Icon';
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
          label: <Icon icon={mdiAlignVerticalTop} fontSize="lg" />,
          tooltip: 'Flex Start',
        },
        {
          value: 'center',
          label: <Icon icon={mdiAlignVerticalCenter} fontSize="lg" />,
          tooltip: 'Center',
        },
        {
          value: 'flex-end',
          label: <Icon icon={mdiAlignVerticalBottom} fontSize="lg" />,
          tooltip: 'Flex End',
        },
        {
          value: 'stretch',
          label: <Icon icon={mdiStretchToPageOutline} fontSize="lg" />,
          tooltip: 'Stretch',
        },
        {
          value: 'baseline',
          label: <Icon icon={mdiFormatAlignBottom} fontSize="lg" />,
          tooltip: 'Baseline',
        },
      ]}
    />
  );
}
