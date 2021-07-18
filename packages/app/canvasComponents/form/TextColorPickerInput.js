import { useCallback } from 'react';
import ColorPickerInput from './ColorPickerInput';

export default function TextColorPickerInput({ componentId }) {
  return <ColorPickerInput name="color" label="Color" onChange={useCallback((rgba) => {}, [])} />;
}
