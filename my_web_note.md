
一共四个模块：博客模块、做饭模块、追番模块、工具模块、登录注册模块

GET 用于获取资源或资源集合的详细信息，可以通过 URL 路径或查询参数来传递条件。使用RequestParam
POST 用于创建新资源，通常通过 @RequestBody 获取请求体中的数据，并返回新创建的资源
PUT @RequestBody 来接收更新的资源数据，并根据资源 ID 更新相应的记录
DELETE 通过 URL 中的路径参数传递要删除的资源 ID

上传博客的过程是，前端先上传图片，后端返回图片URL，前端把URL插入markdown，然后再把markdown发给后端

前端需要知道后端什么内容？【controller、POJO】、【interceptor】、【exceptionHandler】、【webconfig】
前端需要和后端对接的模块：mock,axios,api

后端还需要添加的接口：
* 用户信息接口（输入token）
* 网站统计数据接口

| 操作类型     | 正确的返回类型 | 含义            |
|----------|---------|---------------|
| `insert` | `int`   | 插入了多少行（通常是 1） |
| `update` | `int`   | 更新了多少行（可以是 0） |
| `delete` | `int`   | 删除了多少行（可以是 0） |
| `select` | `pojo`  | 实体类           |

| 比较项       | 同步 vs 串行                              | 异步 vs 并行                            |
| --------- | ------------------------------------- | ----------------------------------- |
| ✅ **共同点** | 都是“按顺序执行”的体现（一个完成了才开始下一个）             | 都可以让程序“同时处理多个事情”                    |
| ❌ **不同点** | **同步**关注“是否等待任务完成”，**串行**关注“任务是否同时进行” | **异步**是“能继续做别的”，**并行**是“真的多个任务同时运行” |
| 举例        | 同步串行就是逐步做事（如流水线），同步并行少见               | 异步串行是常见的 JS 模式，异步并行则是 Promise.all   |


# 模块与功能设计
## 1.博客模块
### 功能
1-3需要登录，4-8不用登录，9-10需要管理员
1. 用户发布博客
2. 用户删除自己的博客
3. 用户改动自己的博客
4. 按博客标题查询
5. 按博客TAG查询
6. 按博客发布用户查询
7. 按博客发布时间查询
8. 查询tag
9. 新增tag
10. 删除tag

### 数据库
博客、TAG、用户
## 2.做饭模块
### 功能
1-4需要登录，5不用登录
1. 用户添加菜谱（食材、步骤、用户、图片）
2. 用户删除菜谱
3. 管理员添加食材（图片）
4. 管理员删除食材
5. 按照食材搜寻菜谱
### 数据库
菜谱、食材、用户
## 3.追番模块
### 功能
1-4需要登录，5不用登录
1. 用户添加追番
2. 用户删除追番
3. 管理员添加番剧
4. 管理员删除番剧
5. 查看番剧
### 数据库
番剧、用户
## 4.工具模块
### 功能
不需要登录
1. pdf合并pdf合并
2. pdf拆分
3. 统计文件夹一级目录占用内存大小
4. 打印文件夹一级、二级、三级目录结构
### 数据库
无

## 5.登录注册模块
### 功能
不需要登录
1. 账号密码登录
2. 账号、密码、头像、邮箱注册
### 数据库
用户

# 数据库设计
## Table:users
用户数据库

| 字段名         | 类型           | 描述               |
|-------------|--------------|------------------|
| id          | BIGINT PK    | 用户ID，自增          |
| username    | VARCHAR(50)  | 用户名              |
| password    | VARCHAR(100) | 密码（加密存储）         |
| email       | VARCHAR(100) | 邮箱               |
| avatar      | VARCHAR(255) | 头像链接             |
| role        | TINYINT      | 角色（0=普通用户，1=管理员） |
| create_time | TIMESTAMP    | 创建时间             |

用户POJO
public class User {
private Long id;
private String username;
private String password;
private String email;
private String avatar;
private Integer role; // 0: 普通用户, 1: 管理员
private LocalDateTime createTime;
}

## Table:blogs
博客数据库

