"use client";
import React, { useEffect, useState, useRef } from "react";
import { VscSend } from "react-icons/vsc";
import DashboardClick from "@/components/tutor-dashboard/DashboardSidebar";
import { Heading1, Heading4 } from "@/components/Heading";
import { TextSm } from "@/components/Text";

// --- Helper Component for Contact List ---
interface ContactProps {
  name: string;
  lastMessage: string;
  selected: boolean;
  profileimg: string;
  onClick: () => void;
}

const ContactItem: React.FC<ContactProps> = ({
  name,
  lastMessage,
  selected,
  profileimg,
  onClick,
}) => (
  <div
    onClick={onClick}
    className={`flex items-center gap-3 p-3 rounded-xl cursor-pointer transition-colors duration-200 ${
      selected ? "bg-indigo-100" : "hover:bg-gray-100"
    }`}
  >
    <img
      src={profileimg}
      alt={name}
      className="object-cover h-12 w-12 rounded-full border-2 border-white shadow-sm"
      onError={(e) => {
        e.currentTarget.src =
          "https://placehold.co/100x100/EBF8F8/4A5568?text=??";
      }}
    />
    <div className="flex-1 overflow-hidden">
      <Heading4 className="font-bold text-gray-800 truncate">{name}</Heading4>
      <TextSm className="text-gray-500 truncate">
        {lastMessage || "No messages yet"}
      </TextSm>
    </div>
  </div>
);

// --- Main Page Component ---
interface Contact {
  conversationId: string;
  name: string;
  lastMessage: string;
  lastMessageAt: string;
  profileimg: string;
}

interface Msg {
  messageID: string;
  senderIsTutor: boolean;
  content: string;
  sentAt: string;
}

