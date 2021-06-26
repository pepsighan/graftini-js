import { Grid, GridItem, Text } from '@chakra-ui/layout';
import { Divider } from '@chakra-ui/react';
import {
  BorderRadius,
  DimensionMaxLimit,
  DimensionMinLimit,
  DimensionSize,
} from '@graftini/bricks';
import { useEditor } from '@graftini/graft';
import { OptionsProps } from 'canvasComponents';
import { useCallback } from 'react';
import { boxTags } from 'utils/constants';
import { parseInteger, parsePositiveFloat, parsePositiveInteger } from 'utils/parser';
import { BoxComponentProps, default as CanvasBox } from './Box';
import AlignmentInput from './form/AlignmentInput';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import DirectionInput from './form/DirectionInput';
import Labelled from './form/Labelled';
import NumberInputWithLabel from './form/NumberInputWithLabel';
import OpacityInput from './form/OpacityInput';
import OverflowInput from './form/OverflowInput';
import RadiusInput from './form/RadiusInput';
import SegmentedInput from './form/SegmentedInput';
import SelectInputWithLabel from './form/SelectInputWithLabel';
import SizeInput from './form/SizeInput';
import SizeLimitInput from './form/SizeLimitInput';
import SpacingField from './form/SpacingField';
import TextInputWithLabel from './form/TextInputWithLabel';
import SyncResize, { transformToRawHeight, transformToRawWidth } from './SyncResize';

type RawDimension = {
  size: string;
  unit: 'px' | '%';
  toggle?: 'auto';
};

