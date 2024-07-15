package com.till.bank.controller;



import com.till.bank.dto.LoginRequest;
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
@CrossOrigin(origins = "http://localhost:3000")
public class UserController {

    @Autowired
    private UserService userService;

    @CrossOrigin(origins = "*")
    @GetMapping
    public List<User1> getAllUsers() {
        return userService.getAllUsers();
    }

    @CrossOrigin(origins = "*")
    @GetMapping("/{id}")
    public ResponseEntity<User1> getUserById(@PathVariable Long id) {
        User1 user = userService.getUserById(id);
        return user != null ? ResponseEntity.ok(user) : ResponseEntity.notFound().build();
    }
    @CrossOrigin(origins = "*")
    @PostMapping("/twillio")
    public ResponseEntity<String> getSecurityCode(@RequestBody String phone) {
        ResponseEntity<String> response = userService.getSecurityCode(phone);
        if (response.getStatusCode() == HttpStatus.OK) {
            // Twilio message sent successfully
            String responseBody = response.getBody();
            String[] parts = responseBody.split("=");
            String messageBody = parts[1]; // Extract the part after the "=" sign
            return ResponseEntity.ok("Security code sent successfully= " + messageBody);
        } else {
            // Error occurred in sending the Twilio message
            return ResponseEntity.status(response.getStatusCode()).body(response.getBody());
        }
    }

    @CrossOrigin(origins = "*")
    @PostMapping
    public ResponseEntity<User1> createUser(@RequestBody UserDto userdto) {
        return new ResponseEntity<>(userService.createUser(userdto), HttpStatus.CREATED);
    }
    @PostMapping("/login")
    @CrossOrigin(origins = "*")
    public ResponseEntity<User1> loginUser(@RequestBody LoginRequest loginRequest) {
        // Call your UserService method to handle the login request
        User1 user = userService.login(loginRequest);
        if (user != null) {
            return ResponseEntity.ok(user);
        } else {
            return ResponseEntity.status(HttpStatus.UNAUTHORIZED).build();
        }
    }

    @CrossOrigin(origins = "*")
    @PutMapping("/{id}")
    public ResponseEntity<User1> updateUser(@PathVariable Long id, @RequestBody UserDto userdto) {
        User1 updatedUser = userService.updateUser(id, userdto);
        return updatedUser != null ? ResponseEntity.ok(updatedUser) : ResponseEntity.notFound().build();
    }

    @CrossOrigin(origins = "*")
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteUser(@PathVariable Long id) {
        userService.deleteUser(id);
        return ResponseEntity.noContent().build();
    }
}
