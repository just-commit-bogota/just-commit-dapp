import { useEffect, useState, useCallback } from "react";

import PhonePickupsContext from "./PhonePickupsContext";

const PhonePickupsService = ({ children }) => {
  const [phonePickups, setPhonePickups] = useState(null);

  const handleLocalStorage = useCallback(() => {
    const storedCount = parseInt(localStorage.getItem("phonePickups"));
    if (!isNaN(storedCount)) {
      setPhonePickups(storedCount);
    }
  }, []);

  useEffect(() => {
    handleLocalStorage();
  }, [handleLocalStorage]);

  useEffect(() => {
    localStorage.setItem("phonePickups", phonePickups);
  }, [phonePickups]);

  return (
    <PhonePickupsContext.Provider value={{ phonePickups, setPhonePickups }}>
      {children}
    </PhonePickupsContext.Provider>
  );
};

export default PhonePickupsService;