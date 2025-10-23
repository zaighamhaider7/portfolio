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

const SDCaseStudy = () => {
      const [formData, setFormData] = useState({
        software_name: '',
        software_description: '',
        software_title: '',
        software_title_description: '',
        project_overview_1: '',
        project_overview_2: '',
        project_overview_3: '',
        goal_1: '',
        goal_2: '',
        last_description: '',
        last_heading: '',
        sort_order: ''
      });
  
  
    // const [files, setFiles] = useState({
    //   heroImage: { file: null, preview: '' },
    //   video1: { file: null, preview: '' },
    //   image1: { file: null, preview: '' },
    //   image2: { file: null, preview: '' },
    //   imgSet1: { file: null, preview: '' },
    //   imgSet2: { file: null, preview: '' },
    //   video3: { file: null, preview: '' }
    // });
  
    const [files, setFiles] = useState({
      software_banner_image: { file: null, preview: '' },
      overview_image_1: { file: null, preview: '' },
      overview_image_2: { file: null, preview: '' },
      goal_image_1: { file: null, preview: '' },
      goal_image_2: { file: null, preview: '' },
      goal_image_3: { file: null, preview: '' },
      software_front_image: { file: null, preview: '' }
    });
  
  
    const handleText = key => e =>
      setFormData({ ...formData, [key]: e.target.value });
  
    const handleFile = key => e => {
      const file = e.target.files[0];
      if (file) {
        const preview = URL.createObjectURL(file);
        setFiles(prev => ({ ...prev, [key]: { file, preview } }));
      }
    };

    const handleSubmit = async () => {
  try {
    const data = new FormData();
    
    // Add form data
    Object.entries(formData).forEach(([key, value]) => {
      data.append(key, value || '');
    });

    // Add files with proper names
    Object.entries(files).forEach(([key, value]) => {
      if (value.file) {
        data.append(key, value.file, value.file.name);
      }
    });

    // Log form data for debugging
    for (let pair of data.entries()) {
      console.log(pair[0] + ': ' + pair[1]);
    }

    const response = await fetch('http://localhost/materially-free-react-admin-template-1.0.0/materially-free-react-admin-template-1.0.0/api/caseStudy copy/upload_sd.php', {
      method: 'POST',
      body: data,
    });

    const responseText = await response.text();
    console.log('Server response:', responseText); // Debug line

    let json;
    try {
      json = JSON.parse(responseText);
    } catch (e) {
      console.error('Failed to parse JSON:', responseText);
      throw new Error('Server returned invalid response format');
    }

    if (!json.success) {
      throw new Error(json.message || 'Upload failed');
    }

    alert('Upload successful!');
    
  } catch (err) {
    console.error('Upload error:', err);
    alert(`Upload failed: ${err.message}`);
  }
};
  
    // const handleSubmit = async () => {
    //   try {
    //     const data = new FormData();
    //     Object.entries(formData).forEach(([k, v]) => data.append(k, v));
    //     Object.entries(files).forEach(([k, v]) => {
    //       if (v.file) data.append(k, v.file);
    //     });
  
    //     const res = await fetch('http://localhost/api/caseStudy/upload_sd.php', {
    //       method: 'POST',
    //       body: data
    //     });
  
    //     const json = await res.json();
    //     if (json.success) {
    //       alert(json.message || 'Upload complete');
    //     } else {
    //       throw new Error(json.message || 'Upload failed');
    //     }
    //   } catch (err) {
    //     console.error('Upload error:', err);
    //     alert('Upload failed: ' + err.message);
    //   }
    // };
  
    const renderPreview = (key, type = 'image') => {
      const src = files[key].preview;
      if (!src) return null;
      return type === 'image' ? (
        <img src={src} alt="preview" style={{ maxHeight: 500, borderRadius: 8, marginTop: 8 }} />
      ) : (
        <video width="800" controls style={{ marginTop: 8 }}>
          <source src={src} />
        </video>
      );
    };

  return (
    <Grid container spacing={3} justifyContent="center">
      <Grid item xs={12} lg={5}>
        <Card elevation={2} className="rounded-3xl shadow-md">
          <CardHeader
            title={<Typography variant="h6" fontWeight={600}>Upload Software Developement Case Study</Typography>}
          />
          <Divider />
          <CardContent>
            <Stack spacing={2}>

              <Typography variant="subtitle1" fontWeight={600}>Software Title & Description</Typography>
              <TextField fullWidth label="Software Title" value={formData.software_title} onChange={handleText('software_title')} />
              <TextField fullWidth label="Software Title Description" value={formData.software_title_description} onChange={handleText('software_title_description')} />
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                Software Front Image
                <input hidden accept="image/*" type="file" onChange={handleFile('software_front_image')} />
              </Button>
              {renderPreview('software_front_image')}

              <Divider />

              <Typography variant="subtitle1" fontWeight={600}>Hero Section</Typography>
              <TextField fullWidth label="Software Name" value={formData.software_name} onChange={handleText('software_name')} />
              <TextField fullWidth label="Software Description" value={formData.software_description} onChange={handleText('software_description')} />
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                Upload Banner Image
                <input hidden accept="image/*" type="file" onChange={handleFile('software_banner_image')} />
              </Button>
              {renderPreview('software_banner_image')}

              {/* <Divider />
              <Typography variant="subtitle1" fontWeight={600}>Third Section</Typography>
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                Upload Video (optional)
                <input hidden accept="video/*" type="file" onChange={handleFile('video1')} />
              </Button>
              {renderPreview('video1', 'video')} */}

              <Divider />
              <Typography variant="subtitle1" fontWeight={600}>Project Overview Section</Typography>
              <TextField fullWidth label="Project Overview First Text" value={formData.project_overview_1} onChange={handleText('project_overview_1')} />
              <TextField fullWidth label="Project Overview Second Text" value={formData.project_overview_2} onChange={handleText('project_overview_2')} />
              <TextField fullWidth label="Project Overview Third Text" value={formData.project_overview_3} onChange={handleText('project_overview_3')} />
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                Project Overview First Image
                <input hidden accept="image/*" type="file" onChange={handleFile('overview_image_1')} />
              </Button>
              {renderPreview('overview_image_1')}
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                 Project Overview Second Image
                <input hidden accept="image/*" type="file" onChange={handleFile('overview_image_2')} />
              </Button>
              {renderPreview('overview_image_2')}

              <Divider />
              <Typography variant="subtitle1" fontWeight={600}>The Goal Section</Typography>
              <TextField fullWidth label="The Goal First Text" value={formData.goal_1} onChange={handleText('goal_1')} />
              <TextField fullWidth label="The Goal Second Text" value={formData.goal_2} onChange={handleText('goal_2')} />
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                Goal First Image
                <input hidden accept="image/*" type="file" onChange={handleFile('goal_image_1')} />
              </Button>
              {renderPreview('goal_image_1')}
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                 Goal Second Image
                <input hidden accept="image/*" type="file" onChange={handleFile('goal_image_2')} />
              </Button>
              {renderPreview('goal_image_2')}
              <Button component="label" variant="outlined" startIcon={<CloudUploadIcon />}>
                 Goal Third Image
                <input hidden accept="image/*" type="file" onChange={handleFile('goal_image_3')} />
              </Button>
              {renderPreview('goal_image_3')}

              <Divider />
              <Typography variant="subtitle1" fontWeight={600}>Last Description & Heading</Typography>
              <TextField fullWidth label="Last Description" value={formData.last_description} onChange={handleText('last_description')} />

              <TextField fullWidth label="Last Heading" value={formData.last_heading} onChange={handleText('last_heading')} />

              <Divider />
              <Typography variant="subtitle1" fontWeight={600}>Enter Where You Want Your Item To Be</Typography>
              <TextField fullWidth label="Number" value={formData.sort_order} onChange={handleText('sort_order')} />


              <Stack direction="row" justifyContent="flex-end">
                <Button variant="contained" onClick={handleSubmit}>Submit</Button>
              </Stack>
            </Stack>
          </CardContent>
        </Card>
      </Grid>
    </Grid>
  );
};

export default SDCaseStudy;
