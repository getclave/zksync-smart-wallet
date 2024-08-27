'use client';

import { core } from '@/utils';
import { mergeClasses } from '@/utils/global';
import { ethers } from 'ethers';
import { useMemo, useState } from 'react';

export const SendView = () => {
    const [value, setValue] = useState('');
    const [receiver, setReceiver] = useState('');

    const transfer = async () => {
        core.populateTransaction({
            to: '',
        });
    };

    const isButtonDisabled = useMemo(() => {
        return value.length === 0 || !ethers.utils.isAddress(receiver);
    }, [receiver, value]);

    return (
        <div>
            <h1 className="text-4xl font-semibold">Send</h1>
            <div>
                <div className="mt-4">
                    <span className="inputLabel">Receiver</span>
                    <input
                        onChange={(e) => setReceiver(e.target.value)}
                        placeholder="Enter address"
                        autoFocus
                        value={receiver}
                        className="h-12 w-full mt-2 text-md bg-transparent outline-none caret-slate-300 border-b-2"
                    />
                </div>

                <div className="flex flex-col mt-10  border-b-2">
                    <span className="inputLabel">Receiver</span>
                    <input
                        onChange={(e) => {
                            const _value = e.target.value;
                            const commasReplace = _value.replace(/,/g, '.');
                            if (commasReplace === '.') {
                                setValue('0.');
                            } else {
                                if (commasReplace.match(/^[0-9]*\.?[0-9]*$/)) {
                                    setValue(commasReplace);
                                }
                            }
                        }}
                        placeholder="0.00"
                        value={value}
                        className="h-12 rounded-md text-4xl bg-transparent outline-none caret-slate-300 mt-2"
                    />
                </div>
            </div>
            <button
                className={mergeClasses(
                    'bPrimary h-16 w-full mt-12',
                    isButtonDisabled && 'disabled',
                )}
            >
                Send
            </button>
        </div>
    );
};
