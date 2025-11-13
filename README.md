# 🛡️ OWASP漏洞实验室 (OWASP Vulnerability Lab)

一个用于学习和演示OWASP Top 10安全漏洞的完整实验环境，包含前端React应用和后端Spring Boot API。

## 🎯 项目简介

本项目是一个教育性质的Web安全漏洞演示平台，旨在帮助开发者和安全研究人员：
- 理解常见的Web安全漏洞
- 学习漏洞的利用方法
- 掌握安全防护措施
- 提高Web应用安全意识

## 🔥 支持的漏洞类型

- **XSS (跨站脚本攻击)** - 反射型、存储型、DOM型
- **SQL注入** - 登录绕过、UNION注入、盲注
- **SSRF (服务器端请求伪造)** - 内网探测、文件读取
- **XXE (XML外部实体注入)** - 文件读取、SSRF、DoS攻击
- **RCE (远程代码执行)** - 命令注入、系统命令执行
- **IDOR 未授权直接对象引用**
- **Mass Assignment 过度赋值**
- **Open Redirect 开放重定向**
- **File Upload + Path Traversal 文件上传与路径遍历**
- **不安全反序列化 (Java)**
- **不安全 JWT (alg=none)**
- **ReDoS 正则拒绝服务**

## 🏗️ 技术栈

### 前端
- **React 18** - 现代化前端框架
- **Ant Design** - 企业级UI组件库
- **Vite** - 快速构建工具
- **Axios** - HTTP客户端

### 后端
- **Spring Boot 2.3.12** - Java企业级框架
- **Spring Security** - 安全框架
- **H2 Database** - 内存数据库
- **JPA/Hibernate** - ORM框架
- **Maven** - 项目管理工具

## 🚀 快速开始

### 环境要求
- **Java 8+** (推荐使用JDK 8)
- **Node.js 16+** 
- **npm 或 yarn**
- **Git**

### 1. 克隆项目
```bash
git clone https://github.com/your-username/owasp-vulnlab.git
cd owasp-vulnlab
```

### 2. 启动后端服务
```bash
cd backend
# 设置JAVA_HOME (macOS示例)
export JAVA_HOME=/Library/Java/JavaVirtualMachines/jdk1.8.0_211.jdk/Contents/Home
# 启动Spring Boot应用
mvn clean compile spring-boot:run
```

后端服务将在 `http://localhost:8080` 启动

### 3. 启动前端服务
```bash
cd frontend
# 安装依赖
npm install
# 启动开发服务器
npm run dev
```

前端应用将在 `http://localhost:5173` 启动（默认端口）

## 🔐 测试账户

- **管理员**: `admin` / `admin123`
- **普通用户**: 
  - `john` / `password123`
  - `jane` / `qwerty`
  - `bob` / `123456`
  - `alice` / `password`

## 📖 使用指南

### Web界面测试
访问 `http://localhost:5173` 使用图形界面进行漏洞测试（左侧菜单包含 SQLi/XSS/SSRF/XXE/RCE；“更多漏洞” 页面包含新增漏洞）

### API测试
参考 `POC_测试手册.md` 文件，使用curl命令进行API测试

### 漏洞Writeup（代码产生点 + 触发POC）
所有接口基址为 `http://localhost:8080/api`。

**SQL 注入**
- 产生点
  - 直接拼接凭据：`backend/src/main/java/com/owaspvulnlab/vulnerability/sqli/SqlInjectionService.java:34-41`
  - 组合 LIKE 查询：`backend/src/main/java/com/owaspvulnlab/vulnerability/sqli/SqlInjectionService.java:78-83`
  - ID拼接查询：`backend/src/main/java/com/owaspvulnlab/vulnerability/sqli/SqlInjectionService.java:105-110`
- 触发
  - 登录绕过：`POST /sqli/vulnerable/login`，`username=admin' OR '1'='1' --`
  - 联合查询：`GET /sqli/vulnerable/search?keyword=' UNION SELECT id,username,password,email,role,secret FROM users --`
  - 错误/盲注：`GET /sqli/vulnerable/user/1' AND (SELECT COUNT(*) FROM users) > 0 --`
