type NewsId = number

type DbRequestKind =
  | 'DbRequestGetNewsList'
  | 'DbRequestGetNewsItemById'

type DbRequest<K extends DbRequestKind>
  = K extends 'DbRequestGetNewsList'     ? { kind: K }
  : K extends 'DbRequestGetNewsItemById' ? { kind: K, newsId: NewsId }
  : never

type DbResponse<K extends DbRequestKind>
  = K extends 'DbRequestGetNewsList'     ? number[]
  : K extends 'DbRequestGetNewsItemById' ? number
  : never

function dbNewsList(
  req: DbRequest<'DbRequestGetNewsList'>
): DbResponse<'DbRequestGetNewsList'> {
  return [10, 20, 30]
}

function dbNewsItem(
  req: DbRequest<'DbRequestGetNewsItemById'>
): DbResponse<'DbRequestGetNewsItemById'> {
  return req.newsId + 10
}

function dbQuery<K extends DbRequestKind>(req: DbRequest<K>): DbResponse<K> {
  return (req => {
    if (req.kind === 'DbRequestGetNewsList') {
      return dbNewsList(req)
    } else if (req.kind === 'DbRequestGetNewsItemById') {
      return dbNewsItem(req)
    } else {
      const _: never = req
      throw new Error('Unexpected kind!')
    }
  })(
    req as DbRequest<'DbRequestGetNewsList' | 'DbRequestGetNewsItemById'>
  ) as DbResponse<K>;
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
