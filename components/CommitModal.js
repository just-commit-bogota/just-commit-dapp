import { Dialog } from '@ensdomains/thorin'


export default function CommitModal({ commitDescription, commitTo, amount, duration }) {

  return (
    <>
      <Dialog
        className="modal"
        title={
          <Heading as="h2" align="center">
            Commitment Summary
          </Heading>
        }
        onDismiss={() => { setIsOpen(false) }}
     />

      <Details
        commitDescription={commitDescription}
        commitTo={commitTo}
        amount={amount}
        duration={duration}
      />
    </>
  )
}
        