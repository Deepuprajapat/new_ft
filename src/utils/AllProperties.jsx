// import React, { useState, useEffect } from 'react';

// // Sample data for property types, configurations, localities, and properties
// const propertyTypes = ['Apartment', 'Villa', 'House'];
// const configurations = ['1 BHK', '2 BHK', '3 BHK'];
// const localities = ['New York', 'Los Angeles', 'San Francisco'];
// const properties = [
//   {
//     property_id: 1,
//     property_name: 'Ace Divino',
//     group_by: 'Ace Group',
//     img1: 'https://www.investmango.com/img/ace-divino/ace-divino-outside-image.webp',
//     price: 500000,
//     built_up_area: '1200 Sq.ft',
//     possession_date: 'December 2024',
//     possession_status: 'Under Construction',
//     floors: '20',
//     facing: 'East',
//     property_address: 'Noida, Uttar Pradesh',
//     post_url: 'ace-divino',
//   },
//   // Add more properties as needed
// ];

// const PropertyListing = () => {
//   const [selectedPropertyType, setSelectedPropertyType] = useState('');
//   const [selectedConfiguration, setSelectedConfiguration] = useState('');
//   const [selectedLocality, setSelectedLocality] = useState('');
//   const [filteredProperties, setFilteredProperties] = useState(properties);

//   // Handle form submission to filter properties
//   const handleFilterChange = () => {
//     let filtered = properties;

//     if (selectedPropertyType) {
//       filtered = filtered.filter((property) => property.property_name.includes(selectedPropertyType));
//     }

//     if (selectedConfiguration) {
//       filtered = filtered.filter((property) => property.built_up_area.includes(selectedConfiguration));
//     }

//     if (selectedLocality) {
//       filtered = filtered.filter((property) => property.property_address.includes(selectedLocality));
//     }

//     setFilteredProperties(filtered);
//   };

//   useEffect(() => {
//     handleFilterChange();
//   }, [selectedPropertyType, selectedConfiguration, selectedLocality]);

//   return (
//     <section className="main-body" style={{ marginTop: '70px' }}>
//       <div className="main-con">
//         <div className="container">
//           <span>Home / All Property</span>
//           <h2 style={{ textAlign: 'center' }}>Property For Sale</h2>

//           <div className="container">
//             <div className="row">
//               <div className="col-md-12">
//                 <div className="filters d-flex flex-wrap">
//                   <select
//                     name="propertyType"
//                     value={selectedPropertyType}
//                     onChange={(e) => setSelectedPropertyType(e.target.value)}
//                   >
//                     <option value="">All Property Types</option>
//                     {propertyTypes.map((type) => (
//                       <option key={type} value={type}>
//                         {type}
//                       </option>
//                     ))}
//                   </select>

//                   <select
//                     name="configuration"
//                     value={selectedConfiguration}
//                     onChange={(e) => setSelectedConfiguration(e.target.value)}
//                   >
//                     <option value="">All Configurations</option>
//                     {configurations.map((config) => (
//                       <option key={config} value={config}>
//                         {config}
//                       </option>
//                     ))}
//                   </select>

//                   <select
//                     name="locality"
//                     value={selectedLocality}
//                     onChange={(e) => setSelectedLocality(e.target.value)}
//                   >
//                     <option value="">All Localities</option>
//                     {localities.map((locality) => (
//                       <option key={locality} value={locality}>
//                         {locality}
//                       </option>
//                     ))}
//                   </select>
//                 </div>
//               </div>
//             </div>
//           </div>

