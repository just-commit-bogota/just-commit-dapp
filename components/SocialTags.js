import React from 'react';
import { Tag } from '@ensdomains/thorin';

const SocialTags = ({ selectedTag, setSelectedTag, socialTagNames, isStyled }) => {

  const handleClick = (index) => {
    setSelectedTag(index);
  };

  return (
   <div className={`tagsContainer ${isStyled ? 'gap-2' : ''}`}>
      {socialTagNames.map((tagText, index) => (
        <Tag
          key={index}
          className={"tag"}
          onClick={() => handleClick(index)}
          style={{
            cursor: 'pointer',
            color: selectedTag === index ? '#1DD297' : 'initial',
            ...(isStyled ? { fontSize: '1.25rem', padding: '6px' } : {}),
          }}
        >
          {tagText}
        </Tag>
      ))}
    </div>
  );
};

export default SocialTags;
