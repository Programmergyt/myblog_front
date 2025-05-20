根据你提供的信息，我将为**登录注册模块**和**博客模块**编写完整的接口文档。响应数据格式统一为 `code`、`msg`、`data`，注册时图片采用 `enctype="multipart/form-data"` 来上传。以下是文档以 Markdown 格式输出：

---

# 📚 **接口文档**

## 🔑 认证接口

### 1. **用户登录**
- **接口**：`POST /api/auth/login`
- **描述**：用户登录，返回 JWT Token 或登录成功信息。
- **请求参数**：
  ```json
  {
    "username": "string",  // 用户名
    "password": "string"   // 密码
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "msg": "登录成功",
    "data": {
      "token": "jwt_token_string"
    }
  }
  ```
- **错误响应示例**：
  ```json
  {
    "code": 400,
    "msg": "用户名或密码错误",
    "data": null
  }
  ```

---

### 2. **用户注册**
- **接口**：`POST /api/auth/register`
- **描述**：用户注册新账号，返回注册结果。图片文件采用 `enctype="multipart/form-data"` 上传。
- **请求参数**：
  ```json
  {
    "username": "string",  // 用户名
    "password": "string",  // 密码
    "email": "string",     // 邮箱
    "avatar": "file"       // 头像文件（上传图片）
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "msg": "注册成功",
    "data": null
  }
  ```
- **错误响应示例**：
  ```json
  {
    "code": 400,
    "msg": "用户名已存在",
    "data": null
  }
  ```

---

### 3. **用户登出**
- **接口**：`POST /api/auth/logout`
- **描述**：用户登出，清除本地存储的 JWT Token。
- **请求参数**：无
- **响应示例**：
  ```json
  {
    "code": 200,
    "msg": "登出成功",
    "data": null
  }
  ```

---

## 📝 博客模块

### 1. **新增博客**
- **接口**：`POST /api/blogs`
- **描述**：用户发布新的博客，需登录后调用。
- **请求参数**：
  ```json
  {
    "title": "string",    // 博客标题
    "content": "string",  // 博客内容
    "tags": ["tag1", "tag2"]  // 标签数组
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "msg": "博客发布成功",
    "data": {
      "id": 1,              // 博客ID
      "title": "string",    // 标题
      "content": "string",  // 内容
      "tags": ["tag1", "tag2"], // 标签
      "create_time": "2025-04-01T12:00:00Z", // 创建时间
      "update_time": "2025-04-01T12:00:00Z"  // 更新时间
    }
  }
  ```

---

### 2. **删除博客**
- **接口**：`DELETE /api/blogs/{id}`
- **描述**：用户删除自己的博客，需登录后调用。
- **请求参数**：无（通过 URL 参数传递博客ID）
- **响应示例**：
  ```json
  {
    "code": 200,
    "msg": "博客删除成功",
    "data": null
  }
  ```

---

### 3. **修改博客**
- **接口**：`PUT /api/blogs/{id}`
- **描述**：用户修改自己的博客，需登录后调用。
- **请求参数**：
  ```json
  {
    "title": "string",    // 新的标题
    "content": "string",  // 新的内容
    "tags": ["tag1", "tag2"]  // 新的标签
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "msg": "博客修改成功",
    "data": {
      "id": 1,              // 博客ID
      "title": "string",    // 新标题
      "content": "string",  // 新内容
      "tags": ["tag1", "tag2"], // 新标签
      "create_time": "2025-04-01T12:00:00Z", // 创建时间
      "update_time": "2025-04-01T12:30:00Z"  // 更新时间
    }
  }
  ```

---

### 4. **查询博客列表**
- **接口**：`GET /api/blogs`
- **描述**：根据不同条件查询博客列表，支持标题、标签、用户、发布时间等筛选。
- **请求参数**：
  ```json
  {
    "title": "string",     // 根据标题筛选
    "tags": ["tag1", "tag2"],  // 根据标签筛选
    "user_id": 1,          // 根据发布用户筛选
    "start_time": "2025-04-01T00:00:00",  // 根据发布时间筛选（开始时间）
    "end_time": "2025-04-02T00:00:00",    // 根据发布时间筛选（结束时间）
    "page": 1,             // 当前页数
    "size": 10             // 每页数量
  }
  ```
- **响应示例**：
  ```json
  {
    "code": 200,
    "msg": "查询成功",
    "data": {
      "total": 100,        // 总记录数
      "current_page": 1,   // 当前页
      "page_size": 10,     // 每页记录数
      "records": [
        {
          "id": 1,
          "title": "Blog Title",
          "content": "Blog Content",
          "tags": ["tag1", "tag2"],
          "create_time": "2025-04-01T12:00:00Z",
          "update_time": "2025-04-01T12:30:00Z"
        },
        // 更多记录...
      ]
    }
  }
  ```

---

### 5. **查看博客详情**
- **接口**：`GET /api/blogs/{id}`
- **描述**：查看指定博客的详情，需登录后调用。
- **请求参数**：无（通过 URL 参数传递博客ID）
- **响应示例**：
  ```json
  {
    "code": 200,
    "msg": "查询成功",
    "data": {
      "id": 1,
      "title": "Blog Title",
      "content": "Blog Content",
      "tags": ["tag1", "tag2"],
      "create_time": "2025-04-01T12:00:00Z",
      "update_time": "2025-04-01T12:30:00Z"
    }
  }
  ```

---

# 📌 统一响应格式

所有接口的响应数据统一遵循以下结构：
```json
{
  "code": <int>,    // 状态码（200:成功，其他是失败）
  "msg": "<string>", // 提示信息（如"操作成功"、"参数错误"）
  "data": <object>  // 实际数据（可能为 null，错误时为 null）
}
```

---

# 🚀 小总结

- **认证模块**：处理登录、注册、登出等操作。
- **博客模块**：处理博客的增、删、改、查功能，支持根据不同条件查询博客。
- **响应格式**：使用统一的 `code`、`msg`、`data` 格式来规范 API 响应。

如果你需要进一步优化接口文档或有其他模块的文档需求，随时可以告诉我！