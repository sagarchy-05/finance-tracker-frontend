import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Alert from '../../components/Alert';
import BudgetModal from '../../components/BudgetModal';
import Spinner from '../../components/Spinner';

const Budget = () => {
  const [budgets, setBudgets] = useState([]);
  const [formData, setFormData] = useState({ category: '', limit: '' });
  const [loading, setLoading] = useState(true);
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
  const [editId, setEditId] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [editMode, setEditMode] = useState(false);

  useEffect(() => {
    document.title = 'Budgets - Finance Tracker';
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets');
      setBudgets(res.data);
    } catch (err) {
      console.error('Failed to fetch budgets:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchBudgets();
  }, []);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    try {
      const updatedBudgets = [...budgets];
      const index = updatedBudgets.findIndex(
        (b) => b.category === formData.category
      );

      if (index !== -1) {
        const currentSpent = updatedBudgets[index].spent || 0;
        const newLimit = parseFloat(formData.limit);
        if (newLimit < currentSpent) {
          setAlert({
            type: 'danger',
            message: `New limit ($${newLimit}) can't be less than spent amount ($${currentSpent})`,
            visible: true,
          });
          setLoading(false);
          return;
        }

        updatedBudgets[index].limit = newLimit;
      } else {
        updatedBudgets.push({
          category: formData.category,
          limit: parseFloat(formData.limit),
        });
      }

      await api.put('/budgets/update', { budgets: updatedBudgets });

      setAlert({
        type: 'success',
        message: editId
          ? 'Budget updated successfully'
          : 'Budget added successfully',
        visible: true,
      });

      setFormData({ category: '', limit: '' });
      setEditId(null);
      setShowModal(false);
      fetchBudgets();
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.message || 'Failed to save budget',
        visible: true,
      });
      setLoading(false);
    }
  };

  const openAddModal = () => {
    setFormData({ category: '', limit: '' });
    setEditId(null);
    setEditMode(false);
    setShowModal(true);
  };

  const handleEdit = (budget) => {
    setFormData({ category: budget.category, limit: budget.limit });
    setEditId(budget.category);
    setEditMode(true);
    setShowModal(true);
  };

  const handleDelete = async (category) => {
    if (!window.confirm(`Delete budget for ${category}?`)) return;
    try {
      await api.delete(`/budgets/${category}`);
      fetchBudgets();
    } catch (error) {
      console.error('Failed to delete budget:', error);
      setAlert({
        type: 'danger',
        message: error.response?.data?.message || 'Failed to delete budget',
        visible: true,
      });
    }
  };

  return (
    <div className='container mt-4'>
      <div className='d-flex justify-content-between align-items-center mb-3'>
        <h2 className='mb-0'>Manage Budgets</h2>
        <button className='btn btn-success' onClick={openAddModal}>
          Add Budget
        </button>
      </div>

      {alert.visible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}

      {loading ? (
        <div
          className='d-flex justify-content-center align-items-center'
          style={{ minHeight: '200px' }}
        >
          <Spinner />
        </div>
      ) : (
        <table className='table table-bordered'>
          <thead className='table-light'>
            <tr>
              <th>Category</th>
              <th>Limit</th>
              <th>Spent</th>
              <th>Remaining</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {budgets.map((budget) => (
              <tr key={budget.category}>
                <td>{budget.category}</td>
                <td>${budget.limit.toFixed(2)}</td>
                <td>${budget.spent?.toFixed(2) || 0}</td>
                <td>${(budget.limit - (budget.spent || 0)).toFixed(2)}</td>
                <td>
                  <button
                    className='btn btn-sm btn-warning me-2'
                    onClick={() => handleEdit(budget)}
                  >
                    Edit
                  </button>
                  <button
                    className='btn btn-sm btn-danger'
                    onClick={() => handleDelete(budget.category)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      )}

      <BudgetModal
        show={showModal}
        onHide={() => setShowModal(false)}
        formData={formData}
        setFormData={setFormData}
        onSubmit={handleSubmit}
        loading={loading}
        editMode={editMode}
      />
    </div>
  );
};

export default Budget;
