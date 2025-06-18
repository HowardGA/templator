import { createContext, useContext } from 'react';
import { App as AntdApp, message, notification, Modal } from 'antd'; 

const AntdApiContext = createContext({});

export const AntdApiProvider = ({ children }) => {
    const [messageApi, messageContextHolder] = message.useMessage();
    const [notificationApi] = notification.useNotification();
    const [modalApi] = Modal.useModal(); 

    const contextValue = {
        message: messageApi,
        notification: notificationApi,
        modal: modalApi,
    };

    return (
        <AntdApp>
           <AntdApiContext.Provider value={contextValue}>
                {messageContextHolder}
                {children}
            </AntdApiContext.Provider>
        </AntdApp>
    );
};

export const useAntdApi = () => {
    return useContext(AntdApiContext);
};