package com.example.demo.Entity;

import jakarta.persistence.*;

@Entity
public class KpiDefinition {
    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;
    private String name;
    private String query; // örnek: approval_time > 48
    private String owner;
}