| 字段名         | 类型           | 描述                |
|-------------|--------------|-------------------|
| id          | BIGINT PK    | 博客ID，自增           |
| user_id     | BIGINT FK    | 发布者ID，关联users(id) |
| title       | VARCHAR(200) | 标题                |
| content     | TEXT         | 正文内容              |
| create_time | TIMESTAMP    | 创建时间              |
| update_time | TIMESTAMP    | 更新时间              |

博客POJO
public class Blog {
private Long id;
private Long userId;
private String title;
private String content;
private LocalDateTime createTime;
private LocalDateTime updateTime;
private List<Long> tagIds; // 用于接口传输时使用,由于数据库中没定义，所以mybatis也不会匹配这个
}

## Table:tags
博客的标签

| 字段名  | 类型          | 描述      |
|------|-------------|---------|
| id   | BIGINT PK   | 标签ID，自增 |
| name | VARCHAR(50) | 标签名     |

标签POJO
public class Tag {
private Long id;
private String name;
}

## Table:blog_tags
博客-标签关联表，多对多

| 字段名     | 类型        | 描述   |
|---------|-----------|------|
| blog_id | BIGINT FK | 博客ID |
| tag_id  | BIGINT FK | 标签ID |

## Table:recipes
菜谱

| 字段名         | 类型           | 描述      |
|-------------|--------------|---------|
| id          | BIGINT PK    | 菜谱ID，自增 |
| user_id     | BIGINT FK    | 用户ID    |
| name        | VARCHAR(200) | 菜谱名称    |
| description | TEXT         | 菜谱介绍    |
| steps       | TEXT         | 做法步骤    |
| image       | VARCHAR(255) | 图片链接    |
| create_time | TIMESTAMP    | 创建时间    |

## Table:ingredients
食材

| 字段名   | 类型           | 描述      |
|-------|--------------|---------|
| id    | BIGINT PK    | 食材ID，自增 |
| name  | VARCHAR(100) | 食材名称    |
| image | VARCHAR(255) | 图片链接    |

## Table:ingredients
食材

| 字段名           | 类型        | 描述   |
|---------------|-----------|------|
| recipe_id     | BIGINT FK | 菜谱ID |
| ingredient_id | BIGINT FK | 食材ID |

## Table:animation
番剧

| 字段名         | 类型           | 描述      |
|-------------|--------------|---------|
| id          | BIGINT PK    | 番剧ID，自增 |
| name        | VARCHAR(200) | 番剧名称    |
| description | TEXT         | 番剧介绍    |
| image       | VARCHAR(255) | 封面图片链接  |
| create_time | TIMESTAMP    | 创建时间    |

## Table:animation_users
用户追番表

| 字段名          | 类型        | 描述   |
|--------------|-----------|------|
| user_id      | BIGINT FK | 用户ID |
| animation_id | BIGINT FK | 番剧ID |
| create_time  | TIMESTAMP | 添加时间 |

# 接口文档

结果传输POJO

    public class Result<T> {

    public static final int SUCCESS = 1;
    public static final int FAIL = 0;
    private Integer code;
    private String msg;
    private T data;

    // 通用成功（无数据）
    public static <T> Result<T> success() {
        return new Result<>(SUCCESS, "success", null);
    }

    // 成功 + 携带数据
    public static <T> Result<T> success(T data) {
        return new Result<>(SUCCESS, "success", data);
    }

    // 失败 + 消息
    public static <T> Result<T> error(String msg) {
        return new Result<>(FAIL, msg, null);
    }

    // 失败 + 自定义code
    public static <T> Result<T> error(int code, String msg) {
        return new Result<>(code, msg, null);
    }
    }

## 认证接口
- `POST /api/auth/login` ：登录 ✅
  public Result<String> login(@RequestBody User user) {
  User login_user = userService.login(user);
  String token = JwtUtil.generateToken(login_user.getId().toString(), login_user.getRole());
  return Result.success(token);
  }
- `POST /api/auth/register` ：注册
  public Result<User> register(@RequestBody User user) {
  User register_user = userService.register(user);
  return Result.success(register_user);
  }