- 修复
  - 使用参数化查询：`backend/src/main/java/com/owaspvulnlab/vulnerability/sqli/SqlInjectionService.java:131-139`

**XSS**
- 产生点
  - 反射型：直接返回输入 `backend/src/main/java/com/owaspvulnlab/vulnerability/xss/XssService.java:21-27`
  - 存储型：原样入库 `backend/src/main/java/com/owaspvulnlab/vulnerability/xss/XssService.java:39-47`
  - DOM 型：拼接脚本 `backend/src/main/java/com/owaspvulnlab/vulnerability/xss/XssService.java:76-85`
- 触发
  - 反射型：`GET /xss/reflected?input=<script>alert('XSS')</script>`
  - 存储型：提交 `POST /xss/stored/comment` 然后 `GET /xss/stored/comments`
  - DOM 型：前端页面 `/xss` 执行注入片段
- 修复
  - 输出转义、内容安全渲染（示例：`HtmlUtils`）

**SSRF**
- 产生点
  - 任意 URL 直连：`backend/src/main/java/com/owaspvulnlab/vulnerability/ssrf/SsrfService.java:49-56`
  - 图片代理直连：`backend/src/main/java/com/owaspvulnlab/vulnerability/ssrf/SsrfService.java:85-93`
  - 文件下载直连：`backend/src/main/java/com/owaspvulnlab/vulnerability/ssrf/SsrfService.java:136-144`
- 触发
  - `GET /ssrf/vulnerable/fetch?url=http://169.254.169.254/latest/meta-data/`
  - `GET /ssrf/vulnerable/image-proxy?imageUrl=http://example.com/logo.png`
- 修复
  - 协议/域名白名单与内网IP拒绝：`backend/src/main/java/com/owaspvulnlab/vulnerability/ssrf/SsrfService.java:166-205,209-236`

**XXE**
- 产生点
  - DOM4J 默认允许外部实体：`backend/src/main/java/com/owaspvulnlab/vulnerability/xxe/XxeService.java:33-46`
  - JAXP 默认允许外部实体：`backend/src/main/java/com/owaspvulnlab/vulnerability/xxe/XxeService.java:67-83`
- 触发
  - 文件读取：`POST /xxe/vulnerable/dom4j` 携带 `<!ENTITY xxe SYSTEM "file:///etc/hosts">`
  - SSRF：`POST /xxe/vulnerable/documentbuilder` 携带 `SYSTEM "http://127.0.0.1"`
- 修复
  - 禁用实体与外部 DTD：`backend/src/main/java/com/owaspvulnlab/vulnerability/xxe/XxeService.java:116-126`

**命令执行 / RCE**
- 产生点
  - 拼接 `ping` 命令并通过 shell 执行：`backend/src/main/java/com/owaspvulnlab/vulnerability/rce/RceService.java:35-48`
  - 直接执行任意系统命令：`backend/src/main/java/com/owaspvulnlab/vulnerability/rce/RceService.java:90-103`
  - 文件操作命令拼接：`backend/src/main/java/com/owaspvulnlab/vulnerability/rce/RceService.java:149-166`
- 触发
  - `POST /rce/vulnerable/system?command=id`
  - `POST /rce/vulnerable/ping?host=127.0.0.1; whoami`
- 修复
  - 使用参数数组与白名单：`backend/src/main/java/com/owaspvulnlab/vulnerability/rce/RceService.java:221-241,261-306`

**IDOR / 过度赋值**
- 产生点
  - 未授权读取敏感字段：`backend/src/main/java/com/owaspvulnlab/vulnerability/idor/IdorController.java:18-25`
  - 绑定实体并持久化（允许改 `role/secret`）：`backend/src/main/java/com/owaspvulnlab/vulnerability/idor/IdorController.java:27-45`
- 触发
  - `GET /idor/user/1`
  - `POST /idor/user/update` 提交敏感字段修改
- 修复
  - 资源级鉴权与字段白名单

