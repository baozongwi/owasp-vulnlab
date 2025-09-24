import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Divider, Row, Col, Tag, Collapse, message } from 'antd';
import { DatabaseOutlined, PlayCircleOutlined, SafetyOutlined, BugOutlined } from '@ant-design/icons';
import { sqliApi } from '../utils/api';

const { Title, Paragraph, Text } = Typography;

const SqlInjection = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [vulnInfo, setVulnInfo] = useState(null);

  useEffect(() => {
    loadVulnInfo();
  }, []);

  const loadVulnInfo = async () => {
    try {
      const response = await sqliApi.getInfo();
      setVulnInfo(response.data);
    } catch (error) {
      message.error('加载漏洞信息失败');
    }
  };

  const handleVulnerableLogin = async (values) => {
    setLoading(true);
    try {
      const response = await sqliApi.vulnerableLogin(values.username, values.password);
      setResult({
        type: 'vulnerable',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'vulnerable',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleSafeLogin = async (values) => {
    setLoading(true);
    try {
      const response = await sqliApi.safeLogin(values.username, values.password);
      setResult({
        type: 'safe',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'safe',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleVulnerableSearch = async (values) => {
    setLoading(true);
    try {
      const response = await sqliApi.vulnerableSearch(values.keyword);
      setResult({
        type: 'search',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'search',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleVulnerableUserDetail = async (values) => {
    setLoading(true);
    try {
      const response = await sqliApi.vulnerableUserDetail(values.userId);
      setResult({
        type: 'userDetail',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'userDetail',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const fillPayload = (payload, formName) => {
    const form = document.querySelector(`[data-form="${formName}"]`);
    if (form) {
      const input = form.querySelector('input');
      if (input) {
        input.value = payload;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  return (
    <div>
      <Title level={2}>
        <BugOutlined style={{ color: '#f5222d', marginRight: 8 }} />
        SQL注入漏洞测试
      </Title>
      
      <Alert
        message="SQL注入漏洞"
        description="SQL注入是一种代码注入技术，攻击者通过在应用程序的输入字段中插入恶意SQL代码来操纵数据库查询。"
        type="error"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card 
            title={
              <span>
                <BugOutlined style={{ color: '#f5222d', marginRight: 8 }} />
                易受攻击的登录
              </span>
            }
            extra={<Tag color="red">危险</Tag>}
          >
            <Form onFinish={handleVulnerableLogin} data-form="vulnerable-login">
              <Form.Item name="username" label="用户名">
                <Input placeholder="输入用户名或SQL注入载荷" />
              </Form.Item>
              <Form.Item name="password" label="密码">
                <Input.Password placeholder="输入密码" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  danger 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  测试登录
                </Button>
              </Form.Item>
            </Form>
            
            {vulnInfo?.types?.login && (
              <div style={{ marginTop: 16 }}>
                <Text strong>测试载荷：</Text>
                <div style={{ marginTop: 8 }}>
                  {vulnInfo.types.login.test_payloads.map((payload, index) => (
                    <Tag 
                      key={index}
                      style={{ margin: '2px', cursor: 'pointer' }}
                      onClick={() => fillPayload(payload, 'vulnerable-login')}
                    >
                      {payload}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card 
            title={
              <span>
                <SafetyOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                安全的登录
              </span>
            }
            extra={<Tag color="green">安全</Tag>}
          >
            <Form onFinish={handleSafeLogin} data-form="safe-login">
              <Form.Item name="username" label="用户名">
                <Input placeholder="输入用户名" />
              </Form.Item>
              <Form.Item name="password" label="密码">
                <Input.Password placeholder="输入密码" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  安全登录
                </Button>
              </Form.Item>
            </Form>
            
            <div style={{ marginTop: 16 }}>
              <Text strong>测试账户：</Text>
              <div style={{ marginTop: 8 }}>
                <Tag onClick={() => fillPayload('admin', 'safe-login')}>admin/admin123</Tag>
                <Tag onClick={() => fillPayload('john', 'safe-login')}>john/password</Tag>
                <Tag onClick={() => fillPayload('jane', 'safe-login')}>jane/secret</Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card 
            title={
              <span>
                <BugOutlined style={{ color: '#f5222d', marginRight: 8 }} />
                易受攻击的搜索
              </span>
            }
            extra={<Tag color="red">危险</Tag>}
          >
            <Form onFinish={handleVulnerableSearch} data-form="vulnerable-search">
              <Form.Item name="keyword" label="搜索关键词">
                <Input placeholder="输入搜索关键词或SQL注入载荷" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  danger 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  搜索用户
                </Button>
              </Form.Item>
            </Form>
            
            {vulnInfo?.types?.search && (
              <div style={{ marginTop: 16 }}>
                <Text strong>测试载荷：</Text>
                <div style={{ marginTop: 8 }}>
                  {vulnInfo.types.search.test_payloads.map((payload, index) => (
                    <Tag 
                      key={index}
                      style={{ margin: '2px', cursor: 'pointer' }}
                      onClick={() => fillPayload(payload, 'vulnerable-search')}
                    >
                      {payload}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Col>

        <Col span={12}>
          <Card 
            title={
              <span>
                <BugOutlined style={{ color: '#f5222d', marginRight: 8 }} />
                易受攻击的用户详情
              </span>
            }
            extra={<Tag color="red">危险</Tag>}
          >
            <Form onFinish={handleVulnerableUserDetail} data-form="vulnerable-user">
              <Form.Item name="userId" label="用户ID">
                <Input placeholder="输入用户ID或SQL注入载荷" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  danger 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  获取用户详情
                </Button>
              </Form.Item>
            </Form>
            
            {vulnInfo?.types?.user_detail && (
              <div style={{ marginTop: 16 }}>
                <Text strong>测试载荷：</Text>
                <div style={{ marginTop: 8 }}>
                  {vulnInfo.types.user_detail.test_payloads.map((payload, index) => (
                    <Tag 
                      key={index}
                      style={{ margin: '2px', cursor: 'pointer' }}
                      onClick={() => fillPayload(payload, 'vulnerable-user')}
                    >
                      {payload}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      {result && (
        <Card 
          title="测试结果" 
          style={{ marginTop: 24 }}
          extra={
            <Tag color={result.success ? 'green' : 'red'}>
              {result.success ? '成功' : '失败'}
            </Tag>
          }
        >
          <pre style={{ 
            background: '#f5f5f5', 
            padding: 16, 
            borderRadius: 4,
            overflow: 'auto',
            maxHeight: 400
          }}>
            {JSON.stringify(result.data, null, 2)}
          </pre>
        </Card>
      )}

      {vulnInfo && (
        <Card title="漏洞信息" style={{ marginTop: 24 }}>
          <Collapse
            items={[
              {
                key: 'description',
                label: '漏洞描述',
                children: <Paragraph>{vulnInfo.description}</Paragraph>
              },
              {
                key: 'protection',
                label: '防护措施',
                children: (
                  <div>
                    {Object.entries(vulnInfo.protection || {}).map(([key, value]) => (
                      <div key={key} style={{ marginBottom: 8 }}>
                        <Text strong>{key}:</Text> {value}
                      </div>
                    ))}
                  </div>
                )
              },
              {
                key: 'endpoints',
                label: 'API接口',
                children: (
                  <div>
                    {Object.entries(vulnInfo.types || {}).map(([key, type]) => (
                      <div key={key} style={{ marginBottom: 16 }}>
                        <Title level={5}>{type.name}</Title>
                        <Paragraph>{type.description}</Paragraph>
                        {type.endpoints && type.endpoints.map((endpoint, index) => (
                          <Tag key={index} style={{ marginBottom: 4 }}>{endpoint}</Tag>
                        ))}
                      </div>
                    ))}
                  </div>
                )
              }
            ]}
          />
        </Card>
      )}
    </div>
  );
};

export default SqlInjection;