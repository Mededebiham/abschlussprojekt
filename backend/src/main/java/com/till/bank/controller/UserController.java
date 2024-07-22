package com.till.bank.controller;



import com.till.bank.dto.LoginRequest;
import com.till.bank.dto.UserCreationRequest;
import com.till.bank.dto.UserDto;
import com.till.bank.entity.User1;
import com.till.bank.service.UserService;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@Slf4j
@RequestMapping("/users")
public class UserController {

    @Autowired
    private UserService userService;

    @GetMapping
    public List<User1> getAllUsers() {
        return userService.getAllUsers();
    }

    @GetMapping("/{id}")
    public ResponseEntity<User1> getUserById(@PathVariable Long id) {
        User1 user = userService.getUserById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }


    //changed return type to userdto
    @PostMapping
    public ResponseEntity<UserDto> createUser(@RequestBody UserCreationRequest userCreationRequest) {
        return new ResponseEntity<>(userService.createUser(userCreationRequest), HttpStatus.CREATED);
    }

    @PostMapping("/login")
    public ResponseEntity<UserDto> loginUser(@RequestBody LoginRequest loginRequest) {
        // Call your UserService method to handle the login request
        UserDto user = userService.login(loginRequest);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @PutMapping("/{id}")
    public ResponseEntity<User1> updateUser(@PathVariable Long id, @RequestBody UserDto userdto) {
        User1 updatedUser = userService.updateUser(id, userdto);
        return updatedUser != null ? ResponseEntity.ok(updatedUser) : ResponseEntity.notFound().build();
    }

    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
