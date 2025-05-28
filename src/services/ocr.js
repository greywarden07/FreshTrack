/**
 * OCR Service (Scaffold)
 *
 * This service will handle the OCR processing of receipt images.
 *
 * TODO Implementation steps:
 * 1. Choose an OCR API provider:
 *    - Google Gemini API
 *    - Azure Computer Vision
 *    - Tesseract.js (for client-side OCR)
 *    - Amazon Textract
 *    - Python tessract could work too
 *
 * 2. Implement image processing:
 *    - Send image to OCR API
 *    - Receive text extraction results
 *    - Parse the OCR results to identify:
 *        - Store name
 *        - Purchase date
 *        - List of purchased items
 *
 * 3. Implement text analysis:
 *    - Clean and format extracted text
 *    - Use pattern matching to identify product names
 *    - Handle special cases and formatting variations in receipts
 */

/**
 * OCR Service with Tesseract.js and Gemini AI
 * Improved version with better date extraction and perishable/non-perishable differentiation
 */
import Tesseract from "tesseract.js";
import axios from "axios";

// Use the API key from environment or fallback to hardcoded for testing
const GEMINI_API_KEY = process.env.REACT_APP_GEMINI_API_KEY;

// Helper function to convert File object to base64 string
async function fileToBase64(file) {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onload = () => {
      // result is "data:image/jpeg;base64,actual_base64_string"
      // we need to remove the "data:image/jpeg;base64," part.
      const base64String = reader.result.split(",")[1];
      resolve(base64String);
    };
    reader.onerror = (error) => reject(error);
  });
}

