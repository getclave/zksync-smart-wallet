'use client';

import { mergeClasses } from '@/utils/global';
import { useState } from 'react';

export const SendView = () => {
    const [value, setValue] = useState('');

    return (
        <div>
            <h1 className="text-4xl font-semibold">Send</h1>
            <div>
                <input
                    onChange={(e) => {
                        const commasReplace = e.target.value.replace(/,/g, '.');

                        if (commasReplace.match(/^[0-9]*\.?[0-9]*$/)) {
                            setValue(commasReplace);
                        }
                    }}
                    placeholder="0.00"
                    autoFocus
                    value={value}
                    className="h-12 rounded-md mt-4 text-4xl bg-transparent outline-none caret-slate-300"
                />
            </div>
            <button
                className={mergeClasses(
                    'bPrimary h-12 w-full mt-12',
                    value.length === 0 && 'disabled',
                )}
            >
                Send
            </button>
        </div>
    );
};
