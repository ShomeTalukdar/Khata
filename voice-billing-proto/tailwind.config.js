/** @type {import('tailwindcss').Config} */
export default {
    content: [
        "./index.html",
        "./src/**/*.{js,ts,jsx,tsx}",
    ],
    theme: {
        extend: {
            colors: {
                shop: {
                    primary: '#10b981',   // Emerald 500
                    secondary: '#059669', // Emerald 600
                    accent: '#fbbf24',    // Amber 400
                    bg: '#0f172a',        // Slate 900
                    surface: '#1e293b',   // Slate 800
                    text: '#f1f5f9',      // Slate 100
                }
            }
        },
    },
    plugins: [],
}
