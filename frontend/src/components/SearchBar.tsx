import React, { useState } from 'react';
import { TextField, Button, Box } from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';

type SearchBarProps = {
  onSearch: (tid: bigint) => void;
};

const SearchBar: React.FC<SearchBarProps> = ({ onSearch }) => {
  const [searchTerm, setSearchTerm] = useState('');

  const handleSearch = () => {
    const tid = BigInt(searchTerm);
    onSearch(tid);
  };

  return (
    <Box display="flex" alignItems="center" mb={2}>
      <TextField
        label="Search by TID"
        variant="outlined"
        value={searchTerm}
        onChange={(e) => setSearchTerm(e.target.value)}
        fullWidth
      />
      <Button
        variant="contained"
        color="primary"
        startIcon={<SearchIcon />}
        onClick={handleSearch}
        style={{ marginLeft: '1rem' }}
      >
        Search
      </Button>
    </Box>
  );
};

export default SearchBar;
