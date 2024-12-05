import { type Config } from "tailwindcss";
import { fontFamily } from "tailwindcss/defaultTheme";
import { content, plugin } from "flowbite-react/tailwind";

export default {
  content: [content(), "./src/**/*.tsx"],
  theme: {
    extend: {
      fontFamily: {
        sans: ["var(--font-geist-sans)", ...fontFamily.sans],
      },
    },
  },
  // eslint-disable-next-line @typescript-eslint/no-require-imports
  plugins: [plugin()],
} satisfies Config;
