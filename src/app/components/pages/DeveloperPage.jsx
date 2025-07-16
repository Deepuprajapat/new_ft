import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";

const DeveloperPage = () => {
    const { id, url } = useParams();
    const [developerData, setDeveloperData] = useState(null);
    const [showFullContent, setShowFullContent] = useState(false);

    useEffect(() => {
        const fetchDeveloperData = async () => {
            try {
                const res = await axios.get("https://api.investmango.com/developer/get/all");
                const matchedDeveloper = res.data.find(
                    (dev) => dev.id === parseInt(id) && dev.url === url
                );
                setDeveloperData(matchedDeveloper);
            } catch (err) {
                console.error("Error fetching developer data", err);
            }
        };
        fetchDeveloperData();
    }, [id, url]);

    if (!developerData) return <p>Loading...</p>;

    return (
        <div style={{ maxWidth: "1140px", margin: "30px auto", fontFamily: "Lato, sans-serif", padding: "0 15px" }}>
            <div style={{ marginBottom: "20px", display: "flex", alignItems: "flex-start", flexWrap: "wrap" }}>
                <img
                    src={developerData.logo}
                    alt={developerData.altLogo}
                    style={{
                        border: "1px solid black",
                        width: "7%",
                        marginRight: "20px",
                        maxWidth: "90px"
                    }}
                />
                <div style={{ flex: "1 1 auto" }}>
                    <p style={{ margin: "0 0 5px", fontSize: "16px" }}>
                        <b>ESTABLISHED IN - </b> {developerData.establishedYear}
                    </p>
                    <p style={{ margin: "0 0 5px", fontSize: "16px" }}>
                        <b>TOTAL PROJECTS - </b> {developerData.totalProjects}+
                    </p>
                </div>
            </div>

            <div style={{ marginBottom: "30px", fontSize: "16px", lineHeight: "1.6" }}>
                <div
                    dangerouslySetInnerHTML={{
                        __html: showFullContent
                            ? developerData.about
                            : developerData.about.substring(0, 1000) + "..."
                    }}
                />
                <a
                    style={{ position: "inherit", color: "#2067d1", cursor: "pointer", fontWeight: "bold", marginTop: "10px", display: "inline-block" }}
                    onClick={() => setShowFullContent(!showFullContent)}
                >
                    {showFullContent ? "Read Less" : "Read More"}
                </a>
            </div>

            {developerData.awards && (
                <div style={{ marginBottom: "30px" }}>
                    <h4 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "10px" }}>
                        Awards And Achievements
                    </h4>
                    <div dangerouslySetInnerHTML={{ __html: developerData.awards }} />
                </div>
            )}

            {developerData.whyChoose && (
                <div style={{ marginBottom: "30px" }}>
                    <h4 style={{ fontWeight: "bold", fontSize: "20px", marginBottom: "10px" }}>
                        Why Choose {developerData.name}?
                    </h4>
                    <div dangerouslySetInnerHTML={{ __html: developerData.whyChoose }} />
                </div>
            )}
        </div>
    );
};

export default DeveloperPage;
