import React from 'react';
import { ProgressBar, Card } from 'react-bootstrap';

const BudgetProgressBar = ({ category, limit, spent }) => {
  const percentage = Math.min((spent / limit) * 100, 100);
  const variant =
    percentage < 50 ? 'success' : percentage < 75 ? 'warning' : 'danger';

  return (
    <Card className='mb-3 shadow-sm'>
      <Card.Body>
        <Card.Title className='mb-2'>{category}</Card.Title>
        <Card.Text className='mb-2'>
          ₹{spent} spent of ₹{limit}
        </Card.Text>
        <ProgressBar
          now={percentage}
          label={`${Math.floor(percentage)}%`}
          variant={variant}
        />
      </Card.Body>
    </Card>
  );
};

export default BudgetProgressBar;
