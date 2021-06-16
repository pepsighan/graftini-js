import { Button, ButtonGroup, Tooltip } from '@chakra-ui/react';
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
import { Controller, useFormContext, useWatch } from 'react-hook-form';

const alignTop = {
  label: <AlignTopIcon />,
  tooltip: 'Align Top',
};

const alignMiddle = {
  label: <AlignCenterHorizontallyIcon />,
  tooltip: 'Align Middle',
};

const alignBottom = {
  label: <AlignBottomIcon />,
  tooltip: 'Align Bottom',
};

const alignLeft = {
  label: <AlignLeftIcon />,
  tooltip: 'Align Left',
};

const alignCenter = {
  label: <AlignCenterVerticallyIcon />,
  tooltip: 'Align Center',
};

const alignRight = {
  label: <AlignRightIcon />,
  tooltip: 'Align Right',
};

export default function AlignmentInput() {
  const { control } = useFormContext();
  const direction = useWatch({ control, name: 'flexDirection' });

  const alignOptions = [
    {
      value: 'flex-start',
      ...(direction === 'row' ? alignTop : alignLeft),
    },
    {
      value: 'center',
      ...(direction === 'row' ? alignMiddle : alignCenter),
    },
    {
      value: 'flex-end',
      ...(direction === 'row' ? alignBottom : alignRight),
    },
  ];

  const justifyOptions = [
    {
      value: 'flex-start',
      ...(direction === 'column' ? alignTop : alignLeft),
    },
    {
      value: 'center',
      ...(direction === 'column' ? alignMiddle : alignCenter),
    },
    {
      value: 'flex-end',
      ...(direction === 'column' ? alignBottom : alignRight),
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

  const alignItems = (
    <Controller
      name="alignItems"
      control={control}
      render={({ field }) => (
        <SegmentedInput options={alignOptions} value={field.value} onChange={field.onChange} />
      )}
    />
  );

  return (
    <ButtonGroup isAttached display="flex">
      {direction === 'column' && alignItems}

      <Controller
        name="justifyContent"
        control={control}
        render={({ field }) => (
          <SegmentedInput options={justifyOptions} value={field.value} onChange={field.onChange} />
        )}
      />

      {direction === 'row' && alignItems}

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
