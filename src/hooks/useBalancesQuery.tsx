'use client';
import { tokens } from '@/constants';
import { Balances, useCredentialNullSafe, useSetBalances } from '@/store';
import { Multicall, Queries } from '@/utils';
import { useQuery } from '@tanstack/react-query';

export const useBalancesQuery = () => {
    const credential = useCredentialNullSafe();
    const setBalances = useSetBalances();

    const query = useQuery({
        queryKey: [Queries.BALANCES, credential.publicAddress],
        queryFn: async () => {
            const balances = await Multicall.getTokenBalances(
                credential.publicAddress,
                tokens.map((t) => t.address),
            );
            const returnData: Balances = {};
            if (balances) {
                balances.forEach((balance) => {
                    returnData[balance.address] = balance.balance;
                });
                setBalances(returnData);
            }
            return returnData;
        },
        refetchInterval: 10000,
        gcTime: Infinity,
    });

    return query;
};
