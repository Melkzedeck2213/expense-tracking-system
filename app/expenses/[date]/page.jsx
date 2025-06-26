'use client'

import { useEffect, useState } from 'react';
import { useParams } from 'next/navigation';
import { supabase } from '@/utils/supabaseClient';
import NavBar from '@/components/NavBar';

export default function ExpensesByDatePage() {
  const { date } = useParams();
  const [expenses, setExpenses] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editId, setEditId] = useState(null);
  const [editForm, setEditForm] = useState({ name: '', amount: '', category: '' });

  useEffect(() => {
    async function fetchExpenses() {
      setLoading(true);

      // Get logged-in user first
      const {
        data: { user },
        error: userError
      } = await supabase.auth.getUser();

      if (userError || !user) {
        setError('User not authenticated');
        setLoading(false);
        return;
      }

      // Convert the date param to start and end timestamps
      const start = `${date}T00:00:00`;
      const end = `${date}T23:59:59`;

      // Fetch expenses that match the current user and specific date range
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id)
        .gte('created_at', start)
        .lte('created_at', end);

      if (error) {
        setError('Failed to load expenses');
      } else {
        setExpenses(data);
      }
      setLoading(false);
    }

    fetchExpenses();
  }, [date]);

  const handleDelete = async (id) => {
    const { error } = await supabase
      .from('expenses')
      .delete()
      .eq('id', id);

    if (error) {
      alert('Failed to delete expense');
    } else {
      setExpenses(prev => prev.filter(exp => exp.id !== id));
    }
  };

  const startEdit = (expense) => {
    setEditId(expense.id);
    setEditForm({ name: expense.name, amount: expense.amount, category: expense.category });
  };

  const handleEditChange = (field, value) => {
    setEditForm(prev => ({ ...prev, [field]: value }));
  };

  const handleSaveEdit = async (id) => {
    const { error } = await supabase
      .from('expenses')
      .update({
        name: editForm.name,
        amount: parseFloat(editForm.amount),
        category: editForm.category,
      })
      .eq('id', id);

    if (error) {
      alert('Failed to update expense');
    } else {
      setExpenses(prev => prev.map(exp => exp.id === id ? { ...exp, ...editForm } : exp));
      setEditId(null);
    }
  };

  if (loading) return( 
  <div className='flex items-center justify-center min-h-screen'>
    <span className="loading loading-spinner text-secondary"></span>
  </div>
);
  if (error) return <p className="text-red-500">{error}</p>;

  return (
    <>
    <NavBar/>
     <div className="p-4 max-w-xl mx-auto my-50">
      <h2 className="text-xl font-bold mb-4">Expenses on {date}</h2>

      {expenses.length === 0 ? (
        <p>No expenses found for this date.</p>
      ) : (
        <ul className="space-y-4">
          {expenses.map((expense) => (
            <li key={expense.id} className="p-4 border rounded shadow">
              {editId === expense.id ? (
                <div className="space-y-2">
                  <input
                    value={editForm.name}
                    onChange={(e) => handleEditChange('name', e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Name"
                  />
                  <input
                    value={editForm.amount}
                    onChange={(e) => handleEditChange('amount', e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    type="number"
                    placeholder="Amount"
                  />
                  <input
                    value={editForm.category}
                    onChange={(e) => handleEditChange('category', e.target.value)}
                    className="w-full border px-3 py-2 rounded"
                    placeholder="Category"
                  />
                  <div className="flex gap-2">
                    <button
                      onClick={() => handleSaveEdit(expense.id)}
                      className="bg-green-500 hover:bg-green-600 text-white px-3 py-1 rounded"
                    >
                      Save
                    </button>
                    <button
                      onClick={() => setEditId(null)}
                      className="bg-gray-500 hover:bg-gray-600 text-white px-3 py-1 rounded"
                    >
                      Cancel
                    </button>
                  </div>
                </div>
              ) : (
                <>
                  <p><strong>Name:</strong> {expense.name}</p>
                  <p><strong>Amount:</strong> {expense.amount} TZS</p>
                  <p><strong>Category:</strong> {expense.category}</p>
                  <div className="mt-2 flex gap-3">
                    <button
                      onClick={() => handleDelete(expense.id)}
                      className="bg-red-500 hover:bg-red-600 text-white px-3 py-1 rounded"
                    >
                      Delete
                    </button>
                    <button
                      onClick={() => startEdit(expense)}
                      className="bg-blue-500 hover:bg-blue-600 text-white px-3 py-1 rounded"
                    >
                      Edit
                    </button>
                  </div>
                </>
              )}
            </li>
          ))}
        </ul>
      )}
    </div>
    </>
   
  );
}
