'use client';
import React, { useEffect, useState, useRef } from 'react';
import { playfair } from '@/lib/fonts';
import Contacts from './contacts';
import { VscSend } from "react-icons/vsc";

interface Contact {
  conversationId: string;
  name: string;
  lastMessage: string;
}
interface Msg {
  messageID: string;
  senderIsTutor: boolean;
  content: string;
  sentAt: string;
}

export default function MessagePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeConv, setActiveConv] = useState<string>('');
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState<string>('');
  const tuteeID = 'b52d9970-d390-42f3-b01e-0a79e8ceb9f1';
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const fetchContacts = async () => {
    try {
      const res = await fetch(`/api/conversation-tutee?tuteeID=${tuteeID}`);
      const data: Contact[] = await res.json();
      setContacts(data);
    } catch (err) {
      console.error('Failed fetching contacts', err);
    }
  };

  useEffect(() => {
    fetchContacts();
    const iv = setInterval(fetchContacts, 5000);
    return () => clearInterval(iv);
  }, [tuteeID]);

  useEffect(() => {
    if (!activeConv && contacts.length > 0) {
      setActiveConv(contacts[0].conversationId);
    }
  }, [contacts, activeConv]);

  const fetchMessages = async () => {
    if (!activeConv) return;
    try {
      const res = await fetch(`/api/message-tutee?conversationId=${activeConv}`);
      const msgs: Msg[] = await res.json();
      setMessages(msgs);
    } catch (err) {
      console.error('Failed loading messages', err);
    }
  };
    
  useEffect(() => { fetchMessages(); }, [activeConv]);

  useEffect(() => {
    if (!activeConv) return;
    const iv = setInterval(fetchMessages, 2000);
    return () => clearInterval(iv);
  }, [activeConv]);

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages]);

  const handleSend = async () => {
    if (!draft.trim()) return;
    const res = await fetch('/api/message', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        conversationId: activeConv,
        senderIsTutor: false,
        content: draft.trim(),
      }),
    });
    if (!res.ok) return console.error('failed to send');
    const newMsg: Msg = await res.json();
    setMessages(ms => [...ms, newMsg]);
    setDraft('');
  };

  const current = contacts.find(c => c.conversationId === activeConv);

  return (
    <div className="flex gap-5 h-screen w-full bg-[#F0FAF9] p-6">
      {/*Contacts pane*/}
      <div className="flex flex-col gap-5 w-[20vw] p-2 h-full">
        <h1 className={`${playfair.className} text-[38px]`}>Messaging</h1>
        <div className="flex-1 overflow-y-auto p-2 scrollbar-hover">
          {contacts.map((c, idx) => {
            const isLast = idx === contacts.length - 1;
            return (
              <div
                key={c.conversationId}
                className={!isLast ? 'pb-2 border-b-2 border-gray-300' : ''}
              >
                <Contacts
                  name={c.name}
                  lastMessage={c.lastMessage}
                  selected={c.conversationId === activeConv}
                  onClick={() => setActiveConv(c.conversationId)}
                />
              </div>
            );
          })}
        </div>
      </div>

      {/* Message pane */}
      <div className="w-[80vw] flex flex-col flex-1 p-2 gap-3">
        {/* Header */}
        <div className="flex gap-3 items-center mb-4">
          <div className="bg-gray-300 h-[5vh] w-[2.5vw] rounded-md" />
          <p className={`${playfair.className} text-[18px]`}>
            {current?.name || 'Select a contact'}
          </p>
        </div>

        {/* Messages */}
        <div className="flex-1 bg-white rounded-2xl p-6 overflow-y-auto scroll-hover shadow-md flex flex-col gap-2">
          {messages.map(m => (
            <div
              key={m.messageID}
              className={[
                'max-w-[60%] p-3 rounded-lg',
                m.senderIsTutor
                  ? 'self-start bg-[#F0FAF9]'
                  : 'self-end bg-[#1F65A6] text-white',
              ].join(' ')}
            >
              {m.content}
            </div>
          ))}
          <div ref={messagesEndRef} />
        </div>

        {/* Composer */}
        <div className="mt-4 bg-white rounded-xl p-4 flex items-center shadow-sm">
          <input
            type="text"
            placeholder="Write a message..."
            value={draft}
            onChange={e => setDraft(e.target.value)}
            onKeyDown={e => e.key === 'Enter' && handleSend()}
            className="flex-1 bg-transparent outline-none border-none text-[14px]"
          />
          <button onClick={handleSend} className="ml-2 cursor-pointer">
            <VscSend className="text-[#1F65A6] text-[22px]" />
          </button>
        </div>
      </div>
    </div>
  );
}
