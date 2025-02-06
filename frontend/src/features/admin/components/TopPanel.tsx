import { Box, Tab, Tabs } from '@mui/material';
import { SyntheticEvent, useState } from 'react';
import { useMatch, useNavigate } from 'react-router-dom';

const TopPanel = () => {
  const navigate = useNavigate();
  const match = useMatch('admin/:sub');

  const [selected, setSelected] = useState(match?.params.sub);

  const handleChange = (_: SyntheticEvent, value: string) => {
    setSelected(value);
    navigate(value);
  };

  return (
    <Box>
      <Tabs value={selected} onChange={handleChange} aria-label='disabled tabs example'>
        <Tab label='Artists' value='artists' />
        <Tab label='Albums' value='albums' />
        <Tab label='Tracks' value='tracks' />
      </Tabs>
    </Box>
  );
};

export default TopPanel;
