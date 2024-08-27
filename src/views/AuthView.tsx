"use client";
import { useCredential, useSetCredential } from "@/store";
import { Deployer, Storage, StorageKeys, Webauthn } from "@/utils";
import { ReactNode } from "react";
import { FaArrowCircleRight, FaUserPlus } from "react-icons/fa";

type BoxProps = {
  onPress: () => void;
  title: string;
  text: string;
  icon: ReactNode;
};
export const AuthView = () => {
  const credential = useCredential();
  const setCredential = useSetCredential();

  const deployAccount = async () => {
    const deployer = Deployer.create();
    const publicAddress = await deployer.getRandomAddress();
    const passkey = await Webauthn.register(publicAddress);
    const credential = {
      publicAddress,
      credentialId: passkey.id,
    };
    Storage.setJsonItem(StorageKeys.credential, credential);
    setCredential(credential);
  };

  const loginAccount = async () => {
    const passkey = await Webauthn.login();
    const credential = {
      publicAddress: passkey.response.userHandle,
      credentialId: passkey.id,
    };
    Storage.setJsonItem(StorageKeys.credential, credential);
    setCredential(credential);
  };

  return (
    <div className="flex flex-1 justify-center items-center">
      <div className=" flex flex-col items-center bg-slate-900 border-2 border-slate-800 w-[512px] min-h-[512px] max-w-[95vw] rounded-lg p-8 overflow-hidden">
        <p className="text-2xl text-white text-center mb-4">
          ZKsync Smart Wallet Demo
        </p>
        <div className="space-y-4">
          <Box
            onPress={deployAccount}
            icon={<FaUserPlus className="mr-2" size={32} />}
            title="Create Smart Wallet"
            text=" Start deploying your Smart Wallet on ZKsync, using Clave
              infrastructure"
          />

          <Box
            onPress={loginAccount}
            icon={<FaArrowCircleRight className="mr-2" size={32} />}
            title="Login Existing Wallet"
            text={`Start using your existing Smart Wallet on ZKsync`}
          />
        </div>

        <p className="text-center text-white mt-4">
          🩵 Made with one mission: to accelerate the onboarding of the next
          billion to crypto.
        </p>
      </div>
    </div>
  );
};

const Box = ({ onPress, title, text, icon }: BoxProps): ReactNode => {
  return (
    <button
      onClick={onPress}
      className="text-white flex flex-col items-center justify-center bg-slate-950 p-4 rounded-lg w-full border-2 border-slate-800 focus:border-blue-600 min-h-[180px]"
    >
      {icon}
      <p className="text-xl mt-2">{title}</p>
      <p className="text-sm mt-2 text-gray-400">{text}</p>
    </button>
  );
};