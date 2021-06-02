import Icon from '@chakra-ui/icon';
import { Box, Grid, GridItem, Text } from '@chakra-ui/layout';
import { DimensionSize } from 'bricks';
import { OptionsProps } from 'canvasComponents';
import { useCallback } from 'react';
import {
  CgAlignBottom,
  CgAlignCenter,
  CgAlignLeft,
  CgAlignMiddle,
  CgAlignRight,
  CgAlignTop,
} from 'react-icons/cg';
import { parseInteger, parsePositiveFloat, parsePositiveInteger } from 'utils/parser';
import Container, { ContainerComponentProps, containerTags } from './Container';
import CanvasForm, { CanvasFormComponent } from './form/CanvasForm';
import ColorPicker from './form/ColorPicker';
import Labelled from './form/Labelled';
import OpacityInput from './form/OpacityInput';
import { OverflowInputX, OverflowInputY } from './form/OverflowInput';
import RadiusInput from './form/RadiusInput';
import SegmentedInput from './form/SegmentedInput';
import SelectInput from './form/SelectInput';
import SizeInput from './form/SizeInput';
import SpacingField from './form/SpacingField';
import TextInput from './form/TextInput';

export type ContainerDimension = DimensionSize | 'full';

type RawDimension = {
  size: string;
  unit: 'px' | '%';
  toggle?: 'auto' | 'full';
};

type ContainerOptionsFields = ContainerComponentProps & {
  widthRaw: RawDimension;
  heightRaw: RawDimension;
};

function parseDimension(dim: RawDimension): ContainerDimension {
  if (dim.toggle) {
    return dim.toggle;
  }

  return {
    size: parsePositiveInteger(dim.size),
    unit: dim.unit,
  };
}

export default function ContainerOptions({ componentId }: OptionsProps) {
  const CF = CanvasForm as CanvasFormComponent<ContainerComponentProps, ContainerOptionsFields>;

  return (
    <CF
      componentId={componentId}
      fieldNames={Object.keys(Container.graftOptions.defaultProps)}
      onInitialize={useCallback(
        (initialState) => ({
          ...initialState,
          widthRaw: {
            size: ((initialState.width as any)?.size ?? 100).toString(),
            unit: (initialState.width as any)?.unit ?? '%',
            toggle: typeof initialState.width === 'string' ? initialState.width : null,
          },
          heightRaw: {
            size: ((initialState.height as any)?.size ?? 200).toString(),
            unit: (initialState.height as any)?.unit ?? 'px',
            toggle: typeof initialState.height === 'string' ? initialState.height : null,
          },
        }),
        []
      )}
      onTransformValues={useCallback((values: ContainerOptionsFields) => {
        values.width = parseDimension(values.widthRaw);
        values.height = parseDimension(values.heightRaw);

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
      }, [])}
    >
      {/* Making a 6 column grid system. */}
      <Grid templateColumns="repeat(8, minmax(0, 1fr))" alignItems="center" gap={4}>
        <PropertiesSection />
        <FlexSection />
        <LayoutSection />
        <AppearanceSection />
      </Grid>
    </CF>
  );
}

function PropertiesSection() {
  return (
    <>
      <Labelled label="Name">
        <TextInput name="name" />
      </Labelled>
      <Labelled label="Tag">
        <SelectInput name="tag">
          {containerTags.map((tag) => (
            <option key={tag} value={tag}>
              {tag}
            </option>
          ))}
        </SelectInput>
      </Labelled>
    </>
  );
}

function FlexSection() {
  return (
    <>
      <GridItem colSpan={8} mt={4} mb={1}>
        <Text fontSize="sm" fontWeight="bold">
          Flex
        </Text>
      </GridItem>

      <Labelled label="Direction">
        <SegmentedInput
          name="flexDirection"
          options={[
            { value: 'column', label: 'Column' },
            { value: 'row', label: 'Row' },
          ]}
        />
      </Labelled>

      <Labelled label="Justify">
        <SegmentedInput
          name="justifyContent"
          options={[
            { value: 'flex-start', label: <Icon as={CgAlignLeft} fontSize="lg" /> },
            { value: 'center', label: <Icon as={CgAlignMiddle} fontSize="lg" /> },
            { value: 'flex-end', label: <Icon as={CgAlignRight} fontSize="lg" /> },
          ]}
        />
      </Labelled>

      <Labelled label="Align">
        <SegmentedInput
          name="alignItems"
          options={[
            { value: 'flex-start', label: <Icon as={CgAlignTop} fontSize="lg" /> },
            { value: 'center', label: <Icon as={CgAlignCenter} fontSize="lg" /> },
            { value: 'flex-end', label: <Icon as={CgAlignBottom} fontSize="lg" /> },
          ]}
        />
      </Labelled>
    </>
  );
}

function LayoutSection() {
  return (
    <>
      <GridItem colSpan={8} mt={4} mb={1}>
        <Text fontSize="sm" fontWeight="bold">
          Layout
        </Text>
      </GridItem>
      <Labelled label="Width">
        <SizeInput name="widthRaw" isWidth />
      </Labelled>
      <Labelled label="Height">
        <SizeInput name="heightRaw" isWidth={false} />
      </Labelled>
      <Labelled label="Padding">
        <SpacingField name="padding" />
      </Labelled>
      <Labelled label="Margin">
        <SpacingField name="margin" />
      </Labelled>
      <Labelled label="Overflow">
        <OverflowInputX name="overflow.x" />
        <Box mt={2}>
          <OverflowInputY name="overflow.y" />
        </Box>
      </Labelled>
    </>
  );
}

function AppearanceSection() {
  return (
    <>
      <GridItem colSpan={6} mt={4} mb={1}>
        <Text fontSize="sm" fontWeight="bold">
          Appearance
        </Text>
      </GridItem>
      <Labelled label="Opacity">
        <OpacityInput name="opacity" />
      </Labelled>
      <Labelled label="Fill">
        <ColorPicker name="color" />
      </Labelled>
      <Labelled label="Border">
        <TextInput name="border" />
      </Labelled>
      <Labelled label="Radius">
        <RadiusInput name="borderRadius" />
      </Labelled>
    </>
  );
}
