import { useEffect, useState } from 'react';
import {
  Box,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  TextField
} from '@mui/material';
import {
  GridRowsProp,
  GridRowModesModel,
  GridRowModel,
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridSlots
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import { useFormik } from 'formik';
import * as Yup from 'yup';

const validationSchema = Yup.object({
  name: Yup.string().required('Required'),
  surname: Yup.string().required('Required'),
  phoneNumber: Yup.string().required('Required')
});

interface EditToolbarProps {
  setDialogOpen: (isOpen: boolean) => void;
}

function EditToolbar(props: EditToolbarProps) {
  const { setDialogOpen } = props;

  const handleClick = () => {
    setDialogOpen(true);
  };

  return (
    <GridToolbarContainer>
      <Button color="primary" startIcon={<AddIcon />} onClick={handleClick}>
        New
      </Button>
    </GridToolbarContainer>
  );
}

const Phonebook = () => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isDialogOpen, setDialogOpen] = useState(false);

  useEffect(() => {
    const storedData = localStorage.getItem('phonebook');
    if (storedData) {
      setRows(JSON.parse(storedData));
    }
  }, []);

  const processRowUpdate = (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    const newRows = rows.map((row) => (row.id === newRow.id ? updatedRow : row));
    setRows(newRows);
    localStorage.setItem('phonebook', JSON.stringify(newRows));
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'surname', headerName: 'Surname', width: 150, editable: true },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150, editable: true }
  ];

  const formik = useFormik({
    initialValues: {
      name: '',
      surname: '',
      phoneNumber: ''
    },
    validationSchema: validationSchema,
    onSubmit: (values, { resetForm }) => {
      const newRows = [...rows, { id: rows.length + 1, ...values }];
      setRows(newRows);
      localStorage.setItem('phonebook', JSON.stringify(newRows));
      setDialogOpen(false);
      resetForm();
    }
  });

  return (
    <Box
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      height="calc(100vh - 64px)"
      mt={10}
    >
      <Box sx={{ height: 400, width: '100%' }}>
        <DataGrid
          rows={rows}
          columns={columns}
          editMode="row"
          rowModesModel={rowModesModel}
          onRowModesModelChange={handleRowModesModelChange}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
          slotProps={{ toolbar: { setDialogOpen } }}
        />
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>New Contact</DialogTitle>
        <DialogContent>
          <form onSubmit={formik.handleSubmit}>
            <TextField
              fullWidth
              margin="dense"
              id="name"
              name="name"
              label="Name"
              value={formik.values.name}
              onChange={formik.handleChange}
              error={formik.touched.name && Boolean(formik.errors.name)}
              helperText={formik.touched.name && formik.errors.name}
            />
            <TextField
              fullWidth
              margin="dense"
              id="surname"
              name="surname"
              label="Surname"
              value={formik.values.surname}
              onChange={formik.handleChange}
              error={formik.touched.surname && Boolean(formik.errors.surname)}
              helperText={formik.touched.surname && formik.errors.surname}
            />
            <TextField
              fullWidth
              margin="dense"
              id="phoneNumber"
              name="phoneNumber"
              label="Phone Number"
              value={formik.values.phoneNumber}
              onChange={formik.handleChange}
              error={formik.touched.phoneNumber && Boolean(formik.errors.phoneNumber)}
              helperText={formik.touched.phoneNumber && formik.errors.phoneNumber}
            />
            <DialogActions>
              <Button onClick={() => setDialogOpen(false)}>Cancel</Button>
              <Button type="submit" variant="contained" color="primary">
                Save
              </Button>
            </DialogActions>
          </form>
        </DialogContent>
      </Dialog>
    </Box>
  );
};

export default Phonebook;
