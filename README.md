# CMULab

<div align="right"><sup>
  made with ❤️ in Pittsburgh, PA by <a href="https://quantumstack.xyz">QuantumStack</a>
</sup></div>

Secure check-in and scoring. Easy for instructors, easy for students. By [QuantumStack](https://quantumstack.xyz/), built with love in Pittsburgh, Pennsylvania.

## Features

- Automatically generates QR codes for check-in
- Easily export data to CSV, with filters
- Add/remove users from comprehensive admin console

Learn more [here](https://cmulab.quantumstack.xyz)

## Setup

1. Install Node.js and MongoDB on your system.
2. Fill the `server/.env` file accordingly ([this](https://developers.google.com/identity/protocols/OAuth2) may help)
3. In `client/cmulab`, fill lines 6-7
4. Move the `client/cmulab` script to an accessible location for students
5. Using a terminal, type `mongo <database name>`
6. Type `db.users.insert({"_id": "<admin user ID>", "admin": true});`
7. Run `npm install` in the `server` directory
8. `npm start` to get started!
9. Give instructors access to CMULab from the admin console

## Images

![Home Page](https://i.imgur.com/DxFn4NR.jpg)

![Checkin Page](https://i.imgur.com/NkSU5vm.jpg)

![Administration Page](https://i.imgur.com/RxAPdSZ.png)

## Contributing

Feel free to make issues here on GitHub! Source code available under MIT license.
