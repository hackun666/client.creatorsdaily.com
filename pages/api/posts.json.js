import get from 'lodash/get'
import initApollo from '../../libs/init-apollo'
import { posts } from '../../libs/feed'
import PostList from '../../queries/PostList.gql'

export default async (req, res) => {
  const apollo = initApollo()
  res.setHeader('Content-Type', 'application/xml')
  res.statusCode = 200
  const data = await apollo.query({
    query: PostList
  })
  const list = get(data, 'data.getPosts.data', [])
  const feed = posts(list)
  res.end(feed.rss2())
}
