# Technical Decisions – Organisation Directory

## 1. Technology and architecture

- Used Angular 18 with standalone components.
- Used Angular Signals for component-level state and computed values.
- Used `inject()` for dependency injection.
- Used typed, non-nullable reactive forms for organisation creation.
- Used Angular's new control-flow syntax (`@if`, `@for`, and `@switch`).
- Used RxJS for debounced search and simulated API requests.
- Kept organisation models, services, normalisation logic, and page components separated for maintainability.

## 2. Handling inconsistent fixture data

The supplied fixture contains inconsistent and invalid values. I chose to normalise the data before displaying it rather than modifying the original fixture.

- **Names:** Trim leading and trailing whitespace. Preserve Unicode characters, Arabic text, and emoji. Treat empty or missing names as unavailable.
- **Statuses:** Normalise case and whitespace. Recognise `active`, `suspended`, and `inactive`. Map unrecognised or missing values to `unknown` rather than silently correcting them.
- **Member counts:** Accept non-negative integers and valid numeric strings. Treat negative, decimal, and invalid values as unavailable. Preserve zero as a valid count.
- **Owner email:** Trim whitespace and validate the email format. Distinguish missing and invalid values.
- **Created dates:** Support ISO date strings and Unix timestamps. Treat invalid dates as unavailable.
- **Duplicate IDs:** Keep the first occurrence and ignore subsequent records with the same ID.
- **Long names:** Prevent long names from breaking the table layout. Truncate visually and make the full name available through a tooltip.

The original fixture is preserved so that the data-quality issues remain visible and reproducible.

## 3. Conflict: Display all organisations vs API limits

**Competing requirements**

- Operations requested that all organisations be displayed on one page without pagination.
- The API supports a maximum of 25 records per request, with a rate limit of 5 requests per minute.

**Decision**

I prioritised respecting the API contract and rate limits. For a production API integration, I would use pagination with a maximum of 25 records per page rather than making multiple requests immediately to retrieve every record.

The current assessment prototype loads the supplied local fixture in one request and displays the available organisations. This allows the directory and its search, filtering, and sorting behaviour to be demonstrated without implementing a real backend.

**Trade-off**

Pagination introduces additional navigation for users, but it avoids excessive API requests and respects the backend constraints.

## 4. Conflict: Status colour vs accessibility

**Competing requirements**

- The design preference was to represent status using only a coloured dot.
- The accessibility requirement was to ensure status is not communicated through colour alone.

**Decision**

I chose accessibility. The status indicator uses colour together with a readable status label.

**Reason**

Users who have colour-vision deficiencies or difficulty distinguishing colours can still understand the organisation's status from its text label.

## 5. Organisation creation

- Implemented a typed reactive form.
- Organisation names must contain 3–80 characters and be unique without considering letter case.
- Owner email and status are required.
- Member count is optional but must be a non-negative integer when provided.
- Validation messages appear after a field has been touched.
- New organisations are added to the in-memory list because the assessment does not require backend persistence.
- The interface clearly informs users that newly created organisations are not saved to a backend.

## 6. Loading and error handling

- Simulated request delay between 400 and 900 milliseconds.
- Simulated an approximately 15% request failure rate.
- Provided distinct loading, error, empty, and no-search-results states.
- Retry triggers a fresh request with a new delay and failure probability.

## 7. Translations and design tokens

- Centralised user-facing interface strings in `src/assets/i18n/en.json`.
- Used a translation service and standalone translation pipe to retrieve display strings.
- Centralised colours, spacing, typography, borders, and other design values using CSS custom properties.
- Used responsive styling to support different screen sizes.

## 8. AI tool usage declaration

I used AI-assisted development tools during this assessment.

- **ChatGPT:** Used for requirement analysis, implementation planning, technical explanations, code review, debugging guidance, and documenting design decisions.
- **GitHub Copilot:** Used for code suggestions and assistance with implementing parts of the Angular application and styling.

I reviewed and tested the generated code, made implementation decisions, and used the tools to understand the underlying concepts. I am responsible for the submitted implementation and can explain the code and its behaviour.
