package dev.kali.labendicion.util;

import java.util.Arrays;
import java.util.List;
import java.util.stream.Collectors;

/** Utilidad para serializar listas en CSV (delimitador | para evitar conflictos con comas en nombres). */
public final class CsvListUtil {

    private static final String DELIMITER = "|";

    private CsvListUtil() {}

    public static String toCsv(List<?> items) {
        if (items == null || items.isEmpty()) return "";
        return items.stream()
                .map(Object::toString)
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.joining(DELIMITER));
    }

    public static List<String> fromCsv(String csv) {
        if (csv == null || csv.isBlank()) return List.of();
        String delimiter = csv.contains(DELIMITER) ? DELIMITER : ",";
        return Arrays.stream(csv.split(delimiter))
                .map(String::trim)
                .filter(s -> !s.isEmpty())
                .collect(Collectors.toList());
    }
}
