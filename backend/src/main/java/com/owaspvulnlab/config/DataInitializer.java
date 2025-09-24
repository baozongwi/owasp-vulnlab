package com.owaspvulnlab.config;

import com.owaspvulnlab.entity.User;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.CommandLineRunner;
import org.springframework.stereotype.Component;

import javax.persistence.EntityManager;
import javax.transaction.Transactional;

@Component
public class DataInitializer implements CommandLineRunner {

    @Autowired
    private EntityManager entityManager;

    @Override
    @Transactional
    public void run(String... args) throws Exception {
        // 初始化测试用户数据
        initializeUsers();
    }

    private void initializeUsers() {
        // 创建测试用户
        User admin = new User("admin", "admin123", "admin@vulnlab.com", "admin", "flag{admin_secret_key}");
        User user1 = new User("john", "password123", "john@example.com", "user", "flag{user1_secret}");
        User user2 = new User("jane", "qwerty", "jane@example.com", "user", "flag{user2_secret}");
        User user3 = new User("bob", "123456", "bob@test.com", "moderator", "flag{moderator_secret}");
        User user4 = new User("alice", "password", "alice@demo.com", "user", "flag{alice_secret}");

        entityManager.persist(admin);
        entityManager.persist(user1);
        entityManager.persist(user2);
        entityManager.persist(user3);
        entityManager.persist(user4);

        System.out.println("测试数据初始化完成！");
        System.out.println("管理员账户: admin/admin123");
        System.out.println("普通用户: john/password123, jane/qwerty, bob/123456, alice/password");
    }
}