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
import { useCallback, useMemo } from 'react';
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
  const { control, setValue } = useFormContext();
  const justifyContent = useWatch({ control, name: 'justifyContent' });
  const alignItems = useWatch({ control, name: 'alignItems' });
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

  const onJustifyUpdate = useCallback(
    (value) => {
      setValue('justifyContent', value, { shouldDirty: true, shouldValidate: true });
    },
    [setValue]
  );

  const onAlignUpdate = useCallback(
    (value) => {
      setValue('alignItems', value, { shouldDirty: true, shouldValidate: true });
    },
    [setValue]
  );

  const alignItemsToggle = (
    <SegmentedInput options={alignOptions} value={alignItems} onChange={onAlignUpdate} />
  );

  return (
    <ButtonGroup isAttached display="flex">
      {direction === 'column' && alignItemsToggle}

      <SegmentedInput options={justifyOptions} value={justifyContent} onChange={onJustifyUpdate} />

      {direction === 'row' && alignItemsToggle}

      <SegmentedInput
        options={otherJustifyOptions}
        value={justifyContent}
        onChange={onJustifyUpdate}
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
