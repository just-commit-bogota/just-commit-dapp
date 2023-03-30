import { Dropdown } from '@ensdomains/thorin'
import { ConnectButton } from '@rainbow-me/rainbowkit'
import Link from 'next/link'

export default function Header({ currentPage }) {

  var dropdownLabel = <img src="./logo.svg" />

  return (
    <>
      <div className="header w-full inline-grid header--absolute bg-white gap-1" style={{ justifyContent: "space-between" }}>
        <div className="flex items-center ml-2">
          <Dropdown
            style={{ padding: "0px", boxShadow: "0px 2px 2px 1px rgb(0 0 0 / 80%)", borderRadius: "10px" }}
            inner
            shortThrow
            chevron={false}
            label={dropdownLabel}
            items={[
              {
                label:
                  <Link href="/">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Home
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Link>, color: currentPage == "commitments" && "green"
              },
              {
                label:
                  <Link href="/commit">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Commit
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Link>, color: currentPage == "commit" && "green"
              },
              {
                label:
                  <Link href="https://justcommit.notion.site/Just-Commit-9213dcd452184278a4f628b0e3f48e78#c1d9e58a077d47e2af7583d7665168dd"
                    target="_blank" rel="noopener noreferrer">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    FAQ ↗
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Link>,
              },
              {
                label:
                  <Link href="https://discord.gg/7863Wtv4hX"
                    target="_blank" rel="noopener noreferrer">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    Discord ↗
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                  </Link>,
              },
            ]}
          />
        </div>
        <div className="flex items-center text-xs sm:text-base mr-2">
          <ConnectButton accountStatus="address" className="hover:shadow-lg" />
        </div>
      </div>
    </>
  )
}