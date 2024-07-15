package com.till.bank.controller;


import jakarta.validation.ConstraintViolationException;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.validation.FieldError;
import org.springframework.web.bind.MethodArgumentNotValidException;
import org.springframework.web.bind.annotation.ExceptionHandler;
import org.springframework.web.bind.annotation.RestControllerAdvice;

import java.util.HashMap;
import java.util.Map;

@RestControllerAdvice
public class UserControllerAdvice {

//    @ExceptionHandler(Exception.class)
//    public ResponseEntity<String> handleStdException() {
//        return new ResponseEntity<>("Mööp", HttpStatus.I_AM_A_TEAPOT);
//    }
//
//    @ExceptionHandler(ConstraintViolationException.class)
//    public ResponseEntity<String> handleOtherException() {
//        return new ResponseEntity<>("ConstraintViolationException", HttpStatus.I_AM_A_TEAPOT);
//    }

    @ExceptionHandler(MethodArgumentNotValidException.class)
    public ResponseEntity<Map<String, String>> handleValidationException(MethodArgumentNotValidException ex) {
        Map<String, String> errors = new HashMap<>();
        ex.getBindingResult().getAllErrors().forEach(error -> {
            String fieldName = ((FieldError) error).getField();
            String errorMessage = error.getDefaultMessage();
            errors.put(fieldName, errorMessage);
        });
        return new ResponseEntity<>(errors, HttpStatus.BAD_REQUEST);

    }
}