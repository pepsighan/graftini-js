import { useFormContext } from 'react-hook-form';

/**
 * The ref on Material Input fields is `inputRef`. So this hook conforms to that
 * API surface.
 */
export default function useMaterialFormRegister(name: string) {
  const { register } = useFormContext();
  const { ref, ...rest } = register(name);
  return { inputRef: ref, ...rest };
}
