import React from 'react';
import { RadioButton, RadioButtonGroup } from '@ensdomains/thorin';
import toast, { Toaster } from 'react-hot-toast'

const ButtonGroup = ({ setBetModality, setStartsAt }) => {
  return (
    <RadioButtonGroup
      className="items-start place-self-center"
      onChange={(e) => setBetModality(e.target.value)}
    >
      <div className="flex gap-4">
        <RadioButton
          checked={true}
          id="solo"
          label="Solo"
          name="solo"
          value="solo"
          onClick={() => {
            setBetModality("solo");
            setStartsAt(Date.now());
          }}
        />
        <RadioButton
          checked={false} // {betModality == "1v1"}
          id="1v1"
          label="1v1"
          name="1v1"
          value="1v1"
          onClick={() => {
            toast('⏳ Coming Soon...', { position: 'top-center', id: 'unique' });
            setStartsAt(Date.now() + (12 * 3600 * 1000));
            // DEBUGGING
            //toast("commitJudge includes address? " + JSON.stringify(commitJudge).toUpperCase().includes(address.toUpperCase()));
            //toast("address = " + address.toUpperCase())
          }}
        />
        <RadioButton
          checked={false} // {betModality == "multiplayer"}
          id="multiplayer"
          label="Multiplayer"
          name="multiplayer"
          value="multiplayer"
          onClick={() => {
            toast('⏳ Coming Soon...', { position: 'top-center', id: 'unique' });
            setStartsAt(Date.now() + (12 * 3600 * 1000));
          }}
        />
      </div>
      <Toaster toastOptions={{ duration: 2000 }} />
    </RadioButtonGroup>
  );
};

export default ButtonGroup;