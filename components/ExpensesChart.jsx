// app/components/ExpenseCharts.tsx
"use client";

import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabaseClient";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
  PieChart,
  Pie,
  Cell,
  Legend,
} from "recharts";

export default function ExpenseCharts() {
  const [byMonth, setByMonth] = useState([]);
  const [byCat, setByCat] = useState([]);
  const [loading, setLoading] = useState(true);
  const [err, setErr] = useState("");

  useEffect(() => {
    async function load() {
      setLoading(true);

      // 1️⃣ Get current user
      const {
        data: { user },
        error: userErr,
      } = await supabase.auth.getUser();
      if (userErr || !user) {
        setErr("User not authenticated");
        setLoading(false);
        return;
      }

      // 2️⃣ Fetch all user expenses
      const { data, error } = await supabase
        .from("expenses")
        .select("id, amount, category, created_at")
        .eq("user_id", user.id);

      if (error) {
        setErr("Couldn’t fetch expenses");
        setLoading(false);
        return;
      }

      const monthMap = {};
      const catMap = {};
      const expenses = data;

      expenses.forEach(({ amount, category, created_at }) => {
        const key = created_at.slice(0, 7); // "YYYY-MM"
        monthMap[key] = (monthMap[key] || 0) + amount;
        catMap[category] = (catMap[category] || 0) + amount;
      });

      setByMonth(
        Object.entries(monthMap)
          .sort()
          .map(([month, total]) => ({ month, total }))
      );
      setByCat(
        Object.entries(catMap).map(([category, total]) => ({
          category,
          total,
        }))
      );

      setLoading(false);
    }

    load();
  }, []);

  // Get highest-spend category
  const topCat = byCat.length
    ? byCat.reduce((max, cur) => (cur.total > max.total ? cur : max))
    : null;

  const pieColors = [
    "#6366F1", // indigo
    "#F59E0B", // amber
    "#EF4444", // red
    "#10B981", // emerald
    "#8B5CF6", // violet
    "#F472B6", // pink
  ];

  if (loading)
    return (
      <div className="flex min-h-48 items-center justify-center">
        <span className="loading loading-spinner text-secondary"></span>
      </div>
    );

  if (err) return <p className="text-red-500">{err}</p>;
  if (!byMonth.length) return <p>No expense data yet.</p>;

  return (
    <section className="mx-auto max-w-5xl space-y-12 px-4 py-8">
      {/* ── Monthly totals ───────────────────── */}
      <div className="card rounded-2xl bg-base-100 p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">Monthly spending (TZS)</h3>

        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={byMonth}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis />
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
              labelStyle={{ color: "#f3f4f6" }}
              itemStyle={{ color: "#f9fafb" }}
            />
            <Bar
              dataKey="total"
              radius={[4, 4, 0, 0]}
              fill="currentColor"
              className="text-primary"
            />
          </BarChart>
        </ResponsiveContainer>
      </div>

      {/* ── Category totals ───────────────────── */}
      <div className="card rounded-2xl bg-base-100 p-6 shadow">
        <h3 className="mb-4 text-lg font-semibold">
          All-time spending by category
        </h3>

        <ResponsiveContainer width="100%" height={320}>
          <PieChart>
            <Pie
              data={byCat}
              dataKey="total"
              nameKey="category"
              cx="50%"
              cy="50%"
              outerRadius={110}
              innerRadius={40}
              paddingAngle={3}
            >
              {byCat.map((_, i) => (
                <Cell key={i} fill={pieColors[i % pieColors.length]} />
              ))}
            </Pie>
            <Tooltip
              contentStyle={{
                backgroundColor: "#1f2937",
                border: "none",
                borderRadius: "8px",
                color: "#f9fafb",
              }}
              itemStyle={{ color: "#f9fafb" }}
            />
            <Legend verticalAlign="bottom" height={36} />
          </PieChart>
        </ResponsiveContainer>

        {/* 🆕 Summary line below chart */}
        {topCat && (
          <div className="mt-6 text-center">
            <span className="text-sm opacity-70">Most spent on </span>
            <span className="font-semibold">{topCat.category}</span>{" "}
            <span className="opacity-70">
              ({topCat.total.toLocaleString()} TZS)
            </span>
          </div>
        )}
      </div>
    </section>
  );
}
