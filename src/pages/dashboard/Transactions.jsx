import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';
import TransactionModal from '../../components/TransactionModal';
import exportToPDF from '../../utils/exportToPDF';
import { FaFilePdf, FaPlus, FaEdit, FaTrash, FaFilter } from 'react-icons/fa';
import Select from 'react-select';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [filteredTransactions, setFilteredTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);
  const [selectedCategory, setSelectedCategory] = useState(null);

  useEffect(() => {
    document.title = 'Transactions - Finance Tracker';
    fetchTransactions();
    fetchBudgets();
  }, []);

  useEffect(() => {
    if (selectedCategory) {
      setFilteredTransactions(
        transactions.filter((tx) => tx.category === selectedCategory.value)
      );
    } else {
      setFilteredTransactions(transactions);
    }
  }, [selectedCategory, transactions]);

  const exportFilteredTransactions = async () => {
    // Create a temporary table with only the columns we want to export
    const tempTable = document.createElement('table');
    tempTable.className = 'table table-hover mb-0';
    tempTable.id = 'tempPdfTable';

    // Create table header
    const thead = document.createElement('thead');
    thead.className = 'table-light';
    thead.innerHTML = `
    <tr>
      <th>Date</th>
      <th>Category</th>
      <th>Amount</th>
      <th>Description</th>
    </tr>
  `;
    tempTable.appendChild(thead);

    // Create table body with filtered data
    const tbody = document.createElement('tbody');
    filteredTransactions.forEach((tx) => {
      const row = document.createElement('tr');
      row.innerHTML = `
      <td>${new Date(tx.date).toLocaleDateString('en-IN', {
        day: '2-digit',
        month: 'short',
        year: 'numeric',
      })}</td>
      <td>${tx.category}</td>
      <td>₹${tx.amount.toFixed(2)}</td>
      <td>${tx.description || '-'}</td>
    `;
      tbody.appendChild(row);
    });
    tempTable.appendChild(tbody);

    // Add the temporary table to the DOM (hidden)
    tempTable.style.position = 'absolute';
    tempTable.style.left = '-9999px';
    document.body.appendChild(tempTable);

    try {
      await exportToPDF('tempPdfTable', 'transactions.pdf');
    } finally {
      // Clean up the temporary table
      document.body.removeChild(tempTable);
    }
  };

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions/all');
      const data = Array.isArray(res.data)
        ? res.data
        : res.data.transactions || [];
      setTransactions(data);
      setFilteredTransactions(data);
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Failed to fetch transactions',
        visible: true,
      });
      setTransactions([]);
      setFilteredTransactions([]);
    } finally {
      setLoading(false);
    }
  };

  const fetchBudgets = async () => {
    try {
      const res = await api.get('/budgets');
      const categoriesOnly = (res.data || []).map((b) => b.category);
      setBudgets(categoriesOnly);
    } catch (error) {
      console.error('Failed to fetch budgets', error);
    }
  };

  const handleDelete = async (id) => {
    if (!window.confirm('Are you sure you want to delete this transaction?'))
      return;

    try {
      await api.delete(`/transactions/delete/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      setAlert({
        type: 'success',
        message: 'Transaction deleted successfully!',
        visible: true,
      });
    } catch (error) {
      setAlert({
        type: 'danger',
        message:
          error.response?.data?.message || 'Failed to delete transaction',
        visible: true,
      });
    }
  };

  const handleEdit = (transaction) => {
    setSelectedTransaction(transaction);
    setShowModal(true);
  };

  const handleAdd = () => {
    setSelectedTransaction({});
    setShowModal(true);
  };

  const handleSave = async (data) => {
    try {
      const payload = {
        amount: Number(data.amount),
        type: 'expense',
        category: data.category,
        date: data.date,
        description: data.description,
      };

      if (selectedTransaction && selectedTransaction._id) {
        await api.put(`/transactions/${selectedTransaction._id}`, payload);
        setAlert({
          type: 'success',
          message: 'Transaction updated successfully!',
          visible: true,
        });
      } else {
        await api.post('/transactions/create', payload);
        setAlert({
          type: 'success',
          message: 'Transaction added successfully!',
          visible: true,
        });
      }

      setShowModal(false);
      fetchTransactions();
      fetchBudgets();
    } catch (err) {
      setAlert({
        type: 'danger',
        message: err.response?.data?.message || 'Transaction operation failed',
        visible: true,
      });
    }
  };

  const categoryOptions = [
    { value: null, label: 'All Categories' },
    ...budgets.map((category) => ({ value: category, label: category })),
  ];

  return (
    <div className='container py-4'>
      <div className='d-flex flex-wrap justify-content-between align-items-center mb-4 gap-2'>
        <h2 className='fw-bold mb-0'>Transaction History</h2>

        <div
          className='d-flex flex-wrap gap-2 align-items-center'
          style={{ minWidth: 'fit-content' }}
        >
          <div style={{ width: '180px' }}>
            <Select
              options={categoryOptions}
              value={selectedCategory || categoryOptions[0]}
              onChange={setSelectedCategory}
              placeholder='Filter'
              isSearchable
              classNamePrefix='react-select'
              className='category-select'
            />
          </div>

          <button
            className='btn btn-outline-danger d-flex align-items-center py-2'
            onClick={exportFilteredTransactions}
          >
            <FaFilePdf className='me-1' />
            <span className='d-none d-sm-inline'>Export</span>
          </button>

          <button
            className='btn btn-primary d-flex align-items-center py-2'
            onClick={handleAdd}
          >
            <FaPlus className='me-1' />
            <span className='d-none d-sm-inline'>Add New</span>
          </button>
        </div>
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
      ) : filteredTransactions.length === 0 ? (
        <div className='card shadow-sm'>
          <div className='card-body text-center py-5'>
            <FaFilter className='text-muted fs-1 mb-3' />
            <h4>No Transactions Found</h4>
            <p className='text-muted mb-4'>
              {selectedCategory
                ? `No transactions in "${selectedCategory.label}" category`
                : 'Add your first transaction to get started'}
            </p>
            <button className='btn btn-primary' onClick={handleAdd}>
              <FaPlus className='me-2' />
              Add Transaction
            </button>
          </div>
        </div>
      ) : (
        <div className='card shadow-sm border-0 overflow-hidden'>
          <div className='table-responsive' id='transactionsTable'>
            <table className='table table-hover mb-0'>
              <thead className='table-light'>
                <tr>
                  <th className='ps-4'>Date</th>
                  <th>Category</th>
                  <th className='text-end'>Amount</th>
                  <th>Description</th>
                  <th className='pe-4 text-end'>Actions</th>
                </tr>
              </thead>
              <tbody>
                {filteredTransactions.map((tx) => (
                  <tr key={tx._id}>
                    <td className='ps-4'>
                      {new Date(tx.date).toLocaleDateString('en-IN', {
                        day: '2-digit',
                        month: 'short',
                        year: 'numeric',
                      })}
                    </td>
                    <td>
                      <span className='badge bg-light text-dark'>
                        {tx.category}
                      </span>
                    </td>
                    <td className='text-end fw-bold'>
                      ₹{tx.amount.toFixed(2)}
                    </td>
                    <td className='text-truncate' style={{ maxWidth: '200px' }}>
                      {tx.description || '-'}
                    </td>
                    <td className='pe-4 text-end'>
                      <div className='d-flex justify-content-end'>
                        <button
                          className='btn btn-sm btn-outline-primary me-2'
                          onClick={() => handleEdit(tx)}
                        >
                          <FaEdit />
                        </button>
                        <button
                          className='btn btn-sm btn-outline-danger'
                          onClick={() => handleDelete(tx._id)}
                        >
                          <FaTrash />
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

      <TransactionModal
        show={showModal}
        onHide={() => setShowModal(false)}
        onSave={handleSave}
        transaction={selectedTransaction}
        budgets={budgets}
      />
    </div>
  );
};

export default Transactions;
