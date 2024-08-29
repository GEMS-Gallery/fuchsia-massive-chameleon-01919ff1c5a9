import React, { useState, useEffect } from 'react';
import { Container, Typography, Box, Button, CircularProgress } from '@mui/material';
import AddIcon from '@mui/icons-material/Add';
import TaxPayerTable from './components/TaxPayerTable';
import TaxPayerForm from './components/TaxPayerForm';
import SearchBar from './components/SearchBar';
import { backend } from 'declarations/backend';

type TaxPayer = {
  tid: bigint;
  firstName: string;
  lastName: string;
  address: string;
};

const App: React.FC = () => {
  const [taxPayers, setTaxPayers] = useState<TaxPayer[]>([]);
  const [loading, setLoading] = useState(true);
  const [openForm, setOpenForm] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');

  useEffect(() => {
    fetchTaxPayers();
  }, []);

  const fetchTaxPayers = async () => {
    setLoading(true);
    try {
      const result = await backend.getAllTaxPayers();
      setTaxPayers(result);
    } catch (error) {
      console.error('Error fetching tax payers:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleAddTaxPayer = async (newTaxPayer: Omit<TaxPayer, 'tid'>) => {
    setLoading(true);
    try {
      const result = await backend.createTaxPayer(
        newTaxPayer.firstName,
        newTaxPayer.lastName,
        newTaxPayer.address
      );
      if ('ok' in result) {
        await fetchTaxPayers();
        setOpenForm(false);
      } else {
        console.error('Error creating tax payer:', result.err);
      }
    } catch (error) {
      console.error('Error creating tax payer:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleSearch = async (tid: bigint) => {
    setLoading(true);
    try {
      const result = await backend.getTaxPayerByTID(tid);
      if (result) {
        setTaxPayers([result]);
      } else {
        setTaxPayers([]);
      }
    } catch (error) {
      console.error('Error searching for tax payer:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Container maxWidth="lg">
      <Box className="header-image">
        <Typography variant="h2" component="h1">
          TaxPayer Records Management
        </Typography>
      </Box>
      <Box my={4}>
        <Button
          variant="contained"
          color="primary"
          startIcon={<AddIcon />}
          onClick={() => setOpenForm(true)}
        >
          Add New TaxPayer
        </Button>
      </Box>
      <SearchBar onSearch={handleSearch} />
      {loading ? (
        <Box display="flex" justifyContent="center" my={4}>
          <CircularProgress />
        </Box>
      ) : (
        <TaxPayerTable taxPayers={taxPayers} />
      )}
      <TaxPayerForm open={openForm} onClose={() => setOpenForm(false)} onSubmit={handleAddTaxPayer} />
    </Container>
  );
};

export default App;
