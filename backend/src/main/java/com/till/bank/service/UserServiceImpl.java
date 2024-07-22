package com.till.bank.service;


import com.till.bank.dto.LoginRequest;
import com.till.bank.dto.UserCreationRequest;
import com.till.bank.dto.UserDto;
import com.till.bank.entity.*;
import com.till.bank.error.EmailAlreadyExistsException;
import com.till.bank.repository.AddressRepository;
import com.till.bank.repository.BankAccountRepository;
import com.till.bank.repository.UserRepository;
import jakarta.annotation.PostConstruct;
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
import java.util.Date;
import java.util.List;
import java.util.Optional;
import java.util.Random;

import okhttp3.OkHttpClient;
import okhttp3.Request;
import okhttp3.Response;
import org.json.JSONObject;
import org.springframework.web.client.RestTemplate;


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

    @Autowired
    private RegistRequestService registRequestService;


    //commented because I had problems with the new version of spring boot 3.2.2 to include security
//    @Autowired
//    private BCryptPasswordEncoder bCryptPasswordEncoder;





    private static final String REST_COUNTRIES_URL = "https://restcountries.com/v3.1/name/";

    @PostConstruct
    public void createInitialUsers() {
        createUserIfNotExists("medede@example.com", "Medede", "Tchala", "password", "1234567890", "admin","Street1", "1", "City", "12345", "Deutschland");
        createUserIfNotExists("tillman@example.com", "Tillman", "Tillman", "password", "1234567890", "admin","Street2", "2", "City", "12345", "Deutschland");
        createUserIfNotExists("yasin@example.com", "Yasin", "Yasin", "password", "1234567890", "admin","Street3", "3", "City", "12345", "Deutschland");
        createUserIfNotExists("mats@example.com", "Mats", "Mats", "password", "1234567890", "admin","Street4", "4", "City", "12345", "Deutschland");
    }

    private void createUserIfNotExists(String email, String firstName, String lastName, String password, String phoneNumber, String role,String street,String streetNumber,String city, String zipcode, String country) {
        if (!userRepository.existsByEmail(email)&&userRepository.count() <= 4) {
            Address address = new Address(street, streetNumber, city, zipcode, country);
            User1 user = new User1(firstName, lastName, email, password, phoneNumber, role, address);
            User1 savedUser = userRepository.save(user);
            String accountNumber = generateAccountNumber();
            String iban = generateIBAN(address.getZipCode(), accountNumber, address.getCountry());
            BankAccount bankAccount = new CheckingAccount();
            bankAccount.setBankId(address.getZipCode());
            bankAccount.setAccountNumber(accountNumber);
            bankAccount.setIBAN(iban);
            bankAccount.setBalance(1000000);
            bankAccount.setAccountType("CheckingAccount");
            bankAccount.setUser(savedUser);
            bankAccount.setConfirmedByAdmin(true); // Mark bank account as confirmed by admin
            BankAccount savedBankAccount = bankAccountRepository.save(bankAccount);

            savedUser.getBankAccounts().add(savedBankAccount);
            savedUser.setRole(role);
            savedUser.setConfirmedByAdmin(true);
            userRepository.save(savedUser);
        }
    }
    @Override
    public List<User1> getAllUsers() {
        return userRepository.findAll();
    }

    @Override
    public User1 getUserById(Long id) {
        Optional<User1> userOptional = userRepository.findById(id);
        return userOptional.orElse(null);
    }

    public UserDto login(LoginRequest loginRequest) {
        User1 user= userRepository.findByEmail(loginRequest.getEmail());
//        if (bCryptPasswordEncoder.matches(loginRequest.getPassword(), user.getPassword())) {
        if(loginRequest.getPassword().equals(user.getPassword())){
            return this.convertUserToUserDto(user,user.getBankAccounts().get(0));
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
    public UserDto createUser(UserCreationRequest userCreationRequest) {
        log.info(userCreationRequest.toString());
        if (userRepository.existsByEmail(userCreationRequest.getUserDto().getEmail())) {
            throw new EmailAlreadyExistsException("Email already exists: " + userCreationRequest.getUserDto().getEmail());
        }
        userCreationRequest.getUserDto().setRole("user");
        Address address = new Address(userCreationRequest.getUserDto().getAddress().getStreet(), userCreationRequest.getUserDto().getAddress().getStreetNumber(),
                userCreationRequest.getUserDto().getAddress().getCity(), userCreationRequest.getUserDto().getAddress().getZipCode(), userCreationRequest.getUserDto().getAddress().getCountry());

        // Save the Address entity
        Address savedAddress = addressRepository.save(address);

        // Generate a six-digit account number
        String accountNumber = generateAccountNumber();
        //Generate the IBAN number
        String iban = generateIBAN(userCreationRequest.getUserDto().getAddress().getZipCode(),accountNumber,userCreationRequest.getUserDto().getAddress().getCountry());
//        BankAccount bankAccount=new BankAccount(); //  BankAccount(userdto.getAddress().getZipCode(),accountNumber,iban ,null ,0.0);

        BankAccount bankAccount;
        if ("Girokonto".equals(userCreationRequest.getAccountType())) {
            bankAccount = new CheckingAccount();

        } else if ("Sparkonto".equals(userCreationRequest.getAccountType())) {
            bankAccount = new SavingsAccount();

            // Create SavingsAccount instance
        } else {
            throw new IllegalArgumentException("Invalid account type: " + userCreationRequest.getAccountType());
        }

        bankAccount.setAccountType(userCreationRequest.getAccountType());
        BankAccount savedBankAccount = bankAccountRepository.save(bankAccount);


        //User1 user= this.convertUserDtoToUser(userCreationRequest.getUserDto(),savedBankAccount);
        User1 user= new User1(userCreationRequest.getUserDto().getFirstName(),userCreationRequest.getUserDto().getLastName(),
                userCreationRequest.getUserDto().getEmail(),userCreationRequest.getUserDto().getPassword(),
                userCreationRequest.getUserDto().getPhoneNumber(), userCreationRequest.getUserDto().getRole(),
                userCreationRequest.getUserDto().getAddress());
        // Add the saved bank account to the user's bank accounts list
        user.getBankAccounts().add(savedBankAccount);
//        user.setPassword(bCryptPasswordEncoder.encode(userdto.getPassword()));
        User1 savedUser = userRepository.save(user);


        savedBankAccount.setUser(savedUser);
        savedBankAccount.setBankId(userCreationRequest.getUserDto().getAddress().getZipCode());
        savedBankAccount.setAccountNumber(accountNumber);
        savedBankAccount.setAccountType(userCreationRequest.getAccountType());
        savedBankAccount.setIBAN(iban);
        savedBankAccount.setBalance(userCreationRequest.getBalance());
        savedBankAccount.setAccountType(userCreationRequest.getAccountType());
        // Update the bank account entity with the user's ID
        savedBankAccount.setUser(savedUser);

        // Save the updated bank account entity
        bankAccountRepository.save(savedBankAccount);

        //now create a new registrequest in order for the admin to see what he has to approve
        registRequestService.createRegistRequest(new RegistRequest(new Date(),savedUser,savedBankAccount));

        return this.convertUserToUserDto(savedUser,savedBankAccount);
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

    public User1 convertUserDtoToUser(UserDto userDto,BankAccount bankAccount) {
        User1 user= new User1(userDto.getFirstName(),userDto.getLastName(),
                userDto.getEmail(),userDto.getPassword(),
                userDto.getPhoneNumber(), userDto.getRole(),
                userDto.getAddress(), bankAccount);
        return user;
    }

    public UserDto convertUserToUserDto(User1 user,BankAccount bankAccount) {
        UserDto userDto= new UserDto();
        userDto.setId(user.getId());
        userDto.setFirstName(user.getFirstName());
        userDto.setLastName(user.getLastName());
        userDto.setEmail(user.getEmail());
        userDto.setPassword(user.getPassword());
        userDto.setPhoneNumber(user.getPhoneNumber());
        userDto.setRole(user.getRole());
        userDto.setAddress(user.getAddress());
        userDto.setBankAccount(bankAccount);
        userDto.setConfirmedByAdmin(user.isConfirmedByAdmin());
        return userDto;
    }
}