**开放重定向**
- 产生点
  - 直接拼接跳转目标：`backend/src/main/java/com/owaspvulnlab/vulnerability/redirect/RedirectController.java:11-17`
- 触发
  - `GET /redirect?target=http://example.com`
- 修复
  - 目标白名单与相对路径跳转

**文件上传 / 路径遍历**
- 产生点
  - 原样保存用户文件名：`backend/src/main/java/com/owaspvulnlab/vulnerability/upload/UploadController.java:17-27`
  - 任意路径读取：`backend/src/main/java/com/owaspvulnlab/vulnerability/upload/UploadController.java:29-36`
- 触发
  - `POST /upload/file` 表单上传
  - `GET /upload/read?path=../../../../etc/hosts`
- 修复
  - 路径规范化与存储目录限制、MIME/扩展校验

**不安全反序列化（Java）**
- 产生点
  - 反序列化任意对象：`backend/src/main/java/com/owaspvulnlab/vulnerability/deserialization/DeserializationController.java:20-27`
  - 反序列化回调副作用：`backend/src/main/java/com/owaspvulnlab/vulnerability/deserialization/EvilObject.java:17-23`
- 触发
  - `GET /deser/payload?msg=pwn` 获取 Base64，再 `POST /deser/vulnerable` 提交
- 修复
  - 使用安全的序列化格式（JSON/Protobuf），或启用反序列化类型白名单

**不安全 JWT（alg=none）**
- 产生点
  - 颁发无签名 token：`backend/src/main/java/com/owaspvulnlab/vulnerability/jwt/JwtController.java:19-27`
  - 解析不校验签名：`backend/src/main/java/com/owaspvulnlab/vulnerability/jwt/JwtController.java:30-41`
- 触发
  - `POST /jwt/login` 获取 token，再 `GET /jwt/me?token=...`
- 修复
  - 强制签名算法与密钥校验，拒绝 `alg=none`

**ReDoS 正则拒绝服务**
- 产生点
  - 灾难性回溯正则：`backend/src/main/java/com/owaspvulnlab/vulnerability/regex/RegexController.java:14-19`
- 触发
  - `GET /regex/test?input=aaaaaaaaaaaaaaaaaaaaaaaaaaaaaaaa`
- 修复
  - 使用线性回溯的正则或设置超时

**CSRF（跨站请求伪造）**
- 产生点
  - 无 CSRF Token 的状态修改：`backend/src/main/java/com/owaspvulnlab/vulnerability/csrf/CsrfController.java:41-61`
  - 登录设置可跨站使用的 `session` cookie：`backend/src/main/java/com/owaspvulnlab/vulnerability/csrf/CsrfController.java:18-30`
- 触发
  - 先 `POST /csrf/login?user=alice`，再从任意站点发起 `POST /csrf/transfer?to=attacker&amount=100`
- 修复
  - 同步/双重提交 CSRF Token，`SameSite` 与严格 CORS + 认证策略

**SSTI（服务端模板注入）**
- 产生点
  - 处理用户提供的模板字符串：`backend/src/main/java/com/owaspvulnlab/vulnerability/ssti/SstiController.java:26-35`
- 触发
  - `POST /ssti/render`，`{"template":"Hello [[${T(java.lang.System).getProperty('os.name')}]]"}`
- 修复
  - 禁止动态模板渲染或限制表达式评估能力

**NoSQL 注入（模拟）**
- 产生点
  - 不安全正则：`backend/src/main/java/com/owaspvulnlab/vulnerability/nosql/NosqlController.java:29-46`
  - `$where` 动态执行：`backend/src/main/java/com/owaspvulnlab/vulnerability/nosql/NosqlController.java:49-73`
- 触发
  - `GET /nosql/regex?q=.*` 或 `GET /nosql/where?code=username.length()>2`
- 修复
  - 构建安全查询、禁用动态执行与用户控制的正则

**Clickjacking（点击劫持）**
- 产生点
  - 可被嵌入的敏感页面：`backend/src/main/java/com/owaspvulnlab/vulnerability/clickjacking/ClickjackingController.java:13-22`
