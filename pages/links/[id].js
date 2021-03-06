import React, { useEffect } from 'react'
import { Alert } from 'antd'
import styled from 'styled-components'
import { useRouter } from 'next/router'
import Page from '../../layouts/Page'
import withApollo from '../../libs/with-apollo'

const Container = styled.div`
  width: 500px;
  margin: 200px auto 0;
`

export default withApollo(() => {
  const {
    query: {
      id
    }
  } = useRouter()
  useEffect(() => {
    const timer = setTimeout(() => {
      location.href = id
    }, 3000)
    return () => {
      clearTimeout(timer)
    }
  })
  return (
    <Page header={null}>
      <Container>
        <Alert
          message='请注意'
          description={`您即将离开${process.env.NEXT_PUBLIC_NAME}前往 ${id}`}
          type='warning'
          showIcon
        />
      </Container>
    </Page>
  )
})
