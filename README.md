
### Description of Folders and Files

- **src**: Contains all source code.
  - **api**: Contains the `api.js` file for fetching configuration from external APIs.
  - **commissionCalculator**: Contains the logic for calculating commission fees and its tests.
  - **index.js**: The main entry point of the application.
- **input.json**: Sample input data file.  
- **.eslintrc.json**: ESLint configuration file adhering to Airbnb's style guide.
- **README.md**: Project documentation.
- **package.json**: Project metadata and dependencies.

## Requirements

- Node.js
- npm (Node Package Manager)

## Installation and app runing

1. Clone the repository:
   ```bash
   git clone https://github.com/SergiyPavliuk/commission-calculation
2. Navigate to the project directory:
   ```bash
   cd commission-calculation
3. Install dependencies:
   ```bash
   npm install   
4. To run the application with the provided input file, use please the following command:
   ```bash
   node src/index.js input.json
   
This will read the transactions from input.json, calculate the commissions, and write the results to output.json.