"use client";

import { useState } from "react";
import ChatbotButton from "./ChatbotButton";
import ChatbotModal from "./ChatbotModal";

export default function Chatbot() {
    const [open, setOpen] = useState(false);

    return (
        <>
            <ChatbotButton onClick={() => setOpen(true)} />
            {open && <ChatbotModal onClose={() => setOpen(false)} />}
        </>
    );
}
