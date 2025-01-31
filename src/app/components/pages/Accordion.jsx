import React, { useState } from 'react';
import {
  Accordion as AccessibleAccordion,
  AccordionItem,
  AccordionItemHeading,
  AccordionItemButton,
  AccordionItemPanel,
} from 'react-accessible-accordion';
import 'react-accessible-accordion/dist/fancy-example.css';
import { MdOutlineArrowDropDown } from 'react-icons/md';
import '../styles/css/accordion.css';
import DOMPurify from 'dompurify'; // For sanitizing HTML

const Accordion = ({ data, allowMultipleExpanded = false, preExpanded = [0],scrollToForm }) => {
  const [expandedIndex, setExpandedIndex] = useState(null);

  const handleToggle = (index) => {
    setExpandedIndex(expandedIndex === index ? null : index); // Toggle the expansion
  };

  return (
    <AccessibleAccordion
      className="accordion"
      preExpanded={preExpanded}
      allowMultipleExpanded={false}
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
                <span className="primary-text">{item.heading}</span>
                <div className="flexCenter icon">
                  <MdOutlineArrowDropDown size={20} />
                </div>
              </AccordionItemButton>
            </AccordionItemHeading>
            <AccordionItemPanel>
              {/* Render sanitized HTML content */}
              <div
                className="accordionContent"
                dangerouslySetInnerHTML={{
                  __html: DOMPurify.sanitize(item.detail || "<p>Job description not available.</p>"),
                }}
              />
               {scrollToForm && <button onClick={() => scrollToForm()}>Apply Now</button>}
            </AccordionItemPanel>
          </AccordionItem>
        );
      })}
    </AccessibleAccordion>
  );
};

export default Accordion;
