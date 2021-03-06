import { BorderRadius, BorderSide } from '@graftini/bricks';
import { Divider, MenuItem, Stack, Typography } from '@material-ui/core';
import { OptionsProps } from 'canvasComponents';
import { useCallback } from 'react';
import { boxTags } from 'utils/constants';
import { parsePositiveInteger } from 'utils/parser';
import { BoxComponentProps } from './Box';
import AlignmentInput from './form/AlignmentInput';
import BackgroundImageInput from './form/BackgroundImageInput';
import BorderInput, { defaultBorderSide } from './form/BorderInput';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPickerInput from './form/ColorPickerInput';
import DirectionInput from './form/DirectionInput';
import FlexPropertiesInput from './form/FlexPropertiesInput';
import MarginInput from './form/MarginInput';
import OpacityInput from './form/OpacityInput';
import PaddingInput from './form/PaddingInput';
import RadiusInput from './form/RadiusInput';
import SegmentedInput from './form/SegmentedInput';
import SelectInput from './form/SelectInput';
import SizeInput from './form/SizeInput';
import SizeLimitInput from './form/SizeLimitInput';
import TextInput from './form/TextInput';
import SyncResize, { transformToRawHeight, transformToRawWidth } from './SyncResize';

export type RawDimension = {
  size: number;
  unit: 'px' | '%';
  toggle?: 'auto';
};

type RawDimensionLimit = {
  size: number;
  unit: 'px' | '%';
};

type BoxOptionsFields = BoxComponentProps & {
  borderRadius: BorderRadius & { toggle: 'all' | 'each' };
  borderSide: BorderSide;
  widthRaw: RawDimension;
  heightRaw: RawDimension;
  minWidthRaw: RawDimensionLimit;
  maxWidthRaw: RawDimensionLimit;
  minHeightRaw: RawDimensionLimit;
  maxHeightRaw: RawDimensionLimit;
};

export default function BoxOptions({ componentId }: OptionsProps) {
  const CF = CanvasForm as CanvasFormComponent<BoxComponentProps, BoxOptionsFields>;

  return (
    <CF
      componentId={componentId}
      onInitialize={useCallback(
        (initialState) => ({
          ...initialState,
          widthRaw: transformToRawWidth(initialState.width),
          heightRaw: transformToRawHeight(initialState.height),
          minWidthRaw: {
            size: (initialState.minWidth as any)?.size,
            unit: (initialState.minWidth as any)?.unit ?? 'px',
          },
          maxWidthRaw: {
            size: (initialState.maxWidth as any)?.size,
            unit: (initialState.maxWidth as any)?.unit ?? 'px',
          },
          minHeightRaw: {
            size: (initialState.minHeight as any)?.size,
            unit: (initialState.minHeight as any)?.unit ?? 'px',
          },
          maxHeightRaw: {
            size: (initialState.maxHeight as any)?.size,
            unit: (initialState.maxHeight as any)?.unit ?? 'px',
          },
          borderRadius: {
            ...initialState.borderRadius,
            toggle: hasBorderRadiusAllOrEachToggle(initialState.borderRadius),
          },
          borderSide: initialState.border?.top ?? {
            ...(defaultBorderSide as BorderSide),
            // If the border is not defined, then it has zero width.
            width: 0,
          },
        }),
        []
      )}
      onSync={useCallback(
        (
          props: BoxComponentProps,
          {
            borderRadius,
            borderSide,
            widthRaw,
            heightRaw,
            minWidthRaw,
            maxWidthRaw,
            minHeightRaw,
            maxHeightRaw,
            width,
            height,
            minWidth,
            maxWidth,
            minHeight,
            maxHeight,
            ...rest
          }: BoxOptionsFields
        ) => {
          // Copy the matching states as is.
          Object.keys(rest).forEach((key) => {
            props[key] = rest[key];
          });

          // Other states needs to be transformed back to the standard form.
          props.borderRadius ??= {} as any;
          props.borderRadius.topLeft = borderRadius.topLeft;
          props.borderRadius.topRight = borderRadius.topRight;
          props.borderRadius.bottomRight = borderRadius.bottomRight;
          props.borderRadius.bottomLeft = borderRadius.bottomLeft;

          if (borderSide.width) {
            props.border = {
              top: borderSide,
              right: borderSide,
              bottom: borderSide,
              left: borderSide,
            };
          } else {
            props.border = null;
          }

          assignDimension(props, 'width', widthRaw);
          assignDimension(props, 'height', heightRaw);
          parseLimitDimension(props, 'minWidth', minWidthRaw, true);
          parseLimitDimension(props, 'maxWidth', maxWidthRaw, false);
          parseLimitDimension(props, 'minHeight', minHeightRaw, true);
          parseLimitDimension(props, 'maxHeight', maxHeightRaw, false);
        },
        []
      )}
    >
      <SyncResize componentId={componentId} />

      <Stack spacing={2} mt={2}>
        <AlignmentSection componentId={componentId} />
        <Divider />
        <PropertiesSection />
        <Divider />
        <LayoutSection />
        <Divider />
        {/* We do not know what overflow means and what needs to be shown in the UI
        right now. https://github.com/graftini/graftini/issues/343 */}
        {/* <OverflowSection />
        <Divider /> */}
        <FlexSection />
        <Divider />
        <AppearanceSection />
        <Divider />
        <BorderSection />
      </Stack>
    </CF>
  );
}

