import React, { useState, useEffect } from "react";
import "../styles/css/appNewProject.css";
import { AiOutlineCheck } from "react-icons/ai";
import { Steps, Form, Button, message } from "antd";
import { LogoutOutlined, ProfileOutlined } from "@ant-design/icons";
import { MedicalServicesOutlined } from "@mui/icons-material";
import { MdOutlinePermMedia } from "react-icons/md";
import { BsFillBuildingsFill } from "react-icons/bs";
// import { Select, MenuItem, InputLabel, FormControl, Checkbox, ListItemText } from "@mui/material";
import Select, { components } from "react-select";
import {
  getAllPropertyConfiguration,
  getAllLocality,
  getAllAmenitiesWithCategory,
  getAllDeveloper,
} from "../../apis/api";

const CheckboxOption = (props) => {
  return (
    <components.Option {...props}>
      <input
        type="checkbox"
        checked={props.isSelected}
        onChange={() => null}
        style={{ marginRight: 8 }}
      />
      <label>{props.label}</label>
    </components.Option>
  );
};

const AddNewProjects = () => {
  const [selectedOption, setSelectedOption] = useState([]);
  const [propertyConfigData, setConfigType] = useState([]);
  const [localityData, setLocality] = useState([]);
  const [amenitiesData, setAmenities] = useState([]);
  const [uniqueCategory, setUniqueCategory] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState("");
  const [filteredAmenities, setFilteredAmenities] = useState([]);
  const [getDeveloper, setDeveloper] = useState([]);
  const [currentState, setCurrentState] = useState(0);
  const [basicDetails,setBasicDetails]= useState(null);
  const [usp,setUsp] = useState();
  const [image,setImage] = useState();
  const [faq,setFaq] = useState();
  const onFinishBasicForm =(values)=>{
    setBasicDetails(values);
    setCurrentState(1);
  };
  const onFinishImageForm =(values)=>{
    setImage(values);
    setCurrentState(2);
  }
  
  const onFinishUspForm =(values)=>{
    setUsp(values);
    setCurrentState(3);
  };
  const onFinishFaqForm =(values)=>{
    setFaq(values);
    setCurrentState(4);
  }
 

  const handleChange = (selectedOption) => {
    setSelectedOption(selectedOption || []);
  };
  const handleCategoryChange = (event) => {
    const category = event.target.value;
    setSelectedCategory(category);
    const filtered = amenitiesData.filter(
      (amenity) => amenity.category === category
    );
    setFilteredAmenities(filtered);
  };

  useEffect(() => {
    const fetchConfiguration = async () => {
      try {
        const propertyConfigData = await getAllPropertyConfiguration();
        console.log("Fetched Property Configurations:", propertyConfigData);
        setConfigType(propertyConfigData);
      } catch (error) {
        console.error("Error fetching property configurations:", error);
      }
    };

    const fetchLocality = async () => {
      try {
        const localityData = await getAllLocality();
        console.log("Fetched Localities:", localityData.data);
        setLocality(localityData.data || []);
      } catch (error) {
        console.error("Error fetching localities:", error);
      }
    };
    const fetchAmenities = async () => {
      try {
        const amenitiesData = await getAllAmenitiesWithCategory();
        console.log("fetching Amenities", amenitiesData.data);
        setAmenities(amenitiesData.data || []);
        const categories = Array.from(
          new Set(amenitiesData.data.map((amenity) => amenity.category))
        );
        setUniqueCategory(categories);
        console.log("uniqueCategory", categories);
      } catch (error) {
        console.error("Error fetching Amenities:", error);
      }
    };
    const fetchDeveloper = async () => {
      try {
        const getDeveloper = await getAllDeveloper();
        setDeveloper(getDeveloper.data || []);
        console.log("fetching Developer", getDeveloper.data);
      } catch (error) {
        console.error("Error fetching Developer:", error);
      }
    };

    fetchConfiguration();
    fetchLocality();
    fetchAmenities();
    fetchDeveloper();
  }, []);
  const forms=[
    <BasicForm  onFinish={onFinishBasicForm}
    propertyConfigData={propertyConfigData}
    localityData={localityData}/>,
    <ImageForm onFinish={onFinishImageForm}/>,
    <Usp onFinish={onFinishUspForm}/>,
    <Faq onFinish={onFinishFaqForm}/>,
  ];
  return (
    <div className="overview-projects">
      <div className="steps">
        <Steps onChange={setCurrentState} current={currentState}>
          <Steps.Step title="Basic Details" icon={<LogoutOutlined />} />
          <Steps.Step title="Images" icon={<ProfileOutlined />} />
          <Steps.Step title="USP" icon={<MdOutlinePermMedia />} />
          <Steps.Step title="FAQ" icon={<BsFillBuildingsFill />} />
        </Steps>
        <BasicForm onFinish={onFinishBasicForm}/>
      </div>
      {/* <div className="basic-form">
        <div className="headings">
          <h6>Basic Details</h6>
        </div>
        <div className="basic-form">
          <form>
           
            
           
            <button type="onSubmit">Save</button>
          </form>
        </div>
      </div> */}
    </div>
  );
};

