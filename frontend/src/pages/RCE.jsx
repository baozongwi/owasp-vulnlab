import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Row, Col, Tag, Collapse, message, Select } from 'antd';
import { CodeOutlined, PlayCircleOutlined, SafetyOutlined, BugOutlined, WarningOutlined } from '@ant-design/icons';
import { rceApi } from '../utils/api';

const { Title, Paragraph, Text } = Typography;
const { Option } = Select;

const RCE = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [vulnInfo, setVulnInfo] = useState(null);
  const [examples, setExamples] = useState(null);

  useEffect(() => {
    loadVulnInfo();
    loadExamples();
  }, []);

  const loadVulnInfo = async () => {
    try {
      const response = await rceApi.getInfo();
      setVulnInfo(response.data);
    } catch (error) {
      message.error('加载漏洞信息失败');
    }
  };

  const loadExamples = async () => {
    try {
      const response = await rceApi.getExamples();
      setExamples(response.data);
    } catch (error) {
      message.error('加载示例失败');
    }
  };

  const handleVulnerablePing = async (values) => {
    setLoading(true);
    try {
      const response = await rceApi.vulnerablePing(values.host);
      setResult({
        type: 'ping',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'ping',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleVulnerableSystem = async (values) => {
    setLoading(true);
    try {
      const response = await rceApi.vulnerableSystem(values.command);
      setResult({
        type: 'system',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'system',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleVulnerableFile = async (values) => {
    setLoading(true);
    try {
      const response = await rceApi.vulnerableFile(values.filename, values.operation);
      setResult({
        type: 'file',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'file',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleSafePing = async (values) => {
    setLoading(true);
    try {
      const response = await rceApi.safePing(values.safeHost);
      setResult({
        type: 'safePing',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'safePing',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleSafeSystem = async (values) => {
    setLoading(true);
    try {
      const response = await rceApi.safeSystem(values.safeCommand);
      setResult({
        type: 'safeSystem',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'safeSystem',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
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
        <CodeOutlined style={{ color: '#f5222d', marginRight: 8 }} />
        RCE远程代码执行测试
      </Title>
      
      <Alert
        message="RCE远程代码执行"
        description="RCE攻击是指攻击者通过各种方式在目标服务器上执行任意代码，这是最危险的漏洞类型之一，可能导致服务器完全被控制。"
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
                易受攻击的Ping命令
              </span>
            }
            extra={<Tag color="red">极危险</Tag>}
          >
            <Form onFinish={handleVulnerablePing} data-form="vulnerable-ping">
              <Form.Item name="host" label="目标主机">
                <Input placeholder="输入要ping的主机地址" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  danger
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  执行Ping
                </Button>
              </Form.Item>
            </Form>
            
            {examples?.ping && (
              <div style={{ marginTop: 16 }}>
                <Text strong>危险载荷示例：</Text>
                <div style={{ marginTop: 8 }}>
                  {examples.ping.malicious_payloads.map((payload, index) => (
                    <Tag 
                      key={index}
                      color="red"
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '11px' }}
                      onClick={() => fillInput(payload, 'vulnerable-ping', '主机地址')}
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
                安全的Ping命令
              </span>
            }
            extra={<Tag color="green">安全</Tag>}
          >
            <Form onFinish={handleSafePing} data-form="safe-ping">
              <Form.Item name="safeHost" label="目标主机">
                <Input placeholder="输入要ping的主机地址（会进行安全验证）" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  安全Ping
                </Button>
              </Form.Item>
            </Form>
            
            {examples?.ping && (
              <div style={{ marginTop: 16 }}>
                <Text strong>安全输入示例：</Text>
                <div style={{ marginTop: 8 }}>
                  {examples.ping.safe_inputs.map((input, index) => (
                    <Tag 
                      key={index}
                      color="green"
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '11px' }}
                      onClick={() => fillInput(input, 'safe-ping', '主机地址')}
                    >
                      {input}
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
                <WarningOutlined style={{ color: '#f5222d', marginRight: 8 }} />
                易受攻击的系统命令
              </span>
            }
            extra={<Tag color="red">极危险</Tag>}
          >
            <Form onFinish={handleVulnerableSystem} data-form="vulnerable-system">
              <Form.Item name="command" label="系统命令">
                <Input placeholder="输入要执行的系统命令" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  danger
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  执行命令
                </Button>
              </Form.Item>
            </Form>
            
            {examples?.system && (
              <div style={{ marginTop: 16 }}>
                <Text strong>危险载荷示例：</Text>
                <div style={{ marginTop: 8 }}>
                  {examples.system.malicious_payloads.map((payload, index) => (
                    <Tag 
                      key={index}
                      color="red"
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '11px' }}
                      onClick={() => fillInput(payload, 'vulnerable-system', '系统命令')}
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
                安全的系统命令
              </span>
            }
            extra={<Tag color="green">安全</Tag>}
          >
            <Form onFinish={handleSafeSystem} data-form="safe-system">
              <Form.Item name="safeCommand" label="系统命令">
                <Input placeholder="输入要执行的系统命令（仅允许白名单命令）" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  安全执行
                </Button>
              </Form.Item>
            </Form>
            
            {examples?.system && (
              <div style={{ marginTop: 16 }}>
                <Text strong>允许的命令：</Text>
                <div style={{ marginTop: 8 }}>
                  {examples.system.safe_inputs.map((input, index) => (
                    <Tag 
                      key={index}
                      color="green"
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '11px' }}
                      onClick={() => fillInput(input, 'safe-system', '系统命令')}
                    >
                      {input}
                    </Tag>
                  ))}
                </div>
              </div>
            )}
          </Card>
        </Col>
      </Row>

      <Row gutter={[16, 16]} style={{ marginTop: 16 }}>
        <Col span={24}>
          <Card 
            title={
              <span>
                <BugOutlined style={{ color: '#fa541c', marginRight: 8 }} />
                易受攻击的文件操作
              </span>
            }
            extra={<Tag color="orange">危险</Tag>}
          >
            <Form onFinish={handleVulnerableFile} data-form="vulnerable-file" layout="inline">
              <Form.Item name="filename" label="文件名">
                <Input placeholder="输入文件名" style={{ width: 300 }} />
              </Form.Item>
              <Form.Item name="operation" label="操作类型">
                <Select placeholder="选择操作" style={{ width: 150 }}>
                  <Option value="read">读取</Option>
                  <Option value="write">写入</Option>
                  <Option value="delete">删除</Option>
                </Select>
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                  style={{ backgroundColor: '#fa541c', borderColor: '#fa541c' }}
                >
                  执行文件操作
                </Button>
              </Form.Item>
            </Form>
            
            {examples?.file && (
              <div style={{ marginTop: 16 }}>
                <Text strong>危险文件路径示例：</Text>
                <div style={{ marginTop: 8 }}>
                  {examples.file.malicious_payloads.map((payload, index) => (
                    <Tag 
                      key={index}
                      color="orange"
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '11px' }}
                      onClick={() => fillInput(payload, 'vulnerable-file', '文件名')}
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
                key: 'types',
                label: 'RCE类型说明',
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

export default RCE;