In this Repository, I have completed the Day 20 Async programming - Promise Task

==> Task-2

# Password Checker

Password Checker is a web application that helps users determine if their password has been compromised in a data breach. This project utilizes the Have I Been Pwned (HIBP) API and implements a method called "k-anonymity" to ensure user privacy and security.

## Features

- **Secure Password Checking**: Utilizes the Have I Been Pwned API to check if a password has been breached without storing or transmitting the full password.
- **k-Anonymity**: Only the first few characters of the password's SHA-1 hash are sent to the API, ensuring the actual password never leaves the user's device.
- **Breached Websites Display**: Displays a list of breached websites that are included in the Have I Been Pwned database.

## How It Works

1. **Password Input**: Users enter a password they want to check.
2. **Hashing**: The password is hashed using SHA-1.
3. **k-Anonymity**: Only the first few characters of the SHA-1 hash are sent to the Have I Been Pwned API.
4. **Response**: The API returns a list of hash suffixes and the number of times each suffix has appeared in breaches. If the suffix of the hashed password appears in the list, the password has been compromised.
5. **Display Results**: The application displays whether the password has been breached and lists the compromised sites.

## Technologies Used

- HTML, CSS, Bootstrap, JavaScript for the frontend.
- Have I Been Pwned API for checking breached passwords.
- Netlify for deployment.

## Live Demo

Check out the live demo: [Password Checker](https://ryd-passwordchecker.netlify.app)
