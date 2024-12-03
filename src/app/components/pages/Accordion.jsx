// Accordion.js
import React, { useState } from 'react';
import { Accordion as AccessibleAccordion, AccordionItem, AccordionItemHeading, AccordionItemButton, AccordionItemPanel } from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import { MdOutlineArrowDropDown } from 'react-icons/md';
import '../styles/css/accordion.css';

const Accordion = ({ data, allowMultipleExpanded = false, preExpanded = [0] }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle the expansion
  };

  return (
    <AccessibleAccordion
      className="accordion"
      // allowMultipleExpanded={allowMultipleExpanded}
      preExpanded={preExpanded}  allowMultipleExpanded={false}
    >
      {data.map((item, index) => {
        const isExpanded = expandedIndex === index;

        return (
          <AccordionItem
            key={index}
            className={`accordionItem ${isExpanded ? 'expanded' : 'collapsed'}`}
            uuid={index}
          >
            <AccordionItemHeading>
              <AccordionItemButton
                className="flexCenter accordionButton"
                onClick={() => handleToggle(index)} 
              >
                {/* <div className="flexCenter icon">
                  {item.icon}
                </div> */}
                <span className="primaryText">
                  {item.heading}
                </span>
                <div className="flexCenter icon">
                  <MdOutlineArrowDropDown size={20} />
                </div>
               
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
                {Array.isArray(item.detail) ? (
                  item.detail.map((detail, i) => <p key={i} className="p_n">{detail}</p>)
                ) : (
                  <p className="p_n">{item.detail}</p>
                )}
              {/* <p className="secondaryText">{item.detail}</p>
              <a class="theme-btn" href="#topform">Apply Now</a> */}
            </AccordionItemPanel>
          </AccordionItem>
        );
      })}
    </AccessibleAccordion>
  );
};
export default Accordion;
