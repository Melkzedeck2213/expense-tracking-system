
// This page lists all days with total expenses per day
'use client';

import Link from 'next/link';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';
import NavBar from '@/components/NavBar';

export default function ExpensesPage() {
  const [groupedExpenses, setGroupedExpenses] = useState({});

  useEffect(() => {
    async function fetchExpenses() {
      // Step 1: Get all expenses for the current user
      const {
        data: { user },
      } = await supabase.auth.getUser();

      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);

      if (error || !data) {
        console.error('Failed to load expenses:', error);
        return;
      }

      // Step 2: Group expenses by date (remove time)
      const grouped = data.reduce((acc, expense) => {
        const dateKey = expense.created_at.split('T')[0]; // keep only date
        if (!acc[dateKey]) acc[dateKey] = [];
        acc[dateKey].push(expense);
        return acc;
      }, {});

      setGroupedExpenses(grouped);
    }

    fetchExpenses();
  }, []);

  const formatDateLabel = (dateStr) => {
    const date = new Date(dateStr);
    return date.toLocaleDateString('en-US', {
      weekday: 'long',
      day: 'numeric',
      month: 'short',
      year: 'numeric',
    });
  };

  return (
<>
<NavBar/>
    <div className="p-4 max-w-3xl mx-auto space-y-4 my-50">
      <h2 className="text-xl font-bold">Your Expenses by Date</h2>
      {Object.entries(groupedExpenses).map(([date, expenses]) => {
        const total = expenses.reduce((sum, e) => sum + e.amount, 0);

        return (
          <Link href={`/expenses/${date}`} key={date}>
            <div className="border p-4 rounded hover:bg-base-100 cursor-pointer">
              <h3 className="font-medium">{formatDateLabel(date)}</h3>
              <p>Total: {total.toLocaleString()} TZS</p>
            </div>
          </Link>
        );
      })}
    </div>
</>
  );
}
