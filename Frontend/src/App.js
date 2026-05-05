import React from "react";
import Login from "./pages/Login";
import Register from "./pages/Register";
import Dashboard from "./pages/Dashboard";
import "./index.css";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Layout from "./components/Layout";
import Inventory from "./pages/Inventory";
import NoPageFound from "./pages/NoPageFound";
import AuthContext from "./AuthContext";
import ProtectedWrapper from "./ProtectedWrapper";
import { useEffect, useState } from "react";
import Store from "./pages/Store";
import Sales from "./pages/Sales";
import PurchaseDetails from "./pages/PurchaseDetails";
import AIInsights from "./pages/AIInsights";

const App = () => {
  const [user, setUser] = useState("");
  const [loader, setLoader] = useState(true);

  useEffect(() => {
    try {
      const stored = localStorage.getItem("user");
      if (stored) {
        const myLoginUser = JSON.parse(stored);
        // Validate: MongoDB ObjectId is 24 hex chars
        const validId = myLoginUser?._id && /^[a-f0-9]{24}$/i.test(myLoginUser._id);
        if (validId) {
          setUser(myLoginUser._id);
        } else {
          // Stale / corrupt session – clear and force re-login
          console.warn("Stale session cleared.");
          localStorage.removeItem("user");
          setUser("");
        }
      } else {
        setUser("");
      }
    } catch {
      localStorage.removeItem("user");
      setUser("");
    }
    setLoader(false);
  }, []);

  const signin = (newUser, callback) => {
    setUser(newUser);
    callback();
  };

  const signout = () => {
    setUser(null);
    localStorage.removeItem("user");
  };

  let value = { user, signin, signout };

  if (loader)
    return (
      <div
        style={{
          flex: 1,
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <h1>LOADING...</h1>
      </div>
    );

  return (
    <AuthContext.Provider value={value}>
      <BrowserRouter>
        <Routes>
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />
          <Route
            path="/"
            element={
              <ProtectedWrapper>
                <Layout />
              </ProtectedWrapper>
            }
          >
            <Route index element={<Dashboard />} />
            <Route path="/inventory" element={<Inventory />} />
            <Route path="/purchase-details" element={<PurchaseDetails />} />
            <Route path="/sales" element={<Sales />} />
            <Route path="/manage-store" element={<Store />} />
            <Route path="/ai-insights" element={<AIInsights />} />
          </Route>
          <Route path="*" element={<NoPageFound />} />
        </Routes>
      </BrowserRouter>
    </AuthContext.Provider>
  );
};

export default App;
