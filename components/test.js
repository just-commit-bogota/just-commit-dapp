import { useRouter } from 'next/router'

export default function SearchFilters({ query }) {
  const router = useRouter()

  return (
    <>
      <div className="filters">
        <span className="filters_label">Sort:</span>
        <div className="filters_wrapper">
          {filters.map((filter) => {
            const stringifiedQuery = JSON.stringify(query).slice(1, -1)
            const stringifiedQueryChanges = JSON.stringify(
              filter.queryChanges
            ).slice(1, -1)

            const isActive = stringifiedQuery.includes(stringifiedQueryChanges)

            return (
              <button
                key={filter.label}
                className={`filter ${isActive ? 'filter--active' : ''}`}
                onClick={() => {
                  let newQuery = { ...query }

                  // If the filter is already active, remove it from the query
                  if (isActive) {
                    const paramsToRemove = Object.keys(filter.queryChanges)
                    paramsToRemove.forEach((param) => delete newQuery[param])
                  } else {
                    newQuery = { ...newQuery, ...filter.queryChanges }
                  }

                  // Remove page from query (in effect, resetting to page 1)
                  delete newQuery.page

                  router.push({
                    pathname: '/search',
                    query: newQuery,
                  })
                }}
              >
                {filter.label}
              </button>
            )
          })}
        </div>
      </div>

      
    </>
  )
}

const filters = [
  {
    label: 'Most liked',
    queryChanges: {
      engagement: 'reactions',
    },
  },
  {
    label: 'Most recasted',
    queryChanges: {
      engagement: 'recasts',
    },
  },
  {
    label: 'Most watched',
    queryChanges: {
      engagement: 'watches',
    },
  },
  {
    label: 'Most replied',
    queryChanges: {
      engagement: 'replies',
    },
  },
]