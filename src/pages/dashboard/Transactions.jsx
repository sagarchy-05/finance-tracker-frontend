import React, { useEffect, useState } from 'react';
import api from '../../api/axios';
import Alert from '../../components/Alert';
import Spinner from '../../components/Spinner';
import TransactionModal from '../../components/TransactionModal';
import exportToPDF from '../../utils/exportToPDF';
import { toast } from 'react-toastify';

const Transactions = () => {
  const [transactions, setTransactions] = useState([]);
  const [selectedTransaction, setSelectedTransaction] = useState(null);
  const [showModal, setShowModal] = useState(false);
  const [alert, setAlert] = useState({ type: '', message: '', visible: false });
  const [loading, setLoading] = useState(true);
  const [budgets, setBudgets] = useState([]);

  const fetchTransactions = async () => {
    setLoading(true);
    try {
      const res = await api.get('/transactions/all');
      setTransactions(
        Array.isArray(res.data) ? res.data : res.data.transactions || []
      );
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Failed to fetch transactions',
        visible: true,
      });
      setTransactions([]);
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

  useEffect(() => {
    fetchTransactions();
    fetchBudgets();
  }, []);

  const handleDelete = async (id) => {
    try {
      await api.delete(`/transactions/delete/${id}`);
      setTransactions((prev) => prev.filter((t) => t._id !== id));
      toast.success('Transaction deleted!');
    } catch (error) {
      setAlert({
        type: 'danger',
        message: 'Delete failed',
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
    const payload = {
      amount: Number(data.amount),
      type: 'expense',
      category: data.category,
      date: data.date,
      description: data.description,
    };

    try {
      if (selectedTransaction && selectedTransaction._id) {
        await api.put(`/transactions/${selectedTransaction._id}`, payload);
        toast.success('Transaction updated!');
      } else {
        const res = await api.post('/transactions/create', payload);
        if (!res.data || !res.data.transaction) {
          throw new Error('Transaction not returned');
        }
        toast.success('Transaction added!');
      }

      setShowModal(false);
      fetchTransactions();
      fetchBudgets();
    } catch (err) {
      toast.error(err.response?.data?.message || 'Transaction failed');
    }
  };

  return (
    <div className='container py-4'>
      <div className='d-flex justify-content-between align-items-center mb-4'>
        <h2>Transactions</h2>
        <div>
          <button
            className='btn btn-outline-danger me-2'
            onClick={() => exportToPDF('transactionsTable', 'transactions.pdf')}
          >
            Download as PDF
          </button>
          <button className='btn btn-primary' onClick={handleAdd}>
            + Add Transaction
          </button>
        </div>
      </div>

      {alert.visible && (
        <Alert
          type={alert.type}
          message={alert.message}
          onClose={() => setAlert({ ...alert, visible: false })}
        />
      )}

      {loading ? (
        <Spinner />
      ) : (
        <div id='transactionsTable'>
          {transactions.length === 0 ? (
            <p>No transactions yet.</p>
          ) : (
            <div className='table-responsive'>
              <table className='table table-bordered'>
                <thead className='table-light'>
                  <tr>
                    <th>Date</th>
                    <th>Category</th>
                    <th>Amount</th>
                    <th>Description</th>
                    <th>Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {transactions.map((tx) => (
                    <tr key={tx._id}>
                      <td>{new Date(tx.date).toLocaleDateString()}</td>
                      <td>{tx.category}</td>
                      <td>{tx.amount}</td>
                      <td>{tx.description}</td>
                      <td>
                        <button
                          className='btn btn-sm btn-secondary me-2'
                          onClick={() => handleEdit(tx)}
                        >
                          Edit
                        </button>
                        <button
                          className='btn btn-sm btn-danger'
                          onClick={() => handleDelete(tx._id)}
                        >
                          Delete
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
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
