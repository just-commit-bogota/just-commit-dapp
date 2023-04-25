import { useState } from "react";

import PhonePickupsContext from "./PhonePickupsContext";

const PhonePickupsService = ({ children }) => {
  const [phonePickups, setPhonePickups] = useState();

  return (
    <PhonePickupsContext.Provider value={{ phonePickups, setPhonePickups }}>
      {children}
    </PhonePickupsContext.Provider>
  );
};

export default PhonePickupsService;
