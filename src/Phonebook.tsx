import axios from 'axios';
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
  DataGrid,
  GridColDef,
  GridToolbarContainer,
  GridActionsCellItem,
  GridEventListener,
  GridRowId,
  GridRowModel,
  GridRowEditStopReasons,
  GridSlots
} from '@mui/x-data-grid';
import AddIcon from '@mui/icons-material/Add';
import EditIcon from '@mui/icons-material/Edit';
import DeleteIcon from '@mui/icons-material/Delete';
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

const users = () => {
  const [rows, setRows] = useState<GridRowsProp>([]);
  const [rowModesModel, setRowModesModel] = useState<GridRowModesModel>({});
  const [isDialogOpen, setDialogOpen] = useState(false);
  const [isConfirmDialogOpen, setConfirmDialogOpen] = useState(false);
  const [currentRow, setCurrentRow] = useState<GridRowModel | null>(null);
  const [rowToDelete, setRowToDelete] = useState<GridRowId | null>(null);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const result = await axios.get('http://localhost:3000/users');
        setRows(result.data);
      } catch (error) {
        console.error('Error fetching data: ', error);
      }
    };
    fetchData();
  }, []);

  const handleRowEditStop: GridEventListener<'rowEditStop'> = (params, event) => {
    if (params.reason === GridRowEditStopReasons.rowFocusOut) {
      event.defaultMuiPrevented = true;
    }
  };

  const processRowUpdate = async (newRow: GridRowModel) => {
    const updatedRow = { ...newRow, isNew: false };
    try {
      await axios.put(`http://localhost:3000/users/${newRow.id}`, updatedRow);
      const newRows = rows.map((row) => (row.id === newRow.id ? updatedRow : row));
      setRows(newRows);
    } catch (error) {
      console.error('Error updating row: ', error);
    }
    return updatedRow;
  };

  const handleRowModesModelChange = (newRowModesModel: GridRowModesModel) => {
    setRowModesModel(newRowModesModel);
  };

  const handleUpdateClick = (row: GridRowModel) => () => {
    setCurrentRow(row);
    setDialogOpen(true);
  };

  const handleDeleteClick = (id: GridRowId) => () => {
    setRowToDelete(id);
    setConfirmDialogOpen(true);
  };

  const handleConfirmDelete = async () => {
    if (rowToDelete !== null) {
      try {
        await axios.delete(`http://localhost:3000/users/${rowToDelete}`);
        const newRows = rows.filter((row) => row.id !== rowToDelete);
        setRows(newRows);
      } catch (error) {
        console.error('Error deleting row: ', error);
      }
    }
    setConfirmDialogOpen(false);
    setRowToDelete(null);
  };

  const columns: GridColDef[] = [
    { field: 'name', headerName: 'Name', width: 150, editable: true },
    { field: 'surname', headerName: 'Surname', width: 150, editable: true },
    { field: 'phoneNumber', headerName: 'Phone Number', width: 150, editable: true },
    {
      field: 'actions',
      type: 'actions',
      headerName: 'Actions',
      width: 150,
      cellClassName: 'actions',
      getActions: ({ row, id }) => [
        <GridActionsCellItem
          icon={<EditIcon />}
          label="Update"
          className="textPrimary"
          onClick={handleUpdateClick(row)}
          color="inherit"
        />,
        <GridActionsCellItem
          icon={<DeleteIcon />}
          label="Delete"
          className="textPrimary"
          onClick={handleDeleteClick(id)}
          color="inherit"
        />
      ]
    }
  ];

  const formik = useFormik({
    initialValues: {
      name: currentRow?.name || '',
      surname: currentRow?.surname || '',
      phoneNumber: currentRow?.phoneNumber || ''
    },
    enableReinitialize: true,
    validationSchema: validationSchema,
    onSubmit: async (values, { resetForm }) => {
      let newRows;
      if (currentRow) {
        try {
          await axios.put(`http://localhost:3000/users/${currentRow.id}`, values);
          newRows = rows.map((row) => (row.id === currentRow.id ? { ...row, ...values } : row));
        } catch (error) {
          console.error('Error updating contact: ', error);
        }
      } else {
        try {
          const result = await axios.post('http://localhost:3000/users', values);
          newRows = [...rows, result.data];
        } catch (error) {
          console.error('Error adding contact: ', error);
        }
      }
      setRows(newRows);
      setDialogOpen(false);
      resetForm();
      setCurrentRow(null);
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
          onRowEditStop={handleRowEditStop}
          processRowUpdate={processRowUpdate}
          slots={{ toolbar: EditToolbar as GridSlots['toolbar'] }}
          slotProps={{ toolbar: { setDialogOpen } }}
        />
      </Box>

      <Dialog open={isDialogOpen} onClose={() => setDialogOpen(false)}>
        <DialogTitle>{currentRow ? 'Update Contact' : 'New Contact'}</DialogTitle>
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

      <Dialog
        open={isConfirmDialogOpen}
        onClose={() => setConfirmDialogOpen(false)}
      >
        <DialogTitle>Confirm Delete</DialogTitle>
        <DialogContent>Are you sure you want to delete this contact?</DialogContent>
        <DialogActions>
          <Button onClick={() => setConfirmDialogOpen(false)}>Cancel</Button>
          <Button onClick={handleConfirmDelete} color="primary">
            OK
          </Button>
        </DialogActions>
      </Dialog>
    </Box>
  );
};

export default users;
