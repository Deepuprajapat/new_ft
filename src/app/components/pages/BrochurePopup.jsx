import React, { useState, useEffect } from 'react';
import { Dialog, DialogContent, DialogActions, Button, TextField } from '@mui/material';
import Swal from 'sweetalert2';
import { checkPhoneNumberExists, submitLead } from '../../apis/api';
import { useNavigate } from 'react-router-dom';

const BrochurePopupDialog = ({ open, onClose, projectName }) => {
    const [formData, setFormData] = useState({
        username: '',
        usermobile: '',
        usermsg: ''
    });
    const [error, setError] = useState('');
    const navigate = useNavigate();

    // Sync projectName with formData when the prop changes
    useEffect(() => {
        setFormData((prev) => ({ ...prev, usermsg: projectName }));
    }, [projectName]);

    const handleChange = (e) => {
        const { name, value } = e.target;

        // Phone validation: Only digits and max length of 10
        if (name === 'usermobile') {
            if (!/^\d*$/.test(value)) return; // Allow only digits
            if (value.length > 10) return;   // Limit to 10 digits
        }

        setFormData({ ...formData, [name]: value });
    };

    const handleSubmit = async () => {
        const { username, usermobile } = formData;

        // Basic field validation
        if (!username || !usermobile) {
            setError('Please fill in all fields.');
            return;
        }

        // Phone number length validation
        if (usermobile.length !== 10) {
            setError('Phone number must be exactly 10 digits.');
            return;
        }

        try {
            const phoneExists = await checkPhoneNumberExists(usermobile);

            if (phoneExists) {
                Swal.fire({
                    icon: 'warning',
                    title: 'Number Already Exists',
                    text: 'This phone number is already registered.',
                });
            } else {
                await submitLead(formData);
                Swal.fire({
                    icon: 'success',
                    title: 'Success',
                    text: 'Your details have been submitted successfully!',
                }).then(() => {
                    navigate('/thankYou');  // Redirect to Thank You Page
                });
                onClose();
            }
        } catch (error) {
            Swal.fire({
                icon: 'error',
                title: 'Error',
                text: error.message || 'Something went wrong. Please try again.',
            });
        }
    };

    return (
        <Dialog open={open} onClose={onClose}>
            <DialogContent>
                <p style={{ padding: '10px', color: 'black' }}>
                    Enter your contact details to download the brochure of <br />
                    <strong style={{ fontSize: '24px', color: '#2067d1' }}>{projectName || 'Invest Mango'}</strong>
                </p>
                <TextField
                    label="Enter Name:"
                    type="text"
                    fullWidth
                    name="username"
                    value={formData.username}
                    onChange={handleChange}
                    required
                />
                <TextField
                    margin="dense"
                    label="Enter Phone:"
                    type="text"
                    fullWidth
                    name="usermobile"
                    value={formData.usermobile}
                    onChange={handleChange}
                    required
                />
                {error && <p style={{ color: 'red' }}>{error}</p>}
            </DialogContent>
            <DialogActions>
                <Button onClick={onClose} color="secondary">Cancel</Button>
                <Button onClick={handleSubmit} color="primary">Download</Button>
            </DialogActions>
        </Dialog>
    );
};

export default BrochurePopupDialog;
