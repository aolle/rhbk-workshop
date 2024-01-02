package org.dborrego.config;

import io.smallrye.config.ConfigMapping;
import io.smallrye.config.WithDefault;

@ConfigMapping(prefix = "pagination")
public interface PaginationConfig {

  @WithDefault(value = "0")
  Integer page();

  @WithDefault(value = "10")
  Integer size();

}
