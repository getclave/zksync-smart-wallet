'use client';
import { useCredentialNullSafe, useSetCredential } from '@/store';
import Favicon from '@/app/favicon.png';
import Image from 'next/image';
import { formatAddress, Storage, StorageKeys } from '@/utils';
import { FaExternalLinkAlt } from 'react-icons/fa';
import { useMemo } from 'react';
import { CONFIG } from '@/utils/config';

export const Navbar = () => {
    const setCredential = useSetCredential();
    const credential = useCredentialNullSafe();

    const blockExplorerAddress = useMemo(() => {
        if (CONFIG.chainId === 300) {
            return `https://sepolia.explorer.zksync.io/address/${credential.publicAddress}`;
        } else if (CONFIG.chainId === 324) {
            return `https://explorer.zksync.io/address/${credential.publicAddress}`;
        }
    }, [CONFIG.chainId, credential.publicAddress]);

    return (
        <nav className="container py-4">
            <div className="justify-between items-center flex w-full">
                <div className="flex space-x-4 items-center">
                    <Image
                        alt="Logo"
                        src={Favicon}
                        className="w-[48px] h-[48px]"
                    />
                    <div className="flex items-center">
                        <div className="flex flex-col">
                            <span className="text-xs text-gray-400">
                                Wallet
                            </span>
                            <div className="flex items-center text-sm">
                                {formatAddress(credential.publicAddress)}{' '}
                                <a
                                    className="ml-2"
                                    target="_blank"
                                    href={blockExplorerAddress}
                                >
                                    <FaExternalLinkAlt size={14} />
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <button
                    onClick={() => {
                        setCredential(null);
                        Storage.removeItem(StorageKeys.credential);
                    }}
                    className="bDanger"
                >
                    Disconnect
                </button>
            </div>
        </nav>
    );
};
