import { lightTheme as theme } from '@ensdomains/thorin'

export default function CommitDetails({ commitDescription, commitTo, amount, duration }) {
  return (
    <>
      <div className="detail">
        <span className="key">Description</span>
        <span className="value">{commitDescription}</span>
      </div>
      <div className="detail">
        <span className="key">To</span>
        <span className="value">{commitTo}</span>
      </div>
      <div className="detail">
        <span className="key">Amount</span>
        <span className="value">{amount}</span>
      </div>
      <div className="detail">
        <span className="key">Duration</span>
        <span className="value">{duration}</span>
      </div>

      <style jsx>{`
        .details {
          display: flex;
          flex-direction: column;
          gap: ${theme.space[3]};
          padding-bottom: ${theme.space[6]};
        }
        .detail {
          display: flex;
          flex-direction: row;
          align-items: center;
          min-height: ${theme.space[14]};
          justify-content: space-between;
          font-size: ${theme.fontSizes.base};
          border-radius: ${theme.radii.extraLarge};
          padding: ${theme.space[3]} ${theme.space[4]};
          border: ${theme.borderWidths['0.375']} solid
            ${theme.colors.borderSecondary};
        }
        .key {
          color: ${theme.colors.textSecondary};
          font-weight: ${theme.fontWeights.medium};
        }
        .value {
          display: flex;
          height: max-content;
          align-items: center;
          gap: ${theme.space[3]};
          color: ${theme.colors.textPrimary};
          font-weight: ${theme.fontWeights.semiBold};
        }
        .image-wrapper {
          line-height: 1;
          height: 36px;
          background-image: ${theme.colors.gradients.blue};
          box-shadow: 1px 2px 4px rgba(0, 0, 0, 0.1);
          border-radius: 18px;
          overflow: hidden;
        }
      `}</style>
    </>
  )
}