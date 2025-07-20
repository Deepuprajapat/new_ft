import React, { useEffect, useState } from 'react';
import { useParams } from 'react-router-dom';
import ProjectCard from './ProjectCard';
import { getCustompage } from '../../apis/api';
import Loader from '../Loader';
import { Helmet } from 'react-helmet';

const CustomSearchPage = () => {
  const { slug } = useParams();
  const [loading, setLoading] = useState(true);
  const [projects, setProjects] = useState([]);
  const [pageData, setPageData] = useState({ title: '', description: '', meta_info: {} });

  useEffect(() => {
    const fetchData = async () => {
      setLoading(true);
      try {
        const response = await getCustompage(slug);
        const data = response?.data || {};
        setPageData({
          title: data?.title || '',
          description: data?.description || '',
          meta_info: data?.meta_info || {},
        });
        setProjects(Array.isArray(data?.projects) ? data.projects : []);
      } catch (error) {
        setPageData({ title: '', description: '', meta_info: {} });
        setProjects([]);
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, [slug]);

  const helmetTitle = pageData.meta_info?.title || pageData.title || 'Custom Search Page';
  const helmetDescription = pageData.meta_info?.description || pageData.description || 'Find the best projects.';

  return (
    <div>
      <Helmet>
        <title>{helmetTitle}</title>
        <meta name="description" content={helmetDescription} />
        <meta name="keywords" content={pageData.meta_info?.keywords || ''} />
        <link rel="canonical" href={window.location.href} />
      </Helmet>
      <section className="main-body">
        <div className="container">
          <h1 className="project-title" style={{ marginTop: 32 }}>{pageData.title}</h1>
          {pageData.description && (
            <p style={{ textAlign: 'left', marginBottom: 24 }}>{pageData.description}</p>
          )}
          <div className="main-con">
            <div className="listing-home listing-page">
              <div className="listing-slide row">
                {loading ? (
                  <Loader isFullScreen={false} />
                ) : projects.length > 0 ? (
                  projects.map((project, index) => (
                    <div className="col-md-4" key={index} style={{ marginBottom: 24 }}>
                      <ProjectCard project={project} />
                    </div>
                  ))
                ) : (
                  <p className="no-projects-message">No projects available...</p>
                )}
              </div>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default CustomSearchPage;