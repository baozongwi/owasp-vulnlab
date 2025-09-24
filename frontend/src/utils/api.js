import axios from 'axios';

// 创建axios实例
const api = axios.create({
  baseURL: 'http://localhost:8080/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 请求拦截器
api.interceptors.request.use(
  (config) => {
    console.log('发送请求:', config);
    return config;
  },
  (error) => {
    console.error('请求错误:', error);
    return Promise.reject(error);
  }
);

// 响应拦截器
api.interceptors.response.use(
  (response) => {
    console.log('收到响应:', response);
    return response;
  },
  (error) => {
    console.error('响应错误:', error);
    return Promise.reject(error);
  }
);

// SQL注入API
export const sqliApi = {
  // 获取漏洞信息
  getInfo: () => api.get('/sqli/info'),
  
  // 易受攻击的登录
  vulnerableLogin: (username, password) => 
    api.post('/sqli/vulnerable/login', null, {
      params: { username, password }
    }),
  
  // 安全的登录
  safeLogin: (username, password) => 
    api.post('/sqli/safe/login', null, {
      params: { username, password }
    }),
  
  // 易受攻击的搜索
  vulnerableSearch: (keyword) => 
    api.get('/sqli/vulnerable/search', {
      params: { keyword }
    }),
  
  // 易受攻击的用户详情
  vulnerableUserDetail: (id) => 
    api.get('/sqli/vulnerable/user', {
      params: { id }
    }),
};

// XSS API
export const xssApi = {
  // 获取漏洞信息
  getInfo: () => api.get('/xss/info'),
  
  // 反射型XSS
  reflectedXss: (input) => 
    api.post('/xss/reflected', null, {
      params: { input }
    }),
  
  // 存储型XSS - 提交评论
  submitComment: (comment) => 
    api.post('/xss/stored/submit', null, {
      params: { comment }
    }),
  
  // 存储型XSS - 获取评论
  getComments: () => api.get('/xss/stored/comments'),
  
  // 清空评论
  clearComments: () => api.delete('/xss/stored/clear'),
  
  // DOM型XSS
  domXss: (input) => 
    api.post('/xss/dom', null, {
      params: { input }
    }),
  
  // 安全的评论提交
  safeSubmitComment: (comment) => 
    api.post('/xss/safe/submit', null, {
      params: { comment }
    }),
};

// SSRF API
export const ssrfApi = {
  // 获取漏洞信息
  getInfo: () => api.get('/ssrf/info'),
  
  // 易受攻击的URL获取
  vulnerableFetch: (url) => 
    api.post('/ssrf/vulnerable/fetch', null, {
      params: { url }
    }),
  
  // 易受攻击的图片代理
  vulnerableImageProxy: (imageUrl) => 
    api.post('/ssrf/vulnerable/image-proxy', null, {
      params: { imageUrl }
    }),
  
  // 易受攻击的文件下载
  vulnerableDownload: (fileUrl) => 
    api.post('/ssrf/vulnerable/download', null, {
      params: { fileUrl }
    }),
  
  // 安全的URL获取
  safeFetch: (url) => 
    api.post('/ssrf/safe/fetch', null, {
      params: { url }
    }),
};

// XXE API
export const xxeApi = {
  // 获取漏洞信息
  getInfo: () => api.get('/xxe/info'),
  
  // 易受攻击的DOM4J解析
  vulnerableDom4j: (xmlContent) => 
    api.post('/xxe/vulnerable/dom4j', xmlContent, {
      headers: { 'Content-Type': 'application/xml' }
    }),
  
  // 易受攻击的DocumentBuilder解析
  vulnerableDocumentBuilder: (xmlContent) => 
    api.post('/xxe/vulnerable/document-builder', xmlContent, {
      headers: { 'Content-Type': 'application/xml' }
    }),
  
  // 安全的XML解析
  safeXmlParse: (xmlContent) => 
    api.post('/xxe/safe/parse', xmlContent, {
      headers: { 'Content-Type': 'application/xml' }
    }),
  
  // 文件读取XXE
  fileReadXxe: (filePath) => 
    api.post('/xxe/vulnerable/file-read', null, {
      params: { filePath }
    }),
  
  // SSRF XXE
  ssrfXxe: (url) => 
    api.post('/xxe/vulnerable/ssrf', null, {
      params: { url }
    }),
};

// RCE API
export const rceApi = {
  // 获取漏洞信息
  getInfo: () => api.get('/rce/info'),
  
  // 获取测试示例
  getExamples: () => api.get('/rce/examples'),
  
  // 易受攻击的ping
  vulnerablePing: (host) => 
    api.post('/rce/vulnerable/ping', null, {
      params: { host }
    }),
  
  // 易受攻击的系统命令
  vulnerableSystemCommand: (command) => 
    api.post('/rce/vulnerable/system', null, {
      params: { command }
    }),
  
  // 易受攻击的文件操作
  vulnerableFileOperation: (filename, operation) => 
    api.post('/rce/vulnerable/file', null, {
      params: { filename, operation }
    }),
  
  // 安全的ping
  safePing: (host) => 
    api.post('/rce/safe/ping', null, {
      params: { host }
    }),
  
  // 安全的系统命令
  safeSystemCommand: (command) => 
    api.post('/rce/safe/system', null, {
      params: { command }
    }),
};

export default api;