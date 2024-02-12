-- Keep a log of any SQL queries you execute as you solve the mystery.
SELECT description FROM crime_scene_reports
WHERE year = 2021 AND month = 7 AND day = 28;

SELECT transcript FROM interviews
WHERE year = 2021 AND month = 7 AND day = 28
AND transcript LIKE '%bakery%';

SELECT bakery_security_logs.activity, bakery_security_logs.license_plate, people.name FROM bakery_security_logs
JOIN people ON people.license_plate = bakery_security_logs.license_plate
WHERE bakery_security_logs.year = 2021
AND bakery_security_logs.month = 7
AND bakery_security_logs.day = 28
AND bakery_security_logs.hour = 10
AND bakery_security_logs.minute >= 15
AND bakery_security_logs.minute <= 25;

SELECT people.name FROM people
JOIN bank_accounts ON bank_accounts.person_id = people.id
JOIN atm_transactions ON atm_transactions.account_number = bank_accounts.account_number
WHERE atm_transactions.year = 2021
AND atm_transactions.month = 7
AND atm_transactions.day = 28
AND atm_transactions.atm_location = 'Leggett Street'
AND atm_transactions.transaction_type = 'withdraw';

UPDATE phone_calls
SET caller = people.name
FROM people
WHERE phone_calls.caller = people.phone_number;

UPDATE phone_calls
SET receiver = people.name
FROM people
WHERE phone_calls.receiver = people.phone_number;


SELECT caller, receiver FROM phone_calls
WHERE year = 2021
AND month = 7
AND day = 28
AND duration < 60;

SELECT * FROM flights
WHERE year = 2021
AND month = 7
AND day = 29
ORDER BY hour ASC
LIMIT 1;

SELECT airports.city AS 'ORIGIN CITY' FROM airports
WHERE airports.id IN (
    SELECT flights.origin_airport_id FROM flights
    WHERE year = 2021
    AND month = 7
    AND day = 29
    ORDER BY hour ASC
    LIMIT 1
);

SELECT airports.city AS 'DESTINATION CITY' FROM airports
WHERE airports.id IN (
    SELECT flights.destination_airport_id FROM flights
    WHERE year = 2021
    AND month = 7
    AND day = 29
    ORDER BY hour ASC
    LIMIT 1
);

SELECT flights.destination_airport_id, name, phone_number, license_plate from people
JOIN passengers ON passengers.passport_number = people.passport_number
JOIN flights ON flights.id = passengers.flight_id
WHERE flights.id =
(
    SELECT id FROM flights
    WHERE year = 2021
    AND month = 7
    AND day = 29
    ORDER BY hour ASC
    LIMIT 1
)
ORDER BY flights.hour ASC;

SELECT name AS 'Thief' FROM people
JOIN passengers ON passengers.passport_number = people.passport_number
JOIN flights on flights.id = passengers.flight_id
WHERE year = 2021
AND month = 7
AND day = 29
AND flights.id =
(
    SELECT id FROM flights
    WHERE year = 2021
    AND month = 7
    AND day = 29
    ORDER BY hour ASC
    LIMIT 1
)
AND name in
(
    SELECT caller FROM phone_calls
    WHERE year = 2021
    AND month = 7
    AND day = 28
    AND duration < 60
)
AND name in
(
    SELECT people.name FROM people
    JOIN bank_accounts ON bank_accounts.person_id = people.id
    JOIN atm_transactions ON atm_transactions.account_number = bank_accounts.account_number
    WHERE atm_transactions.year = 2021
    AND atm_transactions.month = 7
    AND atm_transactions.day = 28
    AND atm_transactions.atm_location = 'Leggett Street'
    AND atm_transactions.transaction_type = 'withdraw'
)
AND name in
(
    SELECT people.name FROM people
    JOIN bakery_security_logs ON people.license_plate = bakery_security_logs.license_plate
    WHERE bakery_security_logs.year = 2021
    AND bakery_security_logs.month = 7
    AND bakery_security_logs.day = 28
    AND bakery_security_logs.hour = 10
    AND bakery_security_logs.minute >= 15
    AND bakery_security_logs.minute <= 25
);

SELECT airports.city AS 'The city the thief ESCAPED TO' FROM airports
WHERE airports.id IN (
    SELECT flights.destination_airport_id FROM flights
    WHERE year = 2021
    AND month = 7
    AND day = 29
    ORDER BY hour ASC
    LIMIT 1
);

SELECT receiver FROM phone_calls
WHERE year = 2021
AND month = 7
AND day = 28
AND duration < 60
AND caller = (
    SELECT name FROM people
JOIN passengers ON passengers.passport_number = people.passport_number
JOIN flights on flights.id = passengers.flight_id
WHERE year = 2021
AND month = 7
AND day = 29
AND flights.id =
(
    SELECT id FROM flights
    WHERE year = 2021
    AND month = 7
    AND day = 29
    ORDER BY hour ASC
    LIMIT 1
)
AND name in
(
    SELECT caller FROM phone_calls
    WHERE year = 2021
    AND month = 7
    AND day = 28
    AND duration < 60
)
AND name in
(
    SELECT people.name FROM people
    JOIN bank_accounts ON bank_accounts.person_id = people.id
    JOIN atm_transactions ON atm_transactions.account_number = bank_accounts.account_number
    WHERE atm_transactions.year = 2021
    AND atm_transactions.month = 7
    AND atm_transactions.day = 28
    AND atm_transactions.atm_location = 'Leggett Street'
    AND atm_transactions.transaction_type = 'withdraw'
)
AND name in
(
    SELECT people.name FROM people
    JOIN bakery_security_logs ON people.license_plate = bakery_security_logs.license_plate
    WHERE bakery_security_logs.year = 2021
    AND bakery_security_logs.month = 7
    AND bakery_security_logs.day = 28
    AND bakery_security_logs.hour = 10
    AND bakery_security_logs.minute >= 15
    AND bakery_security_logs.minute <= 25
)
);
