type NewsId = number

type DbRequestKind =
  | 'DbRequestGetNewsList'
  | 'DbRequestGetNewsItemById'

type DbRequest<K extends DbRequestKind> =
  | { kind: K & 'DbRequestGetNewsList' }
  | { kind: K & 'DbRequestGetNewsItemById', newsId: NewsId }

type DbResponse<K extends DbRequestKind> =
  K extends 'DbRequestGetNewsList'     ? number[] :
  K extends 'DbRequestGetNewsItemById' ? number   :
  never

function dbQuery<K extends DbRequestKind>(req: DbRequest<K>): DbResponse<K> {
  if (req.kind === 'DbRequestGetNewsList') {
    const result = [10,20,30]
    return result as DbResponse<K> // FIXME doesn’t check valid K
  } else if (req.kind === 'DbRequestGetNewsItemById') {
    const result = 10
    return result as DbResponse<K> // FIXME doesn’t check valid K
  } else {
    throw new Error('Unexpected kind!')
  }
}

const x = dbQuery({ kind: 'DbRequestGetNewsList' })

// checks that response is inferred
const y: typeof x = [10]
const z: typeof x = 10 // FIXME this should fail! K is not inferred in the reponse!

console.log('DB response:', x);
