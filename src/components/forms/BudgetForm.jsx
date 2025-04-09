// src/components/forms/BudgetForm.jsx
import React, { useState } from 'react';

const BudgetForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    category: initialData.category || '',
    limit: initialData.limit || '',
  });

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    onSubmit(formData);
  };

  return (
    <form onSubmit={handleSubmit}>
      <div className='mb-3'>
        <label className='form-label'>Category</label>
        <input
          type='text'
          name='category'
          className='form-control'
          value={formData.category}
          onChange={handleChange}
          required
        />
      </div>

      <div className='mb-3'>
        <label className='form-label'>Monthly Limit</label>
        <input
          type='number'
          name='limit'
          className='form-control'
          value={formData.limit}
          onChange={handleChange}
          required
        />
      </div>

      <button type='submit' className='btn btn-success w-100'>
        {initialData._id ? 'Update' : 'Add'} Budget
      </button>
    </form>
  );
};

export default BudgetForm;
