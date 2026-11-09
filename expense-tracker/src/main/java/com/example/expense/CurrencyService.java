package com.example.expense;

import org.springframework.stereotype.Service;
import org.springframework.web.client.RestClient;
import java.util.Map;

// Uses the free Currency Converter API: https://open.er-api.com (no API key needed)
@Service
public class CurrencyService {

    private final RestClient client = RestClient.create();

    @SuppressWarnings("unchecked")
    public Map<String, Number> rates(String base) {
        Map<String, Object> res = client.get()
                .uri("https://open.er-api.com/v6/latest/{base}", base)
                .retrieve()
                .body(Map.class);
        return (Map<String, Number>) res.get("rates");
    }

    public double convert(double amount, String from, String to) {
        if (from.equals(to)) return amount;
        Number rate = rates(from).get(to);
        if (rate == null) throw new IllegalArgumentException("Unknown currency: " + to);
        return amount * rate.doubleValue();
    }
}