//           <div className="listing-home listing-page">
//             <div className="listing-slide row">
//               <div className="col-md-8 sticky-scroll">
//                 {filteredProperties.length === 0 ? (
//                   <div className="alert alert-info" role="alert">
//                     No properties found.
//                   </div>
//                 ) : (
//                   filteredProperties.map((property) => (
//                     <div className="card mb-3" style={{ maxWidth: '100%' }} key={property.property_id}>
//                       <div className="row g-0">
//                         <div className="col-md-4">
//                           <a href={`/property-for-sale/${property.post_url}`}>
//                             <img
//                               className="img-fluid"
//                               alt={property.property_name}
//                               src={property.img1}
//                               style={{ maxWidth: '100%', borderRadius: '26px', height: '255px', padding: '10px' }}
//                             />
//                           </a>
//                         </div>
//                         <div className="col-md-8">
//                           <div className="card-body" style={{ fontSize: 'smaller' }}>
//                             <div className="d-flex justify-content-between align-items-center">
//                               <p className="card-title">
//                                 <i className="fas fa-rupee-sign"></i>
//                                 <b>{property.price}</b>
//                               </p>
//                               <div className="dropdown">
//                                 <button
//                                   className="btn dropdown-toggle"
//                                   type="button"
//                                   id="shareDropdown"
//                                   data-toggle="dropdown"
//                                   aria-haspopup="true"
//                                   aria-expanded="false"
//                                 >
//                                   <i className="fa fa-share-alt" aria-hidden="true"></i>
//                                 </button>
//                                 <div className="dropdown-menu" aria-labelledby="shareDropdown">
//                                   <a
//                                     className="dropdown-item"
//                                     href={`/property-for-sale/${property.post_url}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                   >
//                                     Copy to Clipboard
//                                   </a>
//                                   <a
//                                     className="dropdown-item"
//                                     href={`https://www.facebook.com/sharer/sharer.php?u=https://www.investmango.com/property-for-sale/${property.property_id}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                   >
//                                     Facebook
//                                   </a>
//                                   <a
//                                     className="dropdown-item"
//                                     href={`https://api.whatsapp.com/send?text=https://www.investmango.com/property-for-sale/${property.property_id}`}
//                                     target="_blank"
//                                     rel="noopener noreferrer"
//                                   >
//                                     WhatsApp
//                                   </a>
//                                 </div>
//                               </div>
//                             </div>
//                             <h6 className="card-text">
//                               {property.property_name}
//                               <br />
//                               <span style={{ fontSize: '11px', color: '#a1a1a1' }}>BY {property.group_by}</span>
//                             </h6>
//                             <div className="property-info">
//                               <div className="info-group">
//                                 <span className="icon">
//                                   <i className="fas fa-home"> Built-up Area</i>
//                                 </span>
//                                 <span className="value">{property.built_up_area}</span>
//                               </div>
//                               <div className="info-group">
//                                 <span className="icon">
//                                   <i className="far fa-calendar-alt"> Possession Date</i>
//                                 </span>
//                                 <span className="value">{property.possession_date}</span>
//                               </div>
//                               <div className="info-group">
//                                 <span className="icon">
//                                   <i className="fas fa-tools"> Construction Status</i>
//                                 </span>
//                                 <span className="value">{property.possession_status}</span>
//                               </div>
//                               <div className="info-group">
//                                 <span className="icon">
//                                   <i className="fas fa-layer-group"> Unit Available</i>
//                                 </span>
//                                 <span className="value">{property.floors}</span>
//                               </div>
//                               <div className="info-group">
//                                 <span className="icon">
//                                   <i className="fas fa-compass"> Facing</i>
//                                 </span>
//                                 <span className="value">{property.facing}</span>
//                               </div>
//                               <div className="info-group">
//                                 <span className="icon">
//                                   <i className="fas fa-map-marker-alt"> Location</i>
//                                 </span>
//                                 <span className="value">{property.property_address}</span>
//                               </div>
//                             </div>
//                             <a href={`/property-for-sale/${property.post_url}`} className="theme-btn">
//                               Contact Details
//                             </a>
//                           </div>
//                         </div>
//                       </div>
//                     </div>
//                   ))
//                 )}
//               </div>

//               {/* Carousel Section */}
//               <div className="col-md-4" id="carousel">
//                 <div className="bord" style={{ backgroundColor: 'white', padding: '20px', borderRadius: '20px' }}>
//                   <img
//                     src="https://www.investmango.com/img/ace-divino/ace-divino-outside-image.webp"
//                     className="d-block w-100"
//                     alt="Top Image"
//                     style={{ borderRadius: '10px', height: '262px', marginBottom: '31px' }}
//                   />
//                   <div id="carouselExampleIndicators" className="carousel slide" data-bs-ride="carousel">
//                     <div className="carousel-inner">
//                       <div className="carousel-item active">
//                         <div className="row">
//                           <div className="col-md-6">
//                             <img
//                               src="https://www.investmango.com/img/ace-divino/ace-divino-dinning-room.webp"
//                               className="d-block w-100"
//                               alt="First Slide"
//                               style={{ borderRadius: '10px', height: '131px' }}
//                             />
//                           </div>
//                           <div className="col-md-6">
//                             <img
//                               src="https://www.investmango.com/img/ace-divino/ace-divino-kitchen.webp"
//                               className="d-block w-100"
//                               alt="Second Slide"
//                               style={{ borderRadius: '10px', height: '131px' }}
//                             />
//                           </div>
//                         </div>
//                       </div>
//                       {/* Add more carousel items as needed */}
//                     </div>
//                   </div>
//                 </div>
//               </div>
//               {/* End of Carousel Section */}
//             </div>
//           </div>
//         </div>
//       </div>
//     </section>
//   );
// };

// export default PropertyListing;
