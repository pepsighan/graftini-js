import { Box, ToggleButton, ToggleButtonGroup } from '@material-ui/core';
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
import { useFormContext, useWatch } from 'react-hook-form';

const alignTop = {
  value: 'flex-start',
  icon: <AlignTopIcon />,
};

const alignMiddle = {
  value: 'center',
  icon: <AlignCenterHorizontallyIcon />,
};

const alignBottom = {
  value: 'flex-end',
  icon: <AlignBottomIcon />,
};

const alignLeft = {
  value: 'flex-start',
  icon: <AlignLeftIcon />,
};

const alignCenter = {
  value: 'center',
  icon: <AlignCenterVerticallyIcon />,
};

const alignRight = {
  value: 'flex-end',
  icon: <AlignRightIcon />,
};

const otherJustifyOptions = [
  {
    value: 'space-between',
    icon: <SpaceBetweenHorizontallyIcon />,
  },
  {
    value: 'space-evenly',
    icon: <SpaceEvenlyHorizontallyIcon />,
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
    <Box sx={{ display: 'flex', justifyContent: 'center' }}>
      {direction === 'column' && alignItemsToggle}
      <SegmentedInput options={justifyOptions} value={justifyContent} onChange={onJustifyUpdate} />
      {direction === 'row' && alignItemsToggle}
      <SegmentedInput
        options={otherJustifyOptions}
        value={justifyContent}
        onChange={onJustifyUpdate}
      />
    </Box>
  );
}

function SegmentedInput({ options, value, onChange }) {
  return (
    <ToggleButtonGroup
      value={value}
      onChange={(_, value) => onChange(value)}
      exclusive
      sx={{
        justifyContent: 'center',
        '& .MuiToggleButtonGroup-grouped': {
          border: 0,
        },
      }}
    >
      {options.map(({ value, icon }) => (
        <ToggleButton key={value} value={value} style={{ borderRadius: 0 }} sx={{ padding: 1.2 }}>
          {icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}
