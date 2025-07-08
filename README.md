# 🏋️‍♂️ FitLog API

**FitLog API** is the backend service for a workout tracking application. It provides secure and scalable endpoints to log workouts, manage exercises, track progress, and support user accounts.

---

## ⚙️ Features

- 🔐 JWT-based user authentication
- 🏋️ CRUD operations for workouts and exercises
- 📆 Workout tracking by date
- 📈 Progress summaries and filtering
- 🧾 Workout templates (optional)
- 🧪 Built-in testing with Jest + Supertest
- 🌐 RESTful JSON API

---

## 🧱 Tech Stack

- **Runtime:** Node.js
- **Framework:** Express.js
- **Database:** MongoDB + Mongoose
- **Authentication:** JWT
- **Validation:** Joi / express-validator
- **Testing:** Jest + Supertest
- **Docs:** Swagger / Postman (optional)

---

## 📦 Installation

```bash
# Clone the repository
git clone https://github.com/devonochie/fitlog-api.git

cd fitlog-api

# Install dependencies
npm install

# Copy and configure environment variables
cp .env.example .env

# Start the development server
npm run dev

🧪 Testing with Jest
Run All Tests
bash
Copy code
npm run test
Run Tests in Watch Mode
bash
Copy code
npm run test:watch

🧩 Contributing
Fork this repo and open a PR!
Please use meaningful commit messages and follow the existing code style.

📄 License
This project is licensed under the MIT License.

👨‍💻 Author
Devon Onochie
GitHub: @devonochie
