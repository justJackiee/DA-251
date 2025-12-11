package com.example.demo.enums;

import lombok.Getter;
import lombok.AllArgsConstructor; // <<< BỔ SUNG ANNOTATION NÀY

@Getter
@AllArgsConstructor // <<< BỔ SUNG ANNOTATION NÀY
public enum BonusType {
    
    HOLIDAY("holiday", "Holiday Bonus"),
    OTHER("other", "Other Bonus");

    private final String key;
    private final String label;
}