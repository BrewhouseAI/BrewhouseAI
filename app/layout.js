import "./globals.css"
import Link from "next/link"
import { RecipeProvider } from "./context/RecipeContext"
import ClientAuth from "./components/ClientAuth"

export const metadata = {
  title: "BrewAI",
  description: "AI Beer Recipe Generator"
}

export default function RootLayout({ children }) {

  return (

    <html lang="en">

      <body className="bg-black text-white">

        <RecipeProvider>

          {/* NAVBAR */}

          <nav className="border-b border-zinc-800">

            <div className="max-w-6xl mx-auto px-6 py-4 flex justify-between items-center">

              <Link
                href="/"
                className="text-xl font-bold"
              >
                BrewAI
              </Link>

              <div className="flex gap-6 text-gray-400 items-center">

                <Link
                  href="/"
                  className="hover:text-white"
                >
                  Create
                </Link>

                <Link
                  href="/recipes"
                  className="hover:text-white"
                >
                  My Recipes
                </Link>

                <ClientAuth />

              </div>

            </div>

          </nav>


          {/* PAGE CONTENT */}

          <div className="max-w-6xl mx-auto px-6 py-10">

            {children}

          </div>

        </RecipeProvider>

      </body>

    </html>

  )

}