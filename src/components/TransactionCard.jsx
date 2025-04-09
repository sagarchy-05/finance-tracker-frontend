import React from 'react';
import { Card, Button } from 'react-bootstrap';

const TransactionCard = ({ transaction, onEdit, onDelete }) => {
  const { title, amount, category, date, type } = transaction;

  const formattedDate = new Date(date).toLocaleDateString();

  return (
    <Card className='mb-3 shadow-sm'>
      <Card.Body className='d-flex justify-content-between align-items-center'>
        <div>
          <Card.Title className='mb-1'>{title}</Card.Title>
          <Card.Subtitle className='text-muted mb-2'>
            {category} • {formattedDate}
          </Card.Subtitle>
          <h5 className={type === 'income' ? 'text-success' : 'text-danger'}>
            {type === 'income' ? '+' : '-'} ₹{amount}
          </h5>
        </div>

        <div className='d-flex gap-2'>
          <Button
            variant='outline-primary'
            size='sm'
            onClick={() => onEdit(transaction)}
          >
            Edit
          </Button>
          <Button
            variant='outline-danger'
            size='sm'
            onClick={() => onDelete(transaction._id)}
          >
            Delete
          </Button>
        </div>
      </Card.Body>
    </Card>
  );
};

export default TransactionCard;