- 触发
  - 在任意页面用 `<iframe src="http://localhost:8080/api/clickjacking/vulnerable"></iframe>` 叠加诱导点击
- 修复
  - 设置 `X-Frame-Options: DENY` 或 `Content-Security-Policy: frame-ancestors 'none'`（示例：`/safe`）

**HTTP 请求走私（模拟）**
- 产生点
  - 错误的长度/分块优先级解析：`backend/src/main/java/com/owaspvulnlab/vulnerability/smuggling/SmugglingController.java:21-31,31-47`
- 触发
  - `POST /smuggle/parse` 原始文本携带 `Content-Length` 与 `Transfer-Encoding: chunked` 混合，观察解析结果
- 修复
  - 遵循正确的解析优先级，在代理/网关层统一与规范化请求头

## 📁 项目结构

```
owasp-vulnlab/
├── README.md                 # 项目说明文档
├── POC_测试手册.md           # 详细的POC测试指南
├── backend/                  # Spring Boot后端
│   ├── src/main/java/
│   │   └── com/owaspvulnlab/
│   │       ├── OwaspVulnlabApplication.java
│   │       ├── config/       # 配置类
│   │       ├── entity/       # 数据实体
│   │       └── vulnerability/ # 漏洞演示模块
│   │           ├── xss/      # XSS漏洞
│   │           ├── sqli/     # SQL注入
│   │           ├── ssrf/     # SSRF漏洞
│   │           ├── xxe/      # XXE漏洞
│   │           ├── rce/      # RCE漏洞
│   │           ├── idor/     # IDOR与过度赋值
│   │           ├── redirect/ # 开放重定向
│   │           ├── upload/   # 文件上传与路径遍历
│   │           ├── deserialization/ # 不安全反序列化
│   │           ├── jwt/      # 不安全JWT
│   │           ├── regex/    # ReDoS
│   │           ├── csrf/     # CSRF
│   │           ├── ssti/     # SSTI
│   │           ├── nosql/    # NoSQL注入(模拟)
│   │           ├── clickjacking/ # 点击劫持
│   │           └── smuggling/ # 请求走私(模拟)
└── frontend/                # React前端
│   └── pom.xml              # Maven配置
└── frontend/                # React前端
    ├── src/
    │   ├── components/      # 通用组件
    │   ├── pages/          # 页面组件（含 More 页面）
    │   └── App.jsx         # 主应用组件
    └── package.json        # npm配置
```

## 🛡️ 安全说明

### ⚠️ 重要警告
- **仅用于教育目的**: 本项目仅用于学习和研究Web安全
- **禁止恶意使用**: 不得用于攻击真实系统
- **测试环境限制**: 仅在授权的测试环境中使用
- **遵守法律法规**: 使用时请遵守当地法律法规

### 🔒 安全特性
- 包含安全和不安全两种实现方式
- 详细的安全防护措施说明
- 完整的漏洞修复示例
- 安全编码最佳实践

## 🤝 贡献指南

欢迎提交Issue和Pull Request来改进项目：

1. Fork 项目
2. 创建特性分支 (`git checkout -b feature/AmazingFeature`)
3. 提交更改 (`git commit -m 'Add some AmazingFeature'`)
4. 推送到分支 (`git push origin feature/AmazingFeature`)
5. 开启 Pull Request

## 📄 许可证

本项目采用 MIT 许可证 - 查看 [LICENSE](LICENSE) 文件了解详情

## 🙏 致谢

- [OWASP Top 10](https://owasp.org/www-project-top-ten/) - 安全漏洞参考
- [Spring Boot](https://spring.io/projects/spring-boot) - 后端框架
- [React](https://reactjs.org/) - 前端框架
- [Ant Design](https://ant.design/) - UI组件库

## 📞 联系方式

如有问题或建议，请通过以下方式联系：
- 提交 [GitHub Issue](https://github.com/baozongwi/owasp-vulnlab/issues)
- 发送邮件至: baozongwi@outlook.com

---

**⚠️ 免责声明**: 本项目仅用于教育和研究目的。使用者需对使用本项目产生的任何后果负责。项目维护者不承担任何法律责任。
