package com.platifon.mycards.services.impl;

import com.platifon.mycards.entity.RoleEnum;
import com.platifon.mycards.entity.User;
import com.platifon.mycards.model.CreateUserRequest;
import com.platifon.mycards.model.RestorePasswordRequest;
import com.platifon.mycards.repositories.UserRepository;
import com.platifon.mycards.services.IUserService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.HashSet;
import java.util.Set;

/**
 * @author paradoxfm - 21.01.2016
 */
@Service
@Transactional
public class UserService implements IUserService {

    @Autowired
    private PasswordEncoder passwordEncoder;

    @Autowired
    private UserRepository userRepository;

    public void save(User user) {
        //user.setPasswordHash(passwordEncoder.encode(user.getPasswordHash()));
        userRepository.save(user);
    }

    @Override
    public User registerUser(CreateUserRequest req) {
        User u = new User();
        u.setEmail(req.getEmail());
        u.setLogin(req.getUsername());
        u.setPasswordHash(passwordEncoder.encode(req.getPassword()));
        Set<RoleEnum> roles = new HashSet<>();
        roles.add(RoleEnum.USER);
        u.setRoles(roles);
        return userRepository.save(u);
    }

    @Override
    public User getUserByEmail(RestorePasswordRequest req) {
        return userRepository.findUserByEmail(req.getEmail());
    }
}
