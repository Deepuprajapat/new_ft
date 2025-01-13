// // src/utils/rel.js
// import React from 'react';
// const withSafeLinks = (Component) => {
//     return (props) => {
//       console.log('Props received by withSafeLinks:', props);
//       const safeLinks = props.children && React.Children.map(props.children, (child) => {
//         if (child.type === 'a') {
//           console.log('Adding rel to anchor tag:', child);
//           return React.cloneElement(child, {
//             rel: 'noopener noreferrer',
//           });
//         }
//         return child;
//       });
  
//       return <Component {...props}>{safeLinks}</Component>;
//     };
//   };
  
//   export default withSafeLinks;