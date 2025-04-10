import React, { useEffect, useState } from 'react';
import api from '../api/axios';
import Select from 'react-select';

const TransactionModal = ({ show, onHide, onSave, transaction, budgets }) => {
  const [amount, setAmount] = useState('');
  const [category, setCategory] = useState('');
  const [date, setDate] = useState('');
  const [description, setDescription] = useState('');
  const [loading, setLoading] = useState(false);

  const options = budgets.map((b) => ({ label: b, value: b }));

  // Lock scroll on modal open
  useEffect(() => {
    if (show) {
      document.body.classList.add('modal-open');
    } else {
      document.body.classList.remove('modal-open');
    }
    return () => document.body.classList.remove('modal-open');
  }, [show]);

  useEffect(() => {
    if (transaction && Object.keys(transaction).length > 0) {
      setAmount(transaction.amount || '');
      setCategory(transaction.category || '');
      setDate(transaction.date ? transaction.date.slice(0, 10) : '');
      setDescription(transaction.description || '');
    } else {
      setAmount('');
      setCategory('');
      setDate('');
      setDescription('');
    }
    setLoading(false);
  }, [transaction, show]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const todayStr = new Date().toISOString().split('T')[0];
    if (date > todayStr) {
      window.showToast?.('Transaction date cannot be in the future.', 'danger');
      setLoading(false);
      return;
    }

    const payload = {
      amount: Number(amount),
      category,
      date,
      description,
      type: 'expense',
    };

    try {
      const budgetRes = await api.get('/budgets');
      const currentBudgets = budgetRes.data || [];
      const matchedBudget = currentBudgets.find((b) => b.category === category);

      if (matchedBudget) {
        const originalAmt = transaction?.amount || 0;
        const updatedSpent = matchedBudget.spent - originalAmt + payload.amount;

        if (updatedSpent > matchedBudget.limit) {
          window.showToast?.(
            transaction
              ? 'Budget is exceeding, cannot update transaction.'
              : 'Budget is exceeding, cannot add transaction.',
            'danger'
          );
          setLoading(false);
          return;
        }
      }

      onSave(payload);
    } catch (err) {
      window.showToast?.('Failed to validate budget.', 'danger');
    } finally {
      setLoading(false);
    }
  };

  if (!show) return null;

  return (
    <div className='modal show d-block' tabIndex='-1' role='dialog'>
      <div className='modal-dialog modal-dialog-centered' role='document'>
        <div className='modal-content'>
          <div className='modal-header'>
            <h5 className='modal-title'>
              {transaction && Object.keys(transaction).length > 0
                ? 'Edit Transaction'
                : 'Add Transaction'}
            </h5>
            <button
              type='button'
              className='btn-close'
              onClick={onHide}
            ></button>
          </div>

          <div className='modal-body'>
            <form onSubmit={handleSubmit}>
              <div className='mb-3'>
                <label>Amount (₹)</label>
                <input
                  type='number'
                  className='form-control'
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  required
                />
              </div>

              <div className='mb-3'>
                <label>Category</label>
                <Select
                  options={options}
                  value={options.find((opt) => opt.value === category)}
                  onChange={(selected) => setCategory(selected.value)}
                  placeholder='Select category'
                  styles={{
                    menu: (base) => ({
                      ...base,
                      maxHeight: 200,
                      overflowY: 'auto',
                      scrollbarWidth: 'thin',
                    }),
                    menuList: (base) => ({
                      ...base,
                      maxHeight: 200,
                      overflowY: 'auto',
                    }),
                  }}
                />
              </div>

              <div className='mb-3'>
                <label>Date</label>
                <input
                  type='date'
                  className='form-control'
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  max={new Date().toISOString().split('T')[0]}
                />
              </div>

              <div className='mb-3'>
                <label>Description</label>
                <input
                  type='text'
                  className='form-control'
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                />
              </div>

              <button
                type='submit'
                className='btn btn-primary'
                disabled={loading}
              >
                {loading ? (
                  <>
                    <span className='spinner-border spinner-border-sm me-2'></span>
                    {transaction ? 'Updating...' : 'Adding...'}
                  </>
                ) : transaction && Object.keys(transaction).length > 0 ? (
                  'Update'
                ) : (
                  'Add'
                )}
              </button>
            </form>
          </div>
        </div>
      </div>
    </div>
  );
};

export default TransactionModal;
