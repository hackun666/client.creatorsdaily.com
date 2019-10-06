import { forwardRef } from 'react'
import { Button, Form, Icon, Input } from 'antd'

const { Item } = Form

export default forwardRef((props, ref) => {
  const { form, loading, onSubmit, ...rest } = props
  const { getFieldDecorator } = form
  if (ref) {
    ref.current = { props }
  }
  const handleSubmit = e => {
    e.preventDefault()
    form.validateFields((err, fieldsValue) => {
      if (err) return
      onSubmit(fieldsValue)
    })
  }
  return (
    <Form {...rest} onSubmit={handleSubmit}>
      <Item>
        {getFieldDecorator('username', {
          rules: [{
            required: true, message: '请输入用户名'
          }]
        })(
          <Input
            size='large'
            placeholder='用户名'
            prefix={<Icon type='user' />}
          />
        )}
      </Item>
      <Item>
        {getFieldDecorator('password', {
          rules: [{
            required: true, message: '请输入密码'
          }]
        })(
          <Input
            size='large'
            placeholder='密码'
            type='password'
            prefix={<Icon type='lock' />}
            // suffix={
            //   <Suffix>
            //     <Link href='/'>
            //       <a>
            //         忘记密码？
            //       </a>
            //     </Link>
            //   </Suffix>
            // }
          />
        )}
      </Item>
      <Item>
        <Button loading={loading} type='primary' size='large' block htmlType='submit'>登录</Button>
      </Item>
    </Form>
  )
})
