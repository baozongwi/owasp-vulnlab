import React from 'react';
import { BrowserRouter as Router, Routes, Route } from 'react-router-dom';
import { Layout, Menu, Typography, Card } from 'antd';
import { 
  BugOutlined, 
  CodeOutlined, 
  GlobalOutlined, 
  FileTextOutlined, 
  CodeOutlined as TerminalOutlined,
  HomeOutlined 
} from '@ant-design/icons';
import SqlInjection from './pages/SqlInjection';
import XSS from './pages/XSS';
import SSRF from './pages/SSRF';
import XXE from './pages/XXE';
import RCE from './pages/RCE';
import Home from './pages/Home';

const { Header, Content, Sider } = Layout;
const { Title } = Typography;

function App() {
  const menuItems = [
    {
      key: '/',
      icon: <HomeOutlined />,
      label: '首页',
    },
    {
      key: '/sqli',
      icon: <BugOutlined />,
      label: 'SQL注入',
    },
    {
      key: '/xss',
      icon: <CodeOutlined />,
      label: 'XSS跨站脚本',
    },
    {
      key: '/ssrf',
      icon: <GlobalOutlined />,
      label: 'SSRF服务端请求伪造',
    },
    {
      key: '/xxe',
      icon: <FileTextOutlined />,
      label: 'XXE外部实体注入',
    },
    {
      key: '/rce',
      icon: <TerminalOutlined />,
      label: 'RCE远程代码执行',
    },
  ];

  return (
    <Router>
      <Layout style={{ minHeight: '100vh' }}>
        <Header style={{ 
          background: '#001529', 
          padding: '0 24px',
          display: 'flex',
          alignItems: 'center'
        }}>
          <Title level={3} style={{ 
            color: 'white', 
            margin: 0,
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          }}>
            <BugOutlined />
            OWASP漏洞测试实验室
          </Title>
        </Header>
        
        <Layout>
          <Sider width={250} style={{ background: '#fff' }}>
            <Menu
              mode="inline"
              defaultSelectedKeys={['/']}
              style={{ height: '100%', borderRight: 0 }}
              items={menuItems}
              onClick={({ key }) => {
                window.location.href = key;
              }}
            />
          </Sider>
          
          <Layout style={{ padding: '24px' }}>
            <Content style={{ 
              background: '#fff', 
              padding: 24, 
              margin: 0, 
              minHeight: 280,
              borderRadius: '8px'
            }}>
              <Routes>
                <Route path="/" element={<Home />} />
                <Route path="/sqli" element={<SqlInjection />} />
                <Route path="/xss" element={<XSS />} />
                <Route path="/ssrf" element={<SSRF />} />
                <Route path="/xxe" element={<XXE />} />
                <Route path="/rce" element={<RCE />} />
              </Routes>
            </Content>
          </Layout>
        </Layout>
      </Layout>
    </Router>
  );
}

export default App;