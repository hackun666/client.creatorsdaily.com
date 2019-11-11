import React, { Fragment } from 'react'
import Head from 'next/head'
import { Button, Col, Empty, Row, Spin } from 'antd'
import get from 'lodash/get'
import styled from 'styled-components'
import Page from '../../layouts/Page'
import Container from '../../components/Container'
import { GET_POSTS } from '../../queries'
import usePagination from '../../hooks/usePagination'
import media from '../../libs/media'
import PostCell from '../../components/PostCell'
import Time from '../../components/Time'
import RightSide from '../../components/RightSide'
import withApollo from '../../libs/with-apollo'

const StyledContainer = styled(Container)`
margin-top: 24px;
`

const Pagination = styled.div`
padding: 0 24px;
margin-bottom: 24px;
${media.sm`
  padding: 0;
`}
`

const StyledFeed = styled.a`
  margin: 0 auto 24px;
  display: block;
  width: 160px;
`

const TimeContainer = styled.div`
line-height: 30px;
font-size: 12px;
font-weight: bold;
text-align: center;
margin-bottom: 24px;
`

export default withApollo(() => {
  const {
    result: {
      loading,
      data
    },
    pagination
  } = usePagination({
    path: '/posts',
    query: GET_POSTS,
    getTotal: ({ data }) => get(data, 'getPosts.total', 0)
  })

  const posts = get(data, 'getPosts.data', [])
  const renderList = () => {
    if (posts.length) {
      return posts.map(post => (
        <Fragment key={post.id}>
          <TimeContainer>
            <Time time={post.createdAt} format='YYYY 年 M 月 D 日' />
          </TimeContainer>
          <PostCell {...post} />
        </Fragment>
      ))
    }
    return (
      <Empty description='暂无内容' image={Empty.PRESENTED_IMAGE_SIMPLE} />
    )
  }
  return (
    <Page>
      <Head>
        <title>日报 - {process.env.NAME}</title>
        <meta key='description' name='description' content='每天发现一款有趣产品' />
      </Head>
      <StyledContainer>
        <Row type='flex' gutter={24}>
          <Col lg={14} md={17} xs={24}>
            <Spin spinning={loading}>
              {renderList()}
            </Spin>
            <StyledFeed href='/api/posts.atom' rel='noreferrer' target='_blank'>
              <Button icon='link' block>订阅日报</Button>
            </StyledFeed>
            <Pagination>
              {pagination}
            </Pagination>
          </Col>
          <Col lg={6} md={7} xs={24}>
            <RightSide />
          </Col>
        </Row>
      </StyledContainer>
    </Page>
  )
})
