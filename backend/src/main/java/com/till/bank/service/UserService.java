package com.till.bank.service;



import com.till.bank.dto.LoginRequest;
import com.till.bank.dto.UserCreationRequest;
import com.till.bank.dto.UserDto;
import com.till.bank.entity.User1;
import org.springframework.http.ResponseEntity;

import java.util.List;

public interface UserService {
    List<User1> getAllUsers();
    User1 getUserById(Long id);
    UserDto createUser(UserCreationRequest userCreationRequest);
    User1 updateUser(Long id, UserDto userDto);
    User1 login(LoginRequest loginRequest);
    void deleteUser(Long id);

}
