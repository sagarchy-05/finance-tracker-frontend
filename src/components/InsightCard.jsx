import React from 'react';
import { Card } from 'react-bootstrap';

const InsightCard = ({ title, bulletPoints, date }) => {
  return (
    <Card className='mb-3 shadow-sm'>
      <Card.Body>
        <Card.Title>{title}</Card.Title>
        <Card.Subtitle className='mb-2 text-muted'>
          {new Date(date).toLocaleDateString()}
        </Card.Subtitle>
        <ul className='mt-3'>
          {bulletPoints.map((point, index) => (
            <li key={index} className='mb-1'>
              {point}
            </li>
          ))}
        </ul>
      </Card.Body>
    </Card>
  );
};

export default InsightCard;
