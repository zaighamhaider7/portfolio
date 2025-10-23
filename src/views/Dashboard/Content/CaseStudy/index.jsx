import React, { useState } from 'react';
import {
  Grid,
  Card,
  CardHeader,
  CardContent,
  Typography,
  Divider,
  TextField,
  Button,
  Stack
} from '@mui/material';
import CloudUploadIcon from '@mui/icons-material/CloudUpload';

const CaseStudy = () => {
  const [formData, setFormData] = useState({
    title: '',
    description: ''
  });

  const [image, setImage] = useState({ file: null, preview: '' });
  const [loading, setLoading] = useState(false);

  const handleTextChange = (key) => (e) => {
    setFormData((prev) => ({ ...prev, [key]: e.target.value }));
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      setImage({
        file,
        preview: URL.createObjectURL(file)
      });
    }
  };

  const handleSubmit = async () => {
    if (!formData.title || !formData.description || !image.file) {
      alert('Please fill all fields and select an image.');
      return;
    }

    const data = new FormData();
    data.append('title', formData.title);
    data.append('sort_order', formData.sort_order);
    data.append('description', formData.description);
    data.append('image', image.file);

    try {
      setLoading(true);
      const res = await fetch('http://localhost/materially-free-react-admin-template-1.0.0/materially-free-react-admin-template-1.0.0/api/caseStudy/upload_case_study.php', {
        method: 'POST',
        body: data
      });

      const json = await res.json();
      alert(json.message || 'Upload complete');

      // Reset form on success
      if (json.success) {
        setFormData({ title: '', description: '',sort_order: '' });
        setImage({ file: null, preview: '' });
      }
    } catch (err) {
      console.error(err);
      alert('Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} lg={5}>
        <Card elevation={2} className="rounded-3xl shadow-md">
          <CardHeader
            title={<Typography variant="h6" fontWeight={600}>Upload Case Study</Typography>}
          />
          <Divider />
          <CardContent>
            <Stack spacing={2}>
              <TextField
                fullWidth
                label="Title"
                placeholder="Enter a title"
                variant="outlined"
                value={formData.title}
                onChange={handleTextChange('title')}
              />
              <TextField
                fullWidth
                label="Description"
                placeholder="Enter one-line description"
                variant="outlined"
                value={formData.description}
                onChange={handleTextChange('description')}
              />
              
               <TextField
                fullWidth
                label="Position"
                placeholder="Enter Position"
                variant="outlined"
                value={formData.sort_order}
                onChange={handleTextChange('sort_order')}
              />

              <Button
                component="label"
                variant="outlined"
                startIcon={<CloudUploadIcon />}
                sx={{ justifyContent: 'flex-start' }}
              >
                Upload Image
                <input hidden accept="image/*" type="file" onChange={handleImageChange} />
              </Button>

              {image.preview && (
                <Stack spacing={1}>
                  <img
                    src={image.preview}
                    alt="Preview"
                    style={{ maxHeight: 120, borderRadius: 8 }}
                  />
                  <Button
                    size="small"
                    color="error"
                    variant="outlined"
                    onClick={() => setImage({ file: null, preview: '' })}
                  >
                    Remove Image
                  </Button>
                </Stack>
              )}

              <Stack direction="row" justifyContent="flex-end">
                <Button
                  variant="contained"
                  onClick={handleSubmit}
                  disabled={loading}
                >
                  {loading ? 'Submitting...' : 'Submit'}
                </Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default CaseStudy;
