import { Routes, Route } from 'react-router-dom';
import { IncomesPage, ExpensesPage, SavingsPage, SummaryPage, ProjectionPage, ErrorPage } from "../imports";

export const Routing = () => {
  return (
    <Routes>
      <Route path="/" element={<IncomesPage />}/>
      <Route path="/incomes" element={<IncomesPage />} />
      <Route path="/expenses" element={<ExpensesPage />} />
      <Route path="/savings" element={<SavingsPage />} />
      <Route path="/summary" element={<SummaryPage />} />
      <Route path="/projection" element={<ProjectionPage />} />
      <Route path="*" element={<ErrorPage />} />
    </Routes>
  );
};