import { ChangeEventHandler, FC, useState } from 'react';

import {
  Button,
  ButtonGroup,
  ButtonProps,
  TextField,
  TextFieldProps,
} from '@mui/material';

interface Props {
  onChange?: ChangeEventHandler<HTMLInputElement>;
  multiple?: boolean;
  buttonProps?: ButtonProps;
  buttonText: string;
}

const FileInput: FC<TextFieldProps & Props> = ({
  buttonProps,
  buttonText,
  multiple,
  name,
  onChange,
  ...attributes
}) => {
  const [filenames, setFilenames] = useState<string[]>([]);

  const handleChange: ChangeEventHandler<HTMLInputElement> = (e) => {
    if (e.target.files) {
      setFilenames([...e.target.files].map((x) => x.name));
    } else {
      setFilenames([]);
    }

    if (onChange) {
      onChange(e);
    }
  };

  return (
    <ButtonGroup>
      <TextField disabled value={filenames.join(', ')} {...attributes} />
      <Button
        component='label'
        role={undefined}
        variant='contained'
        tabIndex={-1}
        {...buttonProps}
      >
        {buttonText}
        <input
          hidden
          type='file'
          name={name}
          onChange={handleChange}
          multiple={multiple}
        />
      </Button>
    </ButtonGroup>
  );
};

export default FileInput;
