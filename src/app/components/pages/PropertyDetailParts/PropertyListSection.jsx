import React, { useEffect, useState } from "react";
import { getAllProperties } from "../../../apis/api";

const PropertyListSection = ({ propertyList: propPropertyList, title = "All Properties" }) => {
  const [propertyList, setPropertyList] = useState(propPropertyList || []);
  const [loading, setLoading] = useState(!propPropertyList);
  const [error, setError] = useState(null);

  useEffect(() => {
    if (!propPropertyList) {
      const fetchProperties = async () => {
        try {
          const data = await getAllProperties(1, 10); // page 1, size 10
          setPropertyList(data.data?.data || []);
        } catch (err) {
          setError("Failed to fetch properties");
        } finally {
          setLoading(false);
        }
      };
      fetchProperties();
    }
  }, [propPropertyList]);

  if (loading) return <div>Loading properties...</div>;
  if (error) return <div>{error}</div>;

  return (
    <div className="mb-4" id="property-list" style={{ boxShadow: "0 2px 4px rgba(0,0,0,0.1)" }}>
      <h4 className="mb-3 py-2 fw-bold text-white ps-3" style={{ fontSize: window.innerWidth <= 768 ? "16px" : "18px", backgroundColor: "#2067d1", borderRadius: "4px 4px 0 0" }}>
        {title}
      </h4>
      <div className="row px-3">
        {propertyList.length === 0 ? (
          <div className="col-12">No properties found.</div>
        ) : (
          propertyList.map((prop) => (
            <div key={prop.id} className="col-12 col-md-4 mb-4">
              <div className="card h-100">
                {prop.images && prop.images.length > 0 && (
                  <img src={prop.images[0]} alt={prop.name} className="card-img-top" style={{ height: "200px", objectFit: "cover" }} />
                )}
                <div className="card-body">
                  <h5 className="card-title">{prop.name}</h5>
                  <p className="card-text mb-1"><strong>Location:</strong> {prop.location}</p>
                  <p className="card-text mb-1"><strong>Developer:</strong> {prop.developer_name}</p>
                  <span className="badge bg-info text-dark">{prop.possession_status}</span>
                </div>
              </div>
            </div>
          ))
        )}
      </div>
    </div>
  );
};

export default PropertyListSection; 