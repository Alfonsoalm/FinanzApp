import { Routes, Route } from 'react-router-dom';
import { IncomesPage, ExpensesPage, SavingsPage, SummaryPage, ProjectionPage, ErrorPage } from "../imports";

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" />
      <Route path="/incomes" element={<IncomesPage />} />
      <Route path="/expenses" element={<ExpensesPage />} />
      <Route path="/savings" element={<SavingsPage />} />
      <Route path="/summary" element={<SummaryPage ahorroActual={1000} tasaCrecimiento={5} años={10} />} />
      <Route path="/projection" element={<ProjectionPage ahorroActual={1000} tasaCrecimiento={5} años={10} />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};