const ocrService = {
  /**
   * Process receipt image with OCR and extract items
   * @param {File} imageFile - The receipt image file object
   * @returns {Promise<Object>} - Processed receipt data
   */
  processReceipt: async (imageFile) => {
    console.log("Extracting text from receipt using Tesseract.js...");
    try {
      // Extract text using Tesseract
      const ocrText = await extractTextWithTesseract(imageFile);

      if (!ocrText.trim()) {
        console.log("No text extracted from the image.");
        return {
          store: "Unknown Store",
          date: new Date(),
          items: [],
        };
      }

      console.log("OCR Text Extracted:\n", ocrText);

      // Enhanced date extraction from receipt
      const purchaseDate = extractDateFromReceipt(ocrText);
      console.log("Extracted purchase date:", purchaseDate);

      // Parse the text with Gemini
      console.log("Parsing receipt text with Gemini AI...");
      const parsedData = await parseReceiptWithGemini(ocrText, purchaseDate);
      console.log(
        "Parsed Receipt Data:\n",
        JSON.stringify(parsedData, null, 2)
      );

      // Extract items from the response
      let items = [];
      let extractedStore = extractStoreName(ocrText);

      // Handle response structure
      if (
        parsedData &&
        parsedData.candidates &&
        parsedData.candidates[0]?.content?.parts
      ) {
        const responseText = parsedData.candidates[0].content.parts[0].text;
        console.log("Raw response text:", responseText);

        try {
          // Try to parse JSON from the text
          const jsonMatch = responseText.match(/\{[\s\S]*\}/);
          if (jsonMatch) {
            const jsonData = JSON.parse(jsonMatch[0]);
            items = jsonData.items || [];

            // If store name is provided in the response, use it
            if (jsonData.storeName) {
              extractedStore = jsonData.storeName;
            }
          }
        } catch (parseError) {
          console.error("Error parsing Gemini JSON response:", parseError);
        }
      }

      return {
        store: extractedStore,
        date: purchaseDate,
        items: items,
      };
    } catch (error) {
      console.error("Error processing receipt:", error);
      return {
        store: "Error Processing",
        date: new Date(),
        items: [],
      };
    }
  },

  /**
   * Extracts an expiry date from a product image.
   * It first uses OCR to get text, then queries Gemini to find the date.
   * @param {File|string} imageFile - The product image file or base64 data URI.
   * @returns {Promise<string|null>} - The expiry date in YYYY-MM-DD format, or null.
   **/
  extractExpiryDateFromImage: async (imageFile) => {
    console.log(
      "Preparing product image for expiry date extraction with Gemini..."
    );

    if (!imageFile) {
      console.warn("No image file provided for expiry scan.");
      return null;
    }

    if (!GEMINI_API_KEY) {
      console.error(
        "Gemini API Key is not configured. Cannot extract expiry date."
      );
      return null;
    }

    let base64ImageData;
    let mimeType;

    try {
      if (typeof imageFile === "string" && imageFile.startsWith("data:")) {
        // Handle cases where imageFile is already a data URI (e.g., from preview)
        const parts = imageFile.split(";");
        mimeType = parts[0].split(":")[1];
        base64ImageData = parts[1].split(",")[1];
      } else if (imageFile instanceof File) {
        mimeType = imageFile.type;
        base64ImageData = await fileToBase64(imageFile);
      } else {
        console.error("Invalid imageFile format provided.");
        return null;
      }
    } catch (error) {
      console.error("Error converting image to base64:", error);
      return null;
    }

    if (!base64ImageData || !mimeType) {
      console.error("Failed to obtain base64 image data or MIME type.");
      return null;
    }

    // NOTE: This implementation assumes your GEMINI_API_ENDPOINT for 'gemini-2.0-flash'
    // supports multimodal input (image and text). If it's a text-only model,
    // you might need to switch to a vision-enabled model endpoint
    // (e.g., one using 'gemini-1.5-flash-latest' or 'gemini-pro-vision').
    const GEMINI_API_ENDPOINT = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const prompt = `
Analyze the provided image of product packaging and identify the expiration date.
The date can be in various formats (e.g., DD/MM/YYYY, MM/DD/YYYY, YYYY-MM-DD, DD MMM YYYY, MM YYYY, MMM YY, EXP YYYY/MM/DD, BEST BY MMDDYY).
Focus on terms like "EXP", "Best By", "Use By", "Expires", "Expiry Date", "BB", "SELL BY".
If a year is two digits (e.g., 25 for 2025), assume it's in the 21st century (20xx).
If day is missing, assume the last day of the month. If month and day are missing, assume the last day of the year.

Return ONLY the expiration date in strict YYYY-MM-DD format.
If multiple dates are present, choose the one most clearly an expiry date.
If no clear expiration date is found, return the string "null".

Examples of expected output format:
- "2025-03-31"
- "2024-07-12"
- "2024-10-05"
- "2023-12-31"
- "2026-05-15"
- "null"
`;

    const payload = {
      contents: [
        {
          parts: [
            { text: prompt },
            {
              inlineData: {
                mimeType: mimeType,
                data: base64ImageData,
              },
            },
          ],
        },
      ],
      generationConfig: {
        temperature: 0.1,
        maxOutputTokens: 50, // Increased slightly in case of complex image processing
      },
    };

    try {
      console.log("Querying Gemini with image for expiry date extraction...");
      const response = await axios.post(GEMINI_API_ENDPOINT, payload, {
        headers: { "Content-Type": "application/json" },
      });
      const responseData = response.data;

      if (
        responseData &&
        responseData.candidates &&
        responseData.candidates[0]?.content?.parts
      ) {
        let extractedDateStr =
          responseData.candidates[0].content.parts[0].text.trim();
        console.log(
          "Gemini raw expiry date response (from image):",
          extractedDateStr
        );

        if (
          extractedDateStr.toLowerCase() === "null" ||
          extractedDateStr === ""
        ) {
          return null;
        }

        // Validate YYYY-MM-DD format
        if (/^\d{4}-\d{2}-\d{2}$/.test(extractedDateStr)) {
          const parsedDate = new Date(extractedDateStr + "T00:00:00Z"); // Interpret as UTC
          const [year, month, day] = extractedDateStr.split("-").map(Number);

          if (
            parsedDate.getUTCFullYear() === year &&
            parsedDate.getUTCMonth() === month - 1 &&
            parsedDate.getUTCDate() === day
          ) {
            return extractedDateStr;
          } else {
            console.warn(
              "Gemini returned a YYYY-MM-DD string that is not a valid calendar date (from image):",
              extractedDateStr
            );
            return null;
          }
        } else {
          console.warn(
            "Gemini returned a date not in YYYY-MM-DD format (from image):",
            extractedDateStr
          );
          // Attempt to parse common alternative formats if Gemini fails strict format
          try {
            // More robust parsing for various date strings Gemini might return if not strictly YYYY-MM-DD
            const alternativeParse = new Date(extractedDateStr);
            if (!isNaN(alternativeParse.getTime())) {
              const y = alternativeParse.getUTCFullYear();
              const m = String(alternativeParse.getUTCMonth() + 1).padStart(
                2,
                "0"
              );
              const d = String(alternativeParse.getUTCDate()).padStart(2, "0");
              const formattedFallback = `${y}-${m}-${d}`;
              // Final check if the fallback is a valid YYYY-MM-DD
              if (/^\d{4}-\d{2}-\d{2}$/.test(formattedFallback)) {
                console.log(
                  "Attempted fallback parsing to YYYY-MM-DD (from image):",
                  formattedFallback
                );
                return formattedFallback;
              }
            }
          } catch (e) {
            // ignore parsing error for fallback
          }
          return null;
        }
      }
      console.warn(
        "No valid candidate or content part in Gemini response for expiry date (from image)."
      );
      return null;
    } catch (error) {
      console.error(
        "Error calling Gemini for expiry date extraction (from image):",
        error.response
          ? JSON.stringify(error.response.data, null, 2)
          : error.message
      );
      if (error.response && error.response.data && error.response.data.error) {
        console.error(
          "Gemini API Error Details:",
          error.response.data.error.message
        );
      }
      return null;
    }
  },
};

