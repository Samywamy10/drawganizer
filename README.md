# Drawganizer

## Overview

Drawganizer is a web application designed to help users organize their Gridfinity drawers. It provides a user-friendly interface for managing items within drawers, allowing users to add, update, and delete items while visualizing their layout in a 3D view. The application leverages Next.js for the frontend and Prisma with SQLite for the backend database.

## Features

- **3D Visualization**: View and interact with your drawers and items in a 3D space.
- **Item Management**: Add, update, and delete items within drawers.
- **Search Functionality**: Easily find items and drawers using a search bar.
- **Responsive Design**: The application is designed to work on various screen sizes.

## Technologies Used

- **Frontend**: Next.js, React
- **Backend**: Prisma, SQLite
- **Styling**: Tailwind CSS
- **Containerization**: Docker, Docker Compose

## Setup Instructions

### Prerequisites

- Ensure you have Node.js (version 14 or higher) and npm installed on your machine.
- Ensure you have Docker and Docker Compose installed if you want to run the application in a containerized environment.

### Clone the Repository

```bash
git clone https://github.com/Samywamy10/drawganizer.git
cd drawganizer
```

### Local Development

1. **Install Dependencies**: Run the following command to install the required dependencies:

   ```bash
   npm install
   ```

2. **Run the Development Server**: Start the application in development mode:

   ```bash
   npm run dev
   ```

3. **Access the Application**: Open your web browser and navigate to `http://localhost:3000` to access the Drawganizer application.

### Running with Docker

To set up the Drawganizer application using Docker Compose, follow these steps:

1. **Build and Start the Services**: Run the following command in the root directory of the project:

   ```bash
   docker-compose up --build
   ```

2. **Access the Application**: Open your web browser and navigate to `http://localhost:3000` to access the Drawganizer application.

### Database

Prisma uses a SQLite database, which will create a file to hold your database at `/config/dev.db`

## Contributing

Contributions are welcome! If you have suggestions for improvements or new features, feel free to open an issue or submit a pull request.