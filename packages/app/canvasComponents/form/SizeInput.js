import { IconButton } from '@chakra-ui/button';
import { Input } from '@chakra-ui/input';
import { Flex } from '@chakra-ui/layout';
import { Select } from '@chakra-ui/select';
import {
  mdiArrowCollapseHorizontal,
  mdiArrowCollapseVertical,
  mdiArrowLeftRight,
  mdiArrowUpDown,
  mdiClose,
} from '@mdi/js';
import Icon from 'components/Icon';
import { useCallback } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import SegmentedInput from './SegmentedInput';

const units = ['px', '%'];

export default function SizeInput({ name, isWidth }) {
  const { register, control, setValue } = useFormContext();
  const toggle = useWatch({ control, name: `${name}.toggle` });

  const unsetToggle = useCallback(
    () => setValue(`${name}.toggle`, null, { shouldDirty: true, shouldValidate: true }),
    [name, setValue]
  );

  return (
    <Flex>
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
          />
          <Select
            {...register(`${name}.unit`)}
            size="sm"
            bg="white"
            autoComplete="off"
            flex={1}
            borderLeft="none"
            borderRadius="none"
            sx={{ paddingInlineStart: 1 }}
          >
            {units.map((it) => (
              <option key={it} value={it}>
                {it}
              </option>
            ))}
          </Select>
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
          >
            {toggle === 'auto' ? 'Auto' : `Full ${isWidth ? 'Width' : 'Height'}`}
            <IconButton size="sm" bg="transparent" onClick={unsetToggle}>
              <Icon icon={mdiClose} fontSize="md" />
            </IconButton>
          </Input>
        </>
      )}

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
