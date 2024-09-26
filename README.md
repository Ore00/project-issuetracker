
# Issue Tracker Project

This is the Issue Tracker project, a part of the freeCodeCamp Quality Assurance certification. 
You can find the challenge details on the [freeCodeCamp website](https://www.freecodecamp.org/learn/quality-assurance/quality-assurance-projects/issue-tracker).

## Project Overview

The Issue Tracker allows users to create and manage issues for different projects. Each issue can have the following details:
- Issue Title
- Issue Text
- Created By
- Assigned To (Optional)
- Status (Open/Closed)
- Date of Creation
- Last Updated Date

## Key Features

- Users can create, view, and update issues for a given project.
- Issues can be filtered based on their status (open/closed) or other fields.
- Data validation using `express-validator`.
- API endpoints are protected from cross-origin attacks using `CORS`.
- MongoDB is used as the database to store issues.

## Technologies Used

- Node.js
- Express
- MongoDB (via Mongoose)
- Mocha (for testing)
- Chai and Chai-HTTP (for assertions and HTTP requests testing)
- dotenv (for environment variable management)

## Installation and Setup

To run this project locally, follow the steps below:

1. Clone this repository:
    ```
    git clone https://github.com/freeCodeCamp/boilerplate-project-issuetracker.git
    ```

2. Navigate to the project directory:
    ```
    cd boilerplate-project-issuetracker
    ```

3. Install the required dependencies:
    ```
    npm install
    ```

4. Create a `.env` file in the root directory and add the following environment variables:
    ```
    MONGO_URI=your_mongo_connection_string
    ```

5. Start the development server:
    ```
    npm start
    ```

6. Run the tests to ensure everything is set up correctly:
    ```
    npm test
    ```

## API Endpoints

The following endpoints are available for interacting with the Issue Tracker API:

- **POST** `/api/issues/{project}`: Create a new issue.
- **GET** `/api/issues/{project}`: Get issues for a specific project, with optional filtering.
- **PUT** `/api/issues/{project}`: Update an issue.
- **DELETE** `/api/issues/{project}`: Delete an issue.

## Testing

Mocha and Chai are used to test the API endpoints. To run the tests, use the command:
```
npm test
```

## License

This project is licensed under the MIT License - see the [LICENSE](https://opensource.org/license/mit) for details.