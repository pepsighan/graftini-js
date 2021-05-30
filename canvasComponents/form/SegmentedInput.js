import { Button, ButtonGroup } from '@chakra-ui/button';
import { useRadio, useRadioGroup } from '@chakra-ui/radio';

function RadioButton(props) {
  const { getInputProps, getCheckboxProps } = useRadio(props);
  return (
    <>
      <input {...getInputProps()} />
      <Button {...getCheckboxProps()} bg="white">
        {props.children}
      </Button>
    </>
  );
}

export default function SegmentedInput({ name, options }) {
  const { getRadioProps, getRootProps } = useRadioGroup({ name });

  return (
    <ButtonGroup size="sm" isAttached variant="outline" {...getRootProps()}>
      {options.map((opt) => (
        <RadioButton key={opt.value} {...getRadioProps({ value: opt.value })}>
          {opt.label}
        </RadioButton>
      ))}
    </ButtonGroup>
  );
}
