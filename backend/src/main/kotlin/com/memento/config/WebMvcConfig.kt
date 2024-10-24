package com.memento.config

import org.springframework.beans.factory.annotation.Value
import org.springframework.context.annotation.Configuration
import org.springframework.web.servlet.config.annotation.CorsRegistry
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer

@Configuration
class WebMvcConfig(
    @Value("\${app.cors.allowedOrigins}") private val allowedOrigins: Array<String>,
    @Value("\${app.cors.maxRequestAge}") private val maxRequestAge: Long,
): WebMvcConfigurer {


    override fun addCorsMappings(registry: CorsRegistry) {

        arrayOf("1")
        registry.addMapping("/**")
        .allowedOrigins(*allowedOrigins)
            .allowedMethods("GET", "OPTIONS", "POST", "PUT", "PATCH", "DELETE")
            .allowedHeaders("*") // Allow any headers
            .maxAge(maxRequestAge)
    }
}