- `POST /api/auth/logout` ：登出 ✅ （需要登录）
  public Result<Void> logout()
  {
  userService.logout();
  return Result.success();
  }
---

## 博客模块

- `POST /api/blogs` （需要登录）✅
  - 新增博客
    public Result<Blog> postBlog(@RequestBody  Blog blog) {
    Blog output_blog = blogService.postBlog(blog);
    return Result.success(output_blog);
    }
- `DELETE /api/blogs/{id}` （需要登录为管理员或者是自己的博客）✅
  - 删除自己的博客
    public Result<Void> deleteBlog(@PathVariable Long id, HttpServletRequest request) {
    blogService.deleteBlog(id, request);
    return Result.success();
    }
- `PUT /api/blogs/{id}` （需要登录并且是自己的博客）✅
  - 修改自己的博客
      public Result<Void> updateBlog(@PathVariable Long id, @RequestBody Blog blog) {
        blogService.updateBlog(id, blog);
        return Result.success();
    }
- `GET /api/blogs` ✅
  - 查询博客列表，支持标题/标签/用户/时间筛选
    public Result<List<Blog>> getBlogs(@RequestParam(required = false) String title,
    @RequestParam(required = false) Long tagId,
    @RequestParam(required = false) Long userId,
    @RequestParam(required = false) String startTime,
    @RequestParam(required = false) String endTime) {
    List<Blog> blogs = blogService.getBlogs(title, tagId, userId, startTime, endTime);
    return Result.success(blogs);
    }
- `GET /api/blogs/{id}` ✅
  - 查看博客详情
    public Result<Blog> getBlogById(@PathVariable Long id) {
    Blog blog = blogService.getBlogById(id);
    return Result.success(blog);
    }
- `POST /api/blogs/upload` ✅ 
  - 上传博客或头像图片
      public Result<Map<String, Object>> upload(@RequestParam("file") MultipartFile file) throws IOException {
        String url = uploadService.uploadImage(file);
        // 返回图片链接（可按前端编辑器要求定制格式）
        Map<String, Object> result = new HashMap<>();
        result.put("url", url);
        result.put("success", 1); // Editor.md 等编辑器需要
        return Result.success(result);
    }
- `POST /api/tags` （需要登录为管理员）✅
  - 新增tag
    public Result<Tag> createTag(@RequestBody Tag tag, HttpServletRequest request) {
    Tag created_tag = tagService.createTag(tag.getName(),request);
    return Result.success(created_tag);
    }
- `DELETE /api/tags/{id}` （需要登录为管理员）✅
  - 删除tag
    public Result<Void> deleteTag(@PathVariable Long id, HttpServletRequest request) {
    tagService.deleteTag(id,request);
    return Result.success();
    }
- `GET /api/tags`✅
  - 查询tag列表
      public Result<List<Tag>> getAllTags() {
        List<Tag> tags = tagService.getAllTags();
        return Result.success(tags);
    }
---

## 做饭模块

- `POST /api/recipes` （需要登录）
  - 添加菜谱
- `DELETE /api/recipes/{id}` （需要登录）
  - 删除自己的菜谱
- `POST /api/ingredients` （需要管理员权限）
  - 添加食材
- `DELETE /api/ingredients/{id}` （需要登录为管理员权限）
  - 删除食材
- `GET /api/recipes/search?ingredient={name}`
  - 根据食材名搜索菜谱

---

## 追番模块

- `POST /api/user_animation` （需要登录）
  - 用户添加追番
- `DELETE /api/user_animation/{animation_id}` （需要登录）
  - 用户删除追番
- `POST /api/animation` （需要管理员权限）
  - 添加番剧
- `DELETE /api/animation/{id}` （需要管理员权限）
  - 删除番剧
- `GET /api/animation`
  - 查看番剧列表

---

## 工具模块

- `POST /api/tools/pdf/merge`
  - 合并PDF文件
- `POST /api/tools/pdf/split`
  - 拆分PDF文件
- `GET /api/tools/folder/size`
  - 查询文件夹一级目录占用大小
- `GET /api/tools/folder/structure`
  - 打印一级、二级、三级目录结构
