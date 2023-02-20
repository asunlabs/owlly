import * as React from 'react';
import Avatar from '@mui/material/Avatar';
import Stack from '@mui/material/Stack';
import { deepOrange, deepPurple, grey } from '@mui/material/colors';

interface IDefaultProfile {
  name: string;
}

export function DefaultProfile({ name }: IDefaultProfile) {
  return (
    <Stack direction="row" spacing={2}>
      <Avatar sx={{ bgcolor: grey[500] }}>{name}</Avatar>
    </Stack>
  );
}
