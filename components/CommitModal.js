import { Dialog, Heading, Button } from '@ensdomains/thorin'
import CommitDetails from "./CommitDetails.js";
import { useState, useEffect } from 'react'
import useWindowSize from 'react-use/lib/useWindowSize'

export default function CommitModal({ commitDescription, commitTo, amount, duration, modalOpen, setModalOpen }) {

  const [isCommited, setIsCommited] = useState(false)
  const { width: windowWidth, height: windowHeight } = useWindowSize()
  
  return (
    <>
      <Dialog style = {{ opacity: "100%" }}
        open = {modalOpen}
        className="modal"
        title="Commitment Summary"
        onDismiss={() => { setModalOpen(false) }}
        variant="actionable"
        leading = 
        {
          <>
            <Button
              shadowless
              tone="green"
              variant="secondary"
              onClick={() => setModalOpen(false)}
            >
              Cancel
            </Button>
          </>
        }
        trailing =
        {
          <Button
            shadowless
            tone="green"
            onClick={() => commit.write()}>
            Commit
          </Button>
        }
      >
      
        {(!isCommited && 
        <CommitDetails
          commitDescription={commitDescription}
          commitTo={commitTo}
          amount={amount}
          duration={duration}
        />
        )}
        
      </Dialog>
    </>
  )
}
        