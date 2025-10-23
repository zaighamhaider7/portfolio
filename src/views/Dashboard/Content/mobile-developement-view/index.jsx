// ✅ Fixed version of MobileDevTable with improved accessibility and focus handling
import React, { useEffect, useState, useRef } from 'react';
import {
  Table, TableBody, TableCell, TableHead, TableRow,
  Paper, Typography, CircularProgress, Box, TableContainer,
  Button, Dialog, DialogTitle, DialogContent, DialogActions,
  TextField, Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const BASE_URL = 'http://localhost/materially-free-react-admin-template-1.0.0/materially-free-react-admin-template-1.0.0/api';

const initialEditData = {
  id: '', app_name: '', app_description: '', app_title: '', app_title_description: '', project_overview_1: '', project_overview_2: '', project_overview_3: '', goal_1: '', goal_2: '', last_description: '', last_heading: '',
  sort_order: '',
  app_banner_image: null, overview_image_1: null, overview_image_1: null, goal_image_1: null, goal_image_2: null, goal_image_3: null, app_front_image: null,
  originalPaths: {}
};

const fileFields = ['app_banner_image', 'overview_image_1', 'overview_image_2', 'goal_image_1', 'goal_image_2', 'goal_image_3', 'app_front_image'];
const fieldMeta = [
  ['app_banner_image', 'App Banner Image', 'image/*'],
  ['overview_image_1', 'Project Overview First Image', 'image/*'],
  ['overview_image_2', 'Project Overview Second Image', 'image/*'], 
  ['goal_image_1', 'Goal First Image', 'image/*'],
  ['goal_image_2', 'Goal Second Image', 'image/*'], 
  ['goal_image_3', 'Goal Third Image', 'image/*'],
  ['app_front_image', 'App Front Image', 'image/*']
];

const ScrollCell = ({ children }) => (
  <Box
    sx={{
      maxHeight: 100,
      overflowX: 'auto',
      overflowY: 'auto',
    }}
  >
    {children}
  </Box>
);

export default function MobileDevTable() {
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [isEditOpen, setIsEditOpen] = useState(false);
  const [editData, setEditData] = useState(initialEditData);
  const dialogRef = useRef();

  const fetchApps = () => {
    setLoading(true);
    fetch(`${BASE_URL}/get_mobile_apps.php`)
      .then((r) => r.json())
      .then((data) => {
        setApps(data);
        console.log('Fetched apps: ', data);
        setLoading(false);
      })
      .catch((err) => {
        console.error(err);
        setLoading(false);
      });
  };

  useEffect(fetchApps, []);

  useEffect(() => {
    if (isEditOpen && dialogRef.current) {
      const firstInput = dialogRef.current.querySelector('input, textarea, select, button');
      firstInput?.focus();
    }
  }, [isEditOpen]);

  const handleEdit = async (app) => {
    document.activeElement?.blur();
    try {
      const latest = await fetch(`${BASE_URL}/get_mobile_apps.php`).then((r) => r.json());
      const row = latest.find((a) => String(a.id) === String(app.id));
      const originalPaths = {};
      fileFields.forEach((field) => {
        originalPaths[field] = row[field] || '';
        console.log('Fetched apps:', originalPaths[field]);
        console.log('Fetched Row:', row[field]);


      });

      setEditData({
        id: row.id,
        app_name: row.app_name || '',
        app_description: row.app_description || '',
        app_title: row.app_title || '',
        app_title_description: row.app_title_description || '',
        project_overview_1: row.project_overview_1 || '',
        project_overview_2: row.project_overview_2 || '',
        project_overview_3: row.project_overview_3 || '',
        goal_1: row.goal_1 || '',
        goal_2: row.goal_2 || '',
        last_description: row.last_description || '',
        last_heading: row.last_heading || '',
        sort_order: row.sort_order || '',
        app_banner_image: null,
        overview_image_1: null,
        overview_image_2: null,
        goal_image_1: null,
        goal_image_2: null,
        goal_image_3: null,
        app_front_image: null,
        originalPaths
      });
      setIsEditOpen(true);
    } catch (e) {
      console.error('Edit fetch failed', e);
    }
  };

  const submitEdit = async () => {
    const fd = new FormData();
    fd.append('id', editData.id);

    Object.entries(editData).forEach(([key, val]) => {
      if (fileFields.includes(key)) {
        if (val instanceof File) fd.append(key, val);
      } else if (key !== 'originalPaths') {
        fd.append(key, val);
      }
    });

    try {
      const res = await fetch(`${BASE_URL}/update_mobile_app.php`, { method: 'POST', body: fd });
      const json = await res.json();
      if (json.success) {
        const newPaths = {};
        fileFields.forEach((field) => {
          newPaths[field] = json.data[field] || editData.originalPaths[field] || '';
        });

        setEditData(prev => ({ ...prev, originalPaths: newPaths, ...fileFields.reduce((acc, key) => ({ ...acc, [key]: null }), {}) }));
        fetchApps();
        alert('Updated successfully');
        setIsEditOpen(false);
      } else alert(json.message || 'Update failed');
    } catch (e) {
      console.error(e);
      alert('Update failed');
    }
  };

  const handleDelete = (id) => {
    if (!window.confirm('Delete this record?')) return;
    fetch(`${BASE_URL}/delete_mobile_app.php?id=${id}`)
      .then((r) => r.json())
      .then(() => setApps((prev) => prev.filter((a) => a.id !== id)))
      .catch(console.error);
  };

  return (
    <Box p={3}>
      <Typography variant="h5" gutterBottom>Uploaded Mobile App Entries</Typography>

      <Dialog open={isEditOpen} onClose={() => setIsEditOpen(false)} maxWidth="md" fullWidth disableEnforceFocus ref={dialogRef}>
        <DialogTitle>Edit Mobile Application</DialogTitle>
        <DialogContent dividers>
          <Stack spacing={2}>
            {[
              ['app_name', 'App Name'],
              ['app_description', 'App Description'],
              ['app_title', 'App Title'],
              ['app_title_description', 'App Title Description'],
              ['project_overview_1', 'Project Overview 1'],
              ['project_overview_2', 'Project Overview 2'],
              ['project_overview_3', 'Project Overview 3'],
              ['goal_1', 'Goal 1'],
              ['goal_2', 'Goal 2'],
              ['last_description', 'Last Description'],
              ['last_heading', 'Last Heading'],
              ['sort_order', 'Position'],
            ].map(([field, label]) => (
              <TextField key={field} label={label} fullWidth value={editData[field]} onChange={(e) => setEditData({ ...editData, [field]: e.target.value })} />
            ))}

            {fieldMeta.map(([field, label, accept]) => (
              <Box key={field}>
                <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                  Update {label}
                  <input hidden accept={accept} type="file" onChange={(e) => {
                    const file = e.target.files[0];
                    if (file) setEditData((p) => ({ ...p, [field]: file }));
                  }} />
                </Button>
                {/* {editData[field] instanceof File ? (
                  <Box mt={1}>{accept.startsWith('image') ? (
                    <img src={URL.createObjectURL(editData[field])} alt={label} style={{ maxHeight: 100, borderRadius: 8 }} />
                  ) : (
                    <video width="200" controls><source src={URL.createObjectURL(editData[field])} /></video>
                  )}</Box>
                ) : (
                  !!editData.originalPaths[field] && <Box mt={1}>{accept.startsWith('image') ? (
                    <img src={`${BASE_URL}/${editData.originalPaths[field]}`} alt={label} style={{ maxHeight: 100, borderRadius: 8 }} />
                  ) : (
                    <video width="200" controls><source src={`${BASE_URL}/${editData.originalPaths[field]}`} /></video>
                  )}</Box>
                )} */}
                {editData[field] instanceof File ? (
                  <Box mt={1}>
                    <img
                      src={URL.createObjectURL(editData[field])}
                      alt={label}
                      style={{ maxHeight: 100, borderRadius: 8 }}
                    />
                  </Box>
                ) : (
                  !!editData.originalPaths[field] && (
                    <Box mt={1}>
                      <img
                        src={`${BASE_URL}/${editData.originalPaths[field]}`}
                        alt={label}
                        style={{ maxHeight: 100, borderRadius: 8 }}
                      />
                    </Box>
                  )
                )}
              </Box>
            ))}
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setIsEditOpen(false)}>Cancel</Button>
          <Button variant="contained" onClick={submitEdit}>Save</Button>
        </DialogActions>
      </Dialog>

      {loading ? <CircularProgress /> : (
        <TableContainer component={Paper}>
          <Table>
            <TableHead>
              <TableRow>
                <TableCell>#</TableCell>
                <TableCell>App Name</TableCell>
                <TableCell>App Description</TableCell>
                <TableCell>App Title</TableCell>
                <TableCell>App Title Description</TableCell>
                <TableCell>Project Overview 1</TableCell>
                <TableCell>Project Overview 2</TableCell>
                <TableCell>Project Overview 3</TableCell>
                <TableCell>Goal 1</TableCell>
                <TableCell>Goal 2</TableCell>
                <TableCell>Last Description</TableCell>
                <TableCell>Last Heading</TableCell>
                <TableCell>App Image</TableCell>
                <TableCell>Position</TableCell>
                <TableCell>Actions</TableCell>
              </TableRow>
            </TableHead>
           <TableBody>
  {apps.map((app) => (
    <TableRow key={app.id}>
      <TableCell><ScrollCell>{app.id}</ScrollCell></TableCell>
      <TableCell><ScrollCell>{app.app_name}</ScrollCell></TableCell>
      <TableCell><ScrollCell>{app.app_description}</ScrollCell></TableCell>
      <TableCell><ScrollCell>{app.app_title}</ScrollCell></TableCell>
      <TableCell><ScrollCell>{app.app_title_description}</ScrollCell></TableCell>
      <TableCell><ScrollCell>{app.project_overview_1}</ScrollCell></TableCell>
      <TableCell><ScrollCell>{app.project_overview_2}</ScrollCell></TableCell>
      <TableCell><ScrollCell>{app.project_overview_3}</ScrollCell></TableCell>
      <TableCell><ScrollCell>{app.goal_1}</ScrollCell></TableCell>
      <TableCell><ScrollCell>{app.goal_2}</ScrollCell></TableCell>
      <TableCell><ScrollCell>{app.last_description}</ScrollCell></TableCell>
      <TableCell><ScrollCell>{app.last_heading}</ScrollCell></TableCell>

      <TableCell>
        {app.app_front_image ? (
          <img src={`${BASE_URL}/${app.app_front_image}`} width="50" alt="hero" />
        ) : 'N/A'}
      </TableCell>

      <TableCell><ScrollCell>{app.sort_order}</ScrollCell></TableCell>

      <TableCell>
        <Button variant="contained" sx={{ mr: 1 }} onClick={() => handleEdit(app)}>Edit</Button>
        <Button variant="outlined" color="error" onClick={() => handleDelete(app.id)}>Delete</Button>
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
