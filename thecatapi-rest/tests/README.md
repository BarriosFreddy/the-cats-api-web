# Backend Unit Tests

This directory contains unit tests for the Cat API backend, following clean architecture principles. The tests are organized by layer:

- **utils**: Tests for utility functions like JWT handling
- **infrastructure/repositories**: Tests for repository implementations
- **application/use-cases**: Tests for application use cases
- **interfaces/controllers**: Tests for REST controllers

## Test Coverage

The test suite aims for 80% code coverage across all layers of the application.

## Running Tests

To run the tests, use the following commands from the `thecatapi-rest` directory:

```bash
# Install dependencies
npm install

# Run tests once
npm test

# Run tests with coverage report
npm run test:coverage

# Run tests in watch mode during development
npm run test:watch
```

## Coverage Report

After running `npm run test:coverage`, a coverage report will be generated in the `coverage` directory. Open `coverage/lcov-report/index.html` in a browser to view the detailed coverage report.

## Docker Testing

If you're using Docker, you can run tests inside the container:

```bash
# Run tests in the Docker container
docker exec -it thecatapi-backend npm test

# Run tests with coverage in the Docker container
docker exec -it thecatapi-backend npm run test:coverage
```

## Adding More Tests

To add more tests:

1. Create a new test file with the `.test.ts` extension
2. Put it in the appropriate directory structure matching the source code
3. Import the module to test
4. Write your test cases using Jest

## Best Practices

- Mock external dependencies
- Test both success and error scenarios
- Ensure tests are isolated and don't depend on each other
- Avoid testing implementation details when possible
- Use descriptive test names that explain the expected behavior
