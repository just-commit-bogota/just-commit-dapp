import { Dropdown } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export default function Header() {
  return (
    <>
      <div className="header w-full inline-grid justify-between header--absolute bg-white">
        <div className="flex items-center">
          <Dropdown
            style = {{ boxShadow: "0 2px 8px rgb(0 0 0 / 30%)", borderRadius: "10px" }}
            inner
            chevron =  {false}
            items= {[   
              { label: <Link href="./">⚡</Link>, color: 'text' },
              { label: <Link href="./active">Active</Link>, color: 'text' },
              { label: <Link href="./my-history">My History</Link>, color: 'text' },
              { label: <Link href="./feed">Feed</Link>, color: 'green' },
              { label: <Link href="https://danielbelfort.notion.site/Just-Commit-9213dcd452184278a4f628b0e3f48e78"
                             target="_blank" rel="noopener noreferrer">
                             About</Link>, color: 'textSecondary' },        
            ]}
            label= <img src="./logo.png" />
          />
        </div>
        <div className="flex space-x-0 sm:space-x-10 text-sm sm:text-base items-center gap-10 sm:gap-0">
          <ConnectButton className="hover:shadow-lg" />
        </div>
      </div>
    </>
  )
}