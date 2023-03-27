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
                  <Link href="http://turf.dev/plots/301"
                    target="_blank" rel="noopener noreferrer">
                    &nbsp;&nbsp;&nbsp;
                    Headquarters ↗
                    &nbsp;
                  </Link>,
              },
              {
                label:
                  <Link href="https://justcommit.notion.site"
                    target="_blank" rel="noopener noreferrer">
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
                    About ↗
                    &nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;
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