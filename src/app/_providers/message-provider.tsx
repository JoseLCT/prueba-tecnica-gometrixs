"use client";

import { message } from "antd";
import type { MessageInstance } from "antd/es/message/interface";
import { createContext, useContext, type ReactNode, useMemo } from "react";

interface MessageContextType {
    messageApi: MessageInstance;
}

const MessageContext = createContext<MessageContextType | null>(null);

interface MessageProviderProps {
    children: ReactNode;
}

export function MessageProvider({ children }: Readonly<MessageProviderProps>) {
    const [messageApi, contextHolder] = message.useMessage();

    const contextValue = useMemo(() => ({
        messageApi
    }), [messageApi]);

    return (
        <MessageContext.Provider value={contextValue}>
            {contextHolder}
            {children}
        </MessageContext.Provider>
    );
}

export const useMessage = (): MessageInstance => {
    const context = useContext(MessageContext);
    if (!context) {
        throw new Error('useMessage debe ser usado dentro de MessageProvider');
    }
    return context.messageApi;
};