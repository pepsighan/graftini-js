import { mdiAlphaACircle, mdiArrowLeftRight, mdiArrowUpDown, mdiEye, mdiEyeOff } from '@mdi/js';
import Icon from 'components/Icon';
import SegmentedInput from './SegmentedInput';

export function OverflowInputX({ name }) {
  return (
    <SegmentedInput
      name={name}
      isFullWidth
      options={[
        { value: 'visible', label: <Icon icon={mdiEye} fontSize="md" />, tooltip: 'Show' },
        { value: 'hidden', label: <Icon icon={mdiEyeOff} fontSize="md" />, tooltip: 'Hide' },
        {
          value: 'scroll',
          label: <Icon icon={mdiArrowLeftRight} fontSize="md" />,
          tooltip: 'Scroll',
        },
        { value: 'auto', label: <Icon icon={mdiAlphaACircle} fontSize="xl" />, tooltip: 'Auto' },
      ]}
    />
  );
}

export function OverflowInputY({ name }) {
  return (
    <SegmentedInput
      name={name}
      isFullWidth
      options={[
        { value: 'visible', label: <Icon icon={mdiEye} fontSize="md" />, tooltip: 'Show' },
        { value: 'hidden', label: <Icon icon={mdiEyeOff} fontSize="md" />, tooltip: 'Hide' },
        {
          value: 'scroll',
          label: <Icon icon={mdiArrowUpDown} fontSize="md" />,
          tooltip: 'Scroll',
        },
        {
          value: 'auto',
          label: <Icon icon={mdiAlphaACircle} fontSize="xl" />,
          tooltip: 'Auto',
        },
      ]}
    />
  );
}
