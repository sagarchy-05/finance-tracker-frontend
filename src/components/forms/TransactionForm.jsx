// src/components/forms/TransactionForm.jsx
import React, { useState } from 'react';

const TransactionForm = ({ onSubmit, initialData = {} }) => {
  const [formData, setFormData] = useState({
    type: initialData.type || 'expense',
    amount: initialData.amount || '',
    category: initialData.category || '',
    date: initialData.date || '',
    description: initialData.description || '',
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
        <label className='form-label'>Type</label>
        <select
          name='type'
          className='form-select'
          value={formData.type}
          onChange={handleChange}
        >
          <option value='expense'>Expense</option>
          <option value='income'>Income</option>
        </select>
      </div>

      <div className='mb-3'>
        <label className='form-label'>Amount</label>
        <input
          type='number'
          name='amount'
          className='form-control'
          value={formData.amount}
          onChange={handleChange}
          required
        />
      </div>

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
        <label className='form-label'>Date</label>
        <input
          type='date'
          name='date'
          className='form-control'
          value={formData.date}
          onChange={handleChange}
          required
        />
      </div>

      <div className='mb-3'>
        <label className='form-label'>Description (optional)</label>
        <textarea
          name='description'
          className='form-control'
          value={formData.description}
          onChange={handleChange}
        />
      </div>

      <button type='submit' className='btn btn-primary w-100'>
        {initialData._id ? 'Update' : 'Add'} Transaction
      </button>
    </form>
  );
};

export default TransactionForm;
