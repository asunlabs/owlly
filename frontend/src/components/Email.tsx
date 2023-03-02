import * as React from 'react';
import FormControl from '@mui/joy/FormControl';
import FormLabel from '@mui/joy/FormLabel';
import FormHelperText from '@mui/joy/FormHelperText';
import Input from '@mui/joy/Input';
import Button from '@mui/joy/Button';

const inputStyle = {
  '--Input-decorator-childHeight': '45px',
  border: 'none',
  backgroundColor: 'lightgrey',
  color: 'black',
};

export function SendEmail() {
  const [data, setData] = React.useState<{
    name: string;
    email: string;
    message: string;

    status: 'initial' | 'loading' | 'failure' | 'sent';
  }>({
    name: '',
    email: '',
    message: '',
    status: 'initial',
  });

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setData((current) => ({ ...current, status: 'loading' }));
    try {
      // Replace timeout with real backend operation
      setTimeout(() => {
        setData({
          name: '',
          email: '',
          message: '',
          status: 'sent',
        });
      }, 1500);
    } catch (error) {
      setData((current) => ({ ...current, status: 'failure' }));
    }
  };

  return (
    <form onSubmit={handleSubmit} id="demo" style={{ backgroundColor: 'grey' }}>
      <FormControl>
        <FormLabel
          sx={(theme) => ({
            '--FormLabel-color': theme.vars.palette.primary.plainColor,
          })}
        >
          Contact us if you have any inquires
        </FormLabel>
        <Input
          sx={inputStyle}
          placeholder="name"
          type="text"
          required
          value={data.name}
          onChange={(event) =>
            setData((prev) => ({
              ...prev,
              name: event.target.value,
              status: 'initial',
            }))
          }
          error={data.status === 'failure'}
        />
        <Input
          sx={inputStyle}
          placeholder="mail@gmail.com"
          type="email"
          required
          value={data.email}
          onChange={(event) =>
            setData((prev) => ({
              ...prev,
              email: event.target.value,
              status: 'initial',
            }))
          }
          error={data.status === 'failure'}
        />
        <Input
          sx={inputStyle}
          placeholder="message"
          type="text"
          required
          value={data.message}
          onChange={(event) =>
            setData((prev) => ({
              ...prev,
              message: event.target.value,
              status: 'initial',
            }))
          }
          error={data.status === 'failure'}
        />
        <Button
          variant="solid"
          color="primary"
          loading={data.status === 'loading'}
          type="submit"
          sx={{ borderTopLeftRadius: 0, borderBottomLeftRadius: 0 }}
        >
          Send
        </Button>
        {data.status === 'failure' && (
          <FormHelperText sx={(theme) => ({ color: theme.vars.palette.danger[400] })}>
            Oops! something went wrong, please try again later.
          </FormHelperText>
        )}
        {data.status === 'sent' && (
          <FormHelperText sx={(theme) => ({ color: theme.vars.palette.primary[400] })}>
            Message has sent!
          </FormHelperText>
        )}
      </FormControl>
    </form>
  );
}
