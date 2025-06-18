import React, { useState, useEffect, createContext, useContext } from 'react';
import { ConfigProvider, theme } from 'antd';
import { useLocalStorage } from '../hooks/useLocalStorage'; 

const ThemeContext = createContext(null);

export const ThemeProvider = ({ children }) => {
    const [currentThemeMode, setCurrentThemeMode] = useLocalStorage('appTheme', 'light'); 

    const algorithm = currentThemeMode === 'dark' ? theme.darkAlgorithm : theme.defaultAlgorithm;

    const customTokens = {
        // colorPrimary: currentThemeMode === 'dark' ? '#1890ff' : '#001529', // Example: adjust primary color for dark
        // colorBgLayout: currentThemeMode === 'dark' ? '#141414' : '#f0f2f5',
        // You can use the Theme Editor (https://ant.design/theme-editor/) to find tokens
    };

    const toggleTheme = () => {
        setCurrentThemeMode(prevMode => (prevMode === 'light' ? 'dark' : 'light'));
    };

    const themeContextValue = {
        currentThemeMode,
        toggleTheme,
    };

    return (
        <ThemeContext.Provider value={themeContextValue}>
            <ConfigProvider
                theme={{
                    algorithm: algorithm, 
                    token: customTokens,  
                    
                }}
            >
                {children}
            </ConfigProvider>
        </ThemeContext.Provider>
    );
};

export const useAppTheme = () => {
    const context = useContext(ThemeContext);
    if (!context) {
        throw new Error('useAppTheme must be used within a ThemeProvider');
    }
    return context;
};