export default function MessagePage() {
  const [contacts, setContacts] = useState<Contact[]>([]);
  const [activeConv, setActiveConv] = useState<string>("");
  const [messages, setMessages] = useState<Msg[]>([]);
  const [draft, setDraft] = useState<string>("");
  const [isLoading, setIsLoading] = useState(true);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  // Hardcoded tutor ID. In a real app, get this from auth.
  const tutorID = "998083f8-869a-44e8-b2eb-798aa9900274";

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(scrollToBottom, [messages]);

  const fetchContacts = async () => {
    try {
      const res = await fetch(
        `/api/tutor-dashboard/conversations?tutorID=${tutorID}`
      );
      if (!res.ok) throw new Error("Failed to fetch contacts");
      const data: Contact[] = await res.json();
      data.sort(
        (a, b) =>
          new Date(b.lastMessageAt).getTime() -
          new Date(a.lastMessageAt).getTime()
      );
      setContacts(data);
      if (!activeConv && data.length > 0) {
        setActiveConv(data[0].conversationId);
      }
    } catch (err) {
      console.error("Failed fetching contacts", err);
    } finally {
      setIsLoading(false);
    }
  };

  useEffect(() => {
    fetchContacts();
    const interval = setInterval(fetchContacts, 5000);
    return () => clearInterval(interval);
  }, [tutorID]);

  const fetchMessages = async () => {
    if (!activeConv) return;
    try {
      const res = await fetch(
        `/api/tutor-dashboard/messages?conversationId=${activeConv}`
      );
      const msgs: Msg[] = await res.json();
      setMessages(msgs);
    } catch (err) {
      console.error("Failed loading messages", err);
    }
  };

  useEffect(() => {
    if (activeConv) {
      fetchMessages();
      const interval = setInterval(fetchMessages, 2000);
      return () => clearInterval(interval);
    }
  }, [activeConv]);

  const handleSend = async () => {
    if (!draft.trim() || !activeConv) return;
    const optimisticMessage: Msg = {
      messageID: `temp-${Date.now()}`,
      senderIsTutor: true, // Tutor is sending
      content: draft.trim(),
      sentAt: new Date().toISOString(),
    };

    setMessages((ms) => [...ms, optimisticMessage]);
    const currentDraft = draft.trim();
    setDraft("");

    try {
      const res = await fetch("/api/tutor-dashboard/messages", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          conversationId: activeConv,
          senderIsTutor: true, // Tutor is sending
          content: currentDraft,
        }),
      });

      if (!res.ok) throw new Error("Failed to send message");

      const newMsg: Msg = await res.json();
      setMessages((currentMessages) =>
        currentMessages.map((m) =>
          m.messageID === optimisticMessage.messageID ? newMsg : m
        )
      );
      fetchContacts();
    } catch (err) {
      console.error("failed to send", err);
      setMessages((currentMessages) =>
        currentMessages.filter(
          (m) => m.messageID !== optimisticMessage.messageID
        )
      );
      setDraft(currentDraft);
      alert("Failed to send message. Please try again.");
    }
  };

  const currentContact = contacts.find((c) => c.conversationId === activeConv);

  return (
    <div className="h-screen w-full flex bg-[#F0FAF9] items-center">
      <div className="w-[15%] h-[85%] flex flex-col items-center">
        <DashboardClick />
      </div>
      <div className="w-[85%] h-[85%] flex flex-col">
        <div className="w-[90%] h-full justify-center bg-white rounded-2xl shadow-lg flex p-4 gap-4">
          <div className="w-full md:w-[35%] lg:w-[30%] h-full flex flex-col gap-4">
            <Heading1>Messaging</Heading1>
            {isLoading ? (
              <div className="text-center text-gray-500">
                Loading contacts...
              </div>
            ) : (
              <div className="flex-1 flex flex-col overflow-y-auto space-y-2 pr-2">
                {contacts.map((c) => (
                  <ContactItem
                    key={c.conversationId}
                    name={c.name}
                    lastMessage={c.lastMessage}
                    selected={c.conversationId === activeConv}
                    profileimg={c.profileimg}
                    onClick={() => setActiveConv(c.conversationId)}
                  />
                ))}
              </div>
            )}
          </div>

          <div className="w-full md:w-[65%] lg:w-[70%] h-full flex flex-col gap-3">
            <div className="flex gap-3 items-center p-2 border-b border-gray-200">
              {currentContact ? (
                <>
                  <img
                    src={currentContact.profileimg}
                    alt={currentContact.name}
                    className="object-cover h-12 w-12 rounded-full"
                    onError={(e) => {
                      e.currentTarget.src =
                        "https://placehold.co/100x100/EBF8F8/4A5568?text=??";
                    }}
                  />
                  <Heading4>{currentContact.name}</Heading4>
                </>
              ) : (
                <Heading4>Select a conversation</Heading4>
              )}
            </div>

            <div className="flex-1 bg-gray-50 rounded-2xl p-6 overflow-y-auto flex flex-col gap-4">
              {messages.map((m) => (
                <div
                  key={m.messageID}
                  className={`max-w-[70%] w-fit p-3 rounded-xl mb-1 ${
                    m.senderIsTutor
                      ? "self-start bg-indigo-600 text-white" // Tutor's message is on the LEFT
                      : "self-end bg-gray-200 text-gray-800" // Tutee's message is on the RIGHT
                  }`}
                >
                  {m.content}
                </div>
              ))}
              <div ref={messagesEndRef} />
            </div>

            <div className="mt-auto bg-white rounded-xl p-2 flex items-center border border-gray-200 shadow-sm">
              <input
                type="text"
                placeholder={
                  activeConv
                    ? "Write a message..."
                    : "Select a conversation to start"
                }
                value={draft}
                onChange={(e) => setDraft(e.target.value)}
                onKeyDown={(e) => e.key === "Enter" && handleSend()}
                disabled={!activeConv}
                className="flex-1 bg-transparent outline-none border-none px-2 text-gray-800 disabled:bg-gray-100"
              />
              <button
                onClick={handleSend}
                disabled={!activeConv || !draft.trim()}
                className="ml-2 cursor-pointer p-2 rounded-full bg-indigo-600 text-white disabled:bg-gray-300 transition-colors"
              >
                <VscSend className="text-xl" />
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