/**
 * Extracts the store name from receipt text with enhanced detection
 * @param {string} receiptText - The OCR text from receipt
 * @returns {string} - The store name
 */
function extractStoreName(receiptText) {
  try {
    // Common store name patterns
    const storePatterns = [
      // Store name at the beginning of receipt
      /^([A-Z][A-Za-z\s]+(?:Market|Supermarket|Store|Grocery|Foods|Mart|Shop|MARKET|SUPERMARKET|STORE|GROCERY|FOODS|MART|SHOP))/m,
      // Store name following "Welcome to" pattern
      /Welcome to ([A-Z][A-Za-z\s]+(?:Market|Supermarket|Store|Grocery|Foods|Mart|Shop|MARKET|SUPERMARKET|STORE|GROCERY|FOODS|MART|SHOP))/i,
      // Common store brands
      /(Walmart|Kroger|Aldi|Coles|Woolworths|Tesco|Safeway|Costco|Target|Trader Joe's|Whole Foods|IGA|Publix)/i,
    ];

    for (const pattern of storePatterns) {
      const match = receiptText.match(pattern);
      if (match && match[1]) {
        return match[1].trim();
      }
    }

    // Fallback: look for capitalized words at the top of the receipt
    const firstLines = receiptText.split("\n").slice(0, 5).join(" ");
    const capitalizedNamePattern = /([A-Z][A-Z\s]{2,})/;
    const capitalMatch = firstLines.match(capitalizedNamePattern);
    if (capitalMatch && capitalMatch[1]) {
      return capitalMatch[1].trim();
    }
  } catch (error) {
    console.error("Error extracting store name:", error);
  }
  return "Unknown Store";
}

/**
 * Enhanced function to extract the purchase date from receipt text using multiple patterns
 * @param {string} receiptText - The OCR text from receipt
 * @returns {Date} - The purchase date
 */
function extractDateFromReceipt(receiptText) {
  try {
    console.log("Attempting to extract date from receipt text");

    // Look for receipt number and nearby numbers that might be dates
    const receiptPattern =
      /(?:receipt|re[ct]|reg)(?:\s*#|\s*:|\s*no)?[\s.:]*(\d+)/i;
    const receiptMatch = receiptText.match(receiptPattern);

    if (receiptMatch) {
      console.log("Found receipt number, looking for date nearby");
      // Search for date-like patterns near the receipt number (within 3 lines)
      const lines = receiptText.split("\n");
      const receiptLine = lines.findIndex(
        (line) =>
          line.toLowerCase().includes("receipt") ||
          line.toLowerCase().includes("rct") ||
          line.toLowerCase().includes("reg")
      );

      if (receiptLine >= 0) {
        const startLine = Math.max(0, receiptLine - 3);
        const endLine = Math.min(lines.length - 1, receiptLine + 3);

        const nearbyText = lines.slice(startLine, endLine + 1).join(" ");
        console.log("Searching for date in:", nearbyText);

        // All common date patterns in receipts
        const datePatterns = [
          // Date labeled explicitly (most reliable)
          /(?:Date|DT|Dt|dt|date)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
          // Standard date formats
          /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
          // American format MM/DD/YYYY (with or without leading zeros)
          /(\d{1,2}\/\d{1,2}\/\d{4})/,
          // European format DD/MM/YYYY (with or without leading zeros)
          /(\d{1,2}\.\d{1,2}\.\d{4})/,
          // Short year format MM/DD/YY
          /(\d{1,2}\/\d{1,2}\/\d{2})/,
          // MM-DD-YY
          /(\d{1,2}-\d{1,2}-\d{2})/,
          // DD-MM-YY
          /(\d{2}-\d{2}-\d{2})/,
          // ISO format YYYY-MM-DD
          /(\d{4}-\d{1,2}-\d{1,2})/,
          // Written format (e.g., "Jan 01, 2023")
          /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/i,
          // Date as DDMMYY or DDMMYYYY
          /(\d{2})(\d{2})(\d{2,4})/,
        ];

        for (const pattern of datePatterns) {
          const match = nearbyText.match(pattern);
          if (match && match[1]) {
            const dateStr = match[1];
            console.log("Potential date string found:", dateStr);

            try {
              const parsedDate = new Date(dateStr);
              if (!isNaN(parsedDate.getTime())) {
                console.log("Valid date found:", parsedDate);
                return parsedDate;
              }
            } catch (err) {
              console.log("Error parsing date string:", err.message);
            }
          }
        }

        // Special handling for DDMMYY format
        const specialDatePattern = /(\d{2})(\d{2})(\d{2,4})/;
        const specialMatch = nearbyText.match(specialDatePattern);
        if (specialMatch) {
          const day = specialMatch[1];
          const month = specialMatch[2];
          const year =
            specialMatch[3].length === 2
              ? "20" + specialMatch[3]
              : specialMatch[3];

          try {
            // Try both DD/MM/YYYY and MM/DD/YYYY formats
            const dateFormat1 = `${month}/${day}/${year}`;
            const dateFormat2 = `${day}/${month}/${year}`;

            const parsedDate1 = new Date(dateFormat1);
            const parsedDate2 = new Date(dateFormat2);

            if (!isNaN(parsedDate1.getTime()) && parsedDate1 <= new Date()) {
              console.log("Valid date found (MM/DD/YYYY):", parsedDate1);
              return parsedDate1;
            }

            if (!isNaN(parsedDate2.getTime()) && parsedDate2 <= new Date()) {
              console.log("Valid date found (DD/MM/YYYY):", parsedDate2);
              return parsedDate2;
            }
          } catch (err) {
            console.log("Error parsing special date format:", err.message);
          }
        }
      }
    }

    // Search entire receipt for date patterns
    const allDatePatterns = [
      // Date labeled explicitly (most reliable)
      /(?:Date|DATE|date|Dt|DT)\s*:?\s*(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/i,
      // Standard date formats
      /(\d{1,2}[\/\-\.]\d{1,2}[\/\-\.]\d{2,4})/,
      // American format MM/DD/YYYY (with or without leading zeros)
      /(\d{1,2}\/\d{1,2}\/\d{4})/,
      // European format DD/MM/YYYY (with or without leading zeros)
      /(\d{1,2}\.\d{1,2}\.\d{4})/,
      // Short year format MM/DD/YY
      /(\d{1,2}\/\d{1,2}\/\d{2})/,
      // ISO format YYYY-MM-DD
      /(\d{4}-\d{1,2}-\d{1,2})/,
      // Written format (e.g., "Jan 01, 2023")
      /(Jan|Feb|Mar|Apr|May|Jun|Jul|Aug|Sep|Oct|Nov|Dec)\s+\d{1,2},?\s+\d{4}/i,
    ];

    // Try each pattern on the entire receipt text
    for (const pattern of allDatePatterns) {
      const match = receiptText.match(pattern);
      if (match && match[1]) {
        const dateStr = match[1];
        const parsedDate = new Date(dateStr);

        // Check if date is valid and not in the future
        const today = new Date();
        if (!isNaN(parsedDate.getTime()) && parsedDate <= today) {
          console.log(
            `Found valid date: ${parsedDate.toISOString()} using pattern: ${pattern}`
          );
          return parsedDate;
        }
      }
    }

    // Extract from possible handwritten or unusual formats
    // Look for time patterns - often near dates
    const timePattern = /(\d{1,2}):(\d{2})(?:\s*(?:AM|PM))?/i;
    const timeMatch = receiptText.match(timePattern);

    if (timeMatch) {
      console.log("Time pattern found, looking for date nearby");
      const lines = receiptText.split("\n");
      const timeLineIndex = lines.findIndex((line) => line.match(timePattern));

      if (timeLineIndex >= 0) {
        // Check nearby lines for numbers that could be dates
        const nearbyLines = 3;
        const startLine = Math.max(0, timeLineIndex - nearbyLines);
        const endLine = Math.min(lines.length - 1, timeLineIndex + nearbyLines);

        for (let i = startLine; i <= endLine; i++) {
          // Look for number patterns that might be dates (DD/MM/YY, etc.)
          const numberPattern =
            /(\d{1,2})[\/\.\-](\d{1,2})(?:[\/\.\-](\d{2,4}))?/;
          const numMatch = lines[i].match(numberPattern);

          if (numMatch) {
            let day, month, year;
            // Default to current year if not found
            const currentYear = new Date().getFullYear();

            // Try to determine if it's DD/MM or MM/DD format
            // For simplicity, assume DD/MM format (used in Australia)
            day = parseInt(numMatch[1], 10);
            month = parseInt(numMatch[2], 10) - 1; // JS months are 0-based
            year = numMatch[3]
              ? numMatch[3].length === 2
                ? 2000 + parseInt(numMatch[3], 10)
                : parseInt(numMatch[3], 10)
              : currentYear;

            // Validate the date
            if (day > 0 && day <= 31 && month >= 0 && month <= 11) {
              const date = new Date(year, month, day);

              // If it's a valid date and not in the future
              if (!isNaN(date.getTime()) && date <= new Date()) {
                console.log(
                  `Constructed date from numbers: ${date.toISOString()}`
                );
                return date;
              }
            }
          }
        }
      }
    }

    // Look for numeric patterns that could be dates
    // This is risky but worth trying if nothing else worked
    const numericDatePattern = /(\d{1,2})[\/\.\-](\d{1,2})[\/\.\-](\d{2,4})/g;
    let numericMatch;
    const potentialDates = [];

    while ((numericMatch = numericDatePattern.exec(receiptText)) !== null) {
      const formatA = new Date(
        `${numericMatch[1]}/${numericMatch[2]}/${
          numericMatch[3].length === 2
            ? "20" + numericMatch[3]
            : numericMatch[3]
        }`
      );
      const formatB = new Date(
        `${numericMatch[2]}/${numericMatch[1]}/${
          numericMatch[3].length === 2
            ? "20" + numericMatch[3]
            : numericMatch[3]
        }`
      );

      if (!isNaN(formatA.getTime()) && formatA <= new Date()) {
        potentialDates.push(formatA);
      }

      if (!isNaN(formatB.getTime()) && formatB <= new Date()) {
        potentialDates.push(formatB);
      }
    }

    // If we found potential dates, return the most recent one (likely to be receipt date)
    if (potentialDates.length > 0) {
      const mostRecent = new Date(
        Math.max(...potentialDates.map((d) => d.getTime()))
      );
      console.log("Using most recent potential date:", mostRecent);
      return mostRecent;
    }

    // If no date found, try to create one from current context in receipt
    console.log("Attempting to infer date from receipt context");

    // Look for today or yesterday words
    if (/today|today's/i.test(receiptText)) {
      console.log("Found 'today' in receipt, using current date");
      return new Date();
    }

    if (/yesterday/i.test(receiptText)) {
      const yesterday = new Date();
      yesterday.setDate(yesterday.getDate() - 1);
      console.log("Found 'yesterday' in receipt, using yesterday's date");
      return yesterday;
    }

    // As a last resort, check if there's any reference to day of week
    const dayOfWeekPattern =
      /(Monday|Tuesday|Wednesday|Thursday|Friday|Saturday|Sunday)/i;
    const dayMatch = receiptText.match(dayOfWeekPattern);

    if (dayMatch) {
      console.log("Found day of week mentioned:", dayMatch[1]);
      const today = new Date();
      const todayDayOfWeek = today.getDay(); // 0 = Sunday, 1 = Monday, etc.
      const mentionedDayOfWeek = [
        "sunday",
        "monday",
        "tuesday",
        "wednesday",
        "thursday",
        "friday",
        "saturday",
      ].indexOf(dayMatch[1].toLowerCase());

      if (mentionedDayOfWeek !== -1) {
        let daysToSubtract = todayDayOfWeek - mentionedDayOfWeek;
        if (daysToSubtract < 0) daysToSubtract += 7; // If it's from last week

        const inferredDate = new Date();
        inferredDate.setDate(inferredDate.getDate() - daysToSubtract);
        console.log("Inferred date from day of week:", inferredDate);
        return inferredDate;
      }
    }

    console.log("No valid date found in receipt, falling back to current date");
  } catch (error) {
    console.error("Error extracting date:", error);
  }

  // Use current date as fallback
  console.log("Using current date as fallback");
  return new Date();
}

/**
 * Uses Tesseract.js to extract text from an image with enhanced settings.
 * @param {File|string} imageFile - The receipt image file or base64 data URI
 * @returns {Promise<string>} - The extracted OCR text.
 */
async function extractTextWithTesseract(imageFile) {
  try {
    // Enhanced configuration for better OCR quality
    const config = {
      lang: "eng",
      tessedit_char_whitelist:
        "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789/.-:,$ ",
      preserve_interword_spaces: "1",
      tessedit_ocr_engine_mode: "1", // Use neural net mode for better accuracy
    };

    // Check if we received a base64 string (from local storage fallback)
    if (typeof imageFile === "string" && imageFile.startsWith("data:")) {
      console.log("Processing base64 image data from local storage fallback");

      const {
        data: { text },
      } = await Tesseract.recognize(imageFile, "eng", {
        logger: (m) => console.log(m.status, m.progress),
        langPath: "https://tessdata.projectnaptha.com/4.0.0",
        ...config,
      });

      return text;
    }

    // Otherwise use the File object directly with Tesseract
    const {
      data: { text },
    } = await Tesseract.recognize(imageFile, "eng", {
      logger: (m) => console.log(m.status, m.progress), // View progress updates
      langPath: "https://tessdata.projectnaptha.com/4.0.0",
      ...config,
    });

    return text;
  } catch (error) {
    console.error("Error during OCR extraction:", error);
    return "";
  }
}

/**
 * Passes the extracted receipt text to Gemini AI to parse out purchased items
 * and categorize them as perishable/non-perishable.
 * @param {string} receiptText - The OCR text from the receipt
 * @param {Date} purchaseDate - The date when items were purchased
 * @returns {Promise<Object|null>} - The parsed response from Gemini AI
 */
async function parseReceiptWithGemini(receiptText, purchaseDate) {
  try {
    // Format the purchase date
    const dateString = purchaseDate.toISOString().split("T")[0]; // YYYY-MM-DD format

    // Create a focused prompt with perishable/non-perishable classification
    const prompt = `
You are an expert in food analysis and grocery receipts. 

Extract food and household items from this receipt text and categorize them as either PERISHABLE or NON-PERISHABLE.

For PERISHABLE items:
1. Identify the name
2. Determine the food category (dairy, meat, produce, bakery, etc.)
3. Extract quantity if available
4. Extract price if available
5. Find the typical expiry period in days
6. Calculate the exact expiry date based on the purchase date: ${dateString}

For NON-PERISHABLE items:
1. Identify the name
2. Determine the category (toiletries, household, cleaning, pet, etc.)
3. Extract quantity if available
4. Extract price if available
5. Mark them explicitly as non-perishable with no expiry date

Use these guidelines to determine if an item is perishable:
- Perishable: 
  * Fresh foods, dairy, meat, produce, bakery, eggs, refrigerated items
  * Canned foods (still perishable but long shelf life)
  * Frozen foods
  * Snacks with limited shelf life
  * Most edible food items

- Non-perishable: 
  * Toiletries (soap, shampoo, toothpaste)
  * Cleaning supplies
  * Household items (paper towels, etc.)
  * Pet supplies (non-food items)
  * Other non-food items

Categorize items into these categories:
- Food categories: dairy, meat, produce, bakery, pantry, frozen, canned, snacks, beverages
- Non-food categories: toiletries, household, pet, other

For perishable items, use these reasonable defaults for expiry periods if specific information is unavailable:
- Dairy products: 7-14 days
- Fresh meat: 3-5 days
- Fresh produce: 5-7 days
- Bakery items: 3-7 days
- Eggs: 21-30 days
- Frozen foods: 90-180 days
- Canned goods: 365+ days
- Beverages: 7-30 days depending on type

Return a JSON object with this structure:
{
  "storeName": "Store name if detected",
  "items": [
    {
      "name": "Item name",
      "category": "Food or product category (one of the categories listed above)",
      "quantity": "Quantity (or '1' if not specified)",
      "price": "Price (or '$0.00' if not specified)",
      "isPerishable": true/false,
      "expiryDays": Number of days until expiry (null for non-perishable),
      "expiryDate": "YYYY-MM-DD (null for non-perishable)"
    }
  ]
}

For non-perishable items, explicitly set isPerishable to false, and set expiryDays and expiryDate to null.

Receipt text:
${receiptText}
`;

    const endpoint = `https://generativelanguage.googleapis.com/v1beta/models/gemini-2.0-flash:generateContent?key=${GEMINI_API_KEY}`;

    const payload = {
      contents: [
        {
          parts: [{ text: prompt }],
        },
      ],
      generationConfig: {
        temperature: 0.2,
      },
    };

    const response = await axios.post(endpoint, payload, {
      headers: {
        "Content-Type": "application/json",
      },
    });

    return response.data;
  } catch (error) {
    console.error(
      "Error during Gemini AI parsing:",
      error.response ? error.response.data : error.message
    );
    return null;
  }
}

export default ocrService;
