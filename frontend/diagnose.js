#!/usr/bin/env node

const http = require('http');
const fs = require('fs');
const path = require('path');

console.log('🔍 OWASP漏洞实验室前端诊断工具\n');

// 检查前端服务
function checkFrontendService() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:3000', (res) => {
            console.log('✅ 前端服务运行正常 (端口3000)');
            console.log(`   状态码: ${res.statusCode}`);
            resolve(true);
        });
        
        req.on('error', (err) => {
            console.log('❌ 前端服务无法访问');
            console.log(`   错误: ${err.message}`);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ 前端服务响应超时');
            req.destroy();
            resolve(false);
        });
    });
}

// 检查后端服务
function checkBackendService() {
    return new Promise((resolve) => {
        const req = http.get('http://localhost:8080/api/sqli/info', (res) => {
            console.log('✅ 后端服务运行正常 (端口8080)');
            console.log(`   状态码: ${res.statusCode}`);
            resolve(true);
        });
        
        req.on('error', (err) => {
            console.log('❌ 后端服务无法访问');
            console.log(`   错误: ${err.message}`);
            resolve(false);
        });
        
        req.setTimeout(5000, () => {
            console.log('❌ 后端服务响应超时');
            req.destroy();
            resolve(false);
        });
    });
}

// 检查关键文件
function checkFiles() {
    const files = [
        'src/App.jsx',
        'src/pages/Home.jsx',
        'src/pages/XSS.jsx',
        'src/pages/SqlInjection.jsx',
        'src/pages/SSRF.jsx',
        'src/pages/XXE.jsx',
        'src/pages/RCE.jsx',
        'src/utils/api.js',
        'package.json'
    ];
    
    console.log('\n📁 检查关键文件:');
    files.forEach(file => {
        const filePath = path.join(__dirname, file);
        if (fs.existsSync(filePath)) {
            const stats = fs.statSync(filePath);
            console.log(`✅ ${file} (${stats.size} bytes)`);
        } else {
            console.log(`❌ ${file} - 文件不存在`);
        }
    });
}

// 检查依赖
function checkDependencies() {
    console.log('\n📦 检查依赖:');
    try {
        const packageJson = JSON.parse(fs.readFileSync('package.json', 'utf8'));
        const deps = packageJson.dependencies || {};
        
        const requiredDeps = ['react', 'react-dom', 'react-router-dom', 'antd', 'axios'];
        requiredDeps.forEach(dep => {
            if (deps[dep]) {
                console.log(`✅ ${dep}: ${deps[dep]}`);
            } else {
                console.log(`❌ ${dep}: 未安装`);
            }
        });
    } catch (error) {
        console.log('❌ 无法读取package.json');
    }
}

// 测试路由
function testRoutes() {
    console.log('\n🔗 测试路由:');
    const routes = ['/', '/sqli', '/xss', '/ssrf', '/xxe', '/rce'];
    
    return Promise.all(routes.map(route => {
        return new Promise((resolve) => {
            const req = http.get(`http://localhost:3000${route}`, (res) => {
                console.log(`✅ ${route}: ${res.statusCode}`);
                resolve(true);
            });
            
            req.on('error', (err) => {
                console.log(`❌ ${route}: ${err.message}`);
                resolve(false);
            });
            
            req.setTimeout(3000, () => {
                console.log(`❌ ${route}: 超时`);
                req.destroy();
                resolve(false);
            });
        });
    }));
}

// 主函数
async function main() {
    console.log('开始诊断...\n');
    
    // 检查文件
    checkFiles();
    
    // 检查依赖
    checkDependencies();
    
    // 检查服务
    console.log('\n🌐 检查服务:');
    const frontendOk = await checkFrontendService();
    const backendOk = await checkBackendService();
    
    // 测试路由
    if (frontendOk) {
        await testRoutes();
    }
    
    console.log('\n📋 诊断总结:');
    console.log('如果所有检查都通过，但仍然有问题，请检查:');
    console.log('1. 浏览器控制台是否有JavaScript错误');
    console.log('2. 网络选项卡是否有请求失败');
    console.log('3. 尝试清除浏览器缓存');
    console.log('4. 尝试在无痕模式下访问');
    
    console.log('\n🔧 常见解决方案:');
    console.log('- 重启前端服务: npm run dev');
    console.log('- 重启后端服务: mvn spring-boot:run');
    console.log('- 清除缓存: Ctrl+Shift+R (或 Cmd+Shift+R)');
}

main().catch(console.error);