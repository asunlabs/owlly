import Box from '@mui/material/Box';
import Card from '@mui/material/Card';
import CardContent from '@mui/material/CardContent';
import CardMedia from '@mui/material/CardMedia';
import Typography from '@mui/material/Typography';
import { CardActionArea } from '@mui/material';
import { IActionAreaCardProps } from '@owlly/context/types';

export function ActionAreaCard({ src, title, description }: IActionAreaCardProps) {
  return (
    <Card>
      <CardActionArea
        sx={{
          maxWidth: '345px',
        }}
      >
        <CardMedia component="img" height="140" image={src} alt="MUI card" />
        <CardContent>
          <Typography gutterBottom variant="h5" component="div">
            {title}
          </Typography>
          <Typography variant="body2" color="text.secondary">
            {description}
          </Typography>
        </CardContent>
      </CardActionArea>
    </Card>
  );
}
