import { CONTRACT_ADDRESS, ABI } from '../contracts/CommitManager.ts';
import toast from 'react-hot-toast'
import { usePrepareContractWrite, useContractWrite, useWaitForTransaction } from 'wagmi'

type ProveProps = {
  setIsProveComplete: (isProveComplete: boolean) => void
}

export default function Prove({ setIsProveComplete }: ProveProps) {
  
  // prepare
  const { config } = usePrepareContractWrite({
    addressOrName: CONTRACT_ADDRESS,
    contractInterface: ABI,
    functionName: "proveCommit",
    args: [props.id],
  })
  
  // write
  const { data, write } = useContractWrite(config, {
    onSettled() { wait }
  })
  
  // wait
  const { wait, isError, isLoading } = useWaitForTransaction({
    hash: data?.hash,
    onSuccess: () => {
      setIsProveComplete(true)
      location.reload()
    },
    onError: (err) => {
      const regex = /code=(.*?),/;
      const match = regex.exec(err.message);
      const code = match ? match[1] : null;
      if (code === "ACTION_REJECTED") {
        toast.error("Transaction Rejected")
      }
    },
  })

  useEffect(() => {
    console.log("hi")
    write()
  }, [])

  // on error
  if (isError) {
    return (
      toast.error("Error")
    )
  }

  if (data && !isLoading && !isError) {
    return (
      toast("Complete")
    )
  }

  return null
  
}
  