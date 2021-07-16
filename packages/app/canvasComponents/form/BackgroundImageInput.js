import {
  Box,
  Button,
  InputAdornment,
  MenuItem,
  Popover,
  Stack,
  TextField,
  Typography,
} from '@material-ui/core';
import { Cross1Icon } from '@modulz/radix-icons';
import AsyncButton from 'components/AsyncButton';
import { capitalize } from 'lodash-es';
import { useCallback, useRef, useState } from 'react';
import { useFormContext, useWatch } from 'react-hook-form';
import { useUploadedImage, useUploadImage } from 'store/projects';
import { wideLabelAlignmentStyle } from './formLabels';
import SelectInput from './SelectInput';

export default function BackgroundImageInput() {
  const [open, setOpen] = useState(null);
  const onOpen = useCallback((event) => setOpen(event.currentTarget), []);
  const onClose = useCallback(() => setOpen(null), []);

  const { control, setValue } = useFormContext();
  const imageId = useWatch({ control, name: 'imageId' });
  const backgroundFit = useWatch({ control, name: 'backgroundFit' });
  const { image } = useUploadedImage(imageId);

  // Remove the image.
  const onReset = useCallback(() => {
    setValue('imageId', null);
  }, [setValue]);

  return (
    <>
      <TextField
        placeholder="Add"
        onClick={onOpen}
        value={imageId ? capitalize(backgroundFit) : ''}
        InputProps={{
          readOnly: true,
          startAdornment: (
            <InputAdornment position="start" sx={wideLabelAlignmentStyle}>
              <Typography variant="body2">Image</Typography>
            </InputAdornment>
          ),
          endAdornment: image?.fileUrl ? (
            <InputAdornment position="end">
              <Box
                sx={{
                  width: 16,
                  height: 16,
                  borderRadius: 1,
                  backgroundImage: `url(${image.fileUrl})`,
                  backgroundSize: 'cover',
                }}
              />

              <Button
                sx={{ ml: 1, width: 32, minWidth: 'auto' }}
                color="secondary"
                onClick={onReset}
              >
                <Cross1Icon />
              </Button>
            </InputAdornment>
          ) : null,
        }}
        sx={{
          '& .MuiOutlinedInput-root, & .MuiOutlinedInput-input': {
            cursor: 'pointer',
          },
          '& .MuiOutlinedInput-root': {
            paddingRight: 0,
          },
        }}
      />

      <ImagePickerPopover open={open} onClose={onClose} />
    </>
  );
}

function ImagePickerPopover({ open, onClose }) {
  return (
    <Popover
      open={!!open}
      anchorEl={open}
      onClose={onClose}
      anchorOrigin={{
        vertical: 'bottom',
        horizontal: 'right',
      }}
    >
      <Stack sx={{ p: 1.2 }} spacing={1}>
        <ImagePicker />

        <SelectInput name="backgroundFit" label="Fit">
          <MenuItem value="contain">Contain</MenuItem>
          <MenuItem value="cover">Cover</MenuItem>
        </SelectInput>
      </Stack>
    </Popover>
  );
}

function ImagePicker() {
  const { control, setValue } = useFormContext();
  const inputRef = useRef();
  const [uploadImage, { loading: isUploading }] = useUploadImage();

  const imageId = useWatch({ control, name: 'imageId' });
  const { image } = useUploadedImage(imageId);

  const onBrowse = useCallback(() => {
    // Open the file explorer.
    inputRef.current.click();
  }, []);

  const onImageUpload = useCallback(
    async (event) => {
      if (event.target.files.length !== 1) {
        return;
      }

      const file = event.target.files[0];
      const response = await uploadImage({
        variables: {
          file,
        },
      });

      if (response.data?.uploadFile) {
        // Store the file in the form.
        setValue('imageId', response.data.uploadFile.id);
      }
    },
    [setValue, uploadImage]
  );

  return (
    <>
      <Box
        sx={{
          height: 150,
          width: 200,
          bgcolor: !image?.fileUrl ? 'grey.100' : null,
          borderRadius: 1,
          backgroundImage: image?.fileUrl ? `url("${image.fileUrl}")` : undefined,
          backgroundSize: 'contain',
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'center',
          border: '1px solid',
          borderColor: 'grey.200',
        }}
      />
      <AsyncButton fullWidth variant="contained" onClick={onBrowse} isLoading={isUploading}>
        Browse
      </AsyncButton>

      <Box
        ref={inputRef}
        component="input"
        type="file"
        sx={{ display: 'none' }}
        // Only the given mime-types are supported in the backend.
        // We'll add support for more as required.
        accept="image/jpeg,image/png,image/webp"
        onChange={onImageUpload}
      />
    </>
  );
}