function BasicForm({ onFinish, propertyConfigData, localityData }) {
  return (
    <Form onFinish={onFinish}>
      <div>
        <div className="inputDiv">
          <label htmlFor="project Name">Project Name</label>
          <input
            type="text"
            name="projectName"
            id="projectName"
            placeholder="Ace Divino"
          />
        </div>
        <div className="inputDiv">
          <label htmlFor="project Name">Overview Paragraph</label>
          <textarea
            type="text"
            name="projectName"
            id="projectName"
            placeholder="Ace Divino"
          />
        </div>

        <div className="inputDiv">
          <label htmlFor="projectName">Overview Paragraph</label>
          <select>
            <option value="" disabled selected>
              Select Property Type
            </option>
            {propertyConfigData.map((config) => (
              <option value={config.configurationName} key={config.id}>
                {config.configurationName}
              </option>
            ))}
          </select>
        </div>
        {/* <div className="headings">
                <h6>Location Info</h6>
              </div> */}
        <div className="main-input">
          <div className="inputDiv">
            <label htmlFor="Location">Location</label>
            <input
              type="text"
              name="Location"
              id="Location"
              placeholder="Address of project "
            />
          </div>
          <div className="inputDiv">
            <label htmlFor="Location Link">Location Link</label>
            <input
              type="url"
              name="Location Link"
              id="Location Link"
              placeholder="https://example.com"
            />
          </div>
        </div>
        <div className="main-input">
          <div className="inputDiv">
            <label htmlFor="State">State</label>
            <select>
              <option value="" disabled selected>
                Select State
              </option>
              <option value="India">India</option>
              <option value="Amir">Amir</option>
            </select>
          </div>
          <div className="inputDiv">
            <label htmlFor="City">City</label>
            <select>
              <option value="" disabled selected>
                Select City
              </option>
              <option value="India">India</option>
              <option value="Amir">Amir</option>
            </select>
          </div>
        </div>
        <div className="inputDiv">
          <label htmlFor="locality">Locality</label>
          <select>
            <option value="" disabled selected>
              Select Locality
            </option>
            {localityData.map((locality) => (
              <option value={locality.name} key={locality.id}>
                {locality.name}
              </option>
            ))}
          </select>
        </div>
        <div className="main-input">
          <div className="inputDiv">
            <label htmlFor="Location">Rera No</label>
            <input
              type="text"
              name="Rera"
              id="Rera"
              placeholder="Project Rera"
            />
          </div>
          <div className="inputDiv">
            <label htmlFor="Rera Link">Rera Link</label>
            <input
              type="url"
              name="Rera Link"
              id="Location Link"
              placeholder="https://example.com"
            />
          </div>
        </div>
        <div className="main-input">
          <div className="inputDiv">
            <label htmlFor="Launch Date">Launch Date</label>
            <input
              type="date"
              name="LaunchDate"
              id="LaunchDate"
              placeholder="Launch Date"
            />
          </div>
          <div className="inputDiv">
            <label htmlFor="PossessionDate">Possession Date</label>
            <input
              type="date"
              name="PossessionDate"
              id="PossessionDate"
              placeholder="https://example.com"
            />
          </div>
        </div>
        {/* <div className="headings">
                <h6>Floor Specification</h6>
              </div> */}
        <div className="main-input">
          <div className="inputDiv">
            <label htmlFor="TotalFloor">Total Floor</label>
            <input
              type="text"
              name="TotalFloor"
              id="TotalFloor"
              placeholder="Launch Date"
            />
          </div>
          <div className="inputDiv">
            <label htmlFor="AvailableUnits">Available Units</label>
            <input
              type="text"
              name="AvailableUnits"
              id="AvailableUnits"
              placeholder="Available Units"
            />
          </div>
          <div className="inputDiv">
            <label htmlFor="Area">Area</label>
            <input type="text" name="Area" id="Area" placeholder="Sqr.ft" />
          </div>
        </div>
        <div className="headings">
          <h6>Category</h6>
        </div>
        <div className="main-input">
          <div className="group">
            <input type="checkbox" name="Priority" id="Priority" />
            <label htmlFor="Priority">Priority</label>
          </div>
          <div className="group">
            <input type="checkbox" name="Featured" id="Featured" />
            <label htmlFor="Featured">Featured</label>
          </div>
          <div className="group">
            <input type="checkbox" name="Premium" id="Premium" />
            <label htmlFor="Premium">Premium</label>
          </div>
          <div className="group">
            <input type="checkbox" name="Discontinued" id="Discontinued" />
            <label htmlFor="Discontinued">Discontinued</label>
          </div>
        </div>

        <div className="inputDiv">
          <label htmlFor="locality">Project Status</label>
          <select>
            <option value="" disabled selected>
              Select Status
            </option>
            <option value="Ready To Move">Ready To move</option>
            <option value="New Launch">New Launch</option>
            <option value="Delivered">Delivered</option>
            <option value="Under Construction">Under Construction</option>
            <option value="Pre-Launch">Pre Launch</option>
          </select>
        </div>
        {/* <div className="headings">
                <h6>Product Detailed Information</h6>
              </div> */}
        <div className="inputDiv">
          <label htmlFor="project Name">Why Choose Us</label>
          <textarea
            type="text"
            name="projectName"
            id="projectName"
            placeholder="Ace Divino"
          />
        </div>

        <div className="inputDiv">
          <label htmlFor="Meta Title">Meta Title</label>
          <input
            type="text"
            name="Meta Title"
            id="Meta Title"
            placeholder="Meta Title"
          />
        </div>
        <div className="inputDiv">
          <label htmlFor="MetaDescription">Meta Description</label>
          <textarea
            type="text"
            name="MetaDescription"
            id="MetaDescription"
            placeholder="Meta Description"
          />
        </div>
        <div className="inputDiv">
          <label htmlFor="MobileNumber">Mobile Number </label>
          <input
            type="number"
            name="MobileNumber"
            maxlength="10"
            pattern="[5-9][0-9]{9}"
            id="MobileNumber"
            placeholder="MobileNumber"
          />
        </div>

        <div className="headings">
          <h6>Payment Plan</h6>
        </div>
        <div className="inputDiv">
          <label htmlFor="MobileNumber">Payment Plan Para </label>
          <input type="number" name="MobileNumber" placeholder="Description" />
        </div>

        <div className="inputDiv">
          <label htmlFor="PriceListPara">Price List Para</label>
          <textarea
            type="number"
            name="PriceListPara"
            placeholder="Description"
          />
        </div>
        <div className="headings">
          <h6>Amenities</h6>
        </div>
        <div className="inputDiv">
          <label>Select Category</label>
          <select value={selectedCategory} onChange={handleCategoryChange}>
            <option value="" disabled>
              Select Category
            </option>
            {uniqueCategory.map((category, index) => (
              <option value={category} key={index}>
                {category}
              </option>
            ))}
          </select>
        </div>

        {/* Select Amenities */}
        <div className="inputDiv">
          <label>Select Amenities</label>
          <Select
            components={{ Option: CheckboxOption }}
            options={filteredAmenities.map((amenity) => ({
              value: amenity.id,
              label: amenity.name,
            }))}
            value={selectedOption}
            onChange={handleChange}
            isMulti
            closeMenuOnSelect={false}
            hideSelectedOptions={false}
          />
        </div>
        <div className="inputDiv">
          <label htmlFor="Developer Name">Developer Name</label>
          <Select
            options={getDeveloper.map((developer) => ({
              value: developer.id,
              label: developer.name,
            }))}
            value={selectedOption}
            onChange={(selected) => setSelectedOption(selected)}
            isMulti={false}
            closeMenuOnSelect={true}
            hideSelectedOptions={false}
          />
        </div>
      </div>
      <button type="submit">Next</button>
    </Form>
  );
}

