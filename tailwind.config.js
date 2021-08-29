module.exports = {
    purge: ["./src/**/*.{js,jsx,ts,tsx}", "./public/index.html"],
    darkMode: false, // or 'media' or 'class'
    theme: {
        colors: {
            genshin: {
                white: "#F0F3E5",
                blue: "#3D4456",
                lightblue: "hsla(206, 62%, 26%, 1)",
                lighterblue: "#76a8c3",
                mediumblue: "#326483"
            }
        }
    },
    variants: {
        extend: {},
    },
    plugins: [],
};
