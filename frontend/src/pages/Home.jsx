import React from 'react';
import { Card, Row, Col, Typography, Alert, List, Tag, Divider } from 'antd';
import { useNavigate } from 'react-router-dom';
import { 
  BugOutlined, 
  CodeOutlined, 
  GlobalOutlined, 
  FileTextOutlined, 
  CodeOutlined as TerminalOutlined,
  WarningOutlined,
  SafetyOutlined
} from '@ant-design/icons';

const { Title, Paragraph, Text } = Typography;

const Home = () => {
  const navigate = useNavigate();
  
  const vulnerabilities = [
    {
      title: 'SQL注入 (SQL Injection)',
      icon: <BugOutlined style={{ color: '#f5222d' }} />,
      description: '通过在SQL查询中注入恶意代码来获取、修改或删除数据库中的数据',
      severity: 'high',
      path: '/sqli'
    },
    {
      title: 'XSS跨站脚本 (Cross-Site Scripting)',
      icon: <CodeOutlined style={{ color: '#fa8c16' }} />,
      description: '在网页中注入恶意脚本，窃取用户信息或执行恶意操作',
      severity: 'high',
      path: '/xss'
    },
    {
      title: 'SSRF服务端请求伪造 (Server-Side Request Forgery)',
      icon: <GlobalOutlined style={{ color: '#faad14' }} />,
      description: '诱使服务器发起对内部或外部资源的非预期请求',
      severity: 'medium',
      path: '/ssrf'
    },
    {
      title: 'XXE外部实体注入 (XML External Entity)',
      icon: <FileTextOutlined style={{ color: '#13c2c2' }} />,
      description: '通过XML外部实体引用来读取服务器文件或发起SSRF攻击',
      severity: 'high',
      path: '/xxe'
    },
    {
      title: 'RCE远程代码执行 (Remote Code Execution)',
      icon: <TerminalOutlined style={{ color: '#722ed1' }} />,
      description: '在目标服务器上执行任意命令或代码',
      severity: 'critical',
      path: '/rce'
    }
  ];

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'critical': return 'red';
      case 'high': return 'orange';
      case 'medium': return 'gold';
      case 'low': return 'green';
      default: return 'default';
    }
  };

  const getSeverityText = (severity) => {
    switch (severity) {
      case 'critical': return '严重';
      case 'high': return '高危';
      case 'medium': return '中危';
      case 'low': return '低危';
      default: return '未知';
    }
  };

  return (
    <div>
      <div style={{ textAlign: 'center', marginBottom: 40 }}>
        <Title level={1}>
          <BugOutlined style={{ marginRight: 16, color: '#f5222d' }} />
          OWASP漏洞测试实验室
        </Title>
        <Paragraph style={{ fontSize: 16, color: '#666' }}>
          一个用于学习和测试常见Web安全漏洞的实验环境
        </Paragraph>
      </div>

      <Alert
        message="安全警告"
        description="此实验室仅用于教育和学习目的。请勿在生产环境中使用这些漏洞代码。"
        type="warning"
        icon={<WarningOutlined />}
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]} style={{ marginBottom: 32 }}>
        <Col span={12}>
          <Card 
            title={
              <span>
                <BugOutlined style={{ marginRight: 8, color: '#f5222d' }} />
                项目简介
              </span>
            }
            variant="borderless"
          >
            <Paragraph>
              本项目基于OWASP Top 10安全风险清单，提供了一个安全的测试环境来学习和理解常见的Web应用安全漏洞。
            </Paragraph>
            <Paragraph>
              每个漏洞模块都包含：
            </Paragraph>
            <List
              size="small"
              dataSource={[
                '漏洞原理和危害说明',
                '易受攻击的代码示例',
                '安全的代码实现',
                '测试用例和攻击载荷',
                '防护措施和最佳实践'
              ]}
              renderItem={item => <List.Item>• {item}</List.Item>}
            />
          </Card>
        </Col>
        
        <Col span={12}>
          <Card 
            title={
              <span>
                <SafetyOutlined style={{ marginRight: 8, color: '#52c41a' }} />
                使用说明
              </span>
            }
            variant="borderless"
          >
            <Paragraph>
              <Text strong>后端服务：</Text> Spring Boot (端口: 8080)
            </Paragraph>
            <Paragraph>
              <Text strong>前端界面：</Text> React + Ant Design (端口: 3000)
            </Paragraph>
            <Paragraph>
              <Text strong>数据库：</Text> H2内存数据库
            </Paragraph>
            <Divider />
            <Paragraph>
              点击左侧菜单选择要测试的漏洞类型，每个页面都提供了详细的测试界面和说明文档。
            </Paragraph>
            <Paragraph>
              建议按照提供的测试用例逐步进行实验，理解漏洞的成因和防护方法。
            </Paragraph>
          </Card>
        </Col>
      </Row>

      <Card 
        title={
          <span>
            <BugOutlined style={{ marginRight: 8, color: '#f5222d' }} />
            漏洞模块概览
          </span>
        }
        variant="borderless"
      >
        <Row gutter={[16, 16]}>
          {vulnerabilities.map((vuln, index) => (
            <Col span={24} key={index}>
              <Card 
                size="small" 
                hoverable
                onClick={() => navigate(vuln.path)}
                style={{ cursor: 'pointer' }}
              >
                <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
                  <div style={{ display: 'flex', alignItems: 'center', flex: 1 }}>
                    <div style={{ marginRight: 16, fontSize: 24 }}>
                      {vuln.icon}
                    </div>
                    <div style={{ flex: 1 }}>
                      <Title level={4} style={{ margin: 0, marginBottom: 8 }}>
                        {vuln.title}
                      </Title>
                      <Paragraph style={{ margin: 0, color: '#666' }}>
                        {vuln.description}
                      </Paragraph>
                    </div>
                  </div>
                  <div>
                    <Tag color={getSeverityColor(vuln.severity)}>
                      {getSeverityText(vuln.severity)}
                    </Tag>
                  </div>
                </div>
              </Card>
            </Col>
          ))}
        </Row>
      </Card>

      <Card 
        title="技术栈"
        style={{ marginTop: 24 }}
        variant="borderless"
      >
        <Row gutter={[16, 16]}>
          <Col span={8}>
            <Card size="small" title="后端技术">
              <List
                size="small"
                dataSource={[
                  'Spring Boot 2.7.x',
                  'Spring Data JPA',
                  'H2 Database',
                  'Maven',
                  'Java 8'
                ]}
                renderItem={item => <List.Item>• {item}</List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="前端技术">
              <List
                size="small"
                dataSource={[
                  'React 18',
                  'Ant Design',
                  'Vite',
                  'React Router',
                  'Axios'
                ]}
                renderItem={item => <List.Item>• {item}</List.Item>}
              />
            </Card>
          </Col>
          <Col span={8}>
            <Card size="small" title="安全工具">
              <List
                size="small"
                dataSource={[
                  'OWASP ZAP',
                  'Burp Suite',
                  'SQLMap',
                  'XSStrike',
                  'Nmap'
                ]}
                renderItem={item => <List.Item>• {item}</List.Item>}
              />
            </Card>
          </Col>
        </Row>
      </Card>
    </div>
  );
};

export default Home;