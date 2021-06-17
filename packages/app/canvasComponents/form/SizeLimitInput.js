import {
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  MenuList,
  Portal,
} from '@chakra-ui/react';
import { ChevronDownIcon, CheckIcon } from '@modulz/radix-icons';
import { useFormContext, useWatch } from 'react-hook-form';

const units = ['px', '%'];

export default function SizeLimitInput({ name, label }) {
  const { register, setValue, control } = useFormContext();
  const unit = useWatch({ control, name: `${name}.unit` });

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        fontSize="sm"
        height="100%"
        width={16}
        color="gray.600"
        justifyContent="flex-end"
        pr={2}
      >
        {label}
      </InputLeftElement>

      <Input
        {...register(`${name}.size`)}
        type="number"
        size="sm"
        bg="white"
        autoComplete="off"
        flex={1}
        placeholder="Auto"
        sx={{ paddingInlineStart: 16 }}
        pb="1px" // Align the input text with the label.
      />

      <InputRightElement height="100%" width={8}>
        <Menu placement="bottom-end">
          {({ isOpen }) => (
            <>
              <MenuButton>
                <ChevronDownIcon />
              </MenuButton>
              <Portal>
                <MenuList
                  bg="white"
                  zIndex="dropdown"
                  minW="auto"
                  width="60px"
                  display={!isOpen ? 'none' : null}
                >
                  {units.map((it) => (
                    <MenuItem
                      key={it}
                      onClick={() =>
                        setValue(`${name}.unit`, it, {
                          shouldDirty: true,
                          shouldValidate: true,
                        })
                      }
                      fontSize="sm"
                    >
                      {it} {unit === it && <CheckIcon />}
                    </MenuItem>
                  ))}
                </MenuList>
              </Portal>
            </>
          )}
        </Menu>
      </InputRightElement>
    </InputGroup>
  );
}
