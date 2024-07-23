import React, { createContext, useState } from "react";

export const PersonalInformationContext = createContext();

export const PersonalInformationProvider = ({ children }) => {
    const [userInformation, setUserInformation] = useState({ permissions: [], cedula: 0, cargo: "", email: "", rango: 0 });

    const updateUserInformation = (newInformation) => {
        setUserInformation(newInformation);
    };

    return <PersonalInformationContext.Provider value={{ userInformation, updateUserInformation }}>{children}</PersonalInformationContext.Provider>;
};
