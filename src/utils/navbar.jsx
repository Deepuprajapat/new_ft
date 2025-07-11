
const getAuthToken = () => {
  // Try to get token from cookie first
  const value = `; ${document.cookie}`;
  const parts = value.split(`; authToken=`);
  if (parts.length === 2) return parts.pop().split(';').shift();
  
  // Fallback to localStorage
  return localStorage.getItem('authToken');
};

const show = !!getAuthToken();
const navItems = [
    { label: 'Home', path: '/' },
    {
      label: 'About Us',
      dropdown: [
        { label: 'Overview', path: '/about' },
        { label: 'Mango Insights', path: '/mango-insights' },
        { label: 'Our Videos', path: '/video' },
        { label: 'FAQ', path: '/faq' },
        
      ],
    },
    {
  label: 'Our Projects',
  dropdown: [
    { label: 'All Projects', path: '/allProjects' },
    { label: 'Featured Properties', path: '/featuredProperties' },
    show ? { label: 'Add Project', path: '/addProject' } : null,
  ].filter(Boolean),
},
    { label: 'All Properties', path: '/allProperties' },
    { label: 'Compare Projects',path: '/compare'},
    { label: 'Career', path: '/career' },
    { label: 'Contact Us', path: '/contact' },
  ];


export default navItems;
