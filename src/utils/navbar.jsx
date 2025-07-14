

const show = localStorage.getItem('auth-token')
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
    show ? { label: 'Add Project', path: '/addproject' } : null,
  ].filter(Boolean),
},
    { label: 'All Properties', path: '/allProperties' },
    { label: 'Compare Projects',path: '/compare'},
    { label: 'Career', path: '/career' },
    { label: 'Contact Us', path: '/contact' },
  ];


export default navItems;
