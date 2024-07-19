package com.till.bank.fileReader;
//
import net.sourceforge.tess4j.Tesseract;
import net.sourceforge.tess4j.TesseractException;

import java.io.File;
import java.util.regex.Matcher;
import java.util.regex.Pattern;

public class RechnungOCR {
	public static void main(String[] args) throws TesseractException {
		Tesseract tesseract = new Tesseract();
		tesseract.setLanguage("deu");

		String path = "C:\\Users\\MatsEngbers\\IdeaProjects\\abschlussprojekt\\TestData\\tessdata-main";
		tesseract.setDatapath(path);

		String text = tesseract.doOCR(new File("C:\\Users\\MatsEngbers\\Desktop\\Testrechnung png2.png"));

		// IBAN extrahieren
		String iban = ibanExtractor(text);
		System.out.println("Gefundene IBAN: " + iban);

		// Rechnungsbetrag extrahieren
		String betrag = betragExtractor(text);
		System.out.println("Gefundener Rechnungsbetrag: " + betrag);

		// Empfänger extrahieren
		String empfaenger = empfaengerExtractor(text);
		System.out.println("Gefundene Firma: " + empfaenger);
	}

	private static String ibanExtractor(String text) {
		String ibanRegex = "\\b[A-Z]{2}[0-9]{2}[A-Z0-9]{1,30}\\b";
		Pattern pattern = Pattern.compile(ibanRegex);
		Matcher matcher = pattern.matcher(text);

		if (matcher.find()) {
			return matcher.group();
		} else {
			return "Bitte IBAN eingeben";
		}
	}

	private static String betragExtractor(String text) {
		String regexWithEuro = "(?:€\\d{1,3}(?:[.,]\\d{3})*(?:[.,]\\d{2})?|\\d{1,3}(?:[.,]\\d{3})*(?:[.,]\\d{2})?€)";
		String regexWithoutEuro = "\\d{1,3}(?:[.,]\\d{3})*(?:[.,]\\d{2})?";

		Pattern patternWithEuro = Pattern.compile(regexWithEuro);
		Pattern patternWithoutEuro = Pattern.compile(regexWithoutEuro);

		Matcher matcherWithEuro = patternWithEuro.matcher(text);
		Matcher matcherWithoutEuro = patternWithoutEuro.matcher(text);

		String lastFoundNumber = null;

		while (matcherWithEuro.find()) {
			lastFoundNumber = matcherWithEuro.group();
		}

		if (lastFoundNumber == null) {
			while (matcherWithoutEuro.find()) {
				lastFoundNumber = matcherWithoutEuro.group();
			}
		}

		if (lastFoundNumber != null) {
			return lastFoundNumber;
		} else {
			return "Rechnungsbetrag bitte hier eingeben";
		}
	}

	private static String empfaengerExtractor(String text) {
		String regex = "(\\b\\w+\\b\\s+\\b\\w+\\b\\s+(?:GmbH|UG|AG|GbR|OHG|KG|GmbH & Co\\. KG|eG))|(\\b\\w+\\b\\s+(?:GmbH|UG|AG|GbR|OHG|KG|GmbH & Co\\. KG|eG))";

		Pattern pattern = Pattern.compile(regex);
		Matcher matcher = pattern.matcher(text);

		if (matcher.find()) {
			return matcher.group();
		} else {
			return "Empfänger bitte hier eingeben";
		}
	}
}
