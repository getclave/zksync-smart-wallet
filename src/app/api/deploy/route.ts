import { abiFactory, RPC_URL, SmartContract } from '@/utils';
import { ethers } from 'ethers';
import { Provider, types, Wallet } from 'zksync-ethers';

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;

const retry = async <T>(fn: () => Promise<T>, retries = 5) => {
    let retried = 0;

    while (retried < retries) {
        try {
            return await fn();
        } catch (e) {
            console.error(e);
            await new Promise((resolve) => setTimeout(resolve, 2000));
            console.log(`Retrying... ${retried}`);
            retried++;
        }
    }
    throw new Error('Failed to execute function');
};

export async function POST(request: Request) {
    const body = await request.json();
    const { salt, initializer } = body;

    const provider = new ethers.providers.JsonRpcProvider({
        skipFetchSetup: true,
        url: RPC_URL,
    });

    if (!DEPLOYER_PRIVATE_KEY) {
        return Response.json(
            {
                message: 'DEPLOYER_PRIVATE_KEY is not set',
            },
            {
                status: 500,
            },
        );
    }

    const deployerWallet = new Wallet(
        DEPLOYER_PRIVATE_KEY,
        provider as Provider,
    );

    const contracts = SmartContract.create();
    const factoryContract = contracts.getContractWithEOASigner(
        'accountFactory',
        abiFactory,
        deployerWallet,
    );

    const deploymentFn = () =>
        factoryContract.deployAccount(salt, initializer, {
            // Provide manual gas limit
            gasLimit: 100_000_000,
        });

    const tx = await retry<types.TransactionResponse>(deploymentFn);

    const receipt = await tx.wait();

    return Response.json(receipt);
}

export async function GET() {
    return Response.json({ status: 'ok' });
}
