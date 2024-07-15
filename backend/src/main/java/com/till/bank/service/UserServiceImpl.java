package com.till.bank.service;


import com.till.bank.dto.LoginRequest;
import com.till.bank.dto.UserDto;
import com.till.bank.entity.Address;
import com.till.bank.entity.BankAccount;
import com.till.bank.entity.User1;
import com.till.bank.error.EmailAlreadyExistsException;
import com.till.bank.repository.AddressRepository;
import com.till.bank.repository.BankAccountRepository;
import com.till.bank.repository.UserRepository;
import lombok.extern.slf4j.Slf4j;
import org.json.JSONArray;
import org.json.JSONException;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.env.Environment;
import org.springframework.http.*;
//import org.springframework.security.crypto.bcrypt.BCryptPasswordEncoder;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONObject;

import com.twilio.Twilio;
import com.twilio.rest.api.v2010.account.Message;
@Service
@Slf4j
public class UserServiceImpl implements UserService {

    @Autowired
    private UserRepository userRepository;

    @Autowired
    private Environment env;

    @Autowired
    private AddressRepository addressRepository;

    @Autowired
    private BankAccountRepository bankAccountRepository;

    //commented because I had problems with the new version of spring boot 3.2.2 to include security
//    @Autowired
//    private BCryptPasswordEncoder bCryptPasswordEncoder;





    private static final String REST_COUNTRIES_URL = "https://restcountries.com/v3.1/name/";


    @Override
    public List<User1> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User1 getUserById(Long id) {
        Optional<User1> userOptional = userRepository.findById(id);
        return userOptional.orElse(null);
    }

    public User1 login(LoginRequest loginRequest) {
        User1 user= userRepository.findByEmail(loginRequest.getEmail());
//        if (bCryptPasswordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
        if(loginRequest.getPassword().equals(user.getPassword())){
            return user;
        }
        else return null;
        //POSSIBLE TOKEN IMPLEMENTATION
//        if (passwordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
//            try {
//                long expirationTimeMillis = System.currentTimeMillis() + 3600 * 1000; // 1 hour from now
//                Date expirationDate = new Date(expirationTimeMillis);
//
//                String token = Jwts.builder()
//                        .setSubject(user.getFirstName())
//                        .claim("firstName", user.getFirstName())
//                        .claim("id", user.getId())
//                        .claim("role", user.getRole())
//                        .setExpiration(expirationDate)
//                        .signWith(SignatureAlgorithm.HS512, secretKey)
//                        .compact();
//                LoginToken loginToken
//                        = new LoginToken(user, token);
//
//                loginTokenRepository.save(loginToken);
//
//                return token;
//            } catch (Exception e) {
//                // Log the exception
//                e.printStackTrace();
//                // Handle the exception as needed
//            }
//        } else {
//            return null;
//        }
//        return null;
    }
    @Override
    public User1 createUser(UserDto userdto) {
        if (userRepository.existsByEmail(userdto.getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + userdto.getEmail());
        }
        userdto.setRole("user");
        Address address = new Address(userdto.getAddress().getStreet(), userdto.getAddress().getStreetNumber(),
                userdto.getAddress().getCity(), userdto.getAddress().getZipCode(), userdto.getAddress().getCountry());

        // Save the Address entity
        Address savedAddress = addressRepository.save(address);

        // Generate a six-digit account number
        String accountNumber = generateAccountNumber();
        //Generate the IBAN number
        String iban = generateIBAN(userdto.getAddress().getZipCode(),accountNumber,userdto.getAddress().getCountry());
        BankAccount bankAccount=new BankAccount(); //  BankAccount(userdto.getAddress().getZipCode(),accountNumber,iban ,null ,0.0);
        BankAccount savedBankAccount = bankAccountRepository.save(bankAccount);


        User1 user= new User1(userdto.getFirstName(),userdto.getLastName(),userdto.getEmail(),userdto.getPassword(),userdto.getPhoneNumber(), userdto.getRole(), userdto.getAddress(),savedBankAccount);
//        user.setPassword(bCryptPasswordEncoder.encode(userdto.getPassword()));
        User1 savedUser = userRepository.save(user);

        savedBankAccount.setUser(savedUser);
        savedBankAccount.setBankId(userdto.getAddress().getZipCode());
        savedBankAccount.setAccountNumber(accountNumber);
        savedBankAccount.setIBAN(iban);
        savedBankAccount.setBalance(0.0);
        // Update the bank account entity with the user's ID
        savedBankAccount.setUser(savedUser);

        // Save the updated bank account entity
        bankAccountRepository.save(savedBankAccount);


        return savedUser;
    }

