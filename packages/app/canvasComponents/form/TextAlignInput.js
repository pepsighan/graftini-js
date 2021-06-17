import { Button, ButtonGroup, Tooltip } from '@chakra-ui/react';
import {
  TextAlignCenterIcon,
  TextAlignJustifyIcon,
  TextAlignLeftIcon,
  TextAlignRightIcon,
} from '@modulz/radix-icons';
import { Controller, useFormContext } from 'react-hook-form';

const options = [
  { value: 'left', icon: <TextAlignLeftIcon width={20} height={20} />, tooltip: 'Align Left' },
  {
    value: 'center',
    icon: <TextAlignCenterIcon width={20} height={20} />,
    tooltip: 'Align Center',
  },
  { value: 'right', icon: <TextAlignRightIcon width={20} height={20} />, tooltip: 'Align Right' },
  {
    value: 'justify',
    icon: <TextAlignJustifyIcon width={20} height={20} />,
    tooltip: 'Align Justify',
  },
];

export default function TextAlignInput({ name }) {
  const { control } = useFormContext();

  return (
    <ButtonGroup isAttached display="flex">
      <Controller
        name={name}
        control={control}
        render={({ field }) => (
          <SegmentedInput value={field.value} onChange={field.onChange} options={options} />
        )}
      />
    </ButtonGroup>
  );
}

function SegmentedInput({ options, value, onChange }) {
  return (
    <>
      {options.map(({ value: valueOpt, icon, tooltip }) => {
        return (
          <Tooltip key={valueOpt} label={tooltip}>
            <Button
              key={valueOpt}
              color={valueOpt === value ? 'primary.500' : 'gray.600'}
              onClick={() => onChange(valueOpt)}
              minWidth="auto"
              paddingInlineStart="unset"
              paddingInlineEnd="unset"
              flex={1}
            >
              {icon}
            </Button>
          </Tooltip>
        );
      })}
    </>
  );
}
