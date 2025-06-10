import React, { useState, useEffect } from 'react';
import { Modal, Button, Form } from 'react-bootstrap';
import { getAllDeveloper } from '../../../../apis/api';
import { useNavigate } from 'react-router-dom';

const AddProject = ({ show, handleClose, onSubmit }) => {
  const navigate = useNavigate();
  const [formData, setFormData] = useState({
    project_name: '',
    project_url: '',
    project_type: '',
    locality: '',
    project_city: '',
    developer_id: '',
  });
  const [developers, setDevelopers] = useState([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    fetchDevelopers();
  }, []);

  const fetchDevelopers = async () => {
    try {
      const response = await getAllDeveloper();
      if (response && response.data) {
        setDevelopers(response.data);
      }
    } catch (err) {
      setError('Failed to fetch developers');
      console.error('Error fetching developers:', err);
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
      // await onSubmit(formData);
      handleClose();
      setFormData({
        projectName: '',
        projectUrl: '',
        projectType: '',
        developerId: ''
      });
      // Navigate to ProjectDetails
      navigate('/ProjectDetails', { replace: true });
    } catch (err) {
      setError('Failed to add project');
      console.error('Error adding project:', err);
    } finally {
      setLoading(false);
    }
  };

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
            >
              <option value="">Select Developer</option>
              {developers.map((developer) => (
                <option key={developer.id} value={developer.id}>
                  {developer.name}
                </option>
              ))}
            </Form.Select>
          </Form.Group>

          <div className="d-flex justify-content-end gap-2">
            <Button
              variant="primary"
              type="submit"
              disabled={loading}
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