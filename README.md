# 实验室库存管理系统 (Lab Inventory Management System)

一个现代化的实验室库存管理系统，采用前后端分离架构，提供完整的库存管理、订单处理和用户管理功能。

## 🏗️ 项目架构

本项目采用 **Monorepo** 结构，包含以下主要组件：

### 后端 (Backend)
- **框架**: Django 4.2 + Django REST Framework
- **数据库**: PostgreSQL
- **认证**: JWT (JSON Web Tokens)
- **应用模块**:
  - `users`: 用户管理和认证
  - `inventory`: 库存管理
  - `orders`: 订单处理

### 前端 (Frontend)
- **框架**: React 18
- **UI库**: Material-UI (MUI)
- **路由**: React Router DOM
- **HTTP客户端**: Axios

## 📁 项目结构

```
lab-inventory/
├── backend/                 # Django 后端项目
│   ├── backend/            # Django 项目配置
│   ├── users/              # 用户管理应用
│   ├── inventory/          # 库存管理应用
│   ├── orders/             # 订单管理应用
│   ├── venv/               # Python 虚拟环境
│   └── manage.py           # Django 管理脚本
├── frontend/               # React 前端项目
│   ├── public/             # 静态资源
│   ├── src/                # 源代码
│   └── package.json        # 前端依赖配置
└── README.md               # 项目文档
```

## 🚀 快速开始

### 环境要求

- Python 3.8+
- Node.js 18.x+
- PostgreSQL 12+
- Git

### 1. 克隆项目

```bash
git clone <repository-url>
cd lab-inventory
```

### 2. 数据库设置

在 PostgreSQL 中创建数据库和用户：

```sql
CREATE USER lab_user WITH PASSWORD 'a_strong_password_here';
CREATE DATABASE lab_inventory_db;
GRANT ALL PRIVILEGES ON DATABASE lab_inventory_db TO lab_user;
```

### 3. 后端设置

```bash
cd backend

# 激活虚拟环境
# Windows:
venv\Scripts\activate
# macOS/Linux:
source venv/bin/activate

# 安装依赖
pip install -r requirements.txt

# 运行数据库迁移
python manage.py migrate

# 创建超级用户
python manage.py createsuperuser

# 启动开发服务器
python manage.py runserver
```

后端将在 `http://localhost:8000` 运行

### 4. 前端设置

```bash
cd frontend

# 安装依赖
npm install

# 启动开发服务器
npm start
```

前端将在 `http://localhost:3000` 运行

## 🔧 开发指南

### 后端开发

- Django 应用遵循标准的 Django 项目结构
- 使用 Django REST Framework 构建 API
- 所有 API 端点都需要 JWT 认证
- 数据库模型在各自的 `models.py` 文件中定义

### 前端开发

- 使用函数式组件和 React Hooks
- Material-UI 提供一致的 UI 组件
- 使用 React Router 进行路由管理
- API 调用通过 Axios 进行

## 📚 API 文档

### 认证端点

- `POST /api/auth/login/` - 用户登录
- `POST /api/auth/register/` - 用户注册
- `POST /api/auth/logout/` - 用户登出
- `POST /api/auth/refresh/` - 刷新 JWT 令牌

### 库存管理端点

- `GET /api/inventory/items/` - 获取所有库存项目
- `POST /api/inventory/items/` - 创建新库存项目
- `GET /api/inventory/items/{id}/` - 获取特定库存项目
- `PUT /api/inventory/items/{id}/` - 更新库存项目
- `DELETE /api/inventory/items/{id}/` - 删除库存项目

### 订单管理端点

- `GET /api/orders/` - 获取所有订单
- `POST /api/orders/` - 创建新订单
- `GET /api/orders/{id}/` - 获取特定订单
- `PUT /api/orders/{id}/` - 更新订单
- `DELETE /api/orders/{id}/` - 删除订单

## 🛠️ 技术栈

### 后端
- Django 4.2
- Django REST Framework 3.16
- PostgreSQL
- JWT Authentication
- Django CORS Headers
- Djoser

### 前端
- React 18
- Material-UI (MUI)
- React Router DOM
- Axios
- JavaScript (ES6+)

## 📝 许可证

本项目采用 MIT 许可证。

## 🤝 贡献

欢迎提交 Issue 和 Pull Request！

## 📞 支持

如有问题，请创建 Issue 或联系开发团队。 