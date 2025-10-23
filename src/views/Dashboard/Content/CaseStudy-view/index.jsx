import React, { useEffect, useState, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box, TableContainer,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const BASE_URL = 'http://localhost/materially-free-react-admin-template-1.0.0/materially-free-react-admin-template-1.0.0/api/caseStudy/';

const initialEdit = {
  id: '', title: '', description: '',sort_order:'',
  image: null,
  originalImage: ''
};

export default function CaseStudyTable() {
  const [entries, setEntries] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(initialEdit);
  const dialogRef = useRef();

  useEffect(() => {
    fetchEntries();
  }, []);

  useEffect(() => {
    if (isEditOpen && dialogRef.current) {
      const firstInput = dialogRef.current.querySelector('input, textarea');
      firstInput?.focus();
    }
  }, [isEditOpen]);

  const fetchEntries = async () => {
    setLoading(true);
    try {
      const res = await fetch(`${BASE_URL}/get_case_study.php`);
      const json = await res.json();
      setEntries(json);
    } catch (err) {
      console.error('Fetch failed', err);
    } finally {
      setLoading(false);
    }
  };

  const handleEdit = (row) => {
    setEditData({
      id: row.id,
      title: row.title || '',
      description: row.description || '',
      sort_order: row.sort_order || '',
      image: null,
      originalImage: row.image || ''
    });
    setIsEditOpen(true);
  };

  const submitEdit = async () => {
    const fd = new FormData();
    fd.append('id', editData.id);
    fd.append('title', editData.title);
    fd.append('description', editData.description);
    fd.append('sort_order', editData.sort_order);
    if (editData.image instanceof File) {
      fd.append('image', editData.image);
    }

    try {
      const res = await fetch(`${BASE_URL}/update_case_study.php`, { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) {
        setIsEditOpen(false);
        fetchEntries();
        alert('Updated successfully');
      } else {
        alert(json.message || 'Update failed');
      }
    } catch (e) {
      console.error('Submit failed', e);
      alert('Error updating case study');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Are you sure you want to delete this entry?')) return;
    fetch(`${BASE_URL}/delete_case_study.php?id=${id}`)
      .then(res => res.json())
      .then(() => fetchEntries())
      .catch(console.error);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Uploaded Case Studies</Typography>

      {/* Edit Dialog */}
      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} fullWidth maxWidth="sm" ref={dialogRef}>
        <DialogTitle>Edit Case Study</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            <TextField label="Title" fullWidth value={editData.title} onChange={(e) => setEditData({ ...editData, title: e.target.value })} />
            <TextField label="Description" fullWidth value={editData.description} onChange={(e) => setEditData({ ...editData, description: e.target.value })} />
            <TextField label="Position" fullWidth value={editData.sort_order} onChange={(e) => setEditData({ ...editData, sort_order: e.target.value })} />
            <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
              Upload Image
              <input hidden accept="image/*" type="file" onChange={(e) => {
                const file = e.target.files[0];
                if (file) setEditData((p) => ({ ...p, image: file }));
              }} />
            </Button>

            {/* Image preview */}
            {editData.image instanceof File ? (
              <img src={URL.createObjectURL(editData.image)} alt="Preview" style={{ maxHeight: 100, marginTop: 8 }} />
            ) : (
              editData.originalImage && <img src={`${BASE_URL}/${editData.originalImage}`} alt="Preview" style={{ maxHeight: 100, marginTop: 8 }} />
            )}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      {/* Data Table */}
      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>Title</TableCell>
                <TableCell>Description</TableCell>
                <TableCell>Image</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {entries.map((row) => (
                <TableRow key={row.id}>
                  <TableCell>{row.id}</TableCell>
                  <TableCell>{row.title}</TableCell>
                  <TableCell>{row.description}</TableCell>
                  <TableCell>
                    {row.image ? <img src={`${BASE_URL}/${row.image}`} alt="thumb" width="80" /> : 'N/A'}
                  </TableCell>
                  <TableCell>{row.sort_order}</TableCell>

                  <TableCell>
                    <Button variant="contained" sx={{ mr: 1 }} onClick={() => handleEdit(row)}>Edit</Button>
                    <Button variant="outlined" color="error" onClick={() => handleDelete(row.id)}>Delete</Button>
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      )}
    </Box>
  );
}
