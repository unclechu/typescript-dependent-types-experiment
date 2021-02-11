type NewsId = number

type DbRequest<K extends keyof DbResponseMap>
  = K extends 'DbRequestGetNewsList'     ? { kind: K }
  : K extends 'DbRequestGetNewsItemById' ? { kind: K, newsId: NewsId }
  : never

interface DbResponseMap {
  DbRequestGetNewsList: number[]
  DbRequestGetNewsItemById: number
}

function dbQuery<K extends keyof DbResponseMap>(req: DbRequest<K>): DbResponseMap[K] {
  return ((req): DbResponseMap[keyof DbResponseMap] => {
    if (req.kind === 'DbRequestGetNewsList') {
      const result: DbResponseMap[typeof req.kind] = [10, 20, 30]
      return result
    } else if (req.kind === 'DbRequestGetNewsItemById') {
      const result: DbResponseMap[typeof req.kind] = req.newsId + 10
      return result
    } else {
      const _: never = req
      throw new Error('Unexpected kind!')
    }
  })(req as DbRequest<keyof DbResponseMap>) as DbResponseMap[K]
}

{
  const x = dbQuery({ kind: 'DbRequestGetNewsList' })

  // Check that response type is inferred
  const y: typeof x = [10]
  // const z: typeof x = 10 // fails (as intended, it’s good)

  console.log('DB response (list):', x)
}

{
  const x = dbQuery({ kind: 'DbRequestGetNewsItemById', newsId: 5 })

  // Check that response type is inferred
  // const y: typeof x = [10] // fails (as intended, it’s good)
  const z: typeof x = 10

  console.log('DB response (item by id):', x)
}
