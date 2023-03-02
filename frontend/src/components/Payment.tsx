import * as React from 'react';
import Box from '@mui/joy/Box';
import List from '@mui/joy/List';
import ListItem from '@mui/joy/ListItem';
import ListDivider from '@mui/joy/ListDivider';
import Radio from '@mui/joy/Radio';
import RadioGroup from '@mui/joy/RadioGroup';
import Typography from '@mui/joy/Typography';
import Switch, { switchClasses } from '@mui/joy/Switch';

export function BasicSelectPayment() {
  const [orientation, setOrientation] = React.useState('vertical');
  return (
    <Box sx={{ minWidth: 240 }}>
      <Box
        sx={{
          mb: 2,
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
        }}
      >
        <Typography
          id="payment-channel-label"
          level="body3"
          textTransform="uppercase"
          fontWeight="xl"
          sx={{ letterSpacing: '0.15rem' }}
        >
          Pay with
        </Typography>
        <Switch
          component="label"
          size="sm"
          checked={orientation === 'horizontal'}
          onChange={(event) => setOrientation(event.target.checked ? 'horizontal' : 'vertical')}
          sx={{
            [`&&:not(.${switchClasses.checked})`]: {
              '--Switch-track-background': (theme) => theme.vars.palette.background.level3,
            },
          }}
        />
      </Box>
      <RadioGroup aria-labelledby="payment-channel-label" overlay name="payment-channel" defaultValue="Paypal">
        <List
          component="div"
          variant="outlined"
          orientation={'vertical'}
          sx={{
            borderRadius: 'sm',
            boxShadow: 'sm',
            bgcolor: 'background.body',
          }}
        >
          {['Credit Card', 'Paypal', 'QR Code'].map((value, index) => (
            <React.Fragment key={value}>
              {index !== 0 && <ListDivider />}
              <ListItem>
                <Radio id={value} value={value} label={value} />
              </ListItem>
            </React.Fragment>
          ))}
        </List>
      </RadioGroup>
    </Box>
  );
}

export interface IBasicPayhipLink {
  link?: string;
}
export function BasicPayhipLink({ link }: IBasicPayhipLink) {
  return (
    <a href={link} className="payhip-buy-button" data-theme="grey" data-product="fPc2Y">
      Buy Now
    </a>
  );
}
