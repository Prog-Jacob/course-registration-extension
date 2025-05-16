import { Box, Button, Checkbox, FormControlLabel } from '@mui/material';
import React, { ChangeEvent } from 'react';
import { benchmark } from '../services/benchmarker';

function Benchmark() {
  const [loading, setLoading] = React.useState(false);
  const [saveFiles, setSaveFiles] = React.useState(false);

  const handleSaveFiles = (e: ChangeEvent<HTMLInputElement>) => {
    setSaveFiles(e.target.checked);
  };

  const handleImport = async (e: ChangeEvent<HTMLInputElement>) => {
    try {
      const file = await e.target.files[0];
      setLoading(true);
      await benchmark(file, saveFiles);
      setLoading(false);
    } catch (error) {
      alert('Error parsing JSON file!');
    }
  };

  return loading ? (
    <p style={{ textAlign: 'center' }}>Loading...</p>
  ) : (
    <Box sx={{ display: 'flex', justifyContent: 'space-evenly' }}>
      <FormControlLabel
        sx={{ margin: '0.5rem', color: 'var(--secondary)' }}
        control={
          <Checkbox
            checked={saveFiles}
            onChange={handleSaveFiles}
            sx={{ '& .MuiSvgIcon-root': { fontSize: 18, fill: 'var(--secondary)' } }}
          />
        }
        label='Save Solutions'
        labelPlacement='start'
      />

      <Button
        sx={{
          margin: '.5rem',
          backgroundColor: 'var(--secondary)',
          color: 'white',
          '&:hover': { color: 'inherit' },
        }}
      >
        <label htmlFor='benchmark-courses'>Benchmark</label>
        <input
          id='benchmark-courses'
          type='file'
          accept='.json'
          style={{ display: 'none' }}
          onChange={handleImport}
        />
      </Button>
    </Box>
  );
}
export default Benchmark;
