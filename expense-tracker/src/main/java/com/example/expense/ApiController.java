package com.example.expense;

import org.springframework.web.bind.annotation.*;
import java.time.LocalDate;
import java.util.*;

@RestController
@RequestMapping("/api")
public class ApiController {

    private final ExpenseRepository repo;
    private final CurrencyService currency;

    public ApiController(ExpenseRepository repo, CurrencyService currency) {
        this.repo = repo;
        this.currency = currency;
    }

    // ---------- Expenses ----------
    @GetMapping("/expenses")
    public List<Expense> list() {
        return repo.findAllByOrderByDateDesc();
    }

    @PostMapping("/expenses")
    public Expense add(@RequestBody Expense e) {
        if (e.date == null) e.date = LocalDate.now();
        return repo.save(e);
    }

    @DeleteMapping("/expenses/{id}")
    public void delete(@PathVariable Long id) {
        repo.deleteById(id);
    }

    // Total of all expenses converted into one currency
    @GetMapping("/total")
    public Map<String, Object> total(@RequestParam String currencyCode) {
        double sum = 0;
        for (Expense e : repo.findAll()) {
            sum += currency.convert(e.amount, e.currency, currencyCode);
        }
        return Map.of("currency", currencyCode, "total", sum);
    }

    // ---------- Currency ----------
    @GetMapping("/currencies")
    public Set<String> currencies() {
        return new TreeSet<>(currency.rates("USD").keySet());
    }

    @GetMapping("/convert")
    public Map<String, Object> convert(@RequestParam double amount,
                                       @RequestParam String from,
                                       @RequestParam String to) {
        return Map.of("result", currency.convert(amount, from, to));
    }
}
