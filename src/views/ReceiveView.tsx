import { QRCode } from 'react-qrcode-logo';
import Favicon from '@/app/favicon.png';
import { useCredentialNullSafe } from '@/store';

export const ReceiveView = () => {
    const credential = useCredentialNullSafe();

    return (
        <div>
            <h1 className="text-4xl font-semibold">Receive</h1>
            <div className="mt-4">
                <QRCode
                    style={{
                        width: '100%',
                        height: '100%',
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
                <span className="font-semibold">
                    {credential.publicAddress}
                </span>
            </div>
        </div>
    );
};
