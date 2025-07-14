
import React, { useState } from "react";

const AboutDeveloperSection = ({showEdit, property, onSave }) => {
  const [editMode, setEditMode] = useState(false);
  const [editable, setEditable] = useState({
    developerLogo: property?.developer?.developerLogo || "",
    developerEstiblishedYear: property?.developerEstiblishedYear || "",
    totlprojects: property?.totlprojects || ""
  });
  console.log(property?.developer?.developerLogo,"eji");
  console.log(property,"pp")

  const handleChange = (e) => {
    const { name, value } = e.target;
    setEditable((prev) => ({ ...prev, [name]: value }));
  };

  const handleSave = () => {
    setEditMode(false);
    if (onSave) {
      onSave({
        developerLogo: editable.developerLogo,
        developerEstiblishedYear: editable.developerEstiblishedYear,
        totlprojects: editable.totlprojects
      });
    }
  };

  const handleCancel = () => {
    setEditMode(false);
    setEditable({
      developerLogo: property?.developer?.developerLogo || "",
      developerEstiblishedYear: property?.developerEstiblishedYear || "",
      totlprojects: property?.totlprojects || ""
    });
  };

  return (
    <section id="developer" style={{ boxShadow: "rgba(0, 0, 0, 0.1) 0px 2px 4px" }}>
      <div className="box overview">
        <h2 className="headline" style={{
          borderBottom: "solid 1px #e8e8e8",
          padding: "12px 16px",
          fontSize: "15px",
          backgroundColor: "#2067d1",
          textTransform: "uppercase",
          letterSpacing: "0.2px",
          fontWeight: "700",
          color: "#fff",
          borderRadius: "6px 6px 0 0",
        }}>About {property?.propertyName}</h2>
        <div className="row" style={{ display: "flex", flexWrap: "wrap" }}>
          <div className="col-md-12" style={{ padding: "18px" }}>
            <div className="inner-item">
              <div className="over_head" style={{ display: "flex", alignItems: "center", gap: "15px" }}>
                {editMode ? (
                  <>
                    <input
                      type="text"
                      name="developerLogo"
                      value={editable.developerLogo}
                      onChange={handleChange}
                      placeholder="Developer Logo URL"
                      className="form-control mb-2"
                    />
                    <input
                      type="text"
                      name="developerEstiblishedYear"
                      value={editable.developerEstiblishedYear}
                      onChange={handleChange}
                      placeholder="Established Year"
                      className="form-control mb-2"
                    />
                    <input
                      type="text"
                      name="totlprojects"
                      value={editable.totlprojects}
                      onChange={handleChange}
                      placeholder="Total Projects"
                      className="form-control mb-2"
                    />
                    <button className="btn btn-primary btn-sm me-2" onClick={handleSave}>Save</button>
                    <button className="btn btn-secondary btn-sm" onClick={handleCancel}>Cancel</button>
                  </>
                ) : (
                  <>
                    <img
                      src={editable.developerLogo || "/img/developer-img/ace-group.webp"}
                      className="img-fluid"
                      alt="Developer Logo"
                      loading="lazy"
                      fetchPriority="high"
                      style={{ maxWidth: "80px", height: "auto", borderRadius: "4px", border: "1px solid #b5a9a9" }}
                    />
                    <p style={{ margin: 0, fontSize: "14px", color: "#333" }}>
                      ESTABLISHED IN - <b style={{ fontSize: "15px", color: "#2067d1" }}>{editable.developerEstiblishedYear || "N/A"}</b>
                      <br />
                      TOTAL PROJECTS - <b style={{ fontSize: "15px", color: "#2067d1" }}>{editable.totlprojects || "N/A"}</b>
                    </p>
                    <button className="btn btn-link btn-sm" onClick={() => setEditMode(true)}>Edit</button>
                  </>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
};

export default AboutDeveloperSection;