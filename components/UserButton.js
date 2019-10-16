import Link from 'next/link'
import styled from 'styled-components'
import { Button, Divider, Icon, Menu, Popover } from 'antd'
import UserCell from './UserCell'

const StyledButton = styled(Button)`
padding: 0;
border: 0;
`

export default ({ user, back = '/', ...rest }) => {
  if (!user) {
    return (
      <div {...rest}>
        <Link href={`/auth/signin?back=${encodeURIComponent(back)}`} passHref>
          <a>
            <Button>登录</Button>
          </a>
        </Link>
        <Divider type='vertical' />
        <Link href={`/auth/signup?back=${encodeURIComponent(back)}`} passHref>
          <a>
            <Button type='primary'>快速注册</Button>
          </a>
        </Link>
      </div>
    )
  }
  const menu = (
    <Menu>
      {/* <Menu.Item key='logout'>
        <Link href={`/auth/signout?back=${encodeURIComponent(back)}`}>
          <a>
            <Icon type='setting' />
            设置
          </a>
        </Link>
      </Menu.Item>
      <Menu.Divider /> */}
      <Menu.Item key='signout'>
        <Link href={`/auth/signout?back=${encodeURIComponent(back)}`}>
          <a>
            <Icon type='logout' />
            退出登录
          </a>
        </Link>
      </Menu.Item>
    </Menu>
  )
  return (
    <Popover content={menu} overlayClassName='user-button-popover'>
      <StyledButton {...rest}>
        <UserCell user={user} />
      </StyledButton>
    </Popover>
  )
}