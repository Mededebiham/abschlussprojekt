package com.till.bank.service;

import com.till.bank.dto.LoginRequest;
import com.till.bank.dto.UserCreationRequest;
import com.till.bank.dto.UserDto;
import com.till.bank.entity.User1;

import java.util.List;

public interface UserService {
    List<User1> getAllUsers();
    User1 getUserById(String id); // Changed Long to String
    UserDto createUser(UserCreationRequest userCreationRequest);
    User1 updateUser(String id, UserDto userDto); // Changed Long to String
    UserDto login(LoginRequest loginRequest);
    void deleteUser(String id); // Changed Long to String
    User1 activateUser(String id); // Changed Long to String
}
