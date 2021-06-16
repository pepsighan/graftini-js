import { Button, Tooltip, ButtonGroup } from '@chakra-ui/react';
import {
  AlignBottomIcon,
  AlignCenterHorizontallyIcon,
  AlignCenterVerticallyIcon,
  AlignLeftIcon,
  AlignRightIcon,
  AlignTopIcon,
  SpaceBetweenHorizontallyIcon,
  SpaceEvenlyHorizontallyIcon,
} from '@modulz/radix-icons';
import { Controller, useFormContext } from 'react-hook-form';

export default function AlignmentInput() {
  const { control } = useFormContext();

  const alignOptions = [
    {
      value: 'flex-start',
      label: <AlignTopIcon />,
      tooltip: 'Align Top',
    },
    {
      value: 'center',
      label: <AlignCenterHorizontallyIcon />,
      tooltip: 'Align Middle',
    },
    {
      value: 'flex-end',
      label: <AlignBottomIcon />,
      tooltip: 'Align Bottom',
    },
  ];

  const justifyOptions = [
    {
      value: 'flex-start',
      label: <AlignLeftIcon />,
      tooltip: 'Align Left',
    },
    {
      value: 'center',
      label: <AlignCenterVerticallyIcon />,
      tooltip: 'Align Center',
    },
    {
      value: 'flex-end',
      label: <AlignRightIcon />,
      tooltip: 'Align Right',
    },
  ];

  const otherJustifyOptions = [
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
  ];

  return (
    <ButtonGroup isAttached display="flex">
      <Controller
        name="justifyContent"
        control={control}
        render={({ field }) => (
          <SegmentedInput options={justifyOptions} value={field.value} onChange={field.onChange} />
        )}
      />
      <Controller
        name="alignItems"
        control={control}
        render={({ field }) => (
          <SegmentedInput options={alignOptions} value={field.value} onChange={field.onChange} />
        )}
      />
      <Controller
        name="justifyContent"
        control={control}
        render={({ field }) => (
          <SegmentedInput
            options={otherJustifyOptions}
            value={field.value}
            onChange={field.onChange}
          />
        )}
      />
    </ButtonGroup>
  );
}

function SegmentedInput({ options, value, onChange }) {
  return (
    <>
      {options.map(({ value: valueOpt, label, tooltip, ...rest }) => {
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
              {...rest}
            >
              {label}
            </Button>
          </Tooltip>
        );
      })}
    </>
  );
}
