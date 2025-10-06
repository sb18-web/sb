// START OF FILE: js/tools-config.js

// ... (Category Colors) ...

const toolsData = [
    // --- Image Tools (category: image) ---
    {
        id: "image-to-pdf",
        name: "Image to PDF",
        url: "/tools/image-to-pdf.html",
        category: "image",
        keywords: ["image", "pdf", "convert", "merge", "combine"],
        description: "Combine multiple images into a single PDF.",
        logoClass: "tool-logo-image",
        icon: '<svg ...>'
    },
    // ... other image tools ...
    // --- Text Tools (category: text) ---
    // ... other text tools ...
    // --- Converter Tools (category: convert) ---
    // ... other converter tools ...
    {
        id: "calculator", // <--- Calculator ki original position
        name: "Calculator",
        url: "/tools/calculator.html",
        category: "convert",
        keywords: ["calculator", "math", "addition", "subtraction", "multiplication", "division", "scientific", "programmer"],
        description: "Perform basic math operations quickly.",
        logoClass: "tool-logo-convert",
        icon: '<span class="tool-icon">🧮</span>'
    },
    // ... remaining tools ...
];```

**Ab (Updated Position):**

```javascript
// START OF FILE: js/tools-config.js

// ... (Category Colors) ...

const toolsData = [
    // --- IMPORTANT: Move calculator to the top ---
    {
        id: "calculator", // <--- Calculator ki NAYI position
        name: "Calculator",
        url: "/tools/calculator.html",
        category: "convert",
        keywords: ["calculator", "math", "addition", "subtraction", "multiplication", "division", "scientific", "programmer"],
        description: "Perform basic math operations quickly.",
        logoClass: "tool-logo-convert",
        icon: '<span class="tool-icon">🧮</span>'
    },
    // --- Image Tools (category: image) ---
    {
        id: "image-to-pdf",
        name: "Image to PDF",
        url: "/tools/image-to-pdf.html",
        category: "image",
        keywords: ["image", "pdf", "convert", "merge", "combine"],
        description: "Combine multiple images into a single PDF.",
        logoClass: "tool-logo-image",
        icon: '<svg ...>'
    },
    // ... other tools ...
];