function Usp({}){
  <Form onFinish={onFinish}>
     <div>
              <div className="headings">
                <h6>USP</h6>
              </div>
              <div className="inputDiv">
                <label htmlFor="Usp">Usp</label>
                <input
                  type="text"
                  name="Usp"
                  id="Usp"
                  placeholder="Highlights"
                />
              </div>
              <div className="inputDiv">
                <label htmlFor="Schema">Schema</label>
                <input
                  type="text"
                  name="Schema"
                  id="Schema"
                  placeholder="Schema"
                />
              </div>
             <button>Next</button>
            </div>
  </Form>
}

function ImageForm({onFinish}){
  return(
<Form onFinish={onFinish}>
<div>
              <div className="headings">
                <h6>Media</h6>
              </div>
              <div className="inputDiv">
                <label htmlFor="videoPara">Vedio Para </label>
                <input
                  type="number"
                  name="MobileNumber"
                  placeholder="Description"
                />
              </div>
              <div className="inputDiv">
                <label htmlFor="Thumnail">Thumnail </label>
                <input type="file" name="thumnail" placeholder="file" />
              </div>
              <div className="inputDiv">
                <label htmlFor="VideoUrl">Video Url </label>
                <input
                  type="url"
                  name="VideoUrl"
                  placeholder="https://example.com"
                />
              </div>
              <div className="main-input">
                <div className="inputDiv">
                  <label htmlFor="BannerImage">Banner Image</label>
                  <textarea
                    type="file"
                    name="BannerImage"
                    id="BannerImage"
                    placeholder="Upload Image"
                  />
                </div>
                <div className="inputDiv">
                  <label htmlFor="AltTagName">Alt tag Name</label>
                  <textarea
                    type="text"
                    name="AltTagName"
                    id="AltTagName"
                    placeholder="Ace Divino "
                  />
                </div>
              </div>
              <div className="inputDiv">
                <label htmlFor="SitePlanPara">Site Plan Para</label>
                <textarea
                  type="file"
                  name="SitePlanPara"
                  id="SitePlanPara"
                  placeholder="Ace Divino Site Plan ... "
                />
              </div>
              <div className="main-input">
                <div className="inputDiv">
                  <label htmlFor="SitePlanImage">Site Plan Image </label>
                  <textarea
                    type="file"
                    name="SitePlanImage"
                    id="SitePlanImage"
                    placeholder="Upload Site Plan Image"
                  />
                </div>
                <div className="inputDiv">
                  <label htmlFor="AltTagName">Alt tag Name</label>
                  <textarea
                    type="text"
                    name="AltTagName"
                    id="AltTagName"
                    placeholder="Ace Divino "
                  />
                </div>
              </div>
              <div className="inputDiv">
                <label htmlFor="BrochureUrl">Brochure Url</label>
                <textarea
                  type="file"
                  name="BrochureUrl"
                  id="BrochureUrl"
                  placeholder="Upload Pdf"
                />
              </div>
             
            </div>
</Form>
  );
}
function Faq({onFinish}){
  return(
    <Form onFinish={onFinish}>
      <div>
              <div className="headings">
                <h6>FAQ</h6>
              </div>
              <div className="main-input">
                <div className="inputDiv">
                  <label htmlFor="Title">Title</label>
                  <textarea
                    type="text"
                    name="Title"
                    id="Title"
                    placeholder="Title"
                  />
                </div>
                <div className="inputDiv">
                  <label htmlFor="Description">Description</label>
                  <textarea
                    type="text"
                    name="Description"
                    id="Description"
                    placeholder="Ace Divino offers ..."
                  />
                </div>
              </div>
             
            </div>
    </Form>
  )
}
export default AddNewProjects;
