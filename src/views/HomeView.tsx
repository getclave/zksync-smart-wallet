'use client';
import { Loading } from '@/components/Loading';
import { tokens } from '@/constants/tokens';
import { useBalances, useIsBalancesSet } from '@/store';
import { formatUnits } from 'ethers/lib/utils';
import Image from 'next/image';

export const HomeView = () => {
    const balances = useBalances();
    const isBalancesSet = useIsBalancesSet();

    return (
        <div className="space-y-3">
            {!isBalancesSet ? (
                <Loading />
            ) : (
                tokens.map((token) => (
                    <div
                        className="flex bg-slate-900 p-4 rounded-lg items-center"
                        key={token.address}
                    >
                        <Image
                            src={token.icon}
                            alt={token.name}
                            width={40}
                            height={40}
                        />
                        <div className="ml-4">
                            <p className="text-md">{token.name}</p>
                            <p className="text-xs text-gray-400">
                                {token.symbol}
                            </p>
                        </div>
                        <div className="ml-auto">
                            <p className="text-md">
                                {formatUnits(
                                    balances[token.address],
                                    token.decimals,
                                )}{' '}
                                {token.symbol}
                            </p>
                        </div>
                    </div>
                ))
            )}
        </div>
    );
};
