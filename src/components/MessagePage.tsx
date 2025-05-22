'use client';
import { useEffect, useState } from 'react';
import React from 'react';
import { playfair } from '@/lib/fonts';
import Contacts from './contacts';
import { VscSend } from "react-icons/vsc";


export default function MessagePage() {
    const [activeConv, setActiveConv] = React.useState<string>('1');
    
    const people = [
    { id: '1', name: 'Reynard', last: 'Hey, you there?' },
    { id: '2', name: 'Lawryan',   last: 'Got your email.' },
    { id: '3', name: 'Hansen',   last: 'Got your email.' },
    { id: '4', name: 'Jason',   last: 'Got your email.' },
    { id: '5', name: 'Kent',   last: 'Got your email.' },
    { id: '6', name: 'Yoel',   last: 'Got your email.' },
    { id: '7', name: 'Test',   last: 'Got your email.' },
    { id: '8', name: 'Test1',   last: 'Got your email.' },
    ];

    const current = people.find(p => p.id === activeConv);

    return (
        <div className='flex gap-5 h-screen w-full bg-[#F0FAF9] p-6 pl-15 pr-15'>
            <div className='flex flex-col gap-5 w-[20vw] p-2 h-full'>
                <h1 className={`${playfair.className} text-[38px]`}>Messaging</h1>
                {/* Contacts */}
                <div className='flex-1 overflow-y-auto p-2 scrollbar-hover'>
                    <div className="space-y-4">
                        {people.map((p, idx) => {
                            const isLast = idx === people.length - 1;
                            return (
                                <div
                                    key={p.id}
                                    className={!isLast ? 'pb-3 border-b-2 border-gray-300' : ''}
                                >
                                    <Contacts
                                        name={p.name}
                                        lastMessage={p.last}
                                        selected={p.id === activeConv}
                                        onClick={() => setActiveConv(p.id)}
                                    />
                                </div>
                            );
                        })}
                    </div>
                </div>
            </div>
            
            {/* Message */}
            <div className='w-[80vw] flex flex-col flex-1 p-2 gap-3'>
                {/* Currently Chatting */}
                <div className='flex gap-3'>
                    <div className='bg-gray-300 h-[5vh] w-[2.5vw]'></div>
                    <p className={`${playfair.className} text-[18px]`}>{current ? current.name : 'Select a contact'}</p>
                </div>
                
                <div className="flex-1 bg-white rounded-2xl p-6 overflow-y-auto shadow-md">
                    {/* …messages… */}
                </div>

                <div className="mt-4 bg-white rounded-xl p-4 flex items-center shadow-sm">
                    <input
                        type="text"
                        placeholder="Write a message..."
                        className="flex-1 bg-transparent outline-none border-none text-[14px]"
                    />
                    <button className="ml-2">
                        <VscSend className='text-[#1F65A6] text-[22px]'/>
                    </button>
                </div>
            </div>
        </div>
    );
}
