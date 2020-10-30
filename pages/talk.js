import styled from 'styled-components'
import { useMutation, useQuery } from '@apollo/client'
import { useState } from 'react'
import { Affix, Button, Col, Row, Spin, message } from 'antd'
import get from 'lodash/get'
import Link from 'next/link'
import Head from 'next/head'
import Page from '../layouts/Page'
import Container from '../components/Container'
import CommentList from '../queries/CommentList.gql'
import CommentsBox from '../components/CommentsBox.dynamic'
import ProductCell from '../components/ProductCell'
import { ProductContainer } from '../components/Product'
import withApollo from '../libs/with-apollo'
import MoreButton from '../components/MoreButton'
import { Large } from '../components/Editor.dynamic'
import CreateComment from '../queries/mutations/CreateComment.gql'
import FormError from '../libs/form-error'
import Box from '../components/Box'

const EditorToolbar = styled.div`
margin-top: 12px;
display: flex;
justify-content: space-between;
align-items: center;
`
const PublishButton = styled(Button)`
padding: 4px 23px;
`

const StyledContainer = styled(Container)`
margin: 24px auto;
`

const StyledProductCell = styled(ProductCell)`
border: 0px;
box-shadow: none;
margin-bottom: 16px;
:hover {
  border: 0px;
}
a {
  padding: 0;
}
`

const Tip = styled.h1`
  font-size: 32px;
  color: rgba(0,0,0,0.1);
  text-align: center;
  line-height: 400px;
`

const StyledMoreButton = styled(MoreButton)`
margin-top: 16px;
`

const StyledBox = styled(Box)`
padding: 16px;
margin-bottom: 24px;
`

export default withApollo(() => {
  const size = 10
  const [content, setContent] = useState('')
  const [hoverProduct, setHoverProduct] = useState()
  const [focusProduct, setFocusProduct] = useState()
  const query = [CommentList, {
    size
  }]
  const [page, setPage] = useState(1)
  const { data, loading, fetchMore } = useQuery(query[0], {
    variables: query[1],
    notifyOnNetworkStatusChange: true
  })
  const [create] = useMutation(CreateComment, {
    onCompleted: data => {
      message.success('提交成功')
      setContent('')
    },
    onError: error => {
      const errors = FormError(null, error)
      message.error(errors[0].message)
    },
    // TODO: 订阅更新后不再需要刷新
    refetchQueries: () => [{
      query: query[0],
      variables: query[1]
    }]
  })
  const list = get(data, 'getComments.data', [])
  const total = get(data, 'getComments.total', 0)
  const publish = () => {
    create({
      variables: {
        comment: {
          content
        }
      }
    })
  }
  const renderProduct = () => {
    if (!hoverProduct && !focusProduct) {
      return (
        <Tip>快来和创造者们聊聊</Tip>
      )
    }
    return (
      <ProductContainer id={hoverProduct || focusProduct} full />
    )
  }
  const handleFetchMore = () => {
    fetchMore({
      variables: {
        page: page + 1
      },
      updateQuery (prev, { fetchMoreResult }) {
        if (!fetchMoreResult) return prev
        setPage(page + 1)
        return {
          ...prev,
          getComments: {
            ...prev.getComments,
            data: [
              ...prev.getComments.data,
              ...fetchMoreResult.getComments.data
            ]
          }
        }
      }
    })
  }
  const renderMore = () => {
    if (page * size >= total) return null
    return (
      <MoreButton size='small' type='link' block loading={loading} onClick={handleFetchMore}>加载更多</MoreButton>
    )
  }
  return (
    <Page>
      <Head>
        <title>聊产品 - {process.env.NAME}</title>
        <meta key='description' name='description' content='快来和各位创造者们聊一聊～' />
      </Head>
      <StyledContainer>
        <Row gutter={24}>
          <Col md={12} xs={24}>
            <StyledBox>
              <Large value={content} onChange={setContent} placeholder='说点什么...' options={{ minHeight: '74px' }} />
              <EditorToolbar>
                <div style={{ fontSize: 12, color: '#666' }}>文明礼貌，友善发言</div>
                <PublishButton onClick={publish} type='primary' disabled={!content.length}>发布</PublishButton>
              </EditorToolbar>
            </StyledBox>
            <Spin spinning={loading}>
              {list.map(x => {
                const product = x.products[0]
                return (
                  <CommentsBox
                    key={x.id}
                    hideInput={!product}
                    onFocus={() => product && setFocusProduct(product.id)}
                    onBlur={() => setFocusProduct(null)}
                    onMouseEnter={() => product && setHoverProduct(product.id)}
                    onMouseLeave={() => setHoverProduct(null)}
                    list={[x]}
                    renderHeader={() => {
                      if (!product) return null
                      return (
                        <StyledProductCell {...product} size='small' />
                      )
                    }}
                    renderFooter={() => {
                      if (!product) return null
                      return (
                        <Link href='/[id]' as={`/${product.id}#comments`}>
                          <a>
                            <StyledMoreButton size='small' type='link' block>更多「{product.name}」的评论</StyledMoreButton>
                          </a>
                        </Link>
                      )
                    }}
                    query={query}
                    loading={loading}
                    product={product}
                  />
                )
              })}
              {renderMore()}
            </Spin>
          </Col>
          <Col md={12} xs={0}>
            <Affix offsetTop={24}>
              {renderProduct()}
            </Affix>
          </Col>
        </Row>
      </StyledContainer>
    </Page>
  )
})
