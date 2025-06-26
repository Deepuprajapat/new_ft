import React, { useEffect } from "react";
const AddHeadScripts = () => {
  useEffect(() => {
    if (process.env.REACT_APP_ENV !== "production") return;
    // Google Tag Manager
    const gtmScript = document.createElement("script");
    gtmScript.innerHTML = `
      (function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
      new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
      j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
      'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
      })(window,document,'script','dataLayer','GTM-P4VQSDP');
    `;
    document.head.appendChild(gtmScript);
    // Google Analytics
    const gaScript = document.createElement("script");
    gaScript.async = true;
    gaScript.src = "https://www.googletagmanager.com/gtag/js?id=AW-685964924";
    document.head.appendChild(gaScript);
    const gaInitScript = document.createElement("script");
    gaInitScript.innerHTML = `
      window.dataLayer = window.dataLayer || [];
      function gtag(){dataLayer.push(arguments);}
      gtag('js', new Date());
      gtag('config', 'AW-685964924');
    `;
    document.head.appendChild(gaInitScript);
    // Schema JSON-LD (RealEstateAgent)
    const schemaScript = document.createElement("script");
    schemaScript.type = "application/ld+json";
    schemaScript.textContent = JSON.stringify({
      "@context": "https://schema.org",
      "@type": "RealEstateAgent",
      "name": "Invest Mango",
      "image": "https://www.investmango.com/img/logo.jpg",
      "@id": "https://www.investmango.com",
      "url": "https://www.investmango.com",
      "telephone": "7428-189-189",
      "priceRange": "55lacs to 16Cr",
      "address": {
        "@type": "PostalAddress",
        "streetAddress": "11th Floor, Plot no 6, Magnus Tower, Sector 73",
        "addressLocality": "Noida",
        "postalCode": "201307",
        "addressCountry": "IN"
      },
      "geo": {
        "@type": "GeoCoordinates",
        "latitude": 28.5917541,
        "longitude": 77.3845057
      },
      "openingHoursSpecification": {
        "@type": "OpeningHoursSpecification",
        "dayOfWeek": [
          "Monday",
          "Tuesday",
          "Wednesday",
          "Thursday",
          "Friday",
          "Saturday"
        ],
        "opens": "09:30",
        "closes": "18:30"
      },
      "sameAs": [
        "https://www.facebook.com/InvestMangoofficial",
        "https://mobile.twitter.com/invest_mango",
        "https://www.instagram.com/investmango/",
        "https://www.youtube.com/c/InvestMango",
        "https://www.linkedin.com/company/invest-mango/",
        "https://in.pinterest.com/investmango/",
        "https://www.investmango.com/"
      ]
    });
    document.head.appendChild(schemaScript);
    // Meta Pixel Code
    const fbPixelScript = document.createElement("script");
    fbPixelScript.innerHTML = `
      !function(f,b,e,v,n,t,s)
      {if(f.fbq)return;n=f.fbq=function(){n.callMethod?
      n.callMethod.apply(n,arguments):n.queue.push(arguments)};
      if(!f._fbq)f._fbq=n;n.push=n;n.loaded=!0;n.version='2.0';
      n.queue=[];t=b.createElement(e);t.async=!0;
      t.src=v;s=b.getElementsByTagName(e)[0];
      s.parentNode.insertBefore(t,s)}(window, document,'script',
      'https://connect.facebook.net/en_US/fbevents.js');
      fbq('init', '708184850359382');
      fbq('track', 'PageView');
    `;
    document.head.appendChild(fbPixelScript);
    const fbPixelNoScript = document.createElement("noscript");
    fbPixelNoScript.innerHTML = `
      <img height="1" width="1" style="display:none"
      src="https://www.facebook.com/tr?id=708184850359382&ev=PageView&noscript=1" 
      loading="lazy"
      alt="facebook"/>
    `;
    document.body.appendChild(fbPixelNoScript);
    // Google Tag Manager (noscript) - insert as first child of <body>
    const gtmNoScript = document.createElement("noscript");
    gtmNoScript.innerHTML = `
      <iframe src=\"https://www.googletagmanager.com/ns.html?id=GTM-P4VQSDP\" height=\"0\" width=\"0\" style=\"display:none;visibility:hidden\"></iframe>
    `;
    if (document.body.firstChild) {
      document.body.insertBefore(gtmNoScript, document.body.firstChild);
    } else {
      document.body.appendChild(gtmNoScript);
    }
    return () => {
      // Cleanup: Remove all added scripts if necessary
      document.head.removeChild(gtmScript);
      document.head.removeChild(gaScript);
      document.head.removeChild(gaInitScript);
      document.head.removeChild(schemaScript);
      document.head.removeChild(fbPixelScript);
      document.body.removeChild(fbPixelNoScript);
      if (document.body.contains(gtmNoScript)) {
        document.body.removeChild(gtmNoScript);
      }
    };
  }, []);
  return null; // No UI elements
};
export default AddHeadScripts;