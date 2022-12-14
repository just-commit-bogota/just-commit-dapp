import { Dropdown } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'
import { useRouter } from 'next/router'

export default function Header({dropdownLabel}) {

  var dropdownLabel = dropdownLabel == null ? <img src="./logo.png" /> : dropdownLabel
  
  return (
    <>
      <div className="header w-full inline-grid justify-between header--absolute bg-white">
        <div className="flex items-center">
          <Dropdown
            style = {{ boxShadow: "0 2px 8px rgb(0 0 0 / 30%)", borderRadius: "10px" }}
            inner
            shortThrow
            chevron = {false}
            label= {dropdownLabel}
            items= {[   
              { label: <Link href="./">✍🏼</Link>, color: 'text', size: "extraSsmall" },
              { label: <Link href="./commitments">Commitments</Link>, color: 'text' },
              { label: <Link href="http://turf.dev/plots/301"
                             target="_blank" rel="noopener noreferrer">
                             Headquarters</Link>, color: 'green' },
              { label: <Link href="https://danielbelfort.notion.site/Just-Commit-9213dcd452184278a4f628b0e3f48e78"
                             target="_blank" rel="noopener noreferrer">
                             About</Link>, color: 'textTertiary' }, 
            ]}
          />
        </div>
        <div className="flex space-x-0 sm:space-x-10 text-sm sm:text-base items-center gap-10 sm:gap-0">
          <ConnectButton className="hover:shadow-lg" />
        </div>
      </div>
    </>
  )
}