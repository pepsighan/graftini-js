import { useFormContext, UseFormRegister } from 'react-hook-form';

/**
 * The ref on Material Input fields is `inputRef`. So this hook conforms to that
 * API surface.
 */
export default function useMaterialFormRegister(name: string) {
  const { register } = useFormContext();
  return materialRegister(register, name);
}

/**
 * Uses the register to return fields that are acceptable by Material Inputs.
 */
export function materialRegister(register: UseFormRegister<any>, name: string) {
  const { ref, ...rest } = register(name);
  return { inputRef: ref, ...rest };
}