    @Override
    public User1 updateUser(Long id, UserDto userdto) {
//        user.setId(id); // Assuming setId method exists in User1 class

        User1 user= new User1(userdto.getFirstName(),userdto.getLastName(),userdto.getEmail(),userdto.getPassword(),userdto.getPhoneNumber(), userdto.getRole(), userdto.getAddress(),userdto.getBankAccount());
//        user.setPassword(bCryptPasswordEncoder.encode(userdto.getPassword()));

        return userRepository.save(user);
    }

    @Override
    public void deleteUser(Long id) {
        userRepository.deleteById(id);
    }

    @Override
    public ResponseEntity<String> getSecurityCode(String phone) {


        String accountSid = env.getProperty("twilio.account_sid");
        String authToken = env.getProperty("twilio.auth_token");
        Twilio.init(accountSid, authToken);
        // Generate a random 4-digit code
        Random random = new Random();
        int code = random.nextInt(10000); // Generates a random number between 0 (inclusive) and 10000 (exclusive)
        // Create the message body with the generated code
        String messageBody = "Your verification code is: " + String.format("%04d", code);


        // Create and send the message
        try {
            Message message = Message.creator(
                            new com.twilio.type.PhoneNumber(phone), // Use the provided phone number
                            new com.twilio.type.PhoneNumber("+12135893113"),
                            messageBody)
                    .create();

            // Handle the successful response
            return ResponseEntity.ok("Message sent successfull= " + messageBody);
        } catch (Exception e) {
            // Handle any exceptions
            return ResponseEntity.status(HttpStatus.INTERNAL_SERVER_ERROR).body("Failed to send message: " + e.getMessage());
        }
    }
    public String generateAccountNumber() {
        Random random = new Random();
        int accountNumber = random.nextInt(900000) + 100000; // Generates a random number between 100000 and 999999
        return String.valueOf(accountNumber); // Convert int to String
    }
    public String generateIBAN(String bankId, String accountNumber,String country) {
        Random random = new Random();
        int digit = random.nextInt(9) + 1; // Generates a random number between 1 and 9
        String countryCode;
        try {
             countryCode = fetchCountryCode(country); // Retrieve country code from API
        } catch (IOException e) {
            e.printStackTrace(); // Handle or log the exception
            return "DE"; // Return a default country code or handle the error in some other way
        }
        String iban = countryCode + digit + digit+ bankId + accountNumber;
        return iban;
    }
    public String fetchCountryCode(String country) throws IOException {
        OkHttpClient client = new OkHttpClient();
        String url = REST_COUNTRIES_URL + country;

        Request request = new Request.Builder()
                .url(url)
                .build();

        try (Response response = client.newCall(request).execute()) {
            if (!response.isSuccessful()) {
                throw new IOException("Unexpected code " + response);
            }

            String responseBody = response.body().string();

            JSONArray jsonArray = new JSONArray(responseBody);
            if (jsonArray.length() > 0) {
                JSONObject jsonObject = jsonArray.getJSONObject(0);
                String countryCode = jsonObject.getString("cca2");
                log.info("Country Code: {}", countryCode);
                return countryCode;
            } else {
                log.error("No data found for the country: {}", country);
                return null;
            }
        } catch (JSONException e) {
            log.error("Error parsing JSON response: {}", e.getMessage());
            return null;
        }
    }

}
