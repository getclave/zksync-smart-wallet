import { abiFactory, RPC_URL, SmartContract } from '@/utils';
import { ethers } from 'ethers';
import { Provider, Wallet } from 'zksync-ethers';

const DEPLOYER_PRIVATE_KEY = process.env.DEPLOYER_PRIVATE_KEY!;

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

    const tx = await factoryContract.deployAccount(salt, initializer, {
        // Provide manual gas limit
        gasLimit: 10_000_000,
    });

    const receipt = await tx.wait();

    return Response.json(receipt);
}

export async function GET() {
    return Response.json({ status: 'ok' });
}
