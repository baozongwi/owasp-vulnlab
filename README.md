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

前端应用将在 `http://localhost:3000` 启动

## 🔐 测试账户

- **管理员**: `admin` / `admin123`
- **普通用户**: 
  - `john` / `password123`
  - `jane` / `qwerty`
  - `bob` / `123456`
  - `alice` / `password`

## 📖 使用指南

### Web界面测试
访问 `http://localhost:3000` 使用图形界面进行漏洞测试

### API测试
参考 `POC_测试手册.md` 文件，使用curl命令进行API测试

### 示例测试
```bash
# XSS测试
curl -X GET "http://localhost:8080/api/xss/reflected?input=<script>alert('XSS')</script>"

# SQL注入测试
curl -X POST http://localhost:8080/api/sqli/vulnerable/login \
  -H "Content-Type: application/json" \
  -d '{"username": "admin'\'' OR '\''1'\''='\''1'\'' --", "password": "anything"}'
```

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
│   │           └── rce/      # RCE漏洞
│   └── pom.xml              # Maven配置
└── frontend/                # React前端
    ├── src/
    │   ├── components/      # 通用组件
    │   ├── pages/          # 页面组件
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
- 提交 [GitHub Issue](https://github.com/your-username/owasp-vulnlab/issues)
- 发送邮件至: your-email@example.com

---

**⚠️ 免责声明**: 本项目仅用于教育和研究目的。使用者需对使用本项目产生的任何后果负责。项目维护者不承担任何法律责任。