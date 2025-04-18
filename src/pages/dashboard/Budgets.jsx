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
    fetchBudgets();
  }, []);

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets');
      setBudgets(res.data);
    } catch (err) {
      setAlert({
        type: 'danger',
        message: 'Failed to fetch budgets',
        visible: true,
      });
    } finally {
      setLoading(false);
    }
  };

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
            message: `New limit (₹${newLimit}) can't be less than spent amount (₹${currentSpent})`,
            visible: true,
          });
          setLoading(false);
          setShowModal(false);
          return;
        }

        updatedBudgets[index].limit = newLimit;
      } else {
        updatedBudgets.push({
          category: formData.category,
          limit: parseFloat(formData.limit),
          spent: 0,
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
    } finally {
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
    if (category === 'Others') {
      setAlert({
        type: 'danger',
        message: "Default category 'Others' cannot be deleted.",
        visible: true,
      });
      return;
    }

    const budgetToDelete = budgets.find((b) => b.category === category);
    if (budgetToDelete?.spent > 0) {
      setAlert({
        type: 'danger',
        message: `Cannot delete "${category}" as it has existing transactions (₹${budgetToDelete.spent.toFixed(
          2
        )} spent)`,
        visible: true,
      });
      return;
    }

    if (
      !window.confirm(
        `Are you sure you want to delete the "${category}" budget?`
      )
    ) {
      return;
    }

    try {
      await api.delete(`/budgets/${category}`);
      setAlert({
        type: 'success',
        message: `"${category}" budget deleted successfully`,
        visible: true,
      });
      fetchBudgets();
    } catch (error) {
      setAlert({
        type: 'danger',
        message: error.response?.data?.message || 'Failed to delete budget',
        visible: true,
      });
    }
  };

  const getProgressVariant = (spent, limit) => {
    if (!limit || limit === 0) return 'secondary';
    const percentage = (spent / limit) * 100;
    if (percentage >= 90) return 'danger';
    if (percentage >= 75) return 'warning';
    return 'success';
  };

  return (
    <div className='container py-4'>
      <div className='d-flex flex-column flex-md-row justify-content-between align-items-center mb-4'>
        <h2 className='mb-3 mb-md-0 fw-bold'>Manage Budgets</h2>
        <button className='btn btn-success' onClick={openAddModal}>
          <i className='bi bi-plus-lg me-2'></i>Add Budget
        </button>
      </div>

      {alert.visible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
          className='mb-4'
        />
      )}

      {loading ? (
        <Spinner />
      ) : budgets.length === 0 ? (
        <div className='card shadow-sm'>
          <div className='card-body text-center py-5'>
            <i className='bi bi-piggy-bank fs-1 text-muted mb-3'></i>
            <h5 className='mb-3'>No Budgets Found</h5>
            <p className='text-muted mb-4'>Start by adding your first budget</p>
            <button className='btn btn-primary' onClick={openAddModal}>
              <i className='bi bi-plus-lg me-2'></i>Add Budget
            </button>
          </div>
        </div>
      ) : (
        <div className='card shadow-sm'>
          <div className='table-responsive'>
            <table className='table table-sm align-middle mb-0'>
              <thead className='table-light'>
                <tr>
                  <th className='ps-3'>Category</th>
                  <th className='text-end pe-3'>Limit</th>
                  <th className='text-end pe-3'>Spent</th>
                  <th className='text-end pe-3'>Remaining</th>
                  <th className='text-center'>Progress</th>
                  <th className='text-end pe-3'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {budgets.map((budget) => (
                  <tr key={budget.category}>
                    <td className='ps-3 fw-medium'>{budget.category}</td>
                    <td className='text-end pe-3'>
                      ₹{budget.limit?.toFixed(2) || '0.00'}
                    </td>
                    <td className='text-end pe-3'>
                      ₹{(budget.spent || 0).toFixed(2)}
                    </td>
                    <td className='text-end pe-3 fw-bold'>
                      ₹{((budget.limit || 0) - (budget.spent || 0)).toFixed(2)}
                    </td>
                    <td>
                      <div className='mx-2'>
                        <div className='progress' style={{ height: '6px' }}>
                          <div
                            className={`progress-bar bg-${getProgressVariant(
                              budget.spent || 0,
                              budget.limit
                            )}`}
                            style={{
                              width: `${Math.min(
                                100,
                                ((budget.spent || 0) / (budget.limit || 1)) *
                                  100
                              )}%`,
                            }}
                          />
                        </div>
                      </div>
                    </td>
                    <td className='text-end pe-3'>
                      <div className='d-flex justify-content-end'>
                        <button
                          className='btn btn-sm btn-outline-primary me-2'
                          onClick={() => handleEdit(budget)}
                        >
                          <i className='bi bi-pencil'></i>
                        </button>
                        <button
                          className='btn btn-sm btn-outline-danger'
                          onClick={() => handleDelete(budget.category)}
                          disabled={
                            budget.category === 'Others' || budget.spent > 0
                          }
                          title={
                            budget.category === 'Others'
                              ? 'Default category cannot be deleted'
                              : budget.spent > 0
                              ? 'Cannot delete category with transactions'
                              : ''
                          }
                        >
                          <i className='bi bi-trash'></i>
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
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
