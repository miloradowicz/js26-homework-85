import { FC, memo, useState } from 'react';
import { Button, Card, CardActions, CardContent, Grid2 as Grid, Stack, Typography } from '@mui/material';
import YouTubeIcon from '@mui/icons-material/YouTube';

interface Props {
  id: string;
  title: string;
  trackNum: number;
  length: string | null;
  youTubeUrl: string | null;
  onPlay?: () => Promise<void>;
}

const TrackListItem: FC<Props> = ({ title, trackNum, length, youTubeUrl, onPlay }) => {
  const [loading, setLoading] = useState(false);

  const handlePlay = async () => {
    if (onPlay) {
      try {
        setLoading(true);
        await onPlay();
      } finally {
        setLoading(false);
      }
    }
  };

  return (
    <Card variant='outlined' sx={{ px: 2, py: 1 }}>
      <Grid container>
        <Grid size={11}>
          <CardContent component={Grid} container flex={1}>
            <Grid size={2}>
              <Typography gutterBottom variant='h6' component='div'>
                {trackNum}
              </Typography>
            </Grid>
            <Grid size={8}>
              <Typography gutterBottom variant='h6' component='div'>
                {title}
              </Typography>
            </Grid>
            <Grid size={2}>
              <Typography gutterBottom variant='h6' component='div'>
                {length}
              </Typography>
            </Grid>
          </CardContent>
        </Grid>
        <Grid size={1}>
          <CardActions>
            {onPlay && (
              <Stack alignItems='center'>
                {youTubeUrl ? (
                  <Button
                    href={youTubeUrl ?? '#'}
                    loading={loading}
                    onClick={handlePlay}
                    target='_blank'
                    endIcon={<YouTubeIcon />}
                  >
                    Play
                  </Button>
                ) : (
                  <Button loading={loading} onClick={handlePlay}>
                    Play
                  </Button>
                )}
              </Stack>
            )}
          </CardActions>
        </Grid>
      </Grid>
    </Card>
  );
};

export default memo(TrackListItem, (prev, next) => prev.id === next.id);
