import React from 'react';
import { Modal, Button, Form } from 'react-bootstrap';

const BudgetModal = ({
  show,
  onHide,
  formData,
  setFormData,
  onSubmit,
  loading,
  editMode,
}) => {
  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  return (
    <Modal show={show} onHide={onHide} centered>
      <Modal.Header closeButton>
        <Modal.Title>{editMode ? 'Edit Budget' : 'Add Budget'}</Modal.Title>
      </Modal.Header>
      <Modal.Body>
        <Form onSubmit={onSubmit}>
          <Form.Group className='mb-3'>
            <Form.Label>Category</Form.Label>
            <Form.Control
              type='text'
              name='category'
              value={formData.category}
              onChange={handleChange}
              placeholder='e.g. Groceries'
              required
              disabled={editMode}
            />
          </Form.Group>
          <Form.Group className='mb-3'>
            <Form.Label>Limit</Form.Label>
            <Form.Control
              type='number'
              name='limit'
              value={formData.limit}
              onChange={handleChange}
              placeholder='e.g. 300'
              required
            />
          </Form.Group>
          <Button
            type='submit'
            variant='primary'
            disabled={loading}
            className='w-100'
          >
            {editMode ? 'Update Budget' : 'Add Budget'}
          </Button>
        </Form>
      </Modal.Body>
    </Modal>
  );
};

export default BudgetModal;
