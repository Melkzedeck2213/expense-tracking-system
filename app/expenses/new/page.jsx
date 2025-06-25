"use client"
import ExpenseForm from '@/components/ExpenseForm';
import NavBar from '@/components/NavBar';

export default function ExpensesPage() {
  return (
    <>
     <NavBar/>
    <div className="min-h-screen flex flex-col items-center justify-center p-6 my-10">
      <div className="w-full max-w-md  rounded-lg  p-8 flex flex-col items-center">
        <h1 className="text-2xl font-bold mb-6 text-center">Add New Expense</h1>
        <ExpenseForm />
      </div>
    </div>
    </>
    
  );
}
