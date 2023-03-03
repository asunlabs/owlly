import { styled } from '@mui/material/styles';
import Box from '@mui/material/Box';
import Paper from '@mui/material/Paper';
import Grid from '@mui/material/Grid';
import { ActionAreaCard } from './components/Card';
import { Helmet } from 'react-helmet';
import { SendEmail } from './components/Email';

export interface IApp_Props {}

const Item = styled(Paper)(({ theme }) => ({
  backgroundColor: theme.palette.mode === 'dark' ? '#1A2027' : '#fff',
  ...theme.typography.body2,
  padding: theme.spacing(1),
  textAlign: 'center',
  justifyContent: 'center',

  alignItems: 'center',
  color: theme.palette.text.secondary,
}));

export function App_(props: IApp_Props) {
  return (
    // add welcome on board message
    // {/* render login */}
    <div>
      <SendEmail />
      <section>banner here</section>
      if has an account: welcome message if not: redirect to sign in
      <Box sx={{ flexGrow: 1 }}>
        <Grid container spacing={2} justifyContent="center" alignItems="center">
          {/* xs: takes 6 out of 12 columns before md(600px) */}
          <Grid item xs={10} md={6} justifyContent="center" alignItems="center">
            <Item>
              <ActionAreaCard title="hello user" />
            </Item>
          </Grid>
          <Grid item xs={10} md={6}>
            <Item>
              <ActionAreaCard title="hello user" />
            </Item>
          </Grid>
          <Grid item xs={10} md={6}>
            <Item>
              <ActionAreaCard title="hello user" />
            </Item>
          </Grid>
          <Grid item xs={10} md={6}>
            <Item>
              <ActionAreaCard title="hello user" />
            </Item>
          </Grid>
        </Grid>
      </Box>
    </div>
  );
}
