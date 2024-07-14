import { useEffect, useState } from 'react';
import { DataGrid } from '@mui/x-data-grid';

const Phonebook = () => {
  const [rows, setRows] = useState([]);

  useEffect(() => {
    const storedData = localStorage.getItem('phonebook');
    if (storedData) {
      setRows(JSON.parse(storedData));
    }
  }, []);

  const columns = [
    { field: 'name', headerName: 'Name', width: 150 },
    { field: 'surname', headerName: 'Surname', width: 150 },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150 }
  ];

  return (
    <div style={{ height: 400, width: '100%' }}>
      <DataGrid rows={rows} columns={columns}/>
    </div>
  );
};

export default Phonebook;
