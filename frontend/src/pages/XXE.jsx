import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Row, Col, Tag, Collapse, message, Select } from 'antd';
import { FileTextOutlined, PlayCircleOutlined, SafetyOutlined, BugOutlined } from '@ant-design/icons';
import { xxeApi } from '../utils/api';

const { Title, Paragraph, Text } = Typography;
const { Panel } = Collapse;
const { TextArea } = Input;
const { Option } = Select;

const XXE = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [vulnInfo, setVulnInfo] = useState(null);

  useEffect(() => {
    loadVulnInfo();
  }, []);

  const loadVulnInfo = async () => {
    try {
      const response = await xxeApi.getInfo();
      setVulnInfo(response.data);
    } catch (error) {
      message.error('加载漏洞信息失败');
    }
  };

  const handleVulnerableDom4j = async (values) => {
    setLoading(true);
    try {
      const response = await xxeApi.vulnerableDom4j(values.xmlContent);
      setResult({
        type: 'dom4j',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'dom4j',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleVulnerableDocumentBuilder = async (values) => {
    setLoading(true);
    try {
      const response = await xxeApi.vulnerableDocumentBuilder(values.xmlContent);
      setResult({
        type: 'documentBuilder',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'documentBuilder',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleSafeParse = async (values) => {
    setLoading(true);
    try {
      const response = await xxeApi.safeParse(values.xmlContent);
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

  const handleFileRead = async (values) => {
    setLoading(true);
    try {
      const response = await xxeApi.fileRead(values.filePath);
      setResult({
        type: 'fileRead',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'fileRead',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleSsrfAttack = async (values) => {
    setLoading(true);
    try {
      const response = await xxeApi.ssrfAttack(values.targetUrl);
      setResult({
        type: 'ssrf',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'ssrf',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const fillPayload = (payload, formName) => {
    const form = document.querySelector(`[data-form="${formName}"]`);
    if (form) {
      const textarea = form.querySelector('textarea');
      if (textarea) {
        textarea.value = payload;
        textarea.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  const fillInput = (payload, formName, inputName) => {
    const form = document.querySelector(`[data-form="${formName}"]`);
    if (form) {
      const input = form.querySelector(`input[placeholder*="${inputName}"]`);
      if (input) {
        input.value = payload;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  return (
    <div>
      <Title level={2}>
        <FileTextOutlined style={{ color: '#722ed1', marginRight: 8 }} />
        XXE XML外部实体注入测试
      </Title>
      
      <Alert
        message="XXE XML外部实体注入"
        description="XXE攻击是指攻击者通过构造恶意XML文档，利用XML解析器处理外部实体的功能，读取服务器文件、进行SSRF攻击或造成拒绝服务。"
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card 
            title={
              <span>
                <BugOutlined style={{ color: '#722ed1', marginRight: 8 }} />
                DOM4J解析器（易受攻击）
              </span>
            }
            extra={<Tag color="purple">危险</Tag>}
          >
            <Form onFinish={handleVulnerableDom4j} data-form="vulnerable-dom4j">
              <Form.Item name="xmlContent" label="XML内容">
                <TextArea 
                  rows={6} 
                  placeholder="输入XML内容进行解析"
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                  style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
                >
                  DOM4J解析
                </Button>
              </Form.Item>
            </Form>
            
            {vulnInfo?.types?.dom4j && (
              <div style={{ marginTop: 16 }}>
                <Text strong>测试载荷：</Text>
                <div style={{ marginTop: 8 }}>
                  {vulnInfo.types.dom4j.test_payloads.map((payload, index) => (
                    <Tag 
                      key={index}
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '11px' }}
                      onClick={() => fillPayload(payload, 'vulnerable-dom4j')}
                    >
                      载荷 {index + 1}
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
                <BugOutlined style={{ color: '#722ed1', marginRight: 8 }} />
                DocumentBuilder解析器（易受攻击）
              </span>
            }
            extra={<Tag color="purple">危险</Tag>}
          >
            <Form onFinish={handleVulnerableDocumentBuilder} data-form="vulnerable-documentbuilder">
              <Form.Item name="xmlContent" label="XML内容">
                <TextArea 
                  rows={6} 
                  placeholder="输入XML内容进行解析"
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                  style={{ backgroundColor: '#722ed1', borderColor: '#722ed1' }}
                >
                  DocumentBuilder解析
                </Button>
              </Form.Item>
            </Form>
            
            {vulnInfo?.types?.document_builder && (
              <div style={{ marginTop: 16 }}>
                <Text strong>测试载荷：</Text>
                <div style={{ marginTop: 8 }}>
                  {vulnInfo.types.document_builder.test_payloads.map((payload, index) => (
                    <Tag 
                      key={index}
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '11px' }}
                      onClick={() => fillPayload(payload, 'vulnerable-documentbuilder')}
                    >
                      载荷 {index + 1}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={12}>
          <Card 
            title={
              <span>
                <SafetyOutlined style={{ color: '#52c41a', marginRight: 8 }} />
                安全的XML解析
              </span>
            }
            extra={<Tag color="green">安全</Tag>}
          >
            <Form onFinish={handleSafeParse} data-form="safe-parse">
              <Form.Item name="xmlContent" label="XML内容">
                <TextArea 
                  rows={6} 
                  placeholder="输入XML内容进行安全解析"
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  安全解析
                </Button>
              </Form.Item>
            </Form>
            
            <div style={{ marginTop: 16 }}>
              <Text strong>安全特性：</Text>
              <div style={{ marginTop: 8 }}>
                <Tag>禁用外部实体</Tag>
                <Tag>禁用DTD处理</Tag>
                <Tag>禁用外部参数实体</Tag>
              </div>
            </div>
          </Card>
        </Col>

        <Col span={12}>
          <Card 
            title={
              <span>
                <FileTextOutlined style={{ color: '#fa541c', marginRight: 8 }} />
                文件读取攻击模拟
              </span>
            }
            extra={<Tag color="red">高危</Tag>}
          >
            <Form onFinish={handleFileRead} data-form="file-read">
              <Form.Item name="filePath" label="文件路径">
                <Input placeholder="输入要读取的文件路径" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  danger
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  模拟文件读取
                </Button>
              </Form.Item>
            </Form>
            
            <div style={{ marginTop: 16 }}>
              <Text strong>常见目标文件：</Text>
              <div style={{ marginTop: 8 }}>
                <Tag 
                  style={{ cursor: 'pointer' }}
                  onClick={() => fillInput('/etc/passwd', 'file-read', '文件路径')}
                >
                  /etc/passwd
                </Tag>
                <Tag 
                  style={{ cursor: 'pointer' }}
                  onClick={() => fillInput('/etc/hosts', 'file-read', '文件路径')}
                >
                  /etc/hosts
                </Tag>
                <Tag 
                  style={{ cursor: 'pointer' }}
                  onClick={() => fillInput('C:\\Windows\\System32\\drivers\\etc\\hosts', 'file-read', '文件路径')}
                >
                  Windows hosts
                </Tag>
              </div>
            </div>
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card 
            title={
              <span>
                <BugOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                SSRF攻击模拟
              </span>
            }
            extra={<Tag color="orange">危险</Tag>}
          >
            <Form onFinish={handleSsrfAttack} data-form="ssrf-attack">
              <Form.Item name="targetUrl" label="目标URL">
                <Input placeholder="输入要攻击的内网URL" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                  style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
                >
                  模拟SSRF攻击
                </Button>
              </Form.Item>
            </Form>
            
            <div style={{ marginTop: 16 }}>
              <Text strong>常见内网目标：</Text>
              <div style={{ marginTop: 8 }}>
                <Tag 
                  style={{ cursor: 'pointer' }}
                  onClick={() => fillInput('http://localhost:8080/actuator/health', 'ssrf-attack', '目标URL')}
                >
                  本地健康检查
                </Tag>
                <Tag 
                  style={{ cursor: 'pointer' }}
                  onClick={() => fillInput('http://127.0.0.1:22', 'ssrf-attack', '目标URL')}
                >
                  本地SSH
                </Tag>
                <Tag 
                  style={{ cursor: 'pointer' }}
                  onClick={() => fillInput('http://192.168.1.1', 'ssrf-attack', '目标URL')}
                >
                  内网网关
                </Tag>
              </div>
            </div>
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
            <Panel header="XXE类型说明" key="types">
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

export default XXE;