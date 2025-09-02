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

    public Long getId() { return id; }
    public String getName() { return name; }
    public String getQuery() { return query; }
    public String getOwner() { return owner; }

    public void setId(Long id) { this.id = id; }
    public void setName(String name) { this.name = name; }
    public void setQuery(String query) { this.query = query; }
    public void setOwner(String owner) { this.owner = owner; }
}
