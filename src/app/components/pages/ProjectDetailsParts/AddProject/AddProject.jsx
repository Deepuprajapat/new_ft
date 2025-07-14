import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getAllDeveloper, getAllLocations } from '../../../../apis/api';
import { useNavigate } from 'react-router-dom';
import { createnewproject, getAllProjectsByUrlName } from '../../../../apis/api';

const AddProject = ({ show, handleClose, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project_name: '',
    project_url: '',
    project_type: '',
    project_city: '',
    developer_id: '',
    locality: '',
  });

  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');
  const [developersLoading, setDevelopersLoading] = useState(false);
  const [projectData, setProjectData] = useState(null);
  const [localityOptions, setLocalityOptions] = useState([]);
  const [localitiesLoading, setLocalitiesLoading] = useState(false);
  const [cityOptions , setCityoptions]= useState([])

  // const cityOptions = [
  //   { value: 'DELHI', label: 'Delhi' },
  //   { value: 'NOIDA', label: 'Noida' },
  //   { value: 'GURGAON', label: 'Gurgaon' },
  // ];

  useEffect(() => {
    if (show) { // Only fetch when modal is shown
      fetchDevelopers();
      fetchLocalities();
    }
  }, [show]);

  const fetchDevelopers = async () => {
    setDevelopersLoading(true);
    try {
      const response = await getAllDeveloper();
      console.log("Full API response: ", response);
      
      // Based on your API structure: {data: Array(10), pagination: {...}}
      const devs = response?.data?.data || [];
      
      console.log("Processed developers: ", devs);
      
      // Ensure it's an array and has valid data
      if (Array.isArray(devs) && devs.length > 0) {
        setDevelopers(devs);
        setError('');
      } else {
        setDevelopers([]);
        setError('No developers found');
      }
    } catch (err) {
      setError('Failed to fetch developers');
      setDevelopers([]);
      console.error('Error fetching developers:', err);
    } finally {
      setDevelopersLoading(false);
    }
  };

  const fetchLocalities = async () => {
    setLocalitiesLoading(true);
    try {
      const response = await getAllLocations();
      const options = (response || []).map(loc => ({ value: loc.id, label: loc.locality_name }));
      
      // Create unique city options by filtering out duplicates
      const uniqueCities = [];
      const seenCities = new Set();
      
      (response || []).forEach(loc => {
        if (loc.city && !seenCities.has(loc.city)) {
          seenCities.add(loc.city);
          uniqueCities.push({ value: loc.city, label: loc.city });
        }
      });
      
      setCityoptions(uniqueCities);
      setLocalityOptions(options);
    } catch (err) {
      setLocalityOptions([]);
      setError('Failed to fetch localities');
      console.error('Error fetching localities:', err);
    } finally {
      setLocalitiesLoading(false);
    }
  };

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create the project
      const response = await createnewproject(formData);
      const projectId = response.data?.project_id;

      if (projectId) {
        const propertyResponse = await getAllProjectsByUrlName(projectId);
        console.log("propertyResponse", propertyResponse);
        console.log(propertyResponse.meta_info.canonical, "cc")

        // Store the project data in state
        setProjectData(propertyResponse);

        const canonical = propertyResponse.meta_info.canonical
        handleClose();
        setFormData({
          project_name: '',
          project_url: '',
          project_type: '',
          project_city: '',
          developer_id: '',
          locality: '',
        });

        // 4. Navigate to the canonical URL with project data
        if (canonical) {
          navigate(`/${canonical}`, { state: { projectData: propertyResponse } });
        } else {
          navigate('/ProjectDetails', { state: { projectData: propertyResponse } });
        }
      } else {
        alert("Project created, but no project ID returned.");
      }
    } catch (error) {
      setError('Failed to add project');
      console.error('Error adding project:', error);
    } finally {
      setLoading(false);
    }
  };

  // Debug logging
  console.log("Developers in render:", developers);
  console.log("Developers length:", developers.length);
  console.log("Developers loading:", developersLoading);

  return (
    <Modal show={show} onHide={handleClose} centered>
      <Modal.Header closeButton>
        <Modal.Title>Add New Project</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        {error && (
          <div className="alert alert-danger" role="alert">
            {error}
          </div>
        )}
        <Form onSubmit={handleSubmit}>
          <Form.Group className="mb-3">
            <Form.Label>Project Name</Form.Label>
            <Form.Control
              type="text"
              name="project_name"
              value={formData.project_name}
              onChange={handleChange}
              placeholder="Enter project name"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Project URL</Form.Label>
            <Form.Control
              type="text"
              name="project_url"
              value={formData.project_url}
              onChange={handleChange}
              placeholder="Enter project URL"
              required
            />
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Project Type</Form.Label>
            <Form.Select
              name="project_type"
              value={formData.project_type}
              onChange={handleChange}
              required
            >
              <option value="">Select Project Type</option>
              <option value="RESIDENTIAL">Residential</option>
              <option value="COMMERCIAL">Commercial</option>
            </Form.Select>
          </Form.Group>

          <Form.Group className="mb-3">
            <Form.Label>Developer</Form.Label>
            <Form.Select
              name="developer_id"
              value={formData.developer_id}
              onChange={handleChange}
              required
              disabled={developersLoading}
            >
              <option value="">
                {developersLoading ? 'Loading developers...' : 'Select Developer'}
              </option>
              {developers.map((developer) => (
                <option key={developer.id} value={developer.id}>
                  {developer.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>
         

          <Form.Group className="mb-3">
            <Form.Label>Project City</Form.Label>
            <Form.Select
              name="project_city"
              value={formData.project_city}
              onChange={handleChange}
              required
            >
              <option value="">Select City</option>
              {cityOptions.map((city) => (
                <option key={city.value} value={city.value}>{city.label}</option>
              ))}
            </Form.Select>
          </Form.Group>
          
          <Form.Group className="mb-3">
            <Form.Label>Locality</Form.Label>
            <Form.Select
              name="locality"
              value={formData.locality}
              onChange={handleChange}
              required
              disabled={localitiesLoading}
            >
              <option value="">{localitiesLoading ? 'Loading localities...' : 'Select Locality'}</option>
              {localityOptions.map((loc) => (
                <option key={loc.value} value={loc.value}>{loc.label}</option>
              ))}
            </Form.Select>
          </Form.Group>

     

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="secondary"
              onClick={handleClose}
              disabled={loading}
            >
              Cancel
            </Button>
            <Button
              variant="primary"
              type="submit"
              disabled={loading || developersLoading}
            >
              {loading ? 'Adding...' : 'Add Project'}
            </Button>
          </div>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default AddProject;