type RawDimensionLimit = {
  size: string;
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

function parseDimension(dim: RawDimension): DimensionSize {
  if (dim.toggle) {
    return dim.toggle;
  }

  return {
    size: parsePositiveInteger(dim.size) || 0,
    unit: dim.unit,
  };
}

function parseLimitDimension(
  dim: RawDimensionLimit,
  isMin: boolean
): DimensionMinLimit | DimensionMaxLimit {
  const size = parsePositiveInteger(dim.size);
  if (typeof size === 'number') {
    return {
      size,
      unit: dim.unit,
    };
  }

  return isMin ? 'auto' : 'none';
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

export default function BoxOptions({ componentId }: OptionsProps) {
  const CF = CanvasForm as CanvasFormComponent<BoxComponentProps, BoxOptionsFields>;
  const { setChildAppendDirection } = useEditor();

  return (
    <CF
      componentId={componentId}
      onInitialize={useCallback(
        (initialState) => ({
          ...initialState,
          widthRaw: transformToRawWidth(initialState.width),
          heightRaw: transformToRawHeight(initialState.height),
          minWidthRaw: {
            size: (initialState.minWidth as any)?.size?.toString(),
            unit: (initialState.minWidth as any)?.unit ?? 'px',
          },
          maxWidthRaw: {
            size: (initialState.maxWidth as any)?.size?.toString(),
            unit: (initialState.maxWidth as any)?.unit ?? 'px',
          },
          minHeightRaw: {
            size: (initialState.minHeight as any)?.size?.toString(),
            unit: (initialState.minHeight as any)?.unit ?? 'px',
          },
          maxHeightRaw: {
            size: (initialState.maxHeight as any)?.size?.toString(),
            unit: (initialState.maxHeight as any)?.unit ?? 'px',
          },
          borderRadius: {
            ...initialState.borderRadius,
            toggle: hasBorderRadiusAllOrEachToggle(initialState.borderRadius),
          },
        }),
        []
      )}
      onTransformValues={useCallback(
        (values: BoxOptionsFields) => {
          values.width = parseDimension(values.widthRaw);
          values.height = parseDimension(values.heightRaw);
          values.minWidth = parseLimitDimension(values.minWidthRaw, true) as DimensionMinLimit;
          values.maxWidth = parseLimitDimension(values.maxWidthRaw, false) as DimensionMaxLimit;
          values.minHeight = parseLimitDimension(values.minHeightRaw, true) as DimensionMinLimit;
          values.maxHeight = parseLimitDimension(values.maxHeightRaw, false) as DimensionMaxLimit;

          values.padding.top = parseInteger(values.padding?.top) || 0;
          values.padding.right = parseInteger(values.padding?.right) || 0;
          values.padding.bottom = parseInteger(values.padding?.bottom) || 0;
          values.padding.left = parseInteger(values.padding?.left) || 0;

          values.margin.top = parseInteger(values.margin?.top) || 0;
          values.margin.right = parseInteger(values.margin?.right) || 0;
          values.margin.bottom = parseInteger(values.margin?.bottom) || 0;
          values.margin.left = parseInteger(values.margin?.left) || 0;

          values.opacity = parsePositiveFloat(values.opacity);
          values.opacity = values.opacity > 1 ? 1 : values.opacity;

          values.flexShrink = parsePositiveInteger(values.flexShrink) || 0;
          values.flexGrow = parsePositiveInteger(values.flexGrow) || 0;
          values.flexGap = parsePositiveInteger(values.flexGap) || 0;

          // Sync the append direction based on the flex direction.
          setChildAppendDirection(
            componentId,
            values.flexDirection === 'column' ? 'vertical' : 'horizontal'
          );
        },
        [componentId, setChildAppendDirection]
      )}
    >
      <SyncResize componentId={componentId} />

      {/* Making a 8 column grid system. */}
      <Grid templateColumns="repeat(8, minmax(0, 1fr))" alignItems="center" gap={4}>
        <AlignmentSection />
        <SectionDivider />
        <PropertiesSection />
        <SectionDivider />
        <LayoutSection />
        <SectionDivider />
        <OverflowSection />
        <SectionDivider />
        <FlexSection />
        <SectionDivider />
        <AppearanceSection />
        <SectionDivider />
        <BorderSection />
      </Grid>
    </CF>
  );
}

function AlignmentSection() {
  return (
    <>
      <GridItem colSpan={8}>
        <AlignmentInput />
      </GridItem>

      <GridItem colSpan={8}>
        <DirectionInput />
      </GridItem>
    </>
  );
}

function PropertiesSection() {
  return (
    <>
      <GridItem colSpan={8}>
        <TextInputWithLabel name="name" label="Name" />
      </GridItem>
      <GridItem colSpan={8}>
        <SelectInputWithLabel name="tag" label="Tag">
          {boxTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </SelectInputWithLabel>
      </GridItem>
    </>
  );
}

function FlexSection() {
  return (
    <>
      <GridItem colSpan={8} mb={1}>
        <Text fontSize="sm" fontWeight="bold">
          Flex
        </Text>
      </GridItem>

      <GridItem colSpan={4}>
        <NumberInputWithLabel name="flexGrow" label="Grow" />
      </GridItem>

      <GridItem colSpan={4}>
        <NumberInputWithLabel name="flexShrink" label="Shrink" />
      </GridItem>

      <GridItem colSpan={4}>
        <NumberInputWithLabel name="flexGap" label="Gap" />
      </GridItem>

      <GridItem colSpan={8}>
        <SegmentedInput
          name="flexWrap"
          isFullWidth
          options={[
            { value: 'wrap', label: 'Wrap' },
            { value: 'nowrap', label: 'No Wrap' },
          ]}
        />
      </GridItem>
    </>
  );
}

function LayoutSection() {
  return (
    <>
      <GridItem colSpan={8} mb={1}>
        <Text fontSize="sm" fontWeight="bold">
          Layout
        </Text>
      </GridItem>
      <GridItem colSpan={8}>
        <SizeInput name="widthRaw" label="Width" isWidth />
      </GridItem>
      <GridItem colSpan={8}>
        <SizeInput name="heightRaw" label="Height" isWidth={false} />
      </GridItem>
      <GridItem colSpan={4}>
        <SizeLimitInput name="minWidthRaw" label="Min W" />
      </GridItem>
      <GridItem colSpan={4}>
        <SizeLimitInput name="maxWidthRaw" label="Max W" />
      </GridItem>
      <GridItem colSpan={4}>
        <SizeLimitInput name="minHeightRaw" label="Min H" />
      </GridItem>
      <GridItem colSpan={4}>
        <SizeLimitInput name="maxHeightRaw" label="Max W" />
      </GridItem>
      <Labelled label="Padding">
        <SpacingField name="padding" />
      </Labelled>
      <Labelled label="Margin">
        <SpacingField name="margin" />
      </Labelled>
    </>
  );
}

function OverflowSection() {
  return (
    <>
      <GridItem colSpan={8} mb={1}>
        <Text fontSize="sm" fontWeight="bold">
          Overflow
        </Text>
      </GridItem>
      <GridItem colSpan={8}>
        <OverflowInput name="overflow" />
      </GridItem>
    </>
  );
}

function AppearanceSection() {
  return (
    <>
      <GridItem colSpan={8} mb={1}>
        <Text fontSize="sm" fontWeight="bold">
          Appearance
        </Text>
      </GridItem>
      <GridItem colSpan={4}>
        <ColorPicker name="color" />
      </GridItem>
      <GridItem colSpan={4}>
        <OpacityInput name="opacity" />
      </GridItem>
    </>
  );
}

function BorderSection() {
  return (
    <>
      <GridItem colSpan={8} mb={1}>
        <Text fontSize="sm" fontWeight="bold">
          Border
        </Text>
      </GridItem>
      {/* <Labelled label="Border">
        <TextInput name="border" />
      </Labelled> */}
      <GridItem colSpan={8}>
        <RadiusInput name="borderRadius" />
      </GridItem>
    </>
  );
}

function SectionDivider() {
  return (
    <GridItem colSpan={8}>
      <Divider borderColor="gray.400" />
    </GridItem>
  );
}
