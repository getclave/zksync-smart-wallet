"use client";
import { Layout } from "@/components/Layout";
import { Webauthn } from "@/utils";
import { FaUserPlus } from "react-icons/fa";

export default function Home() {
  return (
    <Layout>
      <div className="flex flex-1 justify-center items-center">
        <div className=" flex flex-col items-center bg-slate-900 border-2 border-slate-800 w-[512px] min-h-[512px] rounded-lg p-8">
          <p className="text-2xl text-white text-center">
            ZKsync Smart Wallet Demo
          </p>
          <button
            onClick={async () => {
              await Webauthn.register("clave", "clave", "dead");
            }}
            className="text-white flex flex-col items-center justify-center bg-slate-950 p-4 rounded-lg w-full mt-8 border-2 border-slate-800 focus:border-blue-600"
          >
            <FaUserPlus className="mr-2" size={32} />
            <p className="text-xl mt-2">Create Smart Wallet</p>
            <p className="text-sm mt-2 text-gray-400">
              Start deploying your Smart Wallet on ZKsync, using Clave
              infrastructure
            </p>
          </button>
          <p className="text-center text-white mt-auto">
            🩵 Made with one mission: to accelerate the onboarding of the next
            billion to crypto.
          </p>
        </div>
      </div>
    </Layout>
  );
}
