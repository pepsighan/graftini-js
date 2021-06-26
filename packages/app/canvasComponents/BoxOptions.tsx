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
import { parsePositiveInteger } from 'utils/parser';
import { BoxComponentProps } from './Box';
import AlignmentInput from './form/AlignmentInput';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import DirectionInput from './form/DirectionInput';
import Labelled from './form/Labelled';
import NumberInput from './form/NumberInput';
import OpacityInput from './form/OpacityInput';
import OverflowInput from './form/OverflowInput';
import RadiusInput from './form/RadiusInput';
import SegmentedInput from './form/SegmentedInput';
import SelectInput from './form/SelectInput';
import SizeInput from './form/SizeInput';
import SizeLimitInput from './form/SizeLimitInput';
import SpacingField from './form/SpacingField';
import SyncFormState from './form/SyncFormState';
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
    >
      <SyncResize componentId={componentId} />
      <SyncFormState
        componentId={componentId}
        onSync={useCallback(
          (props: BoxComponentProps, formState: BoxOptionsFields) => {
            // Sync the append direction based on the flex direction.
            setChildAppendDirection(
              componentId,
              formState.flexDirection === 'column' ? 'vertical' : 'horizontal'
            );

            props.width = parseDimension(formState.widthRaw);
            props.height = parseDimension(formState.heightRaw);
            props.minWidth = parseLimitDimension(formState.minWidthRaw, true) as DimensionMinLimit;
            props.maxWidth = parseLimitDimension(formState.maxWidthRaw, false) as DimensionMaxLimit;
            props.minHeight = parseLimitDimension(
              formState.minHeightRaw,
              true
            ) as DimensionMinLimit;
            props.maxHeight = parseLimitDimension(
              formState.maxHeightRaw,
              false
            ) as DimensionMaxLimit;
          },
          [componentId, setChildAppendDirection]
        )}
      />

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
        <TextInput name="name" label="Name" />
      </GridItem>
      <GridItem colSpan={8}>
        <SelectInput name="tag" label="Tag">
          {boxTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </SelectInput>
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
        <NumberInput name="flexGrow" label="Grow" />
      </GridItem>

      <GridItem colSpan={4}>
        <NumberInput name="flexShrink" label="Shrink" />
      </GridItem>

      <GridItem colSpan={4}>
        <NumberInput name="flexGap" label="Gap" />
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

function parseDimension(dim: RawDimension): DimensionSize {
  if (dim.toggle) {
    return dim.toggle;
  }

  return {
    size: dim.size,
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
