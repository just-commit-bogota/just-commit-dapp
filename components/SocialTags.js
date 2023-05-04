import React from 'react';
import { Tag } from '@ensdomains/thorin';

const SocialTags = ({ selectedTag, setSelectedTag, socialTagNames }) => {

  const handleClick = (index) => {
    setSelectedTag(index);
  };

  return (
    <div className="tagsContainer">
      {socialTagNames.map((tagText, index) => (
        <Tag
          key={index}
          className="tag"
          onClick={() => handleClick(index)}
          style={{
            cursor: 'pointer',
            color: selectedTag === index ? '#1DD297' : 'initial',
          }}
        >
          {tagText}
        </Tag>
      ))}
    </div>
  );
};

export default SocialTags;
