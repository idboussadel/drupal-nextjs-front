import { drupal } from "@/lib/drupal"
import { DrupalMenuLinkContent } from "next-drupal"
import { Link } from "@/components/navigation/Link"

export async function HeaderNav() {
  // Get the main navigation menu items
  const mainMenuItems = await drupal.getMenu<DrupalMenuLinkContent>("main")

  return (
    <header>
      <div className="container bg-transparent flex items-center justify-between py-4 mx-auto">
        <Link href="/" className="text-2xl font-semibold no-underline">
          Hashnode
        </Link>

        {/* Main Navigation Links */}
        <nav className="flex items-center gap-12">
          {mainMenuItems.items.map((item) => (
            <Link
              key={item.id}
              href={item.url}
              className="hover:text-blue-600 no-underline"
            >
              {item.title}
            </Link>
          ))}
        </nav>

        <Link
          href="/login"
          className="rounded-md bg-gray-900 px-4 py-2.5 text-sm font-semibold text-white shadow-sm hover:bg-gray-600 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
        >
          Log in
        </Link>
      </div>
    </header>
  )
}
