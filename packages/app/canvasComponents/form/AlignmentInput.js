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
import { useMemo } from 'react';
import { Controller, useFormContext, useWatch } from 'react-hook-form';

const alignTop = {
  value: 'flex-start',
  label: <AlignTopIcon />,
  tooltip: 'Align Top',
};

const alignMiddle = {
  value: 'center',
  label: <AlignCenterHorizontallyIcon />,
  tooltip: 'Align Middle',
};

const alignBottom = {
  value: 'flex-end',
  label: <AlignBottomIcon />,
  tooltip: 'Align Bottom',
};

const alignLeft = {
  value: 'flex-start',
  label: <AlignLeftIcon />,
  tooltip: 'Align Left',
};

const alignCenter = {
  value: 'center',
  label: <AlignCenterVerticallyIcon />,
  tooltip: 'Align Center',
};

const alignRight = {
  value: 'flex-end',
  label: <AlignRightIcon />,
  tooltip: 'Align Right',
};

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

export default function AlignmentInput() {
  const { control } = useFormContext();
  const direction = useWatch({ control, name: 'flexDirection' });

  const alignOptions = useMemo(
    () => [
      direction === 'row' ? alignTop : alignLeft,
      direction === 'row' ? alignMiddle : alignCenter,
      direction === 'row' ? alignBottom : alignRight,
    ],
    [direction]
  );

  const justifyOptions = useMemo(
    () => [
      direction === 'column' ? alignTop : alignLeft,
      direction === 'column' ? alignMiddle : alignCenter,
      direction === 'column' ? alignBottom : alignRight,
    ],
    [direction]
  );

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
