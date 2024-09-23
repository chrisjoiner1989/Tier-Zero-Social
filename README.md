# Tier Zero - TCG Community Platform

Tier Zero is a modern web application designed for Trading Card Game (TCG) enthusiasts. It provides a platform for players to manage their card collections, build decks, participate in events, and connect with other players in the community.

## Features

- User authentication (signup, login, profile management)
- Deck building and management
- Event organization and participation
- Community forums and discussions
- D&D game room integration
- Dark mode support

## Tech Stack

- **Frontend:** HTML5, CSS3, JavaScript (ES6+)
- **Backend:** Node.js with Express.js
- **Database:** MongoDB with Mongoose ODM
- **Authentication:** JSON Web Tokens (JWT)

## Getting Started

1. **Clone the repository:**
   ```bash
   git clone https://github.com/yourusername/tier-zero.git
   cd tier-zero
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Set up your MongoDB database:**
   - Create a MongoDB database and update the connection string in the `.env` file.

4. **Run the server:**
   ```bash
   npm start
   ```
   or for development mode:
   ```bash
   npm run dev
   ```

## API Endpoints

- **`/api/users`**: User registration, authentication, and profile management
- **`/api/decks`**: Deck creation, retrieval, and management
- **`/api/events`**: Event creation, listing, and participation
- **`/api/community`**: Forum posts and discussions

## Contributing

Contributions are welcome! Please feel free to submit a Pull Request.



## Acknowledgments

- Inspired by the TCG community and gaming culture.
- Thanks to all contributors and supporters.
