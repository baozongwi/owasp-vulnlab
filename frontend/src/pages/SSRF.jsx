import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Row, Col, Tag, Collapse, message } from 'antd';
import { GlobalOutlined, PlayCircleOutlined, SafetyOutlined } from '@ant-design/icons';
import { ssrfApi } from '../utils/api';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;

const SSRF = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [vulnInfo, setVulnInfo] = useState(null);

  useEffect(() => {
    loadVulnInfo();
  }, []);

  const loadVulnInfo = async () => {
    try {
      const response = await ssrfApi.getInfo();
      setVulnInfo(response.data);
    } catch (error) {
      message.error('加载漏洞信息失败');
    }
  };

  const handleVulnerableFetch = async (values) => {
    setLoading(true);
    try {
      const response = await ssrfApi.vulnerableFetch(values.url);
      setResult({
        type: 'fetch',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'fetch',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleVulnerableImageProxy = async (values) => {
    setLoading(true);
    try {
      const response = await ssrfApi.vulnerableImageProxy(values.imageUrl);
      setResult({
        type: 'imageProxy',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'imageProxy',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleVulnerableDownload = async (values) => {
    setLoading(true);
    try {
      const response = await ssrfApi.vulnerableDownload(values.fileUrl);
      setResult({
        type: 'download',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'download',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleSafeFetch = async (values) => {
    setLoading(true);
    try {
      const response = await ssrfApi.safeFetch(values.safeUrl);
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
        <GlobalOutlined style={{ color: '#faad14', marginRight: 8 }} />
        SSRF服务端请求伪造测试
      </Title>
      
      <Alert
        message="SSRF服务端请求伪造"
        description="SSRF攻击是指攻击者诱使服务器发起对内部网络或外部系统的非预期请求，可能导致内网信息泄露或对内部服务的攻击。"
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card 
            title={
              <span>
                <GlobalOutlined style={{ color: '#faad14', marginRight: 8 }} />
                易受攻击的URL获取
              </span>
            }
            extra={<Tag color="orange">危险</Tag>}
          >
            <Form onFinish={handleVulnerableFetch} data-form="vulnerable-fetch">
              <Form.Item name="url" label="目标URL">
                <Input placeholder="输入要获取的URL" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                  style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
                >
                  获取URL内容
                </Button>
              </Form.Item>
            </Form>
            
            {vulnInfo?.types?.url_fetch && (
              <div style={{ marginTop: 16 }}>
                <Text strong>测试载荷：</Text>
                <div style={{ marginTop: 8 }}>
                  {vulnInfo.types.url_fetch.test_payloads.map((payload, index) => (
                    <Tag 
                      key={index}
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '11px' }}
                      onClick={() => fillPayload(payload, 'vulnerable-fetch')}
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
                安全的URL获取
              </span>
            }
            extra={<Tag color="green">安全</Tag>}
          >
            <Form onFinish={handleSafeFetch} data-form="safe-fetch">
              <Form.Item name="safeUrl" label="目标URL">
                <Input placeholder="输入要获取的URL（会进行安全检查）" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  安全获取URL
                </Button>
              </Form.Item>
            </Form>
            
            <div style={{ marginTop: 16 }}>
              <Text strong>允许的域名：</Text>
              <div style={{ marginTop: 8 }}>
                <Tag>httpbin.org</Tag>
                <Tag>jsonplaceholder.typicode.com</Tag>
                <Tag>api.github.com</Tag>
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
                <GlobalOutlined style={{ color: '#faad14', marginRight: 8 }} />
                易受攻击的图片代理
              </span>
            }
            extra={<Tag color="orange">危险</Tag>}
          >
            <Form onFinish={handleVulnerableImageProxy} data-form="vulnerable-image">
              <Form.Item name="imageUrl" label="图片URL">
                <Input placeholder="输入图片URL" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                  style={{ backgroundColor: '#faad14', borderColor: '#faad14' }}
                >
                  代理获取图片
                </Button>
              </Form.Item>
            </Form>
            
            {vulnInfo?.types?.image_proxy && (
              <div style={{ marginTop: 16 }}>
                <Text strong>测试载荷：</Text>
                <div style={{ marginTop: 8 }}>
                  {vulnInfo.types.image_proxy.test_payloads.map((payload, index) => (
                    <Tag 
                      key={index}
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '11px' }}
                      onClick={() => fillPayload(payload, 'vulnerable-image')}
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
                <GlobalOutlined style={{ color: '#faad14', marginRight: 8 }} />
                易受攻击的文件下载
              </span>
            }
            extra={<Tag color="red">高危</Tag>}
          >
            <Form onFinish={handleVulnerableDownload} data-form="vulnerable-download">
              <Form.Item name="fileUrl" label="文件URL">
                <Input placeholder="输入要下载的文件URL" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  danger
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  下载文件
                </Button>
              </Form.Item>
            </Form>
            
            {vulnInfo?.types?.file_download && (
              <div style={{ marginTop: 16 }}>
                <Text strong>测试载荷：</Text>
                <div style={{ marginTop: 8 }}>
                  {vulnInfo.types.file_download.test_payloads.map((payload, index) => (
                    <Tag 
                      key={index}
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '11px' }}
                      onClick={() => fillPayload(payload, 'vulnerable-download')}
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
          <Collapse>
            <Panel header="漏洞描述" key="description">
              <Paragraph>{vulnInfo.description}</Paragraph>
            </Panel>
            <Panel header="防护措施" key="protection">
              <div>
                {Object.entries(vulnInfo.protection || {}).map(([key, value]) => (
                  <div key={key} style={{ marginBottom: 8 }}>
                    <Text strong>{key}:</Text> {value}
                  </div>
                ))}
              </div>
            </Panel>
            <Panel header="SSRF类型说明" key="types">
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
            </Panel>
          </Collapse>
        </Card>
      )}
    </div>
  );
};

export default SSRF;