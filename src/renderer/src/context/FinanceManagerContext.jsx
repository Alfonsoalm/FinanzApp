import { createContext, useState } from "react";

export const FinanceManagerContext = createContext();

export const FinanceManagerProvider = ({ children }) => {
  const [incomes, setIncomes] = useState([]);
  const [expenses, setExpenses] = useState([]);
  const [savings, setSavings] = useState([]);
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  // Funciones para ingresos
  const getIncomes = async () => {
    try {
        setIsLoading(true);
        setError(null);
        const result = await window.api.getIncomes();
        if (result.success) {
        setIncomes(result.data);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const insertIncome = async (income) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await window.api.insertIncome(income);
      if (result.success) {
        getIncomes();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteIncome = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await window.api.deleteIncome(id);
      if (result.success) {
        getIncomes();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones para gastos
  const getExpenses = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await window.api.getExpenses();
      if (result.success) {
        setExpenses(result.data);
        console.log("Expenses: ",expenses);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const insertExpense = async (expense) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await window.api.insertExpense(expense);
      if (result.success) {
        getExpenses();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteExpense = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await window.api.deleteExpense(id);
      if (result.success) {
        getExpenses();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  // Funciones para ahorros
  const getSavings = async () => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await window.api.getSavings();
      if (result.success) {
        setSavings(result.data);
        console.log("Savings: ",savings);
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const insertSaving = async (saving) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await window.api.insertSaving(saving);
      if (result.success) {
        getSavings();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  const deleteSaving = async (id) => {
    try {
      setIsLoading(true);
      setError(null);
      const result = await window.api.deleteSaving(id);
      if (result.success) {
        getSavings();
      } else {
        setError(result.error);
      }
    } catch (error) {
      setError(error.message);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <FinanceManagerContext.Provider
      value={{
        incomes,
        expenses,
        savings,
        error,
        isLoading,
        getIncomes,
        insertIncome,
        deleteIncome,
        getExpenses,
        insertExpense,
        deleteExpense,
        getSavings,
        insertSaving,
        deleteSaving,
      }}
    >
      {children}
    </FinanceManagerContext.Provider>
  );
};
