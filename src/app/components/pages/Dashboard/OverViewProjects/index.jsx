import React, { useState } from 'react';
import "../styles/css/OverviewProjects.css";
import { IoIosAdd } from "react-icons/io";
import { Button} from '@mui/material';
import { useNavigate } from 'react-router-dom';
import { TextField, InputAdornment } from '@mui/material';
import { Search as SearchIcon } from '@mui/icons-material';
const index = () => {
    const navigate = useNavigate();
    const handleClick = () => {
      navigate('/addnew-projects'); // Redirect to the desired path
    };
    const [projects, setProjects] = useState([
      {
        projectName: 'Ace Divino',
        uploadDate: '2/19/21',
        lastUpdated: '2/19/21',
        viewProject: 'View Now',
        manage: 'Access / Manage'
      },
      {
        projectName: 'Vistara',
        uploadDate: '5/7/16',
        lastUpdated: '5/7/16',
        viewProject: 'View Now',
        manage: 'Access / Manage'
      },
      {
        projectName: 'Ace Hane\'i',
        uploadDate: '9/18/16',
        lastUpdated: '9/18/16',
        viewProject: 'View Now',
        manage: 'Access / Manage'
      },
      {
        projectName: 'Godrej Ajnara',
        uploadDate: '2/11/12',
        lastUpdated: '2/11/12',
        viewProject: 'View Now',
        manage: 'Access / Manage'
      },
      {
        projectName: 'Pan Oasis',
        uploadDate: '9/18/16',
        lastUpdated: '9/18/16',
        viewProject: 'View Now',
        manage: 'Access / Manage'
      },
      {
        projectName: 'M3M The Line',
        uploadDate: '1/28/17',
        lastUpdated: '1/28/17',
        viewProject: 'View Now',
        manage: 'Access / Manage'
      },
      {
        projectName: 'M3M Signature',
        uploadDate: '5/27/15',
        lastUpdated: '5/27/15',
        viewProject: 'View Now',
        manage: 'Access / Manage'
      },
      {
        projectName: 'Bella Astra',
        uploadDate: '8/2/19',
        lastUpdated: '8/2/19',
        viewProject: 'View Now',
        manage : 'Access / Manage'
      }
    ]);
  return (
    <div className="overview-projects">
    <div className='Headings'>
      <div className="head">
    <h3>Projects</h3>
    <p>View Manage add Projects</p>
    </div>
    <Button variant="contained" color="primary" type="submit"  navigate="addnew-projects" onClick={handleClick} >
    <IoIosAdd /> Add 
          </Button>
    </div>
    <div className="input-wrapper">
    <SearchIcon className="icon"/>
    <input placeholder='Search By Project Name'/>
    </div>
    <table className="projects-table">
      <thead>
        <tr>
          <th>Project Name</th>
          <th>Upload Date</th>
          <th>Last Updated</th>
          <th>Actions</th>
        </tr>
      </thead>
      <tbody>
        {projects.map((project, index) => (
          <tr key={index}>
            <td>{project.projectName}</td>
            <td>{project.uploadDate}</td>
            <td>{project.lastUpdated}</td>
            <td>
              <button>{project.viewProject}</button>
              <button>{project.manage}</button>
            </td>
          </tr>
        ))}
      </tbody>
    </table>
  </div>
  )
}

export default index
