import React from 'react';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom'; // Use Routes instead of Switch
import PaymentPage from './Screen/hyperPay';

function App() {
  return (
    <div className="App">
      <Router>
        <Routes>
          {/* Define Route with element prop instead of component */}
          <Route path="/:userId/:bookingId/:paramCardType/:paymentType/:fromWhere" element={<PaymentPage />} />
          {/* Add other routes here */}
        </Routes>
      </Router>
    </div>
  );
}


export default App;
