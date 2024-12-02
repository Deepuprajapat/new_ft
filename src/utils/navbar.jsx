// navData.js

const navItems = [
    { label: 'Home', path: '/' },
    {
      label: 'About Us',
      dropdown: [
        { label: 'Overview', path: '/about' },
        { label: 'FAQ', path: '/faq' },
        { label: 'Our Videos', path: '/video' },
      ],
    },
    {
      label: 'Our Projects',
      dropdown: [
        { label: 'All Projects', path: '/allProjects' },
        { label: 'Properties', path: '/allProperties' },
      ],
    },
    { label: 'Mango Insights', path: '/mango-insights' },
    { label: 'Career', path: '/career' },
    { label: 'Contact Us', path: '/contact' },
  ];
  
  export default navItems;
  