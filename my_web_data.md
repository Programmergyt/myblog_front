# 建表语句
```sql
-- 用户表
CREATE TABLE users (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '用户ID，自增主键',
                       username VARCHAR(50) NOT NULL UNIQUE COMMENT '用户名',
                       password VARCHAR(100) NOT NULL COMMENT '加密后的密码',
                       email VARCHAR(100) COMMENT '邮箱',
                       avatar VARCHAR(255) COMMENT '用户头像链接',
                       role TINYINT DEFAULT 0 COMMENT '角色：0=普通用户，1=管理员',
                       create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT='用户表';

-- 博客表
CREATE TABLE blogs (
                       id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '博客ID，自增主键',
                       user_id BIGINT NOT NULL COMMENT '发布者ID（关联用户）',
                       title VARCHAR(200) NOT NULL COMMENT '博客标题',
                       content TEXT COMMENT '博客正文内容',
                       create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间',
                       update_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP COMMENT '最后更新时间'
) COMMENT='博客表';

-- 标签表
CREATE TABLE tags (
                      id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '标签ID，自增主键',
                      name VARCHAR(50) NOT NULL UNIQUE COMMENT '标签名称'
) COMMENT='标签表';

-- 博客-标签关联表（联合主键）
CREATE TABLE blog_tags (
                           blog_id BIGINT NOT NULL COMMENT '博客ID',
                           tag_id BIGINT NOT NULL COMMENT '标签ID',
                           PRIMARY KEY (blog_id, tag_id)
) COMMENT='博客与标签的关联表';

-- 菜谱表
CREATE TABLE recipes (
                         id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '菜谱ID，自增主键',
                         user_id BIGINT NOT NULL COMMENT '创建菜谱的用户ID',
                         name VARCHAR(200) NOT NULL COMMENT '菜谱名称',
                         description TEXT COMMENT '菜谱简介',
                         steps TEXT COMMENT '制作步骤',
                         image VARCHAR(255) COMMENT '菜谱图片链接',
                         create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT='菜谱表';

-- 食材表
CREATE TABLE ingredients (
                             id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '食材ID，自增主键',
                             name VARCHAR(100) NOT NULL UNIQUE COMMENT '食材名称',
                             image VARCHAR(255) COMMENT '食材图片链接'
) COMMENT='食材表';

-- 菜谱-食材关联表（联合主键）
CREATE TABLE recipe_ingredients (
                                    recipe_id BIGINT NOT NULL COMMENT '菜谱ID',
                                    ingredient_id BIGINT NOT NULL COMMENT '食材ID',
                                    PRIMARY KEY (recipe_id, ingredient_id)
) COMMENT='菜谱与食材的关联表';

-- 番剧表
CREATE TABLE animation (
                           id BIGINT AUTO_INCREMENT PRIMARY KEY COMMENT '番剧ID，自增主键',
                           name VARCHAR(200) NOT NULL COMMENT '番剧名称',
                           description TEXT COMMENT '番剧简介',
                           image VARCHAR(255) COMMENT '番剧封面图链接',
                           create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '创建时间'
) COMMENT='番剧表';

-- 用户追番表（联合主键）
CREATE TABLE user_animation (
                                user_id BIGINT NOT NULL COMMENT '用户ID',
                                animation_id BIGINT NOT NULL COMMENT '番剧ID',
                                create_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP COMMENT '添加追番时间',
                                PRIMARY KEY (user_id, animation_id)
) COMMENT='用户追番关联表';

```

# 测试数据
```sql
-- 插入用户
INSERT INTO users (username, password, email, avatar, role, create_time) VALUES
('alice', 'password123', 'alice@example.com', 'https://example.com/avatar/alice.png', 0, NOW()),
('bob', 'password123', 'bob@example.com', 'https://example.com/avatar/bob.png', 0, NOW()),
('admin', 'adminpass', 'admin@example.com', 'https://example.com/avatar/admin.png', 1, NOW());

-- 插入博客（Markdown格式内容 + 图片）
INSERT INTO blogs (user_id, title, content, create_time, update_time) VALUES
(1, '如何学习前端开发', 
'# 如何学习前端开发\n\n本文详细讲解了学习前端的路线，包括：HTML、CSS、JavaScript等。\n\n![前端学习图](1.jpg)\n\n## 小结\n持续练习是关键！', 
NOW(), NOW()),
(2, '旅行攻略分享', 
'# 旅行攻略分享\n\n这里是一些超实用的旅行建议。\n\n![旅行照片](2.jpg)\n\n## 推荐\n- 日本\n- 新西兰\n- 冰岛', 
NOW(), NOW());

-- 插入标签
INSERT INTO tags (name) VALUES
('前端'), 
('学习'), 
('旅行'), 
('生活分享');

-- 绑定博客与标签
INSERT INTO blog_tags (blog_id, tag_id) VALUES
(1, 1), -- 博客1绑定"前端"
(1, 2), -- 博客1绑定"学习"
(2, 3), -- 博客2绑定"旅行"
(2, 4); -- 博客2绑定"生活分享"

-- 插入食材
INSERT INTO ingredients (name, image) VALUES
('鸡肉', 'chicken.jpg'),
('米饭', 'rice.jpg'),
('胡萝卜', 'carrot.jpg');

-- 插入菜谱
INSERT INTO recipes (user_id, name, description, steps, image, create_time) VALUES
(1, '鸡肉炒饭', 
'简单美味的鸡肉炒饭，适合新手制作。',
'1. 鸡肉切块。\n2. 胡萝卜切丁。\n3. 热锅下油，炒鸡肉和胡萝卜。\n4. 加入米饭翻炒均匀。\n5. 调味后出锅。',
'fried_rice.jpg', 
NOW());

-- 绑定菜谱与食材
INSERT INTO recipe_ingredients (recipe_id, ingredient_id) VALUES
(1, 1), -- 鸡肉
(1, 2), -- 米饭
(1, 3); -- 胡萝卜

-- 插入番剧
INSERT INTO animation (name, description, image, create_time) VALUES
('鬼灭之刃', '讲述炭治郎与鬼战斗的故事。', 'kimetsu.jpg', '2019-04-06'),
('咒术回战', '咒术师与诅咒之间的斗争。', 'jujutsu.jpg', '2020-10-02');

-- 用户追番
INSERT INTO user_animation (user_id, animation_id, create_time) VALUES
(1, 1), -- Alice追鬼灭之刃
(2, 2); -- Bob追咒术回战

```