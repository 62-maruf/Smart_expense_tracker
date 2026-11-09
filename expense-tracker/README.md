# Smart Expense Tracker

Spring Boot (backend) + HTML/CSS/JS (frontend).
Currency rates come from the free Currency Converter API: https://open.er-api.com (no key needed).

## Requirements
- Java 17+
- Maven 3.8+ (or open the folder in VS Code / IntelliJ)
- Internet connection (for exchange rates)

## Run
    mvn spring-boot:run

Then open http://localhost:8080

## Structure
    pom.xml
    src/main/java/com/example/expense/
        ExpenseTrackerApplication.java   - app entry point
        Expense.java                     - expense data (table)
        ExpenseRepository.java           - database access
        CurrencyService.java             - calls the Currency API
        ApiController.java               - REST endpoints
    src/main/resources/
        application.properties           - settings (H2 file database)
        static/index.html, style.css, app.js

## Endpoints
    GET    /api/expenses
    POST   /api/expenses
    DELETE /api/expenses/{id}
    GET    /api/total?currencyCode=USD
    GET    /api/currencies
    GET    /api/convert?amount=10&from=USD&to=BDT
