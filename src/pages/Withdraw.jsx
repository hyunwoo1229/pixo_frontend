import React from "react";
import Header from "../components/Header/Header";
import RegisterLogo from "../components/Register/RegisterLogo";
import WithdrawConfirm from "../components/Header/WithdrawConfirm"; 

export default function Withdraw() {
  return (
    <div className="min-h-screen bg-white">
      <Header />
      <div className="px-6 pt-4 flex flex-col items-center">
        <RegisterLogo />
        <WithdrawConfirm />
      </div>
    </div>
  );
}
