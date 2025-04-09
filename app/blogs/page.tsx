import { drupal } from "@/lib/drupal"
import { DrupalNode, DrupalUser } from "next-drupal"
import { absoluteUrl } from "@/lib/utils"
import Image from "next/image"
import Link from "next/link"
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { SearchIcon } from "lucide-react"
import DateFilter from "@/components/date-filter"

export default async function Blogs({
  searchParams,
}: {
  searchParams?: {
    search?: string | string[]
    author?: string | string[]
    date?: string | string[]
  }
}) {
  // Get filters from URL
  const searchTerm = searchParams?.search?.toString() || ""
  const authorId = searchParams?.author?.toString() || ""
  const dateFilter = searchParams?.date?.toString() || ""

  // Fetch all authors to populate the select dropdown
  const authors = await drupal.getResourceCollection<DrupalUser[]>(
    "user--user",
    {
      params: {
        "fields[user--user]": "display_name,uid",
      },
    }
  )

  // Build the filters for the article query
  const filters: Record<string, any> = {
    "filter[status]": 1,
    "fields[node--article]": "title,path,field_image,uid,created,body",
    include: "field_image,uid",
    sort: "-created",
  }

  // Add title filter if search term exists
  if (searchTerm) {
    filters["filter[title][operator]"] = "CONTAINS"
    filters["filter[title][value]"] = searchTerm
  }

  // Add author filter if selected
  if (authorId) {
    filters["filter[uid.id]"] = authorId
  }

  // Add date filter if selected
  if (dateFilter) {
    const date = new Date(dateFilter)
    const startOfDay = new Date(date)
    startOfDay.setHours(0, 0, 0, 0) // Set to beginning of day

    const endOfDay = new Date(date)
    endOfDay.setHours(23, 59, 59, 999) // Set to end of day

    filters["filter[created][value]"] = startOfDay.toISOString()
    filters["filter[created][operator]"] = ">="
    filters["filter[created][value2]"] = endOfDay.toISOString()
    filters["filter[created][operator2]"] = "<"
  }

  const nodes = await drupal.getResourceCollection<DrupalNode[]>(
    "node--article",
    {
      params: filters,
    }
  )

  // Format the nodes
  const posts = nodes.map((node) => {
    const date = new Date(node.created).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    })

    return {
      id: node.id,
      title: node.title,
      href: node.path.alias,
      description:
        node.body?.summary ||
        node.body?.processed?.substring(0, 410) + " ..." ||
        "",
      date: date,
      datetime: node.created,
      category: {
        title: "Article",
        href: "#",
      },
      author: {
        id: node.uid?.id,
        name: node.uid?.display_name || "Anonymous",
        role: "Author",
        imageUrl: "/image.png",
      },
      imageUrl: node.field_image?.uri?.url
        ? absoluteUrl(node.field_image.uri.url)
        : absoluteUrl("/images/default-image.jpg"),
    }
  })

  return (
    <div className="bg-white py-8">
      <div className="mx-auto container">
        <div>
          {/* Enhanced filter form */}
          <form className="mt-8 flex flex-wrap gap-4 items-end">
            {/* Wrapper for all inputs to share space */}
            <div className="flex flex-1 gap-4">
              {/* Search by title - using shadcn Input */}
              <div className="relative flex-1">
                <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
                  <SearchIcon className="h-5 w-5 text-gray-400" />
                </div>
                <Input
                  type="text"
                  name="search"
                  id="search"
                  className="pl-10"
                  placeholder="Search articles..."
                  defaultValue={searchTerm}
                />
              </div>

              {/* Filter by author - using shadcn Select */}
              <div className="flex-1">
                <Select name="author" defaultValue={authorId}>
                  <SelectTrigger className="w-full">
                    <SelectValue placeholder="All Authors" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="all">All Authors</SelectItem>
                    {authors.map((author) => (
                      <SelectItem key={author.id} value={author.id}>
                        {author.display_name || `User ${author.id}`}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              {/* Filter by date - using shadcn Calendar */}
              <div className="flex-1">
                <DateFilter initialDate={dateFilter} />

                {/* Hidden input to store the date value for form submission */}
                <input type="hidden" name="date" value={dateFilter} />
              </div>
            </div>

            {/* Submit button - using shadcn Button */}
            <Button type="submit">Apply Filters</Button>
          </form>

          {/* Results count */}
          <div className="mt-4 text-sm text-gray-500">
            Showing {posts.length} {posts.length === 1 ? "article" : "articles"}
          </div>

          {/* Rest of your component remains the same */}
          <div className="mt-12 space-y-20 lg:space-y-20">
            {posts.length > 0 ? (
              posts.map((post) => (
                <article
                  key={post.id}
                  className="relative isolate flex flex-col gap-8 lg:flex-row"
                >
                  <div className="relative aspect-video sm:aspect-2/1 lg:aspect-square lg:w-[28rem] lg:h-[18rem] lg:shrink-0">
                    <Image
                      src={post.imageUrl}
                      alt={post.title}
                      fill
                      className="absolute inset-0 h-auto rounded-md bg-gray-50 object-cover"
                    />
                    <div className="absolute inset-0 rounded-md ring-1 ring-inset ring-gray-900/10" />
                  </div>
                  <div className="w-full">
                    <div className="flex items-center gap-x-4 text-xs">
                      <time dateTime={post.datetime} className="text-gray-500">
                        {post.date}
                      </time>
                      <Link
                        href={post.category.href}
                        className="relative z-10 rounded-full bg-gray-50 px-3 py-1.5 font-medium text-gray-600 hover:bg-gray-100"
                      >
                        {post.category.title}
                      </Link>
                    </div>
                    <div className="group relative">
                      <h3 className="mt-3 text-lg/6 font-semibold text-gray-900 group-hover:text-gray-600">
                        <Link href={post.href}>
                          <span className="absolute inset-0" />
                          {post.title}
                        </Link>
                      </h3>
                      <div
                        dangerouslySetInnerHTML={{ __html: post.description }}
                        className="mt-5 text-sm/6 text-gray-600"
                      />
                    </div>
                    <div className="mt-6 flex border-t border-gray-900/5 pt-6">
                      <div className="relative flex items-center gap-x-4">
                        <Image
                          src={post.author.imageUrl}
                          alt={post.author.name}
                          width={40}
                          height={40}
                          className="size-10 rounded-full bg-gray-50"
                        />
                        <div className="text-sm/6">
                          <p className="font-semibold text-gray-900">
                            <Link href="#">
                              <span className="absolute inset-0" />
                              {post.author.name}
                            </Link>
                          </p>
                          <p className="text-gray-600">{post.author.role}</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </article>
              ))
            ) : (
              <p className="text-gray-500">
                No articles found matching your filters.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  )
}