function AlignmentSection({ componentId }) {
  return (
    <>
      <AlignmentInput />
      <DirectionInput componentId={componentId} />
    </>
  );
}

function PropertiesSection() {
  return (
    <>
      <TextInput name="name" label="Name" />
      <SelectInput name="tag" label="Tag">
        {boxTags.map((tag) => (
          <MenuItem key={tag} value={tag}>
            {tag}
          </MenuItem>
        ))}
      </SelectInput>
    </>
  );
}

function FlexSection() {
  return (
    <>
      <Typography variant="subtitle2">Flex</Typography>
      <FlexPropertiesInput />
      <SegmentedInput
        name="flexWrap"
        options={[
          { value: 'wrap', label: 'Wrap' },
          { value: 'nowrap', label: 'No Wrap' },
        ]}
      />
    </>
  );
}

function LayoutSection() {
  return (
    <>
      <Typography variant="subtitle2">Layout</Typography>
      <SizeInput name="widthRaw" label="Width" />
      <SizeInput name="heightRaw" label="Height" />
      <SizeLimitInput name="minWidthRaw" label="Min W" />
      <SizeLimitInput name="maxWidthRaw" label="Max W" />
      <SizeLimitInput name="minHeightRaw" label="Min H" />
      <SizeLimitInput name="maxHeightRaw" label="Max W" />
      <PaddingInput name="padding" />
      <MarginInput name="margin" />
    </>
  );
}

// function OverflowSection() {
//   return (
//     <>
//       <Typography variant="subtitle2">Overflow</Typography>
//       <OverflowInput name="overflow" />
//     </>
//   );
// }

function AppearanceSection() {
  return (
    <>
      <Typography variant="subtitle2">Appearance</Typography>
      <ColorPickerInput name="color" label="Fill" />
      <BackgroundImageInput />
      <OpacityInput name="opacity" />
    </>
  );
}

function BorderSection() {
  return (
    <>
      <Typography variant="subtitle2">Border</Typography>
      <BorderInput name="borderSide" />
      <RadiusInput name="borderRadius" />
    </>
  );
}

export function assignDimension<T extends object>(props: T, field: string, raw: RawDimension) {
  if (raw.toggle) {
    props[field] = raw.toggle;
    return;
  }

  if (typeof props[field] !== 'object') {
    props[field] = {};
  }

  props[field].size = raw.size;
  props[field].unit = raw.unit;
}

function parseLimitDimension(
  props: BoxComponentProps,
  field: string,
  raw: RawDimensionLimit,
  isMin: boolean
) {
  const size = parsePositiveInteger(raw.size);
  if (typeof size === 'number') {
    if (typeof props[field] !== 'object') {
      props[field] = {};
    }

    props[field].size = size;
    props[field].unit = raw.unit;
    return;
  }

  props[field] = isMin ? 'auto' : 'none';
}

function hasBorderRadiusAllOrEachToggle(borderRadius: BorderRadius): 'all' | 'each' {
  if (
    borderRadius.bottomLeft === borderRadius.bottomRight &&
    borderRadius.bottomLeft === borderRadius.topLeft &&
    borderRadius.topLeft === borderRadius.topRight
  ) {
    return 'all';
  }

  return 'each';
}
