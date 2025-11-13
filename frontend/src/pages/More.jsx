import React, { useState } from 'react';
import { Typography, Space, Card, Button, Input, Form, Upload, message } from 'antd';
import { UploadOutlined } from '@ant-design/icons';
import api from '../utils/api';

const { Title, Paragraph } = Typography;

function More() {
  const [idorUserId, setIdorUserId] = useState('');
  const [idorResult, setIdorResult] = useState(null);
  const [updateUser, setUpdateUser] = useState({ id: '', username: '', password: '', email: '', role: '', secret: '' });
  const [readPath, setReadPath] = useState('uploads/test.txt');
  const [fileContent, setFileContent] = useState('');
  const [jwtUser, setJwtUser] = useState('alice');
  const [jwtToken, setJwtToken] = useState('');
  const [jwtMe, setJwtMe] = useState('');
  const [regexInput, setRegexInput] = useState('aaaaaaaaaaaaaaaaaaaaaaaaaaaa');
  const [csrfUser, setCsrfUser] = useState('alice');
  const [csrfTo, setCsrfTo] = useState('attacker');
  const [csrfAmount, setCsrfAmount] = useState(100);
  const [sstiTemplate, setSstiTemplate] = useState("Hello [[${user}]], OS: [[${T(java.lang.System).getProperty('os.name')}]]");
  const [sstiRendered, setSstiRendered] = useState('');
  const [nosqlRegex, setNosqlRegex] = useState('.*');
  const [nosqlRegexResult, setNosqlRegexResult] = useState([]);
  const [nosqlWhere, setNosqlWhere] = useState('username.length()>2');
  const [nosqlWhereResult, setNosqlWhereResult] = useState([]);
  const [smuggleRaw, setSmuggleRaw] = useState('POST /api/smuggle/parse HTTP/1.1\nHost: localhost:8080\nContent-Length: 10\nTransfer-Encoding: chunked\n\n0\n\nHelloWorld');
  const [smuggleParsed, setSmuggleParsed] = useState(null);

  const fetchIdor = async () => {
    try {
      const res = await api.get(`/idor/user/${idorUserId}`);
      setIdorResult(res.data);
    } catch (e) {
      message.error('请求失败');
    }
  };

  const submitUpdate = async () => {
    try {
      const res = await api.post('/idor/user/update', updateUser);
      setIdorResult(res.data);
      message.success('已提交更新');
    } catch (e) {
      message.error('更新失败');
    }
  };

  const doRedirect = () => {
    window.location.href = `http://localhost:8080/api/redirect?target=${encodeURIComponent('http://example.com')}`;
  };

  const uploadProps = {
    name: 'file',
    action: 'http://localhost:8080/api/upload/file',
    onChange(info) {
      if (info.file.status === 'done') message.success('上传成功');
      else if (info.file.status === 'error') message.error('上传失败');
    }
  };

  const readFile = async () => {
    try {
      const res = await api.get('/upload/read', { params: { path: readPath } });
      setFileContent(res.data.content || '');
    } catch (e) {
      message.error('读取失败');
    }
  };

  const getPayloadAndExploit = async () => {
    try {
      const payload = await api.get('/deser/payload', { params: { msg: 'pwn' } });
      await api.post('/deser/vulnerable', { data: payload.data.data });
      message.success('已反序列化');
    } catch (e) {
      message.error('操作失败');
    }
  };

  const jwtLogin = async () => {
    try {
      const res = await api.post('/jwt/login', { username: jwtUser });
      setJwtToken(res.data.token);
    } catch (e) {
      message.error('登录失败');
    }
  };

  const jwtQuery = async () => {
    try {
      const res = await api.get('/jwt/me', { params: { token: jwtToken } });
      setJwtMe(res.data.payload || '');
    } catch (e) {
      message.error('查询失败');
    }
  };

  const testRegex = async () => {
    try {
      const res = await api.get('/regex/test', { params: { input: regexInput } });
      message.info(`匹配结果: ${res.data.matched}`);
    } catch (e) {
      message.error('正则测试失败');
    }
  };

  const openBackendLogin = () => {
    window.open(`http://localhost:8080/api/csrf/login?user=${encodeURIComponent(csrfUser)}`, '_blank');
  };

  const openBackendMe = () => {
    window.open(`http://localhost:8080/api/csrf/me`, '_blank');
  };

  const submitCrossSiteTransfer = () => {
    const form = document.createElement('form');
    form.method = 'POST';
    form.action = 'http://localhost:8080/api/csrf/transfer';
    const toInput = document.createElement('input');
    toInput.name = 'to';
    toInput.value = csrfTo;
    const amountInput = document.createElement('input');
    amountInput.name = 'amount';
    amountInput.value = String(csrfAmount);
    form.appendChild(toInput);
    form.appendChild(amountInput);
    document.body.appendChild(form);
    form.submit();
    document.body.removeChild(form);
  };

  const renderSsti = async () => {
    try {
      const res = await api.post('/ssti/render', { template: sstiTemplate, user: 'guest' });
      setSstiRendered(res.data.rendered || '');
    } catch (e) {
      message.error('渲染失败');
    }
  };

  const queryNosqlRegex = async () => {
    try {
      const res = await api.get('/nosql/regex', { params: { q: nosqlRegex } });
      setNosqlRegexResult(res.data.results || []);
    } catch (e) {
      message.error('正则查询失败');
    }
  };

  const queryNosqlWhere = async () => {
    try {
      const res = await api.get('/nosql/where', { params: { code: nosqlWhere } });
      setNosqlWhereResult(res.data.results || []);
    } catch (e) {
      message.error('where 查询失败');
    }
  };

  const parseSmuggle = async () => {
    try {
      const res = await api.post('/smuggle/parse', smuggleRaw, { headers: { 'Content-Type': 'text/plain' } });
      setSmuggleParsed(res.data);
    } catch (e) {
      message.error('解析失败');
    }
  };

  return (
    <Space direction="vertical" size="large" style={{ width: '100%' }}>
      <Title level={3}>更多经典漏洞演示</Title>

      <Card title="IDOR 未授权直接对象引用">
        <Space>
          <Input placeholder="用户ID" value={idorUserId} onChange={e => setIdorUserId(e.target.value)} style={{ width: 200 }} />
          <Button type="primary" onClick={fetchIdor}>查询用户</Button>
        </Space>
        <Paragraph style={{ marginTop: 12 }}>{idorResult ? JSON.stringify(idorResult) : ''}</Paragraph>
      </Card>

      <Card title="Mass Assignment 过度赋值">
        <Form layout="inline">
          <Form.Item label="id"><Input value={updateUser.id} onChange={e => setUpdateUser({ ...updateUser, id: e.target.value })} style={{ width: 120 }} /></Form.Item>
          <Form.Item label="username"><Input value={updateUser.username} onChange={e => setUpdateUser({ ...updateUser, username: e.target.value })} style={{ width: 120 }} /></Form.Item>
          <Form.Item label="password"><Input value={updateUser.password} onChange={e => setUpdateUser({ ...updateUser, password: e.target.value })} style={{ width: 120 }} /></Form.Item>
          <Form.Item label="email"><Input value={updateUser.email} onChange={e => setUpdateUser({ ...updateUser, email: e.target.value })} style={{ width: 180 }} /></Form.Item>
          <Form.Item label="role"><Input value={updateUser.role} onChange={e => setUpdateUser({ ...updateUser, role: e.target.value })} style={{ width: 120 }} /></Form.Item>
          <Form.Item label="secret"><Input value={updateUser.secret} onChange={e => setUpdateUser({ ...updateUser, secret: e.target.value })} style={{ width: 200 }} /></Form.Item>
          <Button type="primary" onClick={submitUpdate}>提交</Button>
        </Form>
      </Card>

      <Card title="Open Redirect 开放重定向">
        <Button onClick={doRedirect}>跳转到 example.com</Button>
      </Card>

      <Card title="文件上传与路径遍历">
        <Upload {...uploadProps}>
          <Button icon={<UploadOutlined />}>上传文件</Button>
        </Upload>
        <Space style={{ marginTop: 12 }}>
          <Input placeholder="读取路径" value={readPath} onChange={e => setReadPath(e.target.value)} style={{ width: 300 }} />
          <Button onClick={readFile}>读取</Button>
        </Space>
        <Paragraph style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{fileContent}</Paragraph>
      </Card>

      <Card title="不安全反序列化">
        <Button onClick={getPayloadAndExploit}>获取payload并反序列化</Button>
      </Card>

      <Card title="不安全JWT">
        <Space>
          <Input placeholder="用户名" value={jwtUser} onChange={e => setJwtUser(e.target.value)} style={{ width: 200 }} />
          <Button type="primary" onClick={jwtLogin}>获取Token</Button>
        </Space>
        <Paragraph style={{ marginTop: 12 }}>{jwtToken}</Paragraph>
        <Space>
          <Button onClick={jwtQuery}>解析Token</Button>
        </Space>
        <Paragraph style={{ marginTop: 12 }}>{jwtMe}</Paragraph>
      </Card>

      <Card title="ReDoS 正则拒绝服务">
        <Space>
          <Input value={regexInput} onChange={e => setRegexInput(e.target.value)} style={{ width: 350 }} />
          <Button onClick={testRegex}>测试匹配</Button>
        </Space>
      </Card>

      <Card title="CSRF 跨站请求伪造">
        <Space style={{ marginBottom: 12 }}>
          <Input placeholder="用户名" value={csrfUser} onChange={e => setCsrfUser(e.target.value)} style={{ width: 200 }} />
          <Button onClick={openBackendLogin}>后端域登录并设置Cookie</Button>
          <Button onClick={openBackendMe}>在后端域查看余额</Button>
        </Space>
        <Space>
          <Input placeholder="收款方" value={csrfTo} onChange={e => setCsrfTo(e.target.value)} style={{ width: 200 }} />
          <Input placeholder="金额" value={csrfAmount} onChange={e => setCsrfAmount(Number(e.target.value))} style={{ width: 120 }} />
          <Button type="primary" onClick={submitCrossSiteTransfer}>跨站伪造转账（表单提交）</Button>
        </Space>
        <Paragraph style={{ marginTop: 12 }}>如需诱导点击，可在下方使用点击劫持示例。</Paragraph>
      </Card>

      <Card title="Clickjacking 点击劫持示例">
        <Paragraph>下方 iframe 嵌入了可执行转账的页面：</Paragraph>
        <iframe title="vulnerable" src="http://localhost:8080/api/clickjacking/vulnerable" style={{ width: '100%', height: 200, border: '1px solid #ddd' }} />
        <Space style={{ marginTop: 12 }}>
          <Button href="http://localhost:8080/api/clickjacking/safe" target="_blank">查看受保护页面</Button>
        </Space>
      </Card>

      <Card title="SSTI 服务端模板注入">
        <Space>
          <Input.TextArea value={sstiTemplate} onChange={e => setSstiTemplate(e.target.value)} rows={3} style={{ width: 600 }} />
          <Button type="primary" onClick={renderSsti}>渲染</Button>
        </Space>
        <Paragraph style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{sstiRendered}</Paragraph>
      </Card>

      <Card title="NoSQL 注入（模拟）">
        <Space style={{ marginBottom: 12 }}>
          <Input placeholder="正则查询" value={nosqlRegex} onChange={e => setNosqlRegex(e.target.value)} style={{ width: 300 }} />
          <Button onClick={queryNosqlRegex}>执行正则</Button>
        </Space>
        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(nosqlRegexResult)}</Paragraph>
        <Space style={{ marginTop: 12 }}>
          <Input placeholder="where 代码" value={nosqlWhere} onChange={e => setNosqlWhere(e.target.value)} style={{ width: 300 }} />
          <Button onClick={queryNosqlWhere}>执行where</Button>
        </Space>
        <Paragraph style={{ whiteSpace: 'pre-wrap' }}>{JSON.stringify(nosqlWhereResult)}</Paragraph>
      </Card>

      <Card title="HTTP 请求走私（解析模拟）">
        <Space>
          <Input.TextArea value={smuggleRaw} onChange={e => setSmuggleRaw(e.target.value)} rows={6} style={{ width: 700 }} />
          <Button type="primary" onClick={parseSmuggle}>解析</Button>
        </Space>
        <Paragraph style={{ marginTop: 12, whiteSpace: 'pre-wrap' }}>{smuggleParsed ? JSON.stringify(smuggleParsed, null, 2) : ''}</Paragraph>
      </Card>
    </Space>
  );
}

export default More;
