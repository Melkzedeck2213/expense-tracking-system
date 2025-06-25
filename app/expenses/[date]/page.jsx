
// This page shows all expenses for one specific date
'use client';

import { useParams } from 'next/navigation';
import { useEffect, useState } from 'react';
import { supabase } from '@/utils/supabaseClient';

export default function ExpensesByDatePage() {
  const { date } = useParams();
  const [expenses, setExpenses] = useState([]);

  useEffect(() => {
    async function fetchExpenses() {
      // Step 1: Get user ID first
      const {
        data: { user },
      } = await supabase.auth.getUser();

      if (!user) return;

      // Step 2: Pull all expenses and filter on client (for now)
      const { data, error } = await supabase
        .from('expenses')
        .select('*')
        .eq('user_id', user.id);

      if (error || !data) {
        console.error('Error fetching expenses:', error);
        return;
      }

      // Step 3: Filter only the ones for the selected date
      const filtered = data.filter((exp) => exp.created_at.startsWith(date));
      setExpenses(filtered);
    }

    fetchExpenses();
  }, [date]);

  return (
    <div className="p-4 max-w-2xl mx-auto">
      <h2 className="text-xl font-bold mb-4">Expenses for {date}</h2>
      {expenses.length === 0 ? (
        <p>No expenses found for this day.</p>
      ) : (
        expenses.map((exp) => (
          <div key={exp.id} className="border-b py-2">
            <p className="font-medium">{exp.name}</p>
            <p>{exp.amount} TZS – {exp.category}</p>
          </div>
        ))
      )}
    </div>
  );
}
