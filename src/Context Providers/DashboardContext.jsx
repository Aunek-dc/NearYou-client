import React, { createContext, useContext } from 'react';

const DashboardContext = createContext();

export const useDashboardContext = () => {
    return useContext(DashboardContext);
};
