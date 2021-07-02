import { ToggleButton, ToggleButtonGroup } from '@material-ui/core';
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
  justify({
    value: 'space-between',
    icon: <SpaceBetweenHorizontallyIcon />,
  }),
  justify({
    value: 'space-evenly',
    icon: <SpaceEvenlyHorizontallyIcon />,
  }),
];

export default function AlignmentInput() {
  const { control, setValue } = useFormContext();
  const justifyContent = useWatch({ control, name: 'justifyContent' });
  const alignItems = useWatch({ control, name: 'alignItems' });
  const direction = useWatch({ control, name: 'flexDirection' });

  const selections = useMemo(
    () => [`justify=${justifyContent}`, `align=${alignItems}`],
    [alignItems, justifyContent]
  );

  const options = useMemo(
    () =>
      [
        direction === 'column' ? align(alignLeft) : null,
        direction === 'column' ? align(alignCenter) : null,
        direction === 'column' ? align(alignRight) : null,
        justify(direction === 'column' ? alignTop : alignLeft),
        justify(direction === 'column' ? alignMiddle : alignCenter),
        justify(direction === 'column' ? alignBottom : alignRight),
        direction === 'row' ? align(alignTop) : null,
        direction === 'row' ? align(alignMiddle) : null,
        direction === 'row' ? align(alignBottom) : null,
        ...otherJustifyOptions,
      ].filter((it) => !!it),
    [direction]
  );

  const onChange = useCallback(
    (_, newSelections) => {
      if (newSelections.length <= selections.length) {
        // Selection was removed.
        // We do not allow that.
        return;
      }

      // New selection was added. Need to remove and older one that
      // is replaced by it.
      const newSelection = newSelections.pop();
      const split = newSelection.split('=');

      // Update the form state.
      if (split[0] === 'align') {
        setValue('alignItems', split[1], { shouldDirty: true, shouldValidate: true });
      } else {
        setValue('justifyContent', split[1], { shouldDirty: true, shouldValidate: true });
      }
    },
    [selections, setValue]
  );

  return (
    <ToggleButtonGroup
      sx={{ justifyContent: 'center' }}
      value={selections.filter((it) => !!it)}
      onChange={onChange}
    >
      {options.map((opt) => (
        <ToggleButton
          key={`${opt.type}=${opt.value}`}
          value={`${opt.type}=${opt.value}`}
          sx={{ padding: 1.2 }}
        >
          {opt.icon}
        </ToggleButton>
      ))}
    </ToggleButtonGroup>
  );
}

function align(obj) {
  return {
    ...obj,
    type: 'align',
  };
}

function justify(obj) {
  return {
    ...obj,
    type: 'justify',
  };
}
