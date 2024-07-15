package com.till.bank.service;



import com.till.bank.dto.LoginRequest;
import com.till.bank.dto.UserDto;
import com.till.bank.entity.User1;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
    List<User1> getAllUsers();
    User1 getUserById(Long id);
    User1 createUser(UserDto userdto);
    User1 updateUser(Long id, UserDto userdto);
    User1 login(LoginRequest loginRequest);
    void deleteUser(Long id);

    ResponseEntity<String> getSecurityCode(String phone);
}
