import {
  Flex,
  IconButton,
  Input,
  InputGroup,
  InputLeftElement,
  InputRightElement,
  Menu,
  MenuButton,
  MenuItem,
  Box,
  MenuList,
  Portal,
} from '@chakra-ui/react';
import {
  mdiArrowCollapseHorizontal,
  mdiArrowCollapseVertical,
  mdiArrowLeftRight,
  mdiArrowUpDown,
  mdiClose,
} from '@mdi/js';
import { CheckIcon, ChevronDownIcon } from '@modulz/radix-icons';
import Icon from 'components/Icon';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import SegmentedInput from './SegmentedInput';

const units = ['px', '%'];

export default function SizeInput({ name, isWidth, label }) {
  const { register, control, setValue } = useFormContext();
  const unit = useWatch({ control, name: `${name}.unit` });
  const toggle = useWatch({ control, name: `${name}.toggle` });

  const unsetToggle = useCallback(
    () => setValue(`${name}.toggle`, null, { shouldDirty: true, shouldValidate: true }),
    [name, setValue]
  );

  return (
    <Flex>
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

        {!toggle && (
          <>
            <Input
              {...register(`${name}.size`)}
              type="number"
              size="sm"
              bg="white"
              autoComplete="off"
              flex={1}
              borderRight="none"
              borderTopRightRadius="none"
              borderBottomRightRadius="none"
              sx={{ paddingInlineStart: 16 }}
              pb="1px" // Align the input text with the label.
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
          </>
        )}

        {toggle && (
          <>
            <Input
              as="span"
              size="sm"
              bg="white"
              autoComplete="off"
              flex={1}
              display="flex"
              alignItems="center"
              justifyContent="space-between"
              paddingRight={0}
              userSelect="none"
              borderTopRightRadius="none"
              borderBottomRightRadius="none"
              sx={{ paddingInlineStart: 16 }}
            >
              {toggle === 'auto' ? 'Auto' : `Full ${isWidth ? 'Width' : 'Height'}`}
              <IconButton size="sm" bg="transparent" onClick={unsetToggle}>
                <Icon icon={mdiClose} fontSize="md" />
              </IconButton>
            </Input>
          </>
        )}
      </InputGroup>

      <SegmentedInput
        name={`${name}.toggle`}
        options={[
          {
            value: 'full',
            label: <Icon icon={isWidth ? mdiArrowLeftRight : mdiArrowUpDown} fontSize="md" />,
            borderTopLeftRadius: 'none',
            borderBottomLeftRadius: 'none',
          },
          {
            value: 'auto',
            label: (
              <Icon
                icon={isWidth ? mdiArrowCollapseHorizontal : mdiArrowCollapseVertical}
                fontSize="lg"
              />
            ),
          },
        ]}
      />
    </Flex>
  );
}
