import { QRCode } from 'react-qrcode-logo';
import Favicon from '@/app/favicon.png';
import { useCredentialNullSafe } from '@/store';
import { useState } from 'react';

export const ReceiveView = () => {
    const credential = useCredentialNullSafe();

    const [addressCopied, setAddressCopied] = useState(false);

    const copyAddress = () => {
        navigator.clipboard.writeText(credential.publicAddress);
        setAddressCopied(true);
        setTimeout(() => {
            setAddressCopied(false);
        }, 1000);
    };

    return (
        <div>
            <h1 className="text-4xl font-semibold">Receive</h1>
            <div className="mt-4">
                <QRCode
                    style={{
                        width: '50%',
                        height: '50%',
                        borderRadius: 12,
                        margin: 'auto',
                    }}
                    logoPaddingStyle="circle"
                    logoImage={Favicon.src}
                    value={credential.publicAddress}
                    removeQrCodeBehindLogo={true}
                />
            </div>
            <div className="flex flex-col items-center mt-4">
                <span className="text-gray-400 text-sm">
                    Your ZKsync Address
                </span>
                <span
                    className="font-semibold text-center"
                    style={{
                        overflowWrap: 'anywhere',
                    }}
                >
                    {credential.publicAddress}
                </span>
                <button onClick={copyAddress} className="bPrimary mt-4">
                    {addressCopied ? 'Copied' : 'Copy Address'}
                </button>
            </div>
        </div>
    );
};
