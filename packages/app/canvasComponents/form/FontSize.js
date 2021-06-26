import {
  Box,
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
import { CheckIcon, ChevronDownIcon } from '@modulz/radix-icons';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { parsePositiveInteger } from 'utils/parser';

const units = ['px', 'rem'];

export default function FontSize({ name }) {
  const { control, setValue } = useFormContext();
  const size = useWatch({ control, name: `${name}.size` });
  const unit = useWatch({ control, name: `${name}.unit` });

  return (
    <InputGroup>
      <InputLeftElement
        pointerEvents="none"
        fontSize="sm"
        height="100%"
        width="4.5rem"
        color="gray.600"
        justifyContent="flex-end"
        pr={2}
      >
        Size
      </InputLeftElement>
      <Input
        value={size}
        onChange={useCallback(
          (event) => {
            setValue(`${name}.size`, parsePositiveInteger(event.target.value) || 0);
          },
          [name, setValue]
        )}
        size="sm"
        bg="white"
        autoComplete="off"
        pb="1px" // Align the input text with the label.
        sx={{
          paddingInlineStart: '4.5rem',
        }}
      />

      <InputRightElement height="100%" width={12} fontSize="sm">
        <Box mr={1} color="gray.600">
          {unit}
        </Box>

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
