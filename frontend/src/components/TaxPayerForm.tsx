import React from 'react';
import { Dialog, DialogTitle, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import { useForm, Controller } from 'react-hook-form';

type TaxPayerFormProps = {
  open: boolean;
  onClose: () => void;
  onSubmit: (data: TaxPayerFormData) => void;
};

type TaxPayerFormData = {
  firstName: string;
  lastName: string;
  address: string;
};

const TaxPayerForm: React.FC<TaxPayerFormProps> = ({ open, onClose, onSubmit }) => {
  const { control, handleSubmit, reset } = useForm<TaxPayerFormData>();

  const onSubmitForm = (data: TaxPayerFormData) => {
    onSubmit(data);
    reset();
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <DialogTitle>Add New TaxPayer</DialogTitle>
      <form onSubmit={handleSubmit(onSubmitForm)}>
        <DialogContent>
          <Controller
            name="firstName"
            control={control}
            defaultValue=""
            rules={{ required: 'First name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="First Name"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="lastName"
            control={control}
            defaultValue=""
            rules={{ required: 'Last name is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Last Name"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
          <Controller
            name="address"
            control={control}
            defaultValue=""
            rules={{ required: 'Address is required' }}
            render={({ field, fieldState: { error } }) => (
              <TextField
                {...field}
                label="Address"
                fullWidth
                margin="normal"
                error={!!error}
                helperText={error?.message}
              />
            )}
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={onClose}>Cancel</Button>
          <Button type="submit" color="primary">
            Add TaxPayer
          </Button>
        </DialogActions>
      </form>
    </Dialog>
  );
};

export default TaxPayerForm;
