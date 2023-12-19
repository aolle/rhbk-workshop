package org.dborrego.model;

import io.quarkus.hibernate.reactive.panache.PanacheEntity;
import jakarta.persistence.Entity;

@Entity(name = "PADEL_USERS")
public class User extends PanacheEntity {

  public String username;
  public String name;
  public Integer year;
  public Float level;

}
