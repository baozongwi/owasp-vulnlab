import React, { useState, useEffect } from 'react';
import { Card, Form, Input, Button, Alert, Typography, Row, Col, Tag, Collapse, message, List } from 'antd';
import { CodeOutlined, PlayCircleOutlined, SafetyOutlined, DeleteOutlined } from '@ant-design/icons';
import { xssApi } from '../utils/api';

const { Title, Paragraph, Text } = Typography;
const { TextArea } = Input;

const XSS = () => {
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState(null);
  const [vulnInfo, setVulnInfo] = useState(null);
  const [comments, setComments] = useState([]);

  useEffect(() => {
    loadVulnInfo();
    loadComments();
  }, []);

  const loadVulnInfo = async () => {
    try {
      const response = await xssApi.getInfo();
      setVulnInfo(response.data);
    } catch (error) {
      message.error('加载漏洞信息失败');
    }
  };

  const loadComments = async () => {
    try {
      const response = await xssApi.getComments();
      setComments(response.data.comments || []);
    } catch (error) {
      console.error('加载评论失败:', error);
    }
  };

  const handleReflectedXss = async (values) => {
    setLoading(true);
    try {
      const response = await xssApi.reflectedXss(values.input);
      setResult({
        type: 'reflected',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'reflected',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleSubmitComment = async (values) => {
    setLoading(true);
    try {
      const response = await xssApi.submitComment(values.comment);
      setResult({
        type: 'stored',
        data: response.data,
        success: true
      });
      loadComments(); // 重新加载评论
    } catch (error) {
      setResult({
        type: 'stored',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleSafeSubmitComment = async (values) => {
    setLoading(true);
    try {
      const response = await xssApi.safeSubmitComment(values.safeComment);
      setResult({
        type: 'safe',
        data: response.data,
        success: true
      });
      loadComments(); // 重新加载评论
    } catch (error) {
      setResult({
        type: 'safe',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleDomXss = async (values) => {
    setLoading(true);
    try {
      const response = await xssApi.domXss(values.domInput);
      setResult({
        type: 'dom',
        data: response.data,
        success: true
      });
    } catch (error) {
      setResult({
        type: 'dom',
        data: error.response?.data || { error: error.message },
        success: false
      });
    }
    setLoading(false);
  };

  const handleClearComments = async () => {
    try {
      await xssApi.clearComments();
      setComments([]);
      message.success('评论已清空');
    } catch (error) {
      message.error('清空评论失败');
    }
  };

  const fillPayload = (payload, formName) => {
    const form = document.querySelector(`[data-form="${formName}"]`);
    if (form) {
      const input = form.querySelector('input, textarea');
      if (input) {
        input.value = payload;
        input.dispatchEvent(new Event('input', { bubbles: true }));
      }
    }
  };

  return (
    <div>
      <Title level={2}>
        <CodeOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
        XSS跨站脚本攻击测试
      </Title>
      
      <Alert
        message="XSS跨站脚本攻击"
        description="XSS攻击是指攻击者在网页中注入恶意脚本代码，当用户浏览该网页时，恶意脚本会在用户浏览器中执行。"
        type="warning"
        showIcon
        style={{ marginBottom: 24 }}
      />

      <Row gutter={[16, 16]}>
        <Col span={12}>
          <Card 
            title={
              <span>
                <CodeOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                反射型XSS
              </span>
            }
            extra={<Tag color="orange">危险</Tag>}
          >
            <Form onFinish={handleReflectedXss} data-form="reflected-xss">
              <Form.Item name="input" label="输入内容">
                <Input placeholder="输入内容或XSS载荷" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                  style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
                >
                  测试反射型XSS
                </Button>
              </Form.Item>
            </Form>
            
            {vulnInfo?.test_payloads && (
              <div style={{ marginTop: 16 }}>
                <Text strong>测试载荷：</Text>
                <div style={{ marginTop: 8 }}>
                  {Object.values(vulnInfo.test_payloads).map((payload, index) => (
                    <Tag 
                      key={index}
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '10px' }}
                      onClick={() => fillPayload(payload, 'reflected-xss')}
                    >
                      {payload.length > 30 ? payload.substring(0, 30) + '...' : payload}
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
                <CodeOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                DOM型XSS
              </span>
            }
            extra={<Tag color="orange">危险</Tag>}
          >
            <Form onFinish={handleDomXss} data-form="dom-xss">
              <Form.Item name="domInput" label="DOM输入">
                <Input placeholder="输入DOM操作内容或XSS载荷" />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                  style={{ backgroundColor: '#fa8c16', borderColor: '#fa8c16' }}
                >
                  测试DOM型XSS
                </Button>
              </Form.Item>
            </Form>
            
            {vulnInfo?.test_payloads && (
              <div style={{ marginTop: 16 }}>
                <Text strong>测试载荷：</Text>
                <div style={{ marginTop: 8 }}>
                  {Object.values(vulnInfo.test_payloads).map((payload, index) => (
                    <Tag 
                      key={index}
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '10px' }}
                      onClick={() => fillPayload(payload, 'dom-xss')}
                    >
                      {payload.length > 30 ? payload.substring(0, 30) + '...' : payload}
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
                <CodeOutlined style={{ color: '#fa8c16', marginRight: 8 }} />
                存储型XSS - 提交评论
              </span>
            }
            extra={<Tag color="red">高危</Tag>}
          >
            <Form onFinish={handleSubmitComment} data-form="stored-xss">
              <Form.Item name="comment" label="评论内容">
                <TextArea 
                  rows={4} 
                  placeholder="输入评论内容或XSS载荷" 
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  danger
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  提交评论
                </Button>
              </Form.Item>
            </Form>
            
            {vulnInfo?.test_payloads && (
              <div style={{ marginTop: 16 }}>
                <Text strong>测试载荷：</Text>
                <div style={{ marginTop: 8 }}>
                  {Object.values(vulnInfo.test_payloads).map((payload, index) => (
                    <Tag 
                      key={index}
                      style={{ margin: '2px', cursor: 'pointer', fontSize: '10px' }}
                      onClick={() => fillPayload(payload, 'stored-xss')}
                    >
                      {payload.length > 30 ? payload.substring(0, 30) + '...' : payload}
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
                安全的评论提交
              </span>
            }
            extra={<Tag color="green">安全</Tag>}
          >
            <Form onFinish={handleSafeSubmitComment} data-form="safe-comment">
              <Form.Item name="safeComment" label="评论内容">
                <TextArea 
                  rows={4} 
                  placeholder="输入评论内容（会被安全处理）" 
                />
              </Form.Item>
              <Form.Item>
                <Button 
                  type="primary" 
                  htmlType="submit" 
                  loading={loading}
                  icon={<PlayCircleOutlined />}
                >
                  安全提交评论
                </Button>
              </Form.Item>
            </Form>
          </Card>
        </Col>
      </Row>

      <Card 
        title={
          <span>
            评论列表
            <Button 
              type="link" 
              danger 
              icon={<DeleteOutlined />}
              onClick={handleClearComments}
              style={{ marginLeft: 16 }}
            >
              清空评论
            </Button>
          </span>
        }
        style={{ marginTop: 16 }}
      >
        {comments.length > 0 ? (
          <List
            dataSource={comments}
            renderItem={(comment, index) => (
              <List.Item>
                <div style={{ width: '100%' }}>
                  <Text strong>评论 #{index + 1}:</Text>
                  <div 
                    style={{ 
                      marginTop: 8, 
                      padding: 12, 
                      background: '#f5f5f5', 
                      borderRadius: 4,
                      border: '1px solid #d9d9d9'
                    }}
                    dangerouslySetInnerHTML={{ __html: comment }}
                  />
                </div>
              </List.Item>
            )}
          />
        ) : (
          <div style={{ textAlign: 'center', color: '#999', padding: 20 }}>
            暂无评论
          </div>
        )}
      </Card>

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
                label: 'XSS类型说明',
                children: (
                  <div>
                    {Object.entries(vulnInfo.types || {}).map(([key, description]) => (
                      <div key={key} style={{ marginBottom: 16 }}>
                        <Title level={5}>{key.toUpperCase()}</Title>
                        <Paragraph>{description}</Paragraph>
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

export default XSS;