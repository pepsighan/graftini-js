import { BorderRadius } from '@graftini/bricks';
import { useEditorStore } from '@graftini/graft';
import { Divider, MenuItem, Stack, Typography } from '@material-ui/core';
import { OptionsProps } from 'canvasComponents';
import { useCallback } from 'react';
import { boxTags } from 'utils/constants';
import { parsePositiveInteger } from 'utils/parser';
import { BoxComponentProps } from './Box';
import AlignmentInput from './form/AlignmentInput';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import DirectionInput from './form/DirectionInput';
import FlexProperties from './form/FlexProperties';
import MarginField from './form/MarginField';
import OpacityInput from './form/OpacityInput';
import OverflowInput from './form/OverflowInput';
import PaddingField from './form/PaddingField';
import RadiusInput from './form/RadiusInput';
import SegmentedInput from './form/SegmentedInput';
import SelectInput from './form/SelectInput';
import SizeInput from './form/SizeInput';
import SizeLimitInput from './form/SizeLimitInput';
import TextInput from './form/TextInput';
import SyncResize, { transformToRawHeight, transformToRawWidth } from './SyncResize';

type RawDimension = {
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
  widthRaw: RawDimension;
  heightRaw: RawDimension;
  minWidthRaw: RawDimensionLimit;
  maxWidthRaw: RawDimensionLimit;
  minHeightRaw: RawDimensionLimit;
  maxHeightRaw: RawDimensionLimit;
};

export default function BoxOptions({ componentId }: OptionsProps) {
  const CF = CanvasForm as CanvasFormComponent<BoxComponentProps, BoxOptionsFields>;
  const immerSetEditor = useEditorStore(useCallback((state) => state.immerSet, []));

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
        }),
        []
      )}
      onSync={useCallback(
        (
          props: BoxComponentProps,
          {
            borderRadius,
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
          // Sync the append direction based on the flex direction.
          immerSetEditor((state) => {
            state.componentMap[componentId].childAppendDirection =
              rest.flexDirection === 'column' ? 'vertical' : 'horizontal';
          });

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

          assignDimension(props, 'width', widthRaw);
          assignDimension(props, 'height', heightRaw);
          parseLimitDimension(props, 'minWidth', minWidthRaw, true);
          parseLimitDimension(props, 'maxWidth', maxWidthRaw, false);
          parseLimitDimension(props, 'minHeight', minHeightRaw, true);
          parseLimitDimension(props, 'maxHeight', maxHeightRaw, false);
        },
        [componentId, immerSetEditor]
      )}
    >
      <SyncResize componentId={componentId} />

      <Stack spacing={2} mt={2}>
        <AlignmentSection />
        <Divider />
        <PropertiesSection />
        <Divider />
        <LayoutSection />
        <Divider />
        <OverflowSection />
        <Divider />
        <FlexSection />
        <Divider />
        <AppearanceSection />
        <Divider />
        <BorderSection />
      </Stack>
    </CF>
  );
}

function AlignmentSection() {
  return (
    <>
      <AlignmentInput />
      <DirectionInput />
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
      <FlexProperties />
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
      <SizeInput name="widthRaw" label="Width" isWidth />
      <SizeInput name="heightRaw" label="Height" isWidth={false} />
      <SizeLimitInput name="minWidthRaw" label="Min W" />
      <SizeLimitInput name="maxWidthRaw" label="Max W" />
      <SizeLimitInput name="minHeightRaw" label="Min H" />
      <SizeLimitInput name="maxHeightRaw" label="Max W" />
      <PaddingField name="padding" />
      <MarginField name="margin" />
    </>
  );
}

function OverflowSection() {
  return (
    <>
      <Typography variant="subtitle2">Overflow</Typography>
      <OverflowInput name="overflow" />
    </>
  );
}

function AppearanceSection() {
  return (
    <>
      <Typography variant="subtitle2">Appearance</Typography>
      <ColorPicker name="color" label="Fill" />
      <OpacityInput name="opacity" />
    </>
  );
}

function BorderSection() {
  return (
    <>
      <Typography variant="subtitle2">Border</Typography>
      <RadiusInput name="borderRadius" />
    </>
  );
}

function assignDimension(props: BoxComponentProps, field: string, raw: RawDimension) {
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
