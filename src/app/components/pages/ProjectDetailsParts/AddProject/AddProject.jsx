import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getAllDeveloper, getAllLocations } from '../../../../apis/api';
import { useNavigate } from 'react-router-dom';
import { createnewproject, getAllProjectsByUrlName ,checkSlugAvialableUrl } from '../../../../apis/api';
import { useRef } from 'react';

const AddProject = ({ show, handleClose }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project_name: '',
    slug: '',
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
  const [slugAvailable, setSlugAvailable] = useState(null);
  const [slugCheckLoading, setSlugCheckLoading] = useState(false);
  const slugDebounceRef = useRef();

  // const cityOptions = [
  //   { value: 'DELHI', label: 'Delhi' },
  //   { value: 'NOIDA', label: 'Noida' },
  //   { value: 'GURGAON', label: 'Gurgaon' },
  // ];

  // Fetch developers
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

  useEffect(() => {
    if (show) { // Only fetch when modal is shown
      fetchDevelopers();
      fetchCities(); // Fetch all cities on modal open
      setLocalityOptions([]); // Reset localities when modal opens
    }
  }, [show]);

  // Fetch all cities (on modal open)
  const fetchCities = async () => {
    try {
      const response = await getAllLocations();
      const uniqueCities = [];
      const seenCities = new Set();

      (response || []).forEach(loc => {
        if (loc.city && !seenCities.has(loc.city)) {
          seenCities.add(loc.city);
          uniqueCities.push({ value: loc.city, label: loc.city });
        }
      });

      setCityoptions(uniqueCities);
    } catch (err) {
      setCityoptions([]);
      setError('Failed to fetch cities');
      console.error('Error fetching cities:', err);
    }
  };

  // Fetch localities for a city
  const fetchLocalities = async (city) => {
    setLocalitiesLoading(true);
    try {
      const response = await getAllLocations(city); // Pass city param
      const options = (response || []).map(loc => ({ value: loc.id, label: loc.locality_name }));
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

    if (name === "project_city") {
      fetchLocalities(value); // Fetch localities for selected city
      setFormData(prev => ({
        ...prev,
        locality: '' // Reset locality when city changes
      }));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    try {
      // 1. Create the project
      const response = await createnewproject(formData);
      const projectId = response.data?.project_id;
      console.log(projectId,"projectid")
      if (projectId) {
        const propertyResponse = await getAllProjectsByUrlName(projectId);
        console.log("propertyResponse", propertyResponse);
        console.log(propertyResponse.meta_info.slug, "cc")

        // Store the project data in state
        setProjectData(propertyResponse);

        const canonical = propertyResponse.slug
        handleClose();
        setFormData({
          project_name: '',
          slug: '',
          project_type: '',
          project_city: '',
          developer_id: '',
          locality: '',
        });
       const stateData = { projectId }

        // 4. Navigate to the canonical URL with project data
        if (canonical) {
          sessionStorage.setItem('projectState', JSON.stringify(stateData));
          navigate(`/${canonical}`);
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

  // Debounced slug check
  useEffect(() => {
    if (!formData.slug) {
      setSlugAvailable(null);
      setSlugCheckLoading(false);
      return;
    }
    setSlugCheckLoading(true);
    setSlugAvailable(null);
    if (slugDebounceRef.current) {
      clearTimeout(slugDebounceRef.current);
    }
    slugDebounceRef.current = setTimeout(async () => {
      try {
        const response = await checkSlugAvialableUrl({ params: { url: formData.slug } });
        if (response.data) {
          setSlugAvailable(response.data.exists);
        } else if (typeof response.data === 'boolean') {
          setSlugAvailable(response.data);
        } else {
          setError('Unexpected response from slug check');
        }
      } catch (err) {
        setError('Failed to check slug availability');
        setSlugAvailable(null);
      } finally {
        setSlugCheckLoading(false);
      }
    }, 500);
    return () => clearTimeout(slugDebounceRef.current);
  }, [formData.slug]);

  // Helper to reset form
  const resetForm = () => {
    setFormData({
      project_name: '',
      slug: '',
      project_type: '',
      project_city: '',
      developer_id: '',
      locality: '',
    });
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
            <Form.Label>Slug</Form.Label>
            <Form.Control
              type="text"
              name="slug"
              value={formData.slug}
              onChange={handleChange}
              placeholder="Enter project URL"
              required
            />
            {slugCheckLoading && formData.slug && (
              <div style={{ color: '#888', fontSize: '0.9em', marginTop: 4 }}>Checking slug availability...</div>
            )}
            {slugAvailable === false && (
              <div style={{ color: 'green', fontSize: '0.9em', marginTop: 4 }}>Slug is available!</div>
            )}
            {slugAvailable === true && (
              <div style={{ color: 'red', fontSize: '0.9em', marginTop: 4 }}>Slug is already taken.</div>
            )}
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
              onClick={() => { resetForm(); handleClose(